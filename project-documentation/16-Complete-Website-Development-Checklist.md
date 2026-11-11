# 16. Master Website Development & Handover Checklist

> **Instructions:** Print or clone this master checklist for every client project. Mark each checkbox sequentially as each stage is completed and verified.

---

## Phase 1: Client Discovery & Requirements
- [ ] 1.1 Complete Client Specification Template (Document 15) signed by stakeholder.
- [ ] 1.2 Official registered business name and trade name verified.
- [ ] 1.3 Physical studio/office address verified on Google Maps.
- [ ] 1.4 Primary phone numbers called and confirmed operational.
- [ ] 1.5 Official business email verified and accessible by client.
- [ ] 1.6 Vector logo assets collected (`.svg` or `.png` with transparent background).
- [ ] 1.7 Brand color hex codes and font preferences documented.
- [ ] 1.8 Inventory of all products/services collected with starting prices.
- [ ] 1.9 Minimum 15–20 authentic workshop/store/team photos received.
- [ ] 1.10 Inbound lead destination confirmed (WhatsApp, phone, or email).

---

## Phase 2: Design System & Asset Preparation
- [ ] 2.1 Color tokens established in `src/index.css` (canvas, gradients, accents).
- [ ] 2.2 Heading, body, and accent fonts selected and linked from Google Fonts.
- [ ] 2.3 Glassmorphism tokens (`backdrop-blur-md`, subtle translucent borders) configured.
- [ ] 2.4 All client photos processed via Sharp (1600px max bounds, 85% progressive MozJPEG).
- [ ] 2.5 Image payload verified: every image under 450KB with zero visual blurriness.
- [ ] 2.6 Favicon vector (`favicon.svg`) and apple-touch-icon generated from brand logo.
- [ ] 2.7 OpenGraph banner image (`hero-brand-banner.jpg`, 1200x630px) created.

---

## Phase 3: Project Architecture & Initialization
- [ ] 3.1 Verify not inside a parent Git repository using `git rev-parse --show-toplevel`.
- [ ] 3.2 Initialize Vite + React 19 + TypeScript project.
- [ ] 3.3 Install Tailwind CSS v4 via `@tailwindcss/vite`.
- [ ] 3.4 Install Lucide React, Framer Motion, and Canvas Confetti.
- [ ] 3.5 Install `@vercel/blob` SDK.
- [ ] 3.6 Create `.gitignore` and confirm exclusion of `node_modules`, `dist`, `.env*`, `.data`.
- [ ] 3.7 Initialize local Git repository on branch `main`.
- [ ] 3.8 Create remote repository on GitHub and link `origin`.
- [ ] 3.9 Run `npm run build` to verify 0 TypeScript errors out of the box.

---

## Phase 4: Frontend Component Engineering
- [ ] 4.1 Sticky glassmorphic Header created with brand logo and navigation anchors.
- [ ] 4.2 Mobile navigation drawer built with auto-close on link selection.
- [ ] 4.3 Hero section engineered with brand headline, responsive logo, and cursive tagline.
- [ ] 4.4 Interactive showcase / animated visual feature built with hover pause physics.
- [ ] 4.5 About section built with highlighted brand name and leadership badge.
- [ ] 4.6 Interactive Google Maps office card built with verified coordinates and turn-by-turn routing.
- [ ] 4.7 Services catalog built with category filter pills and live search bar.
- [ ] 4.8 Service cards built with prices, bullet points, and WhatsApp quote buttons.
- [ ] 4.9 Portfolio showcase built with authentic photos, filters, and image zoom modal.
- [ ] 4.10 Why Choose Us section built with 4 distinct value proposition pillars.
- [ ] 4.11 Custom quotation estimate form built with validation and confetti celebration.
- [ ] 4.12 Dedicated contact person cards built with direct calling and WhatsApp links.
- [ ] 4.13 Sticky floating Call and WhatsApp interaction widgets pinned to viewport.
- [ ] 4.14 Comprehensive Footer built with legal, category breakdown, and copyright.

---

## Phase 5: Serverless Backend & Authentication
- [ ] 5.1 Vercel Serverless Functions created in `/api` directory.
- [ ] 5.2 Password cryptography implemented using PBKDF2 (10,000 iterations, SHA-512, random salt).
- [ ] 5.3 Permanent Master Recovery Key (`XXXX-XXXX-XXXX-XXXX`) hardcoded and documented.
- [ ] 5.4 Signed JWT session token issued via secure HTTP-Only cookie (`maxAge: 7 days`).
- [ ] 5.5 IP-based sliding-window rate limiting configured on login (max 25 attempts / 15 min).
- [ ] 5.6 Content mutation endpoints (`POST /api/*`) protected by session validation check.
- [ ] 5.7 Lead pipeline (`/api/enquiries`) captures customer quote requests safely.
- [ ] 5.8 Admin Panel dashboard built with Services CRUD, Business Info, and Leads tabs.

---

