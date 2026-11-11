import { put, head } from '@vercel/blob';
import crypto from 'node:crypto';

export const config = {
  runtime: 'nodejs',
};

const MANIFEST_PATH = 'aura-data/portfolio-manifest.json';
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

async function getBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { return {}; }
    }
    if (Buffer.isBuffer(req.body)) {
      try { return JSON.parse(req.body.toString('utf8')); } catch { return {}; }
    }
  }
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text ? JSON.parse(text) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({
      source: 'unconnected',
      error: 'BLOB_READ_WRITE_TOKEN not set in environment.',
      portfolio: null,
    });
  }

  // 1. GET: Fetch persistent portfolio manifest from Vercel Blob
  if (req.method === 'GET') {
    try {
      const blobInfo = await head(MANIFEST_PATH);
      if (blobInfo && blobInfo.url) {
        const fetchUrl = blobInfo.downloadUrl || blobInfo.url;
        const fetchRes = await fetch(fetchUrl, {
          cache: 'no-store',
          headers: process.env.BLOB_READ_WRITE_TOKEN
            ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
            : {},
        });
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          if (Array.isArray(data) && data.length > 0) {
            return res.status(200).json({ source: 'vercel-blob', portfolio: data });
          }
        }
      }
      return res.status(200).json({ source: 'not-found', portfolio: null });
    } catch {
      return res.status(200).json({ source: 'not-found', portfolio: null });
    }
  }

  // 2. POST: Save updated portfolio manifest (Admin Session required)
  if (req.method === 'POST') {
    const session = getSessionFromRequest(req);
    if (!session.valid) {
      return res.status(401).json({ error: 'Unauthorized. Admin session required to modify portfolio.' });
    }

    try {
      const body = await getBody(req);
      if (!Array.isArray(body)) {
        return res.status(400).json({ error: 'Expected array of portfolio items.' });
      }

      let putResult: any;
      try {
        putResult = await put(MANIFEST_PATH, JSON.stringify(body, null, 2), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
        });
      } catch (err: any) {
        if (err?.name === 'BlobAccessError' || err?.message?.toLowerCase().includes('private')) {
          putResult = await put(MANIFEST_PATH, JSON.stringify(body, null, 2), {
            access: 'private',
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: 'application/json',
          });
        } else {
          throw err;
        }
      }

      return res.status(200).json({
        success: true,
        count: body.length,
        url: putResult?.url || null,
        source: 'vercel-blob',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error syncing portfolio';
      return res.status(500).json({ error: message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
