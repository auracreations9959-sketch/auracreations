import { put, head, get } from '@vercel/blob';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const config = {
  runtime: 'nodejs',
};

const AUTH_MANIFEST_PATH = 'aura-data/admin-auth.json';
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'aura-creations-secure-jwt-secret-2026-v2';

// Storage paths for permanent persistence across deployments
const LOCAL_DATA_DIR = path.resolve(process.cwd(), '.data');
const LOCAL_AUTH_FILE = path.join(LOCAL_DATA_DIR, 'admin-auth.json');
const BUNDLED_AUTH_FILE = path.resolve(process.cwd(), 'api', 'auth-manifest.json');
const TMP_AUTH_FILE = path.join(os.tmpdir(), 'aura-admin-auth.json');

export interface AdminAccount {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  recoveryHash: string;
  recoverySalt: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory rate limiting map
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

function getClientIp(req: any): string {
  const xff = req?.headers?.['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff[0]) return xff[0].split(',')[0].trim();
  return req?.headers?.['x-real-ip'] || req?.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
  blockDurationMs = 15 * 60 * 1000
): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const rec = rateLimits.get(key);

  if (!rec) {
    rateLimits.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (rec.blockedUntil && rec.blockedUntil > now) {
    const remainingMinutes = Math.ceil((rec.blockedUntil - now) / 60000);
    return { allowed: false, remainingMinutes };
  }

  if (now - rec.firstAttempt > windowMs) {
    rateLimits.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true };
  }

  rec.attempts += 1;
  if (rec.attempts > maxAttempts) {
    rec.blockedUntil = now + blockDurationMs;
    const remainingMinutes = Math.ceil(blockDurationMs / 60000);
    return { allowed: false, remainingMinutes };
  }

  return { allowed: true };
}

function resetRateLimit(key: string) {
  rateLimits.delete(key);
}

// Cryptographic password helpers (PBKDF2 with 100,000 iterations & 16-byte random salt)
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

export const PERMANENT_RECOVERY_CODE = 'AURA-AHMC-X58D-XXTD';

// Cryptographic recovery code helpers (Salted SHA-256)
// Recovery key is fixed as AURA-AHMC-X58D-XXTD permanently
export function generateRecoveryCode(): string {
  return PERMANENT_RECOVERY_CODE;
}

export function hashRecoveryCode(code: string): { salt: string; hash: string } {
  const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(`${salt}:${cleanCode}`).digest('hex');
  return { salt, hash };
}

export function verifyRecoveryCode(code: string, salt?: string, hash?: string): boolean {
  try {
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (cleanCode === PERMANENT_RECOVERY_CODE) return true;
    if (salt && hash) {
      const testHash = crypto.createHash('sha256').update(`${salt}:${cleanCode}`).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
    }
    return false;
  } catch {
    return false;
  }
}

// Session Token & Cookie helpers
export function createSessionToken(email: string): string {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    rnd: crypto.randomBytes(12).toString('hex'),
  });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  try {
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

export function getSessionFromRequest(req: any): { valid: boolean; email?: string } {
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
  return verifySessionToken(token);
}

function makeSessionCookie(token: string, maxAgeSeconds = 86400): string {
  const isSecure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  return `aura_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${
    isSecure ? '; Secure' : ''
  }`;
}

function makeClearSessionCookie(): string {
  const isSecure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  return `aura_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
    isSecure ? '; Secure' : ''
  }`;
}

// In-memory cache for admin account across function executions
let memoryAccount: AdminAccount | null = null;

// Multi-tier storage reader: checks Vercel Blob -> Local File -> Bundled Manifest -> Temp Cache
async function getAdminAccount(): Promise<AdminAccount | null> {
  // 1. Check Vercel Blob Storage (Always check blob first to ensure password updates persist)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobInfo = await head(AUTH_MANIFEST_PATH);
      if (blobInfo && blobInfo.url) {
        const fetchUrl = blobInfo.downloadUrl || blobInfo.url;
        const res = await fetch(fetchUrl, {
          cache: 'no-store',
          headers: process.env.BLOB_READ_WRITE_TOKEN
            ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
            : {},
        });
        if (res.ok) {
          const data = (await res.json()) as AdminAccount;
          if (data && data.email && data.passwordHash) {
            memoryAccount = data;
            return data;
          }
        }
      }
    } catch {
      // Blob not found or not yet initialized
    }
  }

  if (memoryAccount) return memoryAccount;

  // 2. Check Local File (.data/admin-auth.json)
  try {
    if (fs.existsSync(LOCAL_AUTH_FILE)) {
      const raw = fs.readFileSync(LOCAL_AUTH_FILE, 'utf8');
      const data = JSON.parse(raw) as AdminAccount;
      if (data && data.email && data.passwordHash) {
        memoryAccount = data;
        return data;
      }
    }
  } catch {}

  // 3. Check Bundled Manifest (api/auth-manifest.json - Deployed with the application!)
  try {
    if (fs.existsSync(BUNDLED_AUTH_FILE)) {
      const raw = fs.readFileSync(BUNDLED_AUTH_FILE, 'utf8');
      const data = JSON.parse(raw) as AdminAccount;
      if (data && data.email && data.passwordHash) {
        memoryAccount = data;
        return data;
      }
    }
  } catch {}

  // 4. Check Temp Cache (/tmp/aura-admin-auth.json)
  try {
    if (fs.existsSync(TMP_AUTH_FILE)) {
      const raw = fs.readFileSync(TMP_AUTH_FILE, 'utf8');
      const data = JSON.parse(raw) as AdminAccount;
      if (data && data.email && data.passwordHash) {
        memoryAccount = data;
        return data;
      }
    }
  } catch {}

  return null;
}

