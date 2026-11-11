# 14. Master Standard Operating Procedure (SOP) for Client Website Development

---

## Purpose & Scope

This Standard Operating Procedure (SOP) defines the standardized, 12-stage engineering lifecycle for delivering high-performance, conversion-focused commercial websites for enterprise and SMB clients. 

Follow this blueprint sequentially on every future client engagement to guarantee technical excellence, zero missed requirements, robust cloud architecture, and smooth client handover.

---

```
                       THE 12-STAGE ENGINEERING LIFECYCLE
                       
  [Stage 1: Discovery]      --> [Stage 2: Scope & Plan]    --> [Stage 3: UI/UX Design]
           |                                                            |
           v                                                            v
  [Stage 4: Initialization] --> [Stage 5: Frontend Build]  --> [Stage 6: Serverless Backend]
           |                                                            |
           v                                                            v
  [Stage 7: Cloud Storage]  --> [Stage 8: Technical SEO]   --> [Stage 9: Security & Speed]
           |                                                            |
           v                                                            v
  [Stage 10: Rigorous QA]   --> [Stage 11: CI/CD & Deploy] --> [Stage 12: Client Handover]
```

---

## Stage 1: Client Discovery & Requirements Engineering

### 1.1 Objective & Rationale
Gather all business context, target audience profiles, commercial priorities, branding assets, and functional constraints before writing any code. Rushing into code without verified requirements causes scope creep, rework, and client frustration.

### 1.2 Required Tools
- Client Discovery Intake Questionnaire (see Document 15).
- Google Drive or Dropbox shared folder for raw assets.
- Meeting recording / transcription software (Google Meet / Zoom).

### 1.3 Step-by-Step Execution
1. **Business Identity Interview:**
   - Official registered legal business name, brand name, and registration numbers.
   - Core value proposition and single-sentence elevator pitch.
   - Primary physical office / factory addresses, operating hours, and authorized phone lines.
2. **Catalog & Services Audit:**
   - Complete inventory of products or services offered.
   - Starting prices, minimum order quantities, and material specifications.
   - Key commercial tags (`Best Seller`, `Exclusive`, `High Margin`).
3. **Asset Gathering:**
   - High-resolution vector logos (`.ai`, `.svg`, `.eps`, `.png` with transparency).
   - Brand guidelines: official brand color hex codes and primary typography.
   - Authentic photography of physical shop, workshop, team, and previous client installations.
   - *Rule:* Reject blurry stock photos; authentic client assets convert $300\%$ better.
4. **Lead Acquisition Definition:**
   - Identify how the client wants to receive leads: Direct WhatsApp, phone calls, form submissions, or email alerts.

### 1.4 Expected Outcome
A signed **Client Project Specification Document** containing verified contact info, catalog structure, and approved media assets.

### 1.5 Common Pitfalls & Mistakes
- *Mistake:* Accepting placeholder phone numbers or temporary emails and deploying them to production.
- *Mistake:* Relying on verbal agreements without a documented services list.

### 1.6 Verification Checklist
- [ ] Official business name spelling confirmed.
- [ ] All phone numbers dialed and verified active.
- [ ] Physical location pin confirmed on Google Maps.
- [ ] Transparent logo vector collected.
- [ ] 100% of service categories and pricing bounds verified by client.

---

## Stage 2: Project Planning & Architecture Design

### 2.1 Objective & Rationale
Select the optimal technology stack, plan database structure, estimate realistic delivery timelines, and eliminate architectural risks early.

### 2.2 Required Tools
- Architecture diagramming (Mermaid.js / Excalidraw).
- Project management board (Trello / Linear / GitHub Projects).

### 2.3 Step-by-Step Execution
1. **Architecture Pattern Selection:**
   - For marketing and catalog websites with client management needs: Choose **Vite + React 19 + TypeScript + Vercel Serverless + Vercel Blob**.
   - *Why:* Zero monthly database cost, global edge CDN performance, sub-second loads, and high security.
