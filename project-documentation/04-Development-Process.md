# 04. Step-by-Step Development Process

---

## 1. Development Environment Prerequisites

To replicate or develop this project from a clean machine, ensure the following tools are installed:

- **Node.js:** v20.x or v22.x LTS (Node.js v24 works seamlessly as verified).
- **Package Manager:** `npm` v10.x or higher.
- **Git:** Version 2.40+ configured with standard CRLF/LF line ending handling.
- **Code Editor:** VS Code or Antigravity IDE with ESLint, Tailwind CSS IntelliSense, and TypeScript extensions.
- **Vercel CLI:** Installed globally or run via `npx vercel`.

---

## 2. Project Initialization from Scratch

### Step 1: Create Vite + React + TypeScript Boilerplate
```bash
npm create vite@latest aura-creations-website -- --template react-ts
cd aura-creations-website
```

### Step 2: Install Core Application Dependencies
```bash
npm install react@^19.3.1 react-dom@^19.3.1
npm install framer-motion@^14.9.1 lucide-react@^1.69.0 canvas-confetti@^1.9.4
npm install @vercel/blob@^2.8.2
```

### Step 3: Install Developer & Build Tooling
```bash
npm install -D tailwindcss@^4.3.4 @tailwindcss/vite@^4.3.4
npm install -D typescript @types/react @types/react-dom @types/node @types/canvas-confetti
npm install -D sharp vite oxlint
```

---

## 3. Project Directory Architecture

```
Aura Creations Website/
├── .github/                   # GitHub workflows (optional CI)
├── api/                       # Vercel Serverless Functions (Node.js runtime)
│   ├── auth.ts                # Admin session & PBKDF2 authentication handler
│   ├── business.ts            # Business profile manifest CRUD
│   ├── diag.ts                # Diagnostic edge verification route
│   ├── enquiries.ts           # Customer quotation lead pipeline
│   ├── photos.ts              # Gallery photo management
│   ├── portfolio.ts           # Portfolio item manifest CRUD
│   ├── services.ts            # 18-Service item manifest CRUD
│   └── upload.ts              # File upload handler targeting @vercel/blob
├── public/                    # Static assets served at root /
│   ├── favicon.svg            # Browser tab SVG vector icon
│   ├── googlee0d744c2f577dcf6.html # Google Search Console HTML verification
│   ├── icons.svg              # SVG sprite library
│   ├── robots.txt             # Search engine crawling rules & sitemap pointer
│   ├── sitemap.xml            # XML Sitemap containing canonical URLs
│   ├── site.webmanifest       # PWA manifest for mobile devices
│   └── images/                # Static image directory
│       ├── logo/              # Brand logos (transparent, cards, banners)
│       ├── portfolio/         # Authentic portfolio project photographs
│       └── services/          # Authentic service catalog photographs
├── src/                       # Client-side React TypeScript application
│   ├── assets/                # Vite static assets (svgs)
│   ├── components/            # Modular UI components
│   │   ├── About.tsx          # About narrative, leads card & Google Maps card
│   │   ├── AdminPanel.tsx     # Full-featured secure administrative dashboard
│   │   ├── ContactSection.tsx # Contact person cards & interactive estimate form
│   │   ├── FloatingWidgets.tsx# Sticky call & WhatsApp inquiry buttons
│   │   ├── Footer.tsx         # Legal, quick links, category catalog, copyright
│   │   ├── Header.tsx         # Sticky glassmorphism header & mobile drawer
│   │   ├── Hero.tsx           # Signature logo, cursive tagline & planetary orbit
│   │   ├── Icons.tsx          # Custom SVG path icons & logo shapes
│   │   ├── PortfolioSection.tsx# Filterable portfolio gallery with image modal
│   │   ├── ServicesSection.tsx# 18-service grid, search, filter & quote modal
│   │   ├── SignatureIntro.tsx # Opening neon-stroke brand splash animation
│   │   └── WhyChooseUs.tsx    # 4-pillar studio value propositions
│   ├── content/               # Deterministic local fallback JSON databases
│   │   ├── business.json      # Offline business profile & phone numbers
│   │   ├── portfolio.json     # Offline portfolio project registry
│   │   └── services.json      # Offline 18-service catalog registry
│   ├── context/
│   │   └── WebsiteContext.tsx # Global state provider syncing Blob & local JSON
│   ├── App.css                # Base layout styles
│   ├── App.tsx                # Main application view & route switcher
│   ├── index.css              # Tailwind v4 configuration, theme variables & utilities
│   └── main.tsx               # Application bootstrap mount
├── .gitignore                 # Excludes node_modules, dist, .env*, .data
├── index.html                 # Semantic HTML5 entry, OpenGraph, JSON-LD Schema
├── package.json               # Manifest of dependencies and build scripts
├── tsconfig.json              # TypeScript root project reference config
├── tsconfig.app.json          # TypeScript client application settings
├── vercel.json                # Vercel Edge routing, rewrites & Cache-Control rules
└── vite.config.ts             # Vite build pipeline & chunk-splitting rules
```

---

## 4. Key Configuration Files

### 4.1 `vercel.json` (Production Edge Routing & Caching)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, no-cache, must-revalidate, proxy-revalidate" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/auth/:action", "destination": "/api/auth?action=:action" },
    { "source": "/admin", "destination": "/index.html" },
    { "source": "/admin-login", "destination": "/index.html" },
    { "source": "/((?!api(?:/|$)).*)", "destination": "/index.html" }
  ]
}
```

---

## 5. Build, Test & Run Commands

| Command | Action | Output |
| :--- | :--- | :--- |
| `npm run dev` | Starts Vite local development server at `http://localhost:5173` | Sub-second hot module reload |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles Vite (`vite build`) | Optimized production output in `dist/` |
| `npm run preview`| Spins up a local HTTP server serving the compiled `dist/` folder | Validates production bundle locally |
| `npx vercel dev` | Emulates full Vercel environment locally including `/api/*` routes | Test serverless APIs with local Blob tokens |
| `npx vercel --prod --yes` | Directly compiles, deploys, and aliases to live production domain | Deployed to `https://www.auracreationss.com` |
