# 02. Complete Project History & Engineering Evolution

---

## 1. Initial Project Context & Requirements

The Aura Creations project commenced with a clear mandate: replace an outdated, non-responsive promotional presence with a premier, high-converting digital storefront reflecting an established physical advertising studio located in Guntur, Andhra Pradesh.

### Core Initial Requirements
1. **Brand Identity:** Highlighting the custom cursive tagline *"Ideas That Create Impact"* alongside the crisp white "AURA CREATIONS" logomark.
2. **Comprehensive Service Spectrum:** Structuring 18 distinct commercial services across 5 commercial sectors (Signage, Printing, Branding, Promotional, Outdoor).
3. **Owner & Key Contact Transparency:** Presenting clear, verified phone lines for key leadership (J. Vani - Administration, Shiva - Marketing & Creative Head, and General Customer Desk).
4. **Interactive Lead Acquisition:** Providing an instant quotation calculator capturing exact specifications (measurements, material type, quantities) without requiring user registration.
5. **Admin Self-Sufficiency:** Enabling the studio proprietor to modify prices, descriptions, and imagery in real-time from mobile or desktop.

---

## 2. Chronological Engineering Phases

### Phase 1: Foundation & Design Language (Sprint 1)
- **Framework Selection:** Initialized a modern Vite + React 19 + TypeScript application.
- **Palette Architecture:** Selected deep space obsidian (`#06040d`) as the backdrop, accented by electric fuchsia (`#d946ef`), royal purple (`#8b5cf6`), and radiant gold (`#f59e0b`).
- **Typography Integration:** Configured dual-font hierarchy:
  - **Headings:** *Montserrat* (Geometric sans-serif for architectural authority).
  - **Body Copy:** *Plus Jakarta Sans* (Legible, contemporary UI typeface).
  - **Signatures & Accents:** *Caveat* and custom cursive vector swoops for brand humanity.

### Phase 2: Dynamic Hero & Planetary Orbit Animation (Sprint 2)
- Designed a unique 3-tier concentric planetary orbit system surrounding the core Aura logo mark.
- Implemented CSS keyframes for clockwise orbit paths (`animate-orbit-outer`, `animate-orbit-middle`, `animate-orbit-inner`) combined with counter-rotational transforms (`animate-counter-rotate-*`) so planet text badges remain perfectly upright as they orbit.
- Added mouse-hover pause physics (`group-hover/orbit:[animation-play-state:paused]`) allowing users to pause and click any orbiting service to inspect details.

### Phase 3: Admin Panel & Serverless Backend (Sprint 3)
- Built the `/admin` portal supporting authenticated business profile configuration and service item CRUD.
- Implemented PBKDF2 SHA-512 password hashing with 10,000 iterations and 16-byte cryptographically secure salts.
- Introduced permanent master recovery key functionality (`AURA-AHMC-X58D-XXTD`) ensuring the business owner can never be permanently locked out if a session expires or password is forgotten.

### Phase 4: The Persistence Bug Diagnosis & Resolution (Critical Milestone)
During initial testing of the Admin Panel on Vercel production, changes made in the dashboard would appear on the local device, but upon refreshing or opening from another phone, the changes reverted to old defaults.

#### Root Cause Analysis:
1. When `@vercel/blob`'s `put()` method was called to update `aura-data/services-manifest.json` and `aura-data/business-manifest.json`, the SDK threw a `BlobAccessError` / collision error because a blob at that path already existed.
2. The missing flag was `allowOverwrite: true`.
3. Furthermore, when requesting `auracreationss.com` directly, the HTTP 308 redirect stripped the incoming `Cookie` header (`aura_admin_session`), causing the backend API to reject authenticated requests.

#### Engineering Fix:
```typescript
// Updated in api/services.ts, api/business.ts, api/portfolio.ts, api/photos.ts
putResult = await put(MANIFEST_PATH, JSON.stringify(body, null, 2), {
  access: 'public',
  addRandomSuffix: false,
  allowOverwrite: true, // CRITICAL FIX: Overwrites existing manifest in place
  contentType: 'application/json',
});
```
- Added `allowOverwrite: true` across all serverless API endpoints.
- Standardized all API calls to target `https://www.auracreationss.com/` directly to avoid header-stripping 308 redirects.
- Cloud persistence was successfully verified with HTTP 200 responses across all devices.

