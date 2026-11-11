# 11. Testing & Quality Assurance Verification Matrix

---

## 1. Test Methodology

Every layer of the Aura Creations digital platform underwent systematic functional, visual, cross-device, security, and performance verification prior to live client deployment.

---

## 2. Comprehensive Test Execution Log

### Test Category 1: Responsive Layout & Viewports
| Test ID | Test Objective | Steps Executed | Expected Result | Verified Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-RESP-01** | Desktop High-Res ($1920 \times 1080$) | Load homepage on 1080p desktop monitor. | Hero planetary orbit displays all 3 rings centered; 3-column service grid; glassmorphic header floats cleanly. | Clean layout, zero horizontal scroll, crisp typography. | **PASSED** |
| **TC-RESP-02** | Laptop Standard ($1440 \times 900$) | Resize browser window to laptop width. | Planetary orbit scales responsively; header links maintain comfortable padding. | All badges legible; navigation items accessible. | **PASSED** |
| **TC-RESP-03** | Tablet Portrait ($768 \times 1024$) | Emulate iPad view in DevTools. | 2-column service card layout; planetary orbit scales to fit viewport width without clipping. | Clean 2-column grid; touch targets $\ge 44\text{px}$. | **PASSED** |
| **TC-RESP-04** | Mobile Viewport ($375 \times 667$ - $414 \times 896$) | Emulate iPhone & Android mobile devices. | Header collapses to hamburger icon; orbit scales smoothly; service grid drops to 1-column stack. | Zero text overflow; fluid vertical scroll; touch buttons easily tapped. | **PASSED** |

---

### Test Category 2: Cross-Browser Compatibility
| Test ID | Browser | Version Tested | Verified Features | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-BRW-01** | Google Chrome | v122+ (Windows / Android) | Hardware-accelerated CSS animations, SVG gradient clips, Vercel Blob fetches. | **PASSED** |
| **TC-BRW-02** | Apple Safari | iOS 17+ / macOS Sonoma | Backdrop blur filters (`-webkit-backdrop-filter`), font rendering, smooth scroll. | **PASSED** |
| **TC-BRW-03** | Microsoft Edge | Chromium v122+ | Full feature parity, Windows font rendering, form inputs. | **PASSED** |
| **TC-BRW-04** | Mozilla Firefox | v124+ | CSS flexbox alignment, keyframe counter-rotations, WebP rendering. | **PASSED** |

---

### Test Category 3: Interactive Features & Lead Forms
| Test ID | Feature | Steps Executed | Expected Result | Verified Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-INT-01** | Quotation Calculator | Enter Name, 10-digit mobile number, select "LED Boards", enter 10x4ft dimensions, click Submit. | Form validates inputs, fires celebration confetti, sends payload to `/api/enquiries`, shows green confirmation. | Confetti burst fires; inquiry stored in Vercel Blob registry; form resets cleanly. | **PASSED** |
| **TC-INT-02** | WhatsApp Quick Chat | Click "WhatsApp" button on "T-Shirt Printing" service card. | Opens WhatsApp app or web tab with message: `"Hi Aura Creations, I would like to inquire about T-Shirt Printing."` | Directs to `wa.me/919959737964` with pre-filled message text. | **PASSED** |
| **TC-INT-03** | Direct Call Actions | Click phone numbers in Header, Contact cards, or floating widget. | Triggers system telephone dialer (`tel:+919959737964`). | Native dialer opens with exact verified phone number. | **PASSED** |
| **TC-INT-04** | Google Maps Office Card | Click anywhere on the Google Maps preview card in About section. | Opens Google Maps in a new browser tab with turn-by-turn directions to Srinagar Colony studio. | Navigates directly to verified Guntur office coordinates. | **PASSED** |
| **TC-INT-05** | Service Catalog Search | Type "flex" into service search bar. | Instantly filters 18 services down to "Flex Printing" and "Flex Boards". | Filter responds in $< 10\text{ms}$; instant visual update. | **PASSED** |

---

### Test Category 4: Admin Panel & Cloud Persistence
| Test ID | Feature | Steps Executed | Expected Result | Verified Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ADM-01** | Authentication | Attempt login with invalid credentials; then login with `AURA-AHMC-X58D-XXTD`. | Invalid credentials rejected with 401; recovery key succeeds and sets `aura_admin_session` cookie. | Session cookie set; dashboard unlocks immediately. | **PASSED** |
| **TC-ADM-02** | Rate Limiting | Fire 30 rapid failed login requests. | System locks out client IP for 15 minutes with HTTP 429. | Rate limiter blocks excess attempts; returns 429. | **PASSED** |
| **TC-ADM-03** | Service Persistence | Modify service price in Admin panel, save, open site on separate smartphone. | Updated price displays identically on phone without reverting to old defaults. | Cloud Blob update verified with `allowOverwrite: true`; HTTP 200 confirmed. | **PASSED** |
| **TC-ADM-04** | Image Upload | Upload a new JPEG image for a service card. | Image uploads to Vercel Blob, returns public URL, and reflects on public service card. | Image stored in Vercel Blob; URL saved to manifest; card updates live. | **PASSED** |

---

### Test Category 5: SEO, Performance & Production Build
| Test ID | Metric | Steps Executed | Target | Verified Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PRF-01** | Production Build | Run `npm run build` in root. | 0 TypeScript errors; bundle size $< 600\text{KB}$. | Built in 4.41s; 0 TS errors; total gzip size $< 180\text{KB}$. | **PASSED** |
| **TC-SEO-01** | Canonical Tag | Inspect `<link rel="canonical">` in live HTML. | Points to `https://www.auracreationss.com/`. | Matches canonical destination exactly. | **PASSED** |
| **TC-SEO-02** | Google Verification | Request `https://www.auracreationss.com/googlee0d744c2f577dcf6.html`. | Returns HTTP 200 with Google token. | HTTP 200 verified live. | **PASSED** |
| **TC-SEO-03** | Robots & Sitemap | Fetch `/robots.txt` and `/sitemap.xml`. | Returns valid XML sitemap and clean directives. | Both return HTTP 200 with valid structure. | **PASSED** |