2. **Routing & Section Hierarchy Mapping:**
   - Plan single-page smooth-scrolling architecture with anchor navigation (`#about`, `#services`, `#contact`) combined with dedicated administrative paths (`/admin`, `/admin-login`).
3. **State & Fallback Planning:**
   - Establish local static JSON manifests (`src/content/*.json`) as the deterministic offline fallback for all cloud storage entities.
4. **Milestone Schedule:**
   - Sprint 1: Prototype & Theme Setup (Days 1–2).
   - Sprint 2: Component & Service Catalog Engineering (Days 3–5).
   - Sprint 3: Backend & Admin Panel (Days 6–7).
   - Sprint 4: SEO, Testing & Custom Domain Handover (Days 8–10).

### 2.4 Expected Outcome
A comprehensive Architecture Blueprint and project schedule approved by stakeholders.

### 2.5 Common Pitfalls & Mistakes
- *Mistake:* Over-engineering with complex Kubernetes, Docker, or heavy SQL servers for a simple commercial business website.
- *Mistake:* Underestimating client review cycles and photo delivery delays.

### 2.6 Verification Checklist
- [ ] Technology stack confirmed.
- [ ] Local fallback JSON strategy established.
- [ ] Delivery milestones agreed in writing.

---

## Stage 3: UI/UX Design System & Typography

### 3.1 Objective & Rationale
Create a cohesive, high-converting visual design that reinforces the client's industry authority and looks stunning on desktop, tablet, and mobile.

### 3.2 Required Tools
- Figma / Penpot (wireframing and layout design).
- Google Fonts (typography selection).
- Contrast ratio checker (WCAG AA compliance).

### 3.3 Step-by-Step Execution
1. **Canvas & Theme Conception:**
   - Establish base background canvas: Dark luxury (`#06040d`) for industrial/luminous brands, or Crisp Architectural Light (`#ffffff` / `#f8fafc`) for medical/legal brands.
   - Define primary brand gradient (e.g. 135deg multi-color text clip).
   - Define glassmorphism tokens: `backdrop-blur-md`, subtle 1px translucent borders (`border-white/10`).
2. **Typography Setup:**
   - Primary Headings: Geometric authority font (e.g. *Montserrat*, *Cabinet Grotesk*, or *Syne*).
   - Body Copy: Highly legible UI font (e.g. *Plus Jakarta Sans*, *Inter*).
   - Accents / Signatures: Calligraphic font (e.g. *Caveat*, *Kaushan Script*).
3. **Ergonomic Responsive Planning:**
   - Desktop: 3-column or 4-column service grids.
   - Tablet: 2-column balanced layouts.
   - Mobile: Single-column cards with $44\text{px}$ minimum button heights and full-width CTAs.

### 3.4 Expected Outcome
Approved design system tokens, color palettes, and component hierarchy ready for coding.

### 3.5 Common Pitfalls & Mistakes
- *Mistake:* Low contrast text (e.g. light gray on white or dark purple on black) that fails readability standards.
- *Mistake:* Overly complex animations that stutter on budget mobile phones.

### 3.6 Verification Checklist
- [ ] Contrast ratio $\ge 4.5:1$ across all text.
- [ ] All typography loaded with `font-display: swap`.
- [ ] Mobile navigation drawer designed with auto-close logic.

---

## Stage 4: Project Initialization & Repository Setup

### 4.1 Objective & Rationale
Bootstrap a clean, type-safe development environment with modern build tooling and version control hygiene.

### 4.2 Required Tools
- Terminal / PowerShell.
- Node.js & npm.
- Git & GitHub CLI.