## Phase 6: Cloud Storage & Data Persistence
- [ ] 6.1 Vercel Blob store provisioned in Vercel project dashboard.
- [ ] 6.2 `BLOB_READ_WRITE_TOKEN` environment variable linked to project.
- [ ] 6.3 **CRITICAL:** `allowOverwrite: true` specified on all `put()` calls for singleton JSON manifests.
- [ ] 6.4 `addRandomSuffix: false` specified to maintain predictable manifest filenames.
- [ ] 6.5 Deterministic offline fallback files created in `src/content/*.json`.
- [ ] 6.6 Media upload API (`/api/upload`) validates MIME types before uploading.
- [ ] 6.7 Cache-busting version tags (`?v=2`) added to dynamic image paths.

---

## Phase 7: Technical & On-Page SEO
- [ ] 7.1 Canonical tag `<link rel="canonical">` points to final destination URL (`https://www.company.com/`).
- [ ] 7.2 Page title optimized (50–60 characters) with primary brand and location keywords.
- [ ] 7.3 Meta description optimized (160–240 characters) with actionable commercial summary.
- [ ] 7.4 OpenGraph and Twitter card meta tags populated with 1200x630px social banner.
- [ ] 7.5 Schema.org JSON-LD graph created with `LocalBusiness`, `PostalAddress`, and `OfferCatalog`.
- [ ] 7.6 Rich Results Test verified with 0 schema errors or warnings.
- [ ] 7.7 `public/robots.txt` deployed with sitemap declaration.
- [ ] 7.8 `public/sitemap.xml` deployed with canonical URL list.
- [ ] 7.9 Google Search Console verification token (HTML file + meta tag) embedded.

---

## Phase 8: Performance Hardening & Edge Security
- [ ] 8.1 Vite `manualChunks` configured to split vendor libraries (`react`, `framer-motion`, `lucide`).
- [ ] 8.2 `vercel.json` configured with HTTP security headers (HSTS, X-Frame-Options, X-Content-Type-Options).
- [ ] 8.3 Cache-Control rules set: `immutable` for hashed assets, `must-revalidate` for images and HTML.
- [ ] 8.4 Form inputs sanitized to prevent script injection.
- [ ] 8.5 All external anchors secured with `rel="noopener noreferrer"`.
- [ ] 8.6 Google Analytics 4 (`gtag.js`) integrated with client Measurement ID.

---

## Phase 9: Testing & Quality Assurance
- [ ] 9.1 Desktop testing verified at $1920\times 1080$, $1440\times 900$, and $1366\times 768$.
- [ ] 9.2 Tablet testing verified at $768\times 1024$.
- [ ] 9.3 Physical smartphone testing verified on both iOS (iPhone) and Android.
- [ ] 9.4 Cross-browser testing verified on Chrome, Safari, Edge, and Firefox.
- [ ] 9.5 Quotation estimate form submitted and lead verified in Admin Panel.
- [ ] 9.6 All direct-dial telephone links tested on a mobile device.
- [ ] 9.7 WhatsApp quick chat links tested and message text pre-population verified.
- [ ] 9.8 Google Maps preview card tested: opens turn-by-turn directions to verified office.
- [ ] 9.9 Admin login, price editing, and cloud persistence verified across separate devices.
- [ ] 9.10 `npm run build` executed locally: passes with 0 TypeScript compilation errors.

---

## Phase 10: Production Deployment & Domain Configuration
- [ ] 10.1 Latest verified code committed and pushed to `main` branch on GitHub.
- [ ] 10.2 Vercel connected to GitHub repository for automated CI/CD builds.
- [ ] 10.3 Custom domain DNS records configured at registrar (A Record `@` $\rightarrow$ `76.76.21.21`, CNAME `www` $\rightarrow$ `cname.vercel-dns.com`).
- [ ] 10.4 Vercel domain alias verified: apex domain set to 308 permanent redirect to `www`.
- [ ] 10.5 Run `npx vercel alias set <deployment-url> www.company.com` to guarantee route binding.
- [ ] 10.6 Automated SSL certificate issued by Let's Encrypt verified with browser padlock.
- [ ] 10.7 Old preview deployments cleaned up or deleted.

---

## Phase 11: Google Search & Local Domination
- [ ] 11.1 Log in to Google Search Console under client Google account.
- [ ] 11.2 Add property `https://www.company.com/` and confirm automatic verification.
- [ ] 11.3 Submit `sitemap.xml` under Sitemaps tab.
- [ ] 11.4 Perform URL Inspection on homepage and click **"Request Indexing"**.
- [ ] 11.5 Register or claim **Google Business Profile** (Google Maps) with verified address and phone lines.
- [ ] 11.6 Link live website URL in Google Business Profile.
- [ ] 11.7 Add live website link to client's official Instagram bio and WhatsApp Business profile.

---

## Phase 12: Client Handover & Training
- [ ] 12.1 Client invited as Owner / Administrator on GitHub and Vercel accounts.
- [ ] 12.2 Admin Panel URL, credentials, and Permanent Recovery Key delivered securely.
- [ ] 12.3 Client training walkthrough conducted (how to edit prices, upload photos, review leads).
- [ ] 12.4 Domain renewal date and registrar login information documented for client.
- [ ] 12.5 Project Handover Acceptance Certificate (Document 12) signed by client.
- [ ] 12.6 Full source code and documentation suite archived in client records.