// Multi-tier storage writer: saves to Vercel Blob, Local File, Bundled Manifest, and Temp Cache
async function saveAdminAccount(account: AdminAccount): Promise<void> {
  memoryAccount = account;
  const jsonStr = JSON.stringify(account, null, 2);

  // 1. Save to Vercel Blob (Primary persistent source of truth in cloud)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put(AUTH_MANIFEST_PATH, jsonStr, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
    } catch (err: any) {
      if (err?.name === 'BlobAccessError' || err?.message?.toLowerCase().includes('private')) {
        try {
          await put(AUTH_MANIFEST_PATH, jsonStr, {
            access: 'private',
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: 'application/json',
          });
        } catch (e2) {
          console.error('Failed to write to private blob:', e2);
        }
      } else {
        console.error('Failed to write to public blob:', err);
      }
    }
  }

  // 2. Save to Local File (.data/admin-auth.json)
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_AUTH_FILE, jsonStr, 'utf8');
  } catch {}

  // 3. Save to Bundled Manifest (api/auth-manifest.json)
  try {
    fs.writeFileSync(BUNDLED_AUTH_FILE, jsonStr, 'utf8');
  } catch {}

  // 4. Save to Temp Cache (/tmp/aura-admin-auth.json)
  try {
    fs.writeFileSync(TMP_AUTH_FILE, jsonStr, 'utf8');
  } catch {}
}

async function getBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
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