### 4.3 Step-by-Step Execution
```bash
# 1. Initialize project
npm create vite@latest client-website -- --template react-ts
cd client-website

# 2. Install production dependencies
npm install react@^19 react-dom@^19 framer-motion lucide-react canvas-confetti @vercel/blob

# 3. Install developer tooling
npm install -D tailwindcss @tailwindcss/vite typescript sharp vite @types/node

# 4. Check for existing git repositories before initializing!
git rev-parse --show-toplevel # Ensure you are not inside a parent .git!

# 5. Initialize Git and set branch to main
git init
git branch -M main

# 6. Configure .gitignore (strictly exclude node_modules, dist, .env*, .data)
```

### 4.4 Expected Outcome
A clean, compiling project structure with zero build errors and an initialized Git repository.

### 4.5 Common Pitfalls & Mistakes
- *Mistake:* Running `git init` in the user's home folder (`C:\Users\Username`), accidentally tracking private personal files.
- *Mistake:* Committing `.env` or secret keys to GitHub.

### 4.6 Verification Checklist
- [ ] `git status` shows only clean project files.
- [ ] `npm run build` succeeds in $< 5$ seconds.
- [ ] TypeScript strict mode enabled in `tsconfig.json`.

---

## Stage 5: Frontend Component Engineering

### 5.1 Objective & Rationale
Transform the design into clean, modular, accessible React components with smooth micro-interactions and zero layout shifts.

### 5.2 Required Tools
- React 19, TypeScript, Lucide React icons, Framer Motion.

### 5.3 Step-by-Step Execution
1. **Modular Components Breakdown:**
   - Create individual files in `src/components/`: `Header`, `Hero`, `About`, `ServicesSection`, `PortfolioSection`, `ContactSection`, `Footer`, `FloatingWidgets`.
2. **Global State Provider (`WebsiteContext.tsx`):**
   - Implement a unified Context provider that loads data from `/api/*` on mount, seamlessly falling back to local JSON if offline.
3. **Hero Section Engineering:**
   - Implement typographic brand headline with responsive image logo preloading.
   - Build interactive animated elements (e.g. planetary orbits or visual showcase) with counter-rotations and mouse-hover pause states.
4. **Services Engine:**
   - Implement live category filter tabs (`All`, `Signage`, `Printing`, etc.).
   - Implement real-time search input with instant filtering.
   - Add pre-filled WhatsApp inquiry hooks and quotation modal triggers.
5. **Interactive Office Map Card:**
   - Embed an iframe or map preview pointing to the exact physical coordinates.
   - Wrap the entire preview in a clickable navigation anchor opening Google Maps turn-by-turn directions.
6. **Floating Interaction Widgets:**
   - Sticky direct-dial call button and branded WhatsApp bubble pinned to the bottom corners.

### 5.4 Expected Outcome
A complete, responsive, visually polished single-page application.

### 5.5 Common Pitfalls & Mistakes
- *Mistake:* Hardcoding service data inside component JSX instead of driving it from structured JSON.
- *Mistake:* Forgetting `alt` tags on images, harming accessibility and SEO.

### 5.6 Verification Checklist
- [ ] Every component renders with zero console errors.
- [ ] Zero horizontal scrollbars across all screen widths ($320\text{px}$ to $2560\text{px}$).
- [ ] All external links open in a new tab with `rel="noopener noreferrer"`.

---

## Stage 6: Serverless Backend & Admin Panel

### 6.1 Objective & Rationale
Provide a zero-maintenance administrative portal allowing the client to manage content, prices, and leads without engineering intervention.

### 6.2 Required Tools
- Vercel Serverless Functions (Node.js runtime), Node.js `crypto`.

### 6.3 Step-by-Step Execution
1. **Authentication Engine (`/api/auth.ts`):**
   - Store administrative credentials in `aura-data/admin-auth.json` with PBKDF2 SHA-512 hashes and random salts.
   - Implement signed JWT session tokens delivered via secure HTTP-Only cookies.
   - Build in a permanent, immutable Master Recovery Key (`AURA-XXXX-XXXX-XXXX`) to ensure zero lockouts.
   - Add IP sliding-window rate limiting (max 25 attempts per 15 minutes).
