# 03. Technology Stack Architecture & Rationale

---

## 1. Overview Matrix

| Layer | Technology | Version | Purpose in Aura Creations | Alternatives for Future Projects |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.3.1` | Declarative UI component architecture | Vue 3, Svelte 5, Next.js 15 |
| **Language** | TypeScript | `~7.0.2` | Static typing, interface safety & auto-completion | JavaScript (ESNext), JSDoc |
| **Build Tool & Bundler**| Vite | `^8.3.6` | Sub-second HMR dev server & optimized production build | Next.js Turbopack, Astro, Rolldown |
| **CSS Framework** | Tailwind CSS | `^4.3.4` | Modern utility-first CSS with `@tailwindcss/vite` | Vanilla CSS Modules, SCSS, styled-components |
| **Animation Engine** | Framer Motion | `^14.9.1` | Declarative spring animations, view reveals & exit states | GSAP, React Spring, AutoAnimate |
| **Icon Library** | Lucide React | `^1.69.0` | 1,000+ tree-shakable SVG icons with uniform 24px strokes | Heroicons, Phosphor Icons, FontAwesome |
| **Serverless Backend** | Vercel Serverless | Node 20.x | Edge API routes (`/api/*`) for auth, CRUD & blob sync | Cloudflare Workers, AWS Lambda, Supabase Functions |
| **Cloud Object Storage** | `@vercel/blob` | `^2.8.2` | Cloud object storage for images & JSON data manifests | AWS S3, Cloudflare R2, Supabase Storage |
| **Image Processing** | Sharp | `^0.34.x` | High-speed Node.js image compression & WebP/JPEG conversion | Jimp, ImageMagick, Cloudinary API |
| **Special FX** | Canvas Confetti | `^1.9.4` | Inquiry submission celebration burst | TS-Particles, React-Confetti |
| **Hosting & CDN** | Vercel Platform | Anycast CDN | Zero-config edge hosting, automatic SSL, and domain routing | Netlify, Cloudflare Pages, AWS Amplify |
| **Source Control & CI/CD**| GitHub | Cloud Git | Cloud code repository & automated deployment triggers | GitLab, Bitbucket |
| **Analytics & Telemetry**| Google Analytics 4 | GA4 (gtag.js)| User behavior, conversion tracking & audience insights | Plausible Analytics, PostHog, Mixpanel |

---

## 2. Deep-Dive Component Analysis

### 2.1 React 19 + TypeScript + Vite
- **What it is:** The cutting-edge React 19 release combined with Vite's native ES-module dev server.
- **Why we used it:** React 19 provides superior rendering performance, refined hydration, and improved hook semantics. Vite builds the entire 2,500-module codebase in ~4.5 seconds (compared to 30–60s with legacy Webpack).
- **Key Configuration (`vite.config.ts`):**
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';

  export default defineConfig({
    plugins: [react(), tailwindcss()],
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
    },
  });
  ```
  *Note:* Code-splitting (`manualChunks`) isolates heavy vendor libraries into cached chunks (`vendor-react-*.js`, `vendor-motion-*.js`), ensuring returning visitors only download modified application code.

---

### 2.2 Tailwind CSS v4 Engine
- **What it is:** The rewritten Tailwind CSS v4 compiler running directly inside Vite via `@tailwindcss/vite`.
- **Why we used it:** Tailwind v4 eliminates complex `tailwind.config.js` boilerplate. All customization, theme tokens, and custom gradients are defined directly in `src/index.css` using modern CSS variables and utility directives.
- **Key Custom Gradients (`src/index.css`):**
  ```css
  .brand-gradient-text {
    background: linear-gradient(135deg, #f43f5e 0%, #d946ef 35%, #8b5cf6 70%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .glass-panel {
    background: rgba(13, 10, 26, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  ```

---

### 2.3 Serverless API & `@vercel/blob` Storage Architecture
- **What it is:** Vercel Serverless Functions running in Node.js runtime located in the `/api` directory.
- **Why we used it:** Provides a 100% serverless, zero-maintenance backend. Instead of paying for an always-on EC2 or Docker container, functions only spin up during client requests (0ms billing at rest).
- **How it handles data persistence without SQL:**
  1. Business profile data is stored as a single JSON file: `aura-data/business-manifest.json`.
  2. Service items are stored as: `aura-data/services-manifest.json`.
  3. Client leads/inquiries are stored as: `aura-data/enquiries-manifest.json`.
  4. Uploaded media is saved to: `services/<timestamp>-<filename>`.
- **Critical Configuration Requirement:**
  The `BLOB_READ_WRITE_TOKEN` environment variable must be connected to the Vercel project to authenticate Blob API calls.

---

### 2.4 Cryptographic Security Architecture (PBKDF2)
- **What it is:** Built-in Node.js `crypto.pbkdf2Sync()` utilizing 10,000 iterations of SHA-512 with cryptographically random 16-byte salts.
- **Why we used it:** Defeats rainbow table attacks and protects the Admin credentials.
- **Implementation in `api/auth.ts`:**
  ```typescript
  function hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }
  ```

---

### 2.5 Sharp Image Processing Pipeline
- **What it is:** High-performance libvips C-library bindings for Node.js image transformation.
- **Why we used it:** Commercial photography taken directly from mobile phones often measures 4000–6000px and weighs 4–8MB. Using `sharp`, we scale images down to 1600px max bounds, strip EXIF metadata, and re-encode using progressive MozJPEG at 85% quality.
- **Outcome:** Total page payload reduced from ~45MB to under 3.5MB, passing Core Web Vitals with an LCP (Largest Contentful Paint) under 1.2 seconds.