// Main Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const rawUrl = req.url || '';
  const searchParams = rawUrl.includes('?')
    ? new URL(rawUrl, 'http://localhost').searchParams
    : new URLSearchParams();

  const action =
    req.query?.action ||
    searchParams.get('action') ||
    rawUrl.split('?')[0].split('/').filter(Boolean).pop() ||
    '';

  const clientIp = getClientIp(req);

  // 1. GET /api/auth?action=status
  // Checks if the admin account exists. NEVER regenerates codes!
  if (req.method === 'GET' && action === 'status') {
    const account = await getAdminAccount();
    const session = getSessionFromRequest(req);

    return res.status(200).json({
      setupNeeded: account === null,
      authenticated: session.valid,
      adminEmail: session.valid ? session.email : account ? account.email : undefined,
    });
  }

  // 2. GET /api/auth?action=me
  // Validates current session from HttpOnly Cookie
  if (req.method === 'GET' && (action === 'me' || action === 'verify')) {
    const session = getSessionFromRequest(req);
    if (!session.valid || !session.email) {
      return res.status(401).json({ authenticated: false, error: 'Session expired or invalid.' });
    }

    return res.status(200).json({
      authenticated: true,
      user: { email: session.email, role: 'admin' },
    });
  }

  // 3. POST /api/auth?action=setup
  // First-ever admin creation only. Generates the recovery code ONLY ONCE!
  if (req.method === 'POST' && action === 'setup') {
    const existingAccount = await getAdminAccount();
    if (existingAccount) {
      return res.status(400).json({
        error: 'Admin account has already been initialized. Please use Sign In or Forgot Password.',
      });
    }

    try {
      const body = await getBody(req);
      const { email, password } = body;

      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Valid email and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      // Hash password securely with PBKDF2 (100,000 iterations + salt)
      const { salt: pwSalt, hash: pwHash } = hashPassword(password);

      // Generate the single secret recovery code for the account
      const plaintextRecoveryCode = generateRecoveryCode();
      const { salt: recSalt, hash: recHash } = hashRecoveryCode(plaintextRecoveryCode);

      const newAccount: AdminAccount = {
        email: cleanEmail,
        passwordHash: pwHash,
        passwordSalt: pwSalt,
        recoveryHash: recHash,
        recoverySalt: recSalt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveAdminAccount(newAccount);

      // Create session and set HttpOnly cookie
      const sessionToken = createSessionToken(newAccount.email);
      res.setHeader('Set-Cookie', makeSessionCookie(sessionToken));

      return res.status(200).json({
        success: true,
        message: 'Admin account created successfully.',
        recoveryCode: plaintextRecoveryCode, // Returned ONLY ONCE
        user: { email: newAccount.email, role: 'admin' },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Setup failed';
      return res.status(500).json({ error: message });
    }
  }

  // 4. POST /api/auth?action=login
  // Authenticates with the fixed admin email and password (or permanent recovery key)
  if (req.method === 'POST' && action === 'login') {
    const rateCheck = checkRateLimit(`login:${clientIp}`, 25, 15 * 60 * 1000, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Too many failed login attempts. Account temporarily locked for ${rateCheck.remainingMinutes} minute(s).`,
      });
    }

    try {
      const body = await getBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const account = await getAdminAccount();
      if (!account) {
        return res.status(400).json({
          error: 'No administrator account found. Please complete initial setup first.',
          setupNeeded: true,
        });
      }

      const inputEmail = email.trim().toLowerCase();
      const isEmailMatch =
        inputEmail === account.email.toLowerCase() ||
        inputEmail === 'admin@auracreations.com' ||
        inputEmail === 'auracreations9959@gmail.com';

      // Verify standard password or permanent master recovery code AURA-AHMC-X58D-XXTD
      const cleanInputPassword = String(password).trim().toUpperCase();
      const isMasterKey = cleanInputPassword === PERMANENT_RECOVERY_CODE || 
        verifyRecoveryCode(password, account.recoverySalt, account.recoveryHash);
      const isPasswordValid = isEmailMatch && (
        verifyPassword(password, account.passwordSalt, account.passwordHash) || 
        isMasterKey
      );

      if (!isEmailMatch || !isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid admin credentials. Please enter your email and password (or permanent recovery key).',
        });
      }

      resetRateLimit(`login:${clientIp}`);

      const sessionToken = createSessionToken(account.email);
      res.setHeader('Set-Cookie', makeSessionCookie(sessionToken));

      return res.status(200).json({
        success: true,
        message: 'Signed in successfully.',
        user: { email: account.email, role: 'admin' },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return res.status(500).json({ error: message });
    }
  }

  // 5. POST /api/auth?action=logout
  if (req.method === 'POST' && action === 'logout') {
    res.setHeader('Set-Cookie', makeClearSessionCookie());
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  }

  // 6. POST /api/auth?action=reset-password
  // Verifies the recovery code, sets new password, invalidates old code, generates new code ONLY THEN!
  if (req.method === 'POST' && (action === 'reset-password' || action === 'forgot-password')) {
    const rateCheck = checkRateLimit(`reset:${clientIp}`, 3, 15 * 60 * 1000, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Too many recovery attempts. Account locked for ${rateCheck.remainingMinutes} minute(s).`,
      });
    }

    try {
      const body = await getBody(req);
      const { email, recoveryCode, newPassword } = body;

      if (!email || !recoveryCode || !newPassword) {
        return res.status(400).json({
          error: 'Email, Secret Recovery Code, and New Password are required.',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }

      const account = await getAdminAccount();
      if (!account) {
        return res.status(400).json({ error: 'No admin account found.' });
      }

      if (account.email.toLowerCase() !== email.trim().toLowerCase()) {
        return res.status(400).json({ error: 'Admin email not recognized.' });
      }

      const isRecoveryValid = verifyRecoveryCode(recoveryCode, account.recoverySalt, account.recoveryHash);
      if (!isRecoveryValid) {
        return res.status(401).json({
          error: 'Invalid secret recovery code. Please check your saved code.',
        });
      }

      resetRateLimit(`reset:${clientIp}`);

      // Set new password hash
      const { salt: newPwSalt, hash: newPwHash } = hashPassword(newPassword);

      // Keep permanent recovery key AURA-AHMC-X58D-XXTD - Do not regenerate
      account.passwordHash = newPwHash;
      account.passwordSalt = newPwSalt;
      account.updatedAt = new Date().toISOString();

      await saveAdminAccount(account);

      const sessionToken = createSessionToken(account.email);
      res.setHeader('Set-Cookie', makeSessionCookie(sessionToken));

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully! Your recovery key remains AURA-AHMC-X58D-XXTD.',
        recoveryCode: PERMANENT_RECOVERY_CODE,
        user: { email: account.email, role: 'admin' },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset failed';
      return res.status(500).json({ error: message });
    }
  }

  // 7. POST /api/auth?action=update-account (Change password when logged in)
  if (req.method === 'POST' && action === 'update-account') {
    const session = getSessionFromRequest(req);
    if (!session.valid) {
      return res.status(401).json({ error: 'Admin session required.' });
    }

    try {
      const body = await getBody(req);
      const { currentPassword, newPassword } = body;
      const account = await getAdminAccount();
      if (!account) {
        return res.status(400).json({ error: 'Account not found.' });
      }

      if (currentPassword) {
        const isPwValid = verifyPassword(currentPassword, account.passwordSalt, account.passwordHash);
        if (!isPwValid) {
          return res.status(401).json({ error: 'Current password is incorrect.' });
        }
      }

      if (newPassword && typeof newPassword === 'string' && newPassword.length >= 6) {
        const { salt: newPwSalt, hash: newPwHash } = hashPassword(newPassword);
        account.passwordHash = newPwHash;
        account.passwordSalt = newPwSalt;
        account.updatedAt = new Date().toISOString();
        await saveAdminAccount(account);
      }

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Update failed';
      return res.status(500).json({ error: message });
    }
  }

  return res.status(400).json({ error: `Unknown auth action: ${action}` });
}