2. **CRUD API Handlers (`/api/services.ts`, `/api/business.ts`):**
   - `GET`: Returns the JSON manifest array from cloud storage (falls back to local JSON).
   - `POST`: Validates session cookie, checks input payload, writes to cloud storage.
3. **Inquiry Pipeline (`/api/enquiries.ts`):**
   - Captures client quote submissions, sanitizes inputs, appends to `enquiries-manifest.json`.
4. **Admin UI (`src/components/AdminPanel.tsx`):**
   - Clean tabbed dashboard: Services Manager (Add/Edit/Delete), Business Settings, and Inbound Leads table.

### 6.4 Expected Outcome
A secure, authenticated administrative portal with full CRUD control.

### 6.5 Common Pitfalls & Mistakes
- *Mistake:* Storing admin passwords in plaintext or using weak MD5/SHA-1 hashing.
- *Mistake:* Allowing unauthenticated POST mutations on content endpoints.

### 6.6 Verification Checklist
- [ ] Unauthenticated requests to `/api/services` POST return HTTP 401 Unauthorized.
- [ ] Rate limiter blocks repeated brute-force login attempts.
- [ ] Master recovery key successfully logs in and allows password reset.

---

## Stage 7: Cloud Storage & Media Pipeline

### 7.1 Objective & Rationale
Store customer-uploaded media and JSON database manifests in durable, globally distributed cloud object storage.

### 7.2 Required Tools
- `@vercel/blob` SDK, Sharp image optimization engine.

### 7.3 Step-by-Step Execution
1. **Blob Store Provisioning:**
   - Create a Vercel Blob store in the project dashboard (`Settings -> Storage -> Create Blob Store`).
   - Connect the store to the project to automatically populate `BLOB_READ_WRITE_TOKEN`.
2. **Implementing `allowOverwrite: true` (Critical Rule):**
   - When writing singleton manifests (`services-manifest.json`), **always pass `allowOverwrite: true`**:
     ```typescript
     await put(MANIFEST_PATH, JSON.stringify(data, null, 2), {
       access: 'public',
       addRandomSuffix: false,
       allowOverwrite: true, // MANDATORY
       contentType: 'application/json',
     });
     ```
3. **Image Optimization Pipeline (Sharp):**
   - Build an automated script or API step that resizes raw client photos to max 1600px width/height and encodes to 85% progressive MozJPEG.
4. **Cache-Busting Integration:**
   - Tag media URLs with version query strings (`?v=2`) so browsers purge stale local disk caches when files change.

### 7.4 Expected Outcome
Durable, high-speed media hosting with zero overwriting bugs and sub-second loading.

### 7.5 Common Pitfalls & Mistakes
- *Mistake:* Omitting `allowOverwrite: true`, causing cloud updates to silently fail with `BlobAccessError`.
- *Mistake:* Serving uncompressed 8MB camera photos directly to mobile visitors.

### 7.6 Verification Checklist
- [ ] Service manifest updates successfully reflect across multiple physical devices.
- [ ] Uploaded image returns valid HTTPS URL accessible on any network.
- [ ] All images load in $< 500\text{ms}$.

---

## Stage 8: Complete Technical & On-Page SEO

### 8.1 Objective & Rationale
Ensure the business ranks #1 on Google for its brand name and captures local high-intent commercial keywords.

### 8.2 Required Tools
- Schema.org Validator / Google Rich Results Test.
- Google Search Console.

### 8.3 Step-by-Step Execution
1. **Canonical Alignment:**
   - Verify that `<link rel="canonical">` points to the final destination URL (`https://www.company.com/`), never an apex URL that redirects.
2. **Metadata Formulation:**
   - Title: `[BRAND] — [Category 1], [Category 2] & [Category 3] | [City], [State]`
   - Description: Actionable 160–240 character summary highlighting key services, location, and USP.
   - Keywords: Exact brand name variants + city + primary commercial offerings.
