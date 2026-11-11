# 06. Admin Panel & Serverless Backend Architecture

---

## 1. Authentication & Security Engine

The administrative backend of Aura Creations is architected with defense-in-depth principles to protect business data while providing a frictionless experience for non-technical studio staff.

```
+-------------------------------------------------------------------------+
|                              CLIENT BROWSER                             |
|  - Login Form at /admin or /admin-login                                 |
|  - Submits { email, password } to POST /api/auth?action=login           |
+------------------------------------+------------------------------------+
                                     |
                                     v
+------------------------------------+------------------------------------+
|                         /api/auth HANDLER                               |
|  1. In-Memory IP Rate Limiter (Max 25 attempts per 15 min)              |
|  2. Fetches admin credentials from aura-data/admin-auth.json            |
|  3. Hashes input with PBKDF2 (10,000 iterations, SHA-512, stored salt)  |
|     OR verifies against Permanent Recovery Code                         |
|  4. On Success: Generates Signed JWT Session Token                      |
|  5. Sets HTTP-Only Cookie: aura_admin_session                           |
+------------------------------------+------------------------------------+
```

### 1.1 Password Cryptography (PBKDF2)
- **Algorithm:** PBKDF2 (Password-Based Key Derivation Function 2)
- **Digest:** SHA-512
- **Iterations:** 10,000
- **Salt:** 16 bytes of cryptographically secure random bytes generated via `crypto.randomBytes(16)`.
- **Output Length:** 64 bytes (128 hex characters).

### 1.2 Permanent Master Recovery Key
To protect against permanent administrative lockout (e.g. if the owner forgets their custom password or browser cookies clear), the system supports a hardcoded, immutable recovery key:
- **Master Key:** `AURA-AHMC-X58D-XXTD`
- Entering this key in the password field allows instant verified login and prompts the administrator to configure a new personal password.

### 1.3 Session Verification Mechanism
All mutation endpoints (`POST /api/services`, `POST /api/business`, `POST /api/portfolio`, `POST /api/upload`) execute a self-contained session validation check before processing requests:
```typescript
function getSessionFromRequest(req: any): { valid: boolean; email?: string } {
  try {
    let token: string | undefined = req?.cookies?.aura_admin_session;
    if (!token) {
      const rawCookie = req?.headers?.cookie || '';
      const match = rawCookie.match(/aura_admin_session=([^;]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }
    if (!token) return { valid: false };

    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (signature !== expectedSig) return { valid: false };

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return { valid: false };

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}
```

---

## 2. API Endpoints Reference

### 2.1 `/api/auth`
| Method | Query / Action | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `?action=login` | Public | Validates email & password (or master key), issues `aura_admin_session` cookie. |
| `POST` | `?action=logout` | Public | Clears the session cookie (`maxAge: 0`). |
| `GET` | `?action=me` | Authenticated | Returns currently authenticated administrator email and role. |
| `POST` | `?action=reset-password` | Authenticated | Updates the stored password hash and generates a new cryptographic salt. |

### 2.2 `/api/services`
| Method | Access | Description |
| :--- | :--- | :--- |
| `GET` | Public | Returns the array of 18 active service items from `aura-data/services-manifest.json` (falls back to local JSON if uninitialized). |
| `POST` | **Admin Session** | Overwrites the services array in Vercel Blob with `allowOverwrite: true`. Returns HTTP 200 with saved URL. |

### 2.3 `/api/business`
| Method | Access | Description |
| :--- | :--- | :--- |
| `GET` | Public | Returns company contact details, address, proprietor role, and phone numbers. |
| `POST` | **Admin Session** | Updates the company details manifest in Vercel Blob. |

### 2.4 `/api/upload`
| Method | Access | Description |
| :--- | :--- | :--- |
| `POST` | **Admin Session** | Accepts multipart file uploads, validates MIME type (`image/jpeg`, `image/png`, `image/webp`), uploads to Vercel Blob at `services/<timestamp>-<filename>`, and returns the permanent public URL. |

### 2.5 `/api/enquiries`
| Method | Access | Description |
| :--- | :--- | :--- |
| `POST` | Public | Captures client inquiry details from the contact form and appends them to `aura-data/enquiries-manifest.json`. |
| `GET` | **Admin Session** | Returns the list of submitted client inquiries for review in the Admin Panel. |

---

## 3. Admin Panel UI & Capabilities (`src/components/AdminPanel.tsx`)

1. **Service Item CRUD:**
   - **Create:** Modal allowing the user to specify service ID, name, commercial category, description, bullet points, price indicator, and upload a photograph.
   - **Edit:** Inline form pre-populated with existing details for immediate editing.
   - **Delete:** Confirmation dialogue preventing accidental deletion.
2. **Business Information Management:**
   - Real-time editing of the 3 primary phone numbers, shop address, tagline, and Instagram handle.
3. **Inquiry Lead Center:**
   - Table displaying incoming quote requests with client name, phone number, required service, and project scope notes.
   - One-click **"Call Client"** and **"WhatsApp Client"** shortcuts for immediate follow-up.
