import { put, head } from '@vercel/blob';
import crypto from 'node:crypto';

export const config = {
  runtime: 'nodejs',
};

const ENQUIRIES_MANIFEST_PATH = 'aura-data/enquiries-manifest.json';
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'aura-creations-secure-jwt-secret-2026-v2';

export interface EnquiryRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'resolved';
}

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

// In-memory rate limiting map for inquiry spam prevention
const inquiryLimits = new Map<string, { count: number; firstSeen: number }>();

function checkInquiryRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxInquiries = 10;

  const rec = inquiryLimits.get(ip);
  if (!rec || now - rec.firstSeen > windowMs) {
    inquiryLimits.set(ip, { count: 1, firstSeen: now });
    return true;
  }

  if (rec.count >= maxInquiries) return false;
  rec.count += 1;
  return true;
}

function getClientIp(req: any): string {
  const xff = req?.headers?.['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff[0]) return xff[0].split(',')[0].trim();
  return req?.headers?.['x-real-ip'] || req?.socket?.remoteAddress || '127.0.0.1';
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

async function getEnquiriesFromBlob(): Promise<EnquiryRecord[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const blobInfo = await head(ENQUIRIES_MANIFEST_PATH);
    if (blobInfo && blobInfo.url) {
      const fetchUrl = blobInfo.downloadUrl || blobInfo.url;
      const res = await fetch(fetchUrl, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    }
  } catch {}
  return [];
}

async function saveEnquiriesToBlob(enquiries: EnquiryRecord[]): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    try {
      await put(ENQUIRIES_MANIFEST_PATH, JSON.stringify(enquiries, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
      return true;
    } catch (err: any) {
      if (err?.name === 'BlobAccessError' || err?.message?.toLowerCase().includes('private')) {
        await put(ENQUIRIES_MANIFEST_PATH, JSON.stringify(enquiries, null, 2), {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
        });
        return true;
      }
    }
  } catch (err) {
    console.error('Failed to save enquiries manifest:', err);
  }
  return false;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 1. GET: Admin fetches inquiries
  if (req.method === 'GET') {
    const session = getSessionFromRequest(req);
    if (!session.valid) {
      return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
    }
    const enquiries = await getEnquiriesFromBlob();
    return res.status(200).json({ success: true, enquiries });
  }

  // 2. POST: Customer submits quote inquiry
  if (req.method === 'POST') {
    const ip = getClientIp(req);
    if (!checkInquiryRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many submissions. Please wait a few minutes before submitting another request.' });
    }

    const body = await getBody(req);
    const { name, phone, email, service, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name.' });
    }

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!service || typeof service !== 'string') {
      return res.status(400).json({ error: 'Please select a valid service.' });
    }

    const newEnquiry: EnquiryRecord = {
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim().slice(0, 100),
      phone: cleanPhone.slice(0, 15),
      email: email ? String(email).trim().slice(0, 100) : undefined,
      service: service.trim().slice(0, 100),
      message: message ? String(message).trim().slice(0, 1000) : 'Custom quote request',
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'new',
    };

    const currentEnquiries = await getEnquiriesFromBlob();
    const updated = [newEnquiry, ...currentEnquiries].slice(0, 500); // Retain latest 500 inquiries
    await saveEnquiriesToBlob(updated);

    return res.status(200).json({ success: true, message: 'Inquiry submitted successfully.', enquiry: newEnquiry });
  }

  // 3. PATCH / DELETE: Admin manages inquiries
  const session = getSessionFromRequest(req);
  if (!session.valid) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  if (req.method === 'PATCH') {
    const body = await getBody(req);
    const { id, status } = body;
    if (!id || !['new', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Valid id and status required.' });
    }
    const currentEnquiries = await getEnquiriesFromBlob();
    const updated = currentEnquiries.map((e) => (e.id === id ? { ...e, status } : e));
    await saveEnquiriesToBlob(updated);
    return res.status(200).json({ success: true, message: 'Status updated.' });
  }

  if (req.method === 'DELETE') {
    const body = await getBody(req);
    const id = req.query?.id || body?.id;
    if (!id) {
      return res.status(400).json({ error: 'Inquiry ID required.' });
    }
    const currentEnquiries = await getEnquiriesFromBlob();
    const updated = currentEnquiries.filter((e) => e.id !== id);
    await saveEnquiriesToBlob(updated);
    return res.status(200).json({ success: true, message: 'Inquiry deleted.' });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
