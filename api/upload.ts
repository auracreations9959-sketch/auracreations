import { put } from '@vercel/blob';
import crypto from 'node:crypto';

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: 'nodejs',
};

const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'aura-creations-secure-jwt-secret-2026-v2';

// Self-contained session verification to prevent ESM relative resolution failures on Vercel
function getSessionFromRequest(req: any): { valid: boolean; email?: string } {
  try {
    let token: string | undefined = req?.cookies?.aura_admin_session;
    if (!token) {
      const rawCookie =
        req?.headers?.cookie ||
        (typeof req?.headers?.get === 'function' ? req.headers.get('cookie') : '') ||
        '';
      const match = rawCookie.match(/aura_admin_session=([^;]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }
    if (!token) return { valid: false };

    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return { valid: false };
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(b64).digest('base64url');
    if (sig !== expectedSig) return { valid: false };
    const data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (data.exp < Date.now()) return { valid: false };
    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

// Reads raw request buffer supporting both pre-parsed bodies and streaming chunks
async function getFileBuffer(req: any): Promise<Buffer> {
  if (req.body) {
    if (Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === 'string') {
      // Check if base64 data url was sent
      const base64Match = req.body.match(/^data:image\/[a-zA-Z]+;base64,(.+)$/);
      if (base64Match) {
        return Buffer.from(base64Match[1], 'base64');
      }
      return Buffer.from(req.body);
    }
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err: any) => reject(err));
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 1. Verify Admin Session
  const session = getSessionFromRequest(req);
  if (!session.valid) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required for image uploads.' });
  }

  // 2. Verify Vercel Blob Token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      error: 'Vercel Blob token is not configured. Please open Vercel Dashboard -> Storage -> Connect "aura-creations-storage" to this project.',
      blobMissing: true,
    });
  }

  try {
    const rawUrl = req.url || '';
    const searchParams = rawUrl.includes('?')
      ? new URL(rawUrl, 'http://localhost').searchParams
      : new URLSearchParams();

    const rawFilename = req.query?.filename || searchParams.get('filename') || `service-${Date.now()}.webp`;
    const cleanFilename = String(rawFilename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = cleanFilename.split('.').pop()?.toLowerCase();

    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!ext || !allowed.includes(ext)) {
      return res.status(400).json({ error: `Allowed image formats: JPG, JPEG, PNG, WEBP. Received: ${ext}` });
    }

    const fileBuffer = await getFileBuffer(req);
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty file payload received.' });
    }

    // Security Hardening: Enforce 5MB upload ceiling
    const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
    if (fileBuffer.length > MAX_UPLOAD_BYTES) {
      return res.status(413).json({ error: 'File size exceeds 5MB limit. Please compress or select a smaller image.' });
    }

    // Security Hardening: Cryptographic Magic Byte inspection
    const isJpeg = fileBuffer.length > 3 && fileBuffer[0] === 0xff && fileBuffer[1] === 0xd8 && fileBuffer[2] === 0xff;
    const isPng = fileBuffer.length > 8 && fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50 && fileBuffer[2] === 0x4e && fileBuffer[3] === 0x47;
    const isGif = fileBuffer.length > 3 && fileBuffer[0] === 0x47 && fileBuffer[1] === 0x49 && fileBuffer[2] === 0x46;
    const isWebp = fileBuffer.length > 12 && fileBuffer.toString('ascii', 0, 4) === 'RIFF' && fileBuffer.toString('ascii', 8, 12) === 'WEBP';

    if (!isJpeg && !isPng && !isGif && !isWebp) {
      return res.status(400).json({ error: 'Security validation failed: payload is not a valid JPEG, PNG, WEBP, or GIF image.' });
    }

    const contentType = req.headers['content-type'] || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const blobPath = `services/${Date.now()}-${cleanFilename}`;

    let blobResult: any;
    try {
      blobResult = await put(blobPath, fileBuffer, {
        access: 'public',
        contentType,
      });
    } catch (err: any) {
      if (err?.name === 'BlobAccessError' || err?.message?.toLowerCase().includes('private')) {
        blobResult = await put(blobPath, fileBuffer, {
          access: 'private',
          contentType,
        });
      } else {
        throw err;
      }
    }

    return res.status(200).json({
      success: true,
      url: blobResult.url,
      downloadUrl: blobResult.downloadUrl || blobResult.url,
      pathname: blobResult.pathname,
      size: fileBuffer.length,
      contentType,
      storage: 'vercel-blob',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return res.status(500).json({ error: message });
  }
}