3. **Schema.org Structured Data:**
   - Embed JSON-LD graph with `LocalBusiness`, `ProfessionalService`, `WebSite`, `PostalAddress`, `GeoCoordinates`, and `OfferCatalog`.
4. **Search Files:**
   - Deploy `public/robots.txt` pointing to `https://www.company.com/sitemap.xml`.
   - Deploy `public/sitemap.xml` with priority 1.0 and daily change frequency.

### 8.4 Expected Outcome
Full Google search readiness with rich snippet eligibility and accurate local signals.

### 8.5 Common Pitfalls & Mistakes
- *Mistake:* Pointing canonical tag to `non-www` while Vercel redirects to `www`, causing Google index confusion.
- *Mistake:* Leaving test robots rules like `Disallow: /` active in production.

### 8.6 Verification Checklist
- [ ] Rich Results Test reports valid `LocalBusiness` schema with 0 errors.
- [ ] `/robots.txt` and `/sitemap.xml` return HTTP 200 OK.
- [ ] Canonical tag matches final live browser URL.

---

## Stage 9: Performance Hardening & Edge Security

### 9.1 Objective & Rationale
Enforce enterprise security headers, minimize JavaScript payloads, and guarantee 90+ Core Web Vitals.

### 9.2 Required Tools
- Google PageSpeed Insights, Chrome DevTools Network Tab, Mozilla Observatory.

### 9.3 Step-by-Step Execution
1. **Vercel Edge Caching Rules (`vercel.json`):**
   - Static hashed chunks (`/assets/(.*)`): `public, max-age=31536000, immutable`.
   - Dynamic HTML (`/index.html`): `no-cache, no-store, must-revalidate`.
   - Media (`/images/(.*)`): `public, max-age=0, must-revalidate` (ensures instant updates).
   - Serverless APIs (`/api/(.*)`): `no-store, no-cache, must-revalidate`.
2. **Security Headers Configuration:**
   - Configure HSTS (`max-age=31536000; includeSubDomains; preload`).
   - Configure `X-Frame-Options: SAMEORIGIN` to defeat clickjacking.
   - Configure `X-Content-Type-Options: nosniff`.
3. **Bundle Chunking:**
   - Configure Vite `manualChunks` to isolate React, motion libraries, and icons.

### 9.4 Expected Outcome
An A+ rating on security audits and sub-second global page delivery.

### 9.5 Common Pitfalls & Mistakes
- *Mistake:* Caching `index.html` for 24 hours, meaning visitors never receive new app releases.
- *Mistake:* Loading unneeded heavy UI component libraries that inflate JS bundles.

### 9.6 Verification Checklist
- [ ] Mozilla Observatory security score $\ge \text{A}$.
- [ ] Total initial JavaScript payload $< 200\text{KB}$ gzipped.
- [ ] No mixed-content (HTTP) warnings in console.

---

## Stage 10: Rigorous Testing & Quality Assurance

### 10.1 Objective & Rationale
Execute end-to-end verification across every viewport, browser engine, form, and API before delivering to the client.

### 10.2 Required Tools
- Real mobile devices (iOS & Android).
- Chrome, Safari, Edge, Firefox.
- Network throttling (Slow 4G emulation).

### 10.3 Step-by-Step Execution
1. **Responsive Testing:** Verify desktop ($1920\text{px}$), laptop ($1440\text{px}$), tablet ($768\text{px}$), and mobile ($375\text{px}$).
2. **Lead Acquisition Testing:** Submit real test quote; verify receipt in Admin Panel; verify celebratory confetti.
3. **Communication Hooks:** Click every telephone link and WhatsApp button on real hardware to confirm app launch.
4. **Admin Operations Testing:** Log in, modify a service price, save, and verify instant reflection on another device.
5. **Production Build Verification:** Run `npm run build` locally to catch any latent TypeScript typing errors.

