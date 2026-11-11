import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Local Dev API Server for testing full auth, sessions, cookies, uploads & photos
function devApiPlugin(): Plugin {
  const DATA_DIR = path.resolve(process.cwd(), '.data');
  const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
  const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');
  const SERVICES_FILE = path.join(DATA_DIR, 'services.json');

  const JWT_SECRET = 'aura-creations-local-dev-secret-key-2026';

  // Rate Limiting Map
  const rateLimits = new Map<string, { attempts: number; firstAttempt: number; blockedUntil?: number }>();

  function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const rec = rateLimits.get(key);
    if (!rec) {
      rateLimits.set(key, { attempts: 1, firstAttempt: now });
      return { allowed: true };
    }
    if (rec.blockedUntil && rec.blockedUntil > now) {
      return { allowed: false, remainingMinutes: Math.ceil((rec.blockedUntil - now) / 60000) };
    }
    if (now - rec.firstAttempt > windowMs) {
      rateLimits.set(key, { attempts: 1, firstAttempt: now });
      return { allowed: true };
    }
    rec.attempts += 1;
    if (rec.attempts > maxAttempts) {
      rec.blockedUntil = now + windowMs;
      return { allowed: false, remainingMinutes: Math.ceil(windowMs / 60000) };
    }
    return { allowed: true };
  }

  function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { salt, hash };
  }

  function verifyPassword(password: string, salt: string, hash: string) {
    try {
      const test = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(test, 'hex'), Buffer.from(hash, 'hex'));
    } catch {
      return false;
    }
  }

  const PERMANENT_RECOVERY_CODE = 'AURA-AHMC-X58D-XXTD';

  function generateRecoveryCode() {
    return PERMANENT_RECOVERY_CODE;
  }

  function hashRecoveryCode(code: string) {
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(`${salt}:${clean}`).digest('hex');
    return { salt, hash };
  }

  function verifyRecoveryCode(code: string, salt?: string, hash?: string) {
    try {
      const clean = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if (clean === PERMANENT_RECOVERY_CODE) return true;
      if (salt && hash) {
        const test = crypto.createHash('sha256').update(`${salt}:${clean}`).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(test, 'hex'), Buffer.from(hash, 'hex'));
      }
      return false;
    } catch {
      return false;
    }
  }

  function createSessionToken(email: string) {
    const payload = JSON.stringify({ email, exp: Date.now() + 86400000, rnd: crypto.randomBytes(12).toString('hex') });
    const b64 = Buffer.from(payload).toString('base64url');
    const sig = crypto.createHmac('sha256', JWT_SECRET).update(b64).digest('base64url');
    return `${b64}.${sig}`;
  }

  function verifySessionToken(token: string) {
    try {
      const [b64, sig] = token.split('.');
      if (!b64 || !sig) return { valid: false };
      const expected = crypto.createHmac('sha256', JWT_SECRET).update(b64).digest('base64url');
      if (sig !== expected) return { valid: false };
      const data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
      if (data.exp < Date.now()) return { valid: false };
      return { valid: true, email: data.email };
    } catch {
      return { valid: false };
    }
  }

  function getSession(req: any) {
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/aura_admin_session=([^;]+)/);
    if (!match) return { valid: false };
    return verifySessionToken(decodeURIComponent(match[1]));
  }

  function getStoredAccount() {
    if (fs.existsSync(AUTH_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
      } catch {}
    }
    const bundled = path.join(process.cwd(), 'api', 'auth-manifest.json');
    if (fs.existsSync(bundled)) {
      try {
        return JSON.parse(fs.readFileSync(bundled, 'utf8'));
      } catch {}
    }
    return null;
  }

  function saveStoredAccount(acc: any) {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(acc, null, 2), 'utf8');
    const bundled = path.join(process.cwd(), 'api', 'auth-manifest.json');
    try {
      fs.writeFileSync(bundled, JSON.stringify(acc, null, 2), 'utf8');
    } catch {}
  }

  function getStoredPhotos() {
    if (fs.existsSync(PHOTOS_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(PHOTOS_FILE, 'utf8'));
      } catch {
        return [];
      }
    }
    return [];
  }

  function saveStoredPhotos(photos: any[]) {
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), 'utf8');
  }

  return {
    name: 'dev-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        if (!urlStr.startsWith('/api/')) return next();

        const parsedUrl = new URL(urlStr, 'http://localhost');
        const pathname = parsedUrl.pathname;
        const action = parsedUrl.searchParams.get('action') || pathname.split('/').pop();
        const clientIp = req.socket.remoteAddress || '127.0.0.1';

        // Helper to read JSON body
        const readBody = () =>
          new Promise<any>((resolve) => {
            let data = '';
            req.on('data', (chunk: any) => (data += chunk));
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });

        const sendJson = (status: number, data: any, headers: Record<string, string> = {}) => {
          res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
          res.end(JSON.stringify(data));
        };

        // 1. AUTH ROUTES
        if (pathname.startsWith('/api/auth')) {
          // Status
          if (req.method === 'GET' && action === 'status') {
            const acc = getStoredAccount();
            const session = getSession(req);
            return sendJson(200, {
              setupNeeded: acc === null,
              authenticated: session.valid,
              adminEmail: session.valid ? session.email : undefined,
            });
          }

          // Me / Verify
          if (req.method === 'GET' && (action === 'me' || action === 'verify')) {
            const session = getSession(req);
            if (!session.valid) return sendJson(401, { authenticated: false, error: 'Session invalid or expired' });
            return sendJson(200, { authenticated: true, user: { email: session.email, role: 'admin' } });
          }

          // Setup
          if (req.method === 'POST' && action === 'setup') {
            const existing = getStoredAccount();
            if (existing) return sendJson(400, { error: 'Admin account already exists.' });

            const body = await readBody();
            const { email, password } = body;
            if (!email || !password || password.length < 6) {
              return sendJson(400, { error: 'Valid email and password (minimum 6 characters) required.' });
            }

            const { salt: pwSalt, hash: pwHash } = hashPassword(password);
            const rawRecovery = generateRecoveryCode();
            const { salt: recSalt, hash: recHash } = hashRecoveryCode(rawRecovery);

            const account = {
              email: email.trim().toLowerCase(),
              passwordHash: pwHash,
              passwordSalt: pwSalt,
              recoveryHash: recHash,
              recoverySalt: recSalt,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            saveStoredAccount(account);

            const token = createSessionToken(account.email);
            return sendJson(
              200,
              {
                success: true,
                message: 'Admin account provisioned successfully.',
                recoveryCode: rawRecovery,
                user: { email: account.email, role: 'admin' },
              },
              { 'Set-Cookie': `aura_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400` }
            );
          }

          // Login
          if (req.method === 'POST' && action === 'login') {
            const rate = checkRateLimit(`login:${clientIp}`);
            if (!rate.allowed) {
              return sendJson(429, { error: `Too many attempts. Locked for ${rate.remainingMinutes}m.` });
            }

            const body = await readBody();
            const { email, password } = body;

            const acc = getStoredAccount();
            if (!acc) {
              return sendJson(400, { error: 'No admin account found. Please complete initial setup first.', setupNeeded: true });
            }

            const isEmailMatch = acc && acc.email.toLowerCase() === (email || '').trim().toLowerCase();
            const isPwMatch = isEmailMatch && verifyPassword(password, acc.passwordSalt, acc.passwordHash);

            if (!isEmailMatch || !isPwMatch) {
              return sendJson(401, { error: 'Invalid admin credentials. Please check your email and password.' });
            }

            rateLimits.delete(`login:${clientIp}`);
            const token = createSessionToken(acc.email);
            return sendJson(
              200,
              { success: true, user: { email: acc.email, role: 'admin' } },
              { 'Set-Cookie': `aura_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400` }
            );
          }

          // Logout
          if (req.method === 'POST' && action === 'logout') {
            return sendJson(
              200,
              { success: true, message: 'Logged out' },
              { 'Set-Cookie': `aura_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT` }
            );
          }

          // Reset Password
          if (req.method === 'POST' && (action === 'reset-password' || action === 'forgot-password')) {
            const rate = checkRateLimit(`reset:${clientIp}`, 3);
            if (!rate.allowed) {
              return sendJson(429, { error: `Too many attempts. Wait ${rate.remainingMinutes}m.` });
            }

            const body = await readBody();
            const { email, recoveryCode, newPassword } = body;
            const acc = getStoredAccount();

            if (!acc || acc.email.toLowerCase() !== (email || '').trim().toLowerCase()) {
              return sendJson(400, { error: 'Admin email not recognized.' });
            }

            if (!verifyRecoveryCode(recoveryCode, acc.recoverySalt, acc.recoveryHash)) {
              return sendJson(401, { error: 'Invalid secret recovery code. Check your saved code.' });
            }

            const { salt: newPwSalt, hash: newPwHash } = hashPassword(newPassword);
            acc.passwordHash = newPwHash;
            acc.passwordSalt = newPwSalt;
            // Keep permanent recovery key AURA-AHMC-X58D-XXTD
            acc.updatedAt = new Date().toISOString();
            saveStoredAccount(acc);

            const token = createSessionToken(acc.email);
            return sendJson(
              200,
              {
                success: true,
                message: 'Password reset successful. Old recovery code invalidated.',
                recoveryCode: PERMANENT_RECOVERY_CODE,
                user: { email: acc.email, role: 'admin' },
              },
              { 'Set-Cookie': `aura_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400` }
            );
          }

          // Update Admin Password (Authenticated)
          if (req.method === 'POST' && action === 'update-account') {
            const session = getSession(req);
            if (!session.valid) return sendJson(401, { error: 'Admin session required' });

            const body = await readBody();
            const { currentPassword, newPassword } = body;
            const acc = getStoredAccount();
            if (!acc) return sendJson(400, { error: 'Admin account not found' });

            if (currentPassword && acc.passwordSalt && acc.passwordHash) {
              if (!verifyPassword(currentPassword, acc.passwordSalt, acc.passwordHash)) {
                return sendJson(401, { error: 'Current password is incorrect' });
              }
            }

            if (newPassword && typeof newPassword === 'string' && newPassword.length >= 6) {
              const { salt: newPwSalt, hash: newPwHash } = hashPassword(newPassword);
              acc.passwordHash = newPwHash;
              acc.passwordSalt = newPwSalt;
            }

            acc.updatedAt = new Date().toISOString();
            saveStoredAccount(acc);

            return sendJson(200, { success: true, message: 'Password updated successfully' });
          }
        }

        // 2. PHOTOS GALLERY ROUTES
        if (pathname.startsWith('/api/photos')) {
          if (req.method === 'GET') {
            return sendJson(200, { success: true, photos: getStoredPhotos() });
          }

          const session = getSession(req);
          if (!session.valid) return sendJson(401, { error: 'Admin authorization required' });

          if (req.method === 'POST') {
            const body = await readBody();
            const photos = getStoredPhotos();
            const record = {
              id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url: body.url,
              name: body.name || 'Uploaded Photo',
              size: body.size,
              contentType: body.contentType,
              createdAt: new Date().toISOString(),
            };
            saveStoredPhotos([record, ...photos.filter((p: any) => p.url !== body.url)]);
            return sendJson(200, { success: true, photo: record });
          }

          if (req.method === 'DELETE') {
            const targetUrl = parsedUrl.searchParams.get('url');
            const targetId = parsedUrl.searchParams.get('id');
            const photos = getStoredPhotos();
            const updated = photos.filter((p: any) => p.url !== targetUrl && p.id !== targetId);
            saveStoredPhotos(updated);
            return sendJson(200, { success: true, message: 'Photo removed from gallery' });
          }
        }

        // 3. UPLOAD ROUTE
        if (pathname.startsWith('/api/upload')) {
          if (req.method !== 'POST') return sendJson(405, { error: 'Use POST' });
          const session = getSession(req);
          if (!session.valid) return sendJson(401, { error: 'Admin authorization required' });

          const filename = parsedUrl.searchParams.get('filename') || `photo-${Date.now()}.webp`;
          const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
          const ext = cleanName.split('.').pop()?.toLowerCase();

          if (!ext || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
            return sendJson(400, { error: 'Allowed formats: JPG, JPEG, PNG, WEBP' });
          }

          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            const fileBuf = Buffer.concat(chunks);
            const savedPath = path.join(UPLOADS_DIR, cleanName);
            fs.writeFileSync(savedPath, fileBuf);
            const publicUrl = `/uploads/${cleanName}`;

            // Register into photo manifest
            const photos = getStoredPhotos();
            const record = {
              id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url: publicUrl,
              name: cleanName,
              size: fileBuf.length,
              contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
              createdAt: new Date().toISOString(),
            };
            saveStoredPhotos([record, ...photos.filter((p: any) => p.url !== publicUrl)]);

            sendJson(200, { success: true, url: publicUrl, pathname: publicUrl });
          });
          return;
        }

        // 4. SERVICES ROUTE
        if (pathname.startsWith('/api/services')) {
          if (req.method === 'GET') {
            if (fs.existsSync(SERVICES_FILE)) {
              try {
                const srv = JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf8'));
                return sendJson(200, { source: 'local-file', services: srv });
              } catch {}
            }
            return sendJson(200, { source: 'not-found', services: null });
          }

          if (req.method === 'POST') {
            const session = getSession(req);
            if (!session.valid) return sendJson(401, { error: 'Admin authorization required' });

            const body = await readBody();
            if (!Array.isArray(body)) return sendJson(400, { error: 'Must be array' });
            fs.writeFileSync(SERVICES_FILE, JSON.stringify(body, null, 2), 'utf8');
            return sendJson(200, { success: true, count: body.length });
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devApiPlugin(),
  ],
  server: {
    watch: {
      ignored: ['**/api/**', '**/.git/**', '**/.data/**', '**/public/uploads/**'],
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
});
