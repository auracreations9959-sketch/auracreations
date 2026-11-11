# 07. Database & Cloud Storage Architecture

---

## 1. Storage Strategy: JSON Manifests on Object Storage

Rather than provisioning a traditional PostgreSQL, MySQL, or MongoDB database—which introduces continuous connection pool management, monthly hosting costs, and migration overhead—Aura Creations utilizes **Singleton JSON Manifests hosted on `@vercel/blob`**.

### Why This Architecture Excels for Small & Medium Business Websites
1. **Zero Database Maintenance:** No connection timeouts, no migrations, no cold-start latency, and zero monthly database server bills.
2. **Global CDN Edge Performance:** Manifest files are served directly through Vercel's Edge Network with global response latencies under 40ms.
3. **Atomic Backups:** Backing up the entire company website database is as simple as downloading three JSON files (`business-manifest.json`, `services-manifest.json`, `portfolio-manifest.json`).
4. **Deterministic Offline Fallbacks:** If the cloud token expires or is temporarily disconnected, the frontend immediately falls back to local static JSON copies (`src/content/*.json`) with zero user-visible disruption.

---

## 2. Cloud Blob Storage Hierarchy

Within the connected Vercel Blob store (`aura-creations-storage`), data is organized into structured prefixes:

```
[Vercel Blob Root]
│
├── aura-data/
│   ├── admin-auth.json         # Cryptographic hashes of admin credentials
│   ├── business-manifest.json  # Studio address, leadership, contact phone numbers
│   ├── services-manifest.json  # Full array of 18 active commercial services
│   ├── portfolio-manifest.json # Full array of 15 commercial client portfolio items
│   └── enquiries-manifest.json # Log of inbound custom quotation requests
│
├── services/
│   ├── 1794294719273-led-board.jpg
│   └── ... (admin uploaded service photos)
│
└── portfolio/
    └── ... (admin uploaded portfolio installations)
```

---

## 3. The `allowOverwrite: true` Milestone & Code Implementation

During initial development, writing updated manifests back to `@vercel/blob` resulted in HTTP 500 errors across devices. The standard `put()` method treats identical paths as conflicts unless explicitly configured.

### Verified Production Implementation
```typescript
import { put, head } from '@vercel/blob';

// Reading from Cloud Storage
const blobInfo = await head(MANIFEST_PATH);
if (blobInfo && blobInfo.url) {
  const fetchRes = await fetch(blobInfo.url, {
    headers: process.env.BLOB_READ_WRITE_TOKEN
      ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      : {},
  });
  if (fetchRes.ok) {
    const data = await fetchRes.json();
    return res.status(200).json({ source: 'vercel-blob', services: data });
  }
}

// Writing to Cloud Storage (CRITICAL OVERWRITE FLAG)
const putResult = await put(MANIFEST_PATH, JSON.stringify(body, null, 2), {
  access: 'public',
  addRandomSuffix: false,  // Prevents generating random hashes in filename
  allowOverwrite: true,    // CRITICAL: Replaces existing manifest cleanly
  contentType: 'application/json',
});
```

---

## 4. Media Upload Pipeline

When an administrator uploads a new photograph via the Admin Panel:
1. **Client Selection:** Admin selects an image from their device in the edit form.
2. **Payload Submission:** Sent via `multipart/form-data` to `POST /api/upload`.
3. **MIME Validation:** Serverless function validates file signature (`image/jpeg`, `image/png`, `image/webp`).
4. **Blob Ingestion:** `put()` streams the file into `services/<timestamp>-<filename>` with public read permissions.
5. **URL Propagation:** Vercel Blob returns a permanent Edge URL (e.g. `https://ntdhzrasytsi6xdy.public.blob.vercel-storage.com/...`).
6. **Manifest Sync:** The service item's `image` property is updated with this URL and saved to `services-manifest.json`.
7. **Immediate Availability:** The updated image is immediately visible across all devices visiting `auracreationss.com`.

---

## 5. Backup & Disaster Recovery Procedures

To create a full snapshot backup of all business data at any time:
1. Authenticate with the Admin Panel or use a Node.js backup script.
2. Fetch `GET /api/services`, `GET /api/business`, and `GET /api/portfolio`.
3. Save the returned JSON payloads to local disk or a secure backup repository.
4. To restore from a backup, post the saved JSON array directly to the respective `/api/*` endpoint using the authenticated admin session.
