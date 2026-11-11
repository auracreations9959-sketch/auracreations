# 08. GitHub, Vercel & Domain Deployment Infrastructure

---

## 1. Source Control Architecture & GitHub Setup

The codebase is version-controlled with Git and hosted on GitHub under a dedicated private/public repository.

### 1.1 Repository Information
- **Repository URL:** `https://github.com/auracreations9959-sketch/auracreations.git`
- **Default Production Branch:** `main`
- **CI/CD Integration:** Direct Vercel GitHub App Webhook Integration

### 1.2 `.gitignore` Security Best Practices
To ensure that production tokens, local build artifacts, and operating system junk files are never committed, the project utilizes the following `.gitignore`:

```gitignore
# Dependencies & Package Managers
node_modules/
npm-debug.log*

# Build Outputs
dist/
dist-ssr/

# Environment Variables & Secrets (CRITICAL)
.env
.env.local
.env.*.local
.data/

# Vercel Temporary Configuration
.vercel/

# OS Junk
.DS_Store
Thumbs.db
```

---

## 2. Vercel Hosting & CI/CD Pipeline

The website is hosted on the Vercel Platform under the project name `aura-creations-website`.

### 2.1 Automated CI/CD Workflow
1. A developer or assistant commits changes locally:
   ```bash
   git add .
   git commit -m "feat: your change summary"
   git push origin main
   ```
2. GitHub sends an encrypted webhook payload to Vercel.
3. Vercel's build infrastructure spins up a secure container running Node.js 20.x.
4. Executes `npm run build` (`tsc -b && vite build`).
5. Generates optimized static assets and serverless function bundles.
6. Deploys to edge servers across global regions.
7. Automatically updates the live production alias: **[https://www.auracreationss.com](https://www.auracreationss.com)**.

---

## 3. Required Environment Variables

The following environment variables must be configured in Vercel under **Project Settings $\rightarrow$ Environment Variables**:

| Variable Name | Environment | Purpose | Example / Required Format |
| :--- | :--- | :--- | :--- |
| `BLOB_READ_WRITE_TOKEN` | Production, Preview, Dev | Grants read/write access to `@vercel/blob` storage store | Auto-populated when connecting Vercel Blob store |
| `ADMIN_SESSION_SECRET` | Production, Preview, Dev | Cryptographic secret used to sign JWT admin session cookies | Random 64-char string |

---

## 4. Custom Domain & DNS Architecture

The official custom domain registered for the enterprise is **`auracreationss.com`**.

### 4.1 DNS Configuration (Configured at Registrar)
| Type | Host / Name | Target / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A Record** | `@` (or blank) | `76.76.21.21` | 3600 | Directs apex `auracreationss.com` to Vercel Anycast edge |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 | Directs `www.auracreationss.com` to Vercel Anycast edge |

### 4.2 Standard Canonical Redirect
In Vercel's Domains settings, **`auracreationss.com`** is configured to permanently redirect (**HTTP 308**) to **`www.auracreationss.com`**. This is industry-standard SEO best practice to prevent search engines from treating non-www and www as duplicate content.

---

## 5. Domain Alias Management & Troubleshooting

### The "Deployment URL vs Custom Domain" Trap
When deploying via the Vercel CLI or after certain GitHub merges, Vercel may assign a unique preview URL (e.g. `aura-creations-website-1jg0cv5xq-...vercel.app`).

If visitors notice that the preview URL has updates while the custom domain is lagging, the domain alias routing needs to be synchronized.

#### CLI Command to Reassign Custom Domains Directly:
```powershell
# In terminal inside the project directory:
npx vercel alias set <latest-deployment-url> www.auracreationss.com
npx vercel alias set <latest-deployment-url> auracreationss.com
```

### Instant Rollback Procedure
If a production deployment ever introduces a bug or visual defect:
1. Open the [Vercel Project Deployments Dashboard](https://vercel.com/aura-creations1/aura-creations-website).
2. Locate the previous known-good deployment.
3. Click the three dots ($\dots$) and select **Promote to Production**.
4. The custom domain instantly switches traffic to the older build within 5 seconds without rebuilding.
