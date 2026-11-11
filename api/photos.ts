import { put, head, del, list } from '@vercel/blob';
import crypto from 'node:crypto';

export const config = {
  runtime: 'nodejs',
};

const PHOTOS_MANIFEST_PATH = 'aura-data/photos-manifest.json';
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'aura-creations-secure-jwt-secret-2026-v2';

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

export interface PhotoRecord {
  id: string;
  url: string;
  name: string;
  size?: number;
  contentType?: string;
  createdAt: string;
}

let memoryPhotos: PhotoRecord[] = [];

async function getPhotosManifest(): Promise<PhotoRecord[]> {
  if (memoryPhotos.length > 0) return memoryPhotos;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobInfo = await head(PHOTOS_MANIFEST_PATH);
      if (blobInfo && blobInfo.url) {
        const res = await fetch(blobInfo.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            memoryPhotos = data;
            return data;
          }
        }
      }
    } catch {}

    try {
      const { blobs } = await list({ prefix: 'services/' });
      if (blobs && blobs.length > 0) {
        const records: PhotoRecord[] = blobs.map((b) => ({
          id: b.pathname,
          url: b.url,
          name: b.pathname.split('/').pop() || b.pathname,
          size: b.size,
          createdAt: b.uploadedAt.toISOString(),
        }));
        memoryPhotos = records;
        return records;
      }
    } catch {}
  }

  return memoryPhotos;
}

async function savePhotosManifest(photos: PhotoRecord[]): Promise<void> {
  memoryPhotos = photos;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      try {
        await put(PHOTOS_MANIFEST_PATH, JSON.stringify(photos, null, 2), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
        });
      } catch (err: any) {
        if (err?.name === 'BlobAccessError' || err?.message?.toLowerCase().includes('private')) {
          await put(PHOTOS_MANIFEST_PATH, JSON.stringify(photos, null, 2), {
            access: 'private',
            addRandomSuffix: false,
            allowOverwrite: true,
          });
        }
      }
    } catch (err) {
      console.error('Failed to save photos manifest:', err);
    }
  }
}

async function getBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { return {}; }
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

  const rawUrl = req.url || '';
  const searchParams = rawUrl.includes('?')
    ? new URL(rawUrl, 'http://localhost').searchParams
    : new URLSearchParams();

  if (req.method === 'GET') {
    try {
      const photos = await getPhotosManifest();
      return res.status(200).json({ success: true, photos });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching photos';
      return res.status(500).json({ error: message });
    }
  }

  const session = getSessionFromRequest(req);
  if (!session.valid) {
    return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
  }

  if (req.method === 'POST') {
    try {
      const body = await getBody(req);
      const { url: photoUrl, name, size, contentType } = body;

      if (!photoUrl) {
        return res.status(400).json({ error: 'Photo URL is required.' });
      }

      const photos = await getPhotosManifest();
      const newPhoto: PhotoRecord = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: photoUrl,
        name: name || photoUrl.split('/').pop() || 'Untitled',
        size,
        contentType,
        createdAt: new Date().toISOString(),
      };

      const updated = [newPhoto, ...photos.filter((p) => p.url !== photoUrl)];
      await savePhotosManifest(updated);

      return res.status(200).json({ success: true, photo: newPhoto });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register photo';
      return res.status(500).json({ error: message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const body = await getBody(req);
      const targetUrl = req.query?.url || searchParams.get('url') || body?.url;
      const targetId = req.query?.id || searchParams.get('id') || body?.id;

      if (!targetUrl && !targetId) {
        return res.status(400).json({ error: 'Provide photo "url" or "id" to delete.' });
      }

      if (targetUrl && process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          await del(targetUrl);
        } catch {}
      }

      const photos = await getPhotosManifest();
      const filtered = photos.filter((p) => p.url !== targetUrl && p.id !== targetId);
      await savePhotosManifest(filtered);

      return res.status(200).json({ success: true, message: 'Photo deleted successfully.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      return res.status(500).json({ error: message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