---

### Phase 5: UI Refinement & Interactive Office Map (Sprint 4)
- **Visiting Card Replacement:** Replaced a static legacy paper card image in the About section with an interactive, responsive **Google Maps Office Preview Card**.
- Embedded verified coordinates (`16.3067, 80.4365`) for the Srinagar Colony office.
- Added direct navigation hooks: clicking anywhere on the map card opens Google Maps directions to the exact office in a new tab.
- **WhatsApp Widget Update:** Replaced legacy individual name references on the floating WhatsApp widget with brand-standard *"Chat with Aura"*.
- **About Us Headline Highlighting:** Highlighted the company name in the narrative text with the signature multi-color gradient (`brand-gradient-text`) with soft fuchsia drop-shadows.

---

### Phase 6: Planetary Animation Service Update (Sprint 5)
- **Service Swap:** Replaced "Umbrella Printing" on Planet 6 (inner purple orbit) with "T-Shirt Printing".
- Swapped index positions in `src/content/services.json` and synchronized the cloud database via authenticated API POST.
- Replaced the icon with `<Shirt />` from `lucide-react`, maintaining orbit physics and responsive typography.

---

### Phase 7: Authentic Photo Asset Migration (Sprint 6)
- The user provided raw high-resolution photography directly from the Aura Creations workshop in `c:\Users\Hello\OneDrive\Desktop\aura creations pics\Website Imges`.
- Engineered an automated Node.js migration pipeline utilizing `sharp`:
  - Processed 24 authentic master photos (originally up to 6.6MB and 6666px).
  - Scaled assets to a max width/height of 1600px with 85% mozjpeg quality.
  - Reduced total image payload by **89%** (e.g. `Flex-printing.jpg` dropped from 6.6MB to 250KB) with zero perceptible loss in visual crispness.
  - Mapped all 18 service cards and 15 portfolio items to authentic workshop photography.

---

### Phase 8: GitHub Integration & Vercel Alias Routing (Sprint 7)
- Initialized local Git repository inside `Aura Creations Website` (fixing an issue where a parent `.git` repository was tracking root user files).
- Linked repository to GitHub: `auracreations9959-sketch/auracreations` (branch `main`).
- Connected GitHub to Vercel for automated CI/CD builds on every git push.
- **Domain Alias Routing Fix:** Discovered that Vercel was routing `auracreationss.com` and `www.auracreationss.com` to an older deployment snapshot. Manually executed `vercel alias set` to bind both domains directly to the latest production build.
- **Cache-Busting Resolution:** Added `?v=2` version tags across all image references in code and Vercel Blob manifests to force Chrome to purge old disk-cached stock images and load the new authentic photos instantly.

---

## 3. Summary of Major Challenges & Lessons Learned

| Challenge | Root Cause | Implemented Solution | Permanent Lesson for Future Projects |
| :--- | :--- | :--- | :--- |
| **Data not syncing across devices** | `@vercel/blob` threw duplicate blob error on `put()` without overwrite flag. | Added `allowOverwrite: true` across all manifest PUT handlers. | Always specify `allowOverwrite: true` when maintaining singleton JSON database manifests in cloud blob storage. |
| **Auth headers dropped during API fetch** | Non-www to www 308 redirect stripped the `Cookie` header. | Directed all frontend API calls to the canonical domain (`https://www.auracreationss.com`). | Never make relative API calls that cross redirect boundaries; verify cookie persistence on production early. |
| **Browser showing old images after update** | Aggressive 24-hour browser HTTP caching in Chrome disk cache. | Added `?v=2` query parameter to image URLs and set `must-revalidate` in `vercel.json`. | Implement query-based asset versioning for any dynamic media served from static paths. |
| **Git tracking user home directory** | `git init` had previously been executed in `C:\Users\Hello`. | Initialized independent Git repo inside project folder with strict `.gitignore`. | Always run `git rev-parse --show-toplevel` before initializing or committing on Windows machines. |
