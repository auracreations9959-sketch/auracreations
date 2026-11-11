# 15. New Client Project Specification Template

> **Instructions:** Duplicate this blank specification document for every new company or client website project. Replace all `[PLACEHOLDER]` fields with verified client details during Stage 1 (Discovery) and Stage 2 (Planning). Do not write any code until this document is signed and approved.

---

## 1. Client & Business Entity Information

- **Client / Primary Stakeholder Name:** `[CLIENT_CONTACT_NAME]`
- **Official Registered Company Name:** `[FULL_LEGAL_COMPANY_NAME]`
- **Brand / Trade Name:** `[BRAND_NAME]`
- **Business Type / Industry Niche:** `[e.g. Commercial Printing / Real Estate / Healthcare / Legal]`
- **Year Established:** `[YEAR_FOUNDED]`
- **Primary Business Address:**
  - Street Address: `[STREET_ADDRESS]`
  - Suite / Floor / Landmark: `[LANDMARK_OR_SUITE]`
  - City, State, PIN / Postal Code: `[CITY, STATE, POSTAL_CODE]`
  - Country: `[COUNTRY]`
- **Official Contact Phone Lines:**
  - Primary Contact / Executive Line: `[+91-XXXXXXXXXX]` (Contact Person: `[NAME_1]`)
  - Secondary Contact / Operations: `[+91-XXXXXXXXXX]` (Contact Person: `[NAME_2]`)
  - Customer Support / Help Desk: `[+91-XXXXXXXXXX]` (Contact Person: `[NAME_3]`)
- **Official Business Email Addresses:**
  - Primary Inquiries: `[inquiry@clientdomain.com]`
  - Administrative / Billing: `[billing@clientdomain.com]`
- **Social Media & Channel Links:**
  - Official WhatsApp Business Number: `[+91-XXXXXXXXXX]`
  - Instagram Profile: `[https://instagram.com/username]`
  - Facebook Page: `[https://facebook.com/username]`
  - LinkedIn Profile: `[https://linkedin.com/company/username]`
  - Google Maps Location URL: `[https://maps.google.com/?cid=XXXXXXXX]`

---

## 2. Project Objectives & Commercial Goals

1. **Primary Business Goal:** `[e.g. Generate 50+ qualified local customer inquiries per month]`
2. **Secondary Goal:** `[e.g. Establish digital brand authority over local competitors]`
3. **Tertiary Goal:** `[e.g. Provide a self-service portfolio and pricing catalog for prospective clients]`
4. **Target Audience Profile:** `[e.g. B2B Corporate procurement managers, retail shop owners, event organizers]`
5. **Geographical Target Market:** `[e.g. City-wide / State-wide / National / Global]`

---

## 3. Scope of Work & Required Pages / Sections

### 3.1 Website Architecture
- [ ] **Single-Page Application (SPA) with Anchor Navigation:** `[Recommended for high-conversion SMB sites]`
- [ ] **Multi-Page Application (MPA):** `[For large corporate sites requiring separate routes]`

### 3.2 Required Sections
- [ ] **Sticky Header:** Brand logo, navigation links, primary phone link, glowing CTA button.
- [ ] **Hero Section:** High-impact brand headline, cursive/eyebrow tagline, animated visual feature.
- [ ] **About Us:** Narrative storytelling, founding philosophy, verified studio lead badge.
- [ ] **Interactive Office / Studio Location Card:** Embedded Google Maps preview with direct turn-by-turn routing.
- [ ] **Products / Services Catalog:** Categorized card grid with starting prices, feature bullets, search, and filter.
- [ ] **Portfolio / Project Showcases:** Authentic installation photography with category filtering and modal views.
- [ ] **Why Choose Us:** 4-pillar architectural value propositions with custom icon badges.
- [ ] **Interactive Lead Acquisition / Quotation Calculator:** Dynamic estimate request form capturing client specifications.
- [ ] **Multi-Contact Hub:** Dedicated cards for leadership, operations, and support with direct calling and WhatsApp chat.
- [ ] **Footer:** Legal, category breakdown, quick links, social profiles, copyright.
- [ ] **Floating Interaction Widgets:** Sticky click-to-call button and instant WhatsApp bubble.
- [ ] **Secure Admin Panel (`/admin`):** Self-service dashboard for pricing, catalog, and lead management.

---

## 4. Design Preferences & Brand Identity Tokens

- **Visual Theme Direction:**
  - [ ] **Obsidian Dark Luxury:** Deep black canvas (`#06040d`), neon ambient radial glows, glassmorphism.
  - [ ] **Clean Architectural Light:** Pure white canvas (`#ffffff`), slate borders, corporate blue accents.
  - [ ] **Warm Organic / Artisan:** Earthy tones, cream background, forest green / terracotta accents.
- **Brand Colors:**
  - Primary Accent Hex: `[#HEX_COLOR_1]`
  - Secondary Accent Hex: `[#HEX_COLOR_2]`
  - Background Base Hex: `[#HEX_COLOR_3]`
- **Typography:**
  - Heading Font: `[e.g. Montserrat / Syne / Cabinet Grotesk]`
  - Body Copy Font: `[e.g. Plus Jakarta Sans / Inter]`
  - Accent / Tagline Font: `[e.g. Caveat / Kaushan Script / Cursive]`
- **Visual Assets Received:**
  - [ ] High-resolution transparent vector logo (`.svg` or `.png`).
  - [ ] Authentic workshop / office / store photography (min 15 photos).
  - [ ] Owner / team portrait photography.

---

## 5. Technology Stack & Infrastructure

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion.
- **Icons:** Lucide React (`^1.69.0`).
- **Backend Runtime:** Vercel Serverless Functions (Node.js 20.x).
- **Data Persistence:** Vercel Blob (`@vercel/blob`) with Singleton JSON Manifests (`allowOverwrite: true`).
- **Offline Fallback:** Local static JSON files (`src/content/*.json`).
- **Image Processing:** Sharp Node.js optimization pipeline (1600px bounds, 85% progressive MozJPEG).
- **Hosting & Edge Delivery:** Vercel Global Anycast CDN.
- **Version Control:** GitHub private repository (`[GITHUB_ORG]/[REPO_NAME]`).
- **Domain Name:** `[CLIENT_CUSTOM_DOMAIN.COM]`
- **SSL / Security:** Automated Let's Encrypt TLS (forced HTTPS), HSTS headers, PBKDF2 SHA-512 password protection.

---

## 6. Budget & Commercial Terms

- **Total Development Contract Price:** `[₹XX,XXX / $X,XXX]`
- **Payment Milestones:**
  - Milestone 1 (Project Kickoff & Architecture Approval): `[30%]`
  - Milestone 2 (Frontend Build & Catalog Population): `[40%]`
  - Milestone 3 (Testing, Domain Deployment & Final Handover): `[30%]`
- **Annual Operational Costs:**
  - Domain Name Annual Renewal: `[$\approx$ ₹1,000 / $15 per year paid directly to registrar]`
  - Hosting & Cloud Storage: `[₹0 / Free on Vercel Hobby Tier for standard traffic]`
- **Target Delivery Date:** `[TARGET_COMPLETION_DATE]`

---

## 7. Approval & Sign-Off

```
CLIENT APPROVAL:
Signature:  _____________________________________
Print Name: [CLIENT_SIGNATORY_NAME]
Title:      [CLIENT_SIGNATORY_TITLE]
Date:       [APPROVAL_DATE]
```