### 10.4 Expected Outcome
A 100% verified, bug-free website documented in the QA Matrix (Document 11).

### 10.5 Common Pitfalls & Mistakes
- *Mistake:* Testing only in Chrome DevTools emulation and skipping real physical phone verification.
- *Mistake:* Forgetting to test form submission failure states (e.g. invalid phone number).

### 10.6 Verification Checklist
- [ ] Tested on physical iPhone and Android devices.
- [ ] All 18 services verified for correct spelling, image, and price.
- [ ] Google Maps card verified to launch correct navigation destination.

---

## Stage 11: Production Deployment & Custom Domain Linking

### 11.1 Objective & Rationale
Publish the verified build to the global CDN, connect the client's custom domain, and secure HTTPS.

### 11.2 Required Tools
- Vercel CLI, Domain Registrar DNS Manager.

### 11.3 Step-by-Step Execution
1. **GitHub Connection:**
   - Push latest tested code to `main` branch on GitHub.
   - Link repository to Vercel project (`Project Settings -> Git -> Connect GitHub`).
2. **Production CLI Deployment:**
   ```bash
   npx vercel --prod --yes
   ```
3. **DNS Configuration:**
   - Add A Record: `@` $\rightarrow$ `76.76.21.21`.
   - Add CNAME Record: `www` $\rightarrow$ `cname.vercel-dns.com`.
4. **Vercel Domain Routing Alignment:**
   - Set `www.company.com` as primary production domain.
   - Set `company.com` as redirect (308) to `www.company.com`.
   - Run `npx vercel alias set <deployment-url> www.company.com` to guarantee immediate route binding.
5. **SSL Certificate Validation:**
   - Wait 60 seconds for Vercel to issue Let's Encrypt TLS certificate; verify padlock in browser.

### 11.4 Expected Outcome
Website live, fast, and secure on the client's branded custom domain.

### 11.5 Common Pitfalls & Mistakes
- *Mistake:* Leaving duplicate conflicting A records at the registrar from older hosting providers.
- *Mistake:* Leaving Vercel domain alias bound to an older preview build.

### 11.6 Verification Checklist
- [ ] `https://company.com` redirects cleanly to `https://www.company.com`.
- [ ] SSL certificate active with zero security warnings.
- [ ] Vercel dashboard reports status: `● Ready`.

---

## Stage 12: Client Handover & Post-Launch Operations

### 12.1 Objective & Rationale
Transfer full operational ownership to the client, deliver documentation, train the client team, and establish ongoing support.

### 12.2 Required Tools
- Client Handover Protocol (Document 12).
- Video recorder (Loom / OBS) for admin training walkthrough.

### 12.3 Step-by-Step Execution
1. **Custody Transfer:**
   - Add client email as Owner on GitHub and Vercel accounts.
   - Hand over primary administrative credentials and Master Recovery Key.
2. **Google Search Console & Indexing Queue:**
   - Submit `sitemap.xml` in client's Search Console.
   - Run URL Inspection on homepage and click **"Request Indexing"**.
3. **Google Business Profile Onboarding:**
   - Guide the client to register or claim their business pin on Google Maps and link the live website.
4. **Admin Training Session:**
   - Walk the client through logging in, editing service prices, uploading photos, and checking leads.
5. **Deliver Formal Handover Acceptance Document:**
   - Client reviews and signs the formal acceptance certificate.

### 12.4 Expected Outcome
A delighted client with 100% ownership, trained staff, and a live, converting website.

### 12.5 Common Pitfalls & Mistakes
- *Mistake:* Handing over admin credentials over insecure channels without documenting a recovery code.
- *Mistake:* Leaving client unsure about annual renewal dates and registrar logins.

### 12.6 Verification Checklist
- [ ] Client successfully logged into Admin Panel and edited a test service.
- [ ] Client has administrative ownership of Vercel and GitHub.
- [ ] Signed Handover Acceptance Certificate filed in project records.
