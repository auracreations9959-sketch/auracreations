# 10. Performance, Security & Scalability Standards

---

## 1. Core Web Vitals & Frontend Performance

The website is engineered to score $90+$ across all Core Web Vitals metrics on Google PageSpeed Insights and Chrome User Experience (CrUX) benchmarks.

| Metric | Target | Aura Creations Architecture Strategy |
| :--- | :--- | :--- |
| **LCP** *(Largest Contentful Paint)* | $< 1.5\text{s}$ | Hero brand logomark preloaded with `fetchPriority="high"`, responsive picture formats, and edge Anycast CDN delivery. |
| **CLS** *(Cumulative Layout Shift)* | $< 0.05$ | Explicit aspect ratio containers on all service cards, static dimensions on the planetary orbit, and web font display set to `swap`. |
| **INP** *(Interaction to Next Paint)* | $< 100\text{ms}$ | Zero heavy third-party tracking scripts, lightweight React 19 concurrent scheduler, and CSS keyframe GPU offloading. |

---

## 2. Image Optimization & Asset Delivery

High-resolution client photography is the #1 cause of slow commercial websites. The Aura Creations asset pipeline uses the following standards:

```
[Raw DSLR / Phone Camera Photo (4000x3000, 6MB)]
                       |
                       v
         [Sharp Optimization Pipeline]
  - Auto-orientation via EXIF metadata (.rotate())
  - Max bound constrain: 1600px width/height (.resize())
  - Progressive MozJPEG encoding at 85% quality
  - Strip unneeded color profiles and camera metadata
                       |
                       v
     [Optimized Web Asset (1600x1200, 250KB)]
             (89% File Size Reduction)
```

### Dynamic Asset Versioning (Cache-Busting)
To prevent browsers from displaying stale cached images after in-place updates, all media references are query-tagged:
`/images/services/led-boards.jpg?v=2`
When a file is modified, incrementing the version query string forces every client browser to immediately discard the old file and stream the new asset.

---

## 3. JavaScript & Bundle Optimization (`vite.config.ts`)

Instead of shipping a single monolithic JavaScript file of $800+\text{KB}$, the build configuration partitions code into targeted vendor chunks:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-motion': ['framer-motion'],
        'vendor-icons': ['lucide-react'],
      },
    },
  },
}
```

### Production Build Distribution
- `dist/assets/vendor-react-*.js` (210 KB / 65 KB gzip) – Long-term immutable cached chunk.
- `dist/assets/vendor-motion-*.js` (136 KB / 45 KB gzip) – Long-term immutable cached chunk.
- `dist/assets/vendor-icons-*.js` (24 KB / 9 KB gzip) – Tree-shaken SVG icon subset.
- `dist/assets/index-*.js` (200 KB / 42 KB gzip) – Dynamic application logic.
- `dist/assets/index-*.css` (102 KB / 14 KB gzip) – Minified zero-runtime Tailwind CSS.

---

## 4. HTTP Security Headers (`vercel.json`)

All responses emitted by the Vercel Edge Network contain strict security headers preventing clickjacking, MIME sniffing, and cross-site scripting:

```json
{
  "key": "Strict-Transport-Security",
  "value": "max-age=31536000; includeSubDomains; preload"
},
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
},
{
  "key": "X-Frame-Options",
  "value": "SAMEORIGIN"
},
{
  "key": "X-XSS-Protection",
  "value": "1; mode=block"
},
{
  "key": "Referrer-Policy",
  "value": "strict-origin-when-cross-origin"
},
{
  "key": "Permissions-Policy",
  "value": "camera=(), microphone=(), geolocation=()"
}
```

---

## 5. Backend Defense & Rate Limiting

### 5.1 IP-Based Rate Limiting
To prevent automated credential stuffing and brute-force attacks against `/api/auth`, an in-memory sliding window rate limiter restricts login attempts:
- **Maximum Attempts:** 25 attempts per 15-minute window per IP.
- **Lockout Duration:** 15 minutes.
- **Response:** HTTP 429 Too Many Requests with retry-after header.

### 5.2 Input Validation & Sanitization
All public mutation endpoints (`POST /api/enquiries`) enforce strict payload sanitization:
- Phone numbers must match valid Indian mobile formats (10 digits).
- Names and project description strings are truncated and stripped of dangerous executable script tags (`<script>`, `javascript:`).
- File uploads are validated by checking file magic bytes to prevent masquerading executable binaries as images.

---

## 6. Scalability & Edge Resilience

1. **Traffic Spikes:** Because the frontend is pre-rendered static HTML/CSS/JS served from Vercel's global Anycast CDN, the site can handle 100,000+ simultaneous pageviews without degrading or requiring manual server scaling.
2. **Serverless Concurrency:** Inbound inquiries and admin operations run on isolated Node.js serverless execution contexts that scale automatically from 0 to 1,000 concurrent instances.
3. **Data Redundancy:** Vercel Blob cloud manifests are replicated across multiple availability zones with automated durability guarantees.
