# AURA CREATIONS — Digital Brand Experience & Website

> **Ideas That Create Impact**  
> *Advertising, Printing, Branding & Creative Solutions*  
> **Location:** Srinagar Colony, 4th Line, Near Sri Chaitanya College, Guntur, Andhra Pradesh, India.  
> **Proprietor:** G. Shiva  
> **Direct Contact:** +91 81438 88858 | +91 99597 37964  
> **GSTIN:** `37BZAPJ8456K1ZW`  
> **Instagram:** [@auracreations246](https://www.instagram.com/auracreations246/)  
> **Email:** `auracreations9959@gmail.com`

---

## 🌟 Executive Overview
This is the official client website for **AURA CREATIONS**, engineered to international advertising agency standards. It showcases the full suite of **18 commercial design, print, and signage services** with authentic extracted portfolio photographs, an animated signature logo introduction experience, real-time quote validation, direct WhatsApp and phone integration, and a **zero-database, static-first CMS Admin Panel** designed for autonomous owner control.

---

## 🎨 Brand Design System & Color Palette
The visual design system is derived directly from the original Aura Creations brand identity:
- **Premium Magenta:** `#C026D3` / `#E11D48`
- **Deep Royal Purple:** `#3B0764` / `#581C87`
- **Midnight Navy Blue:** `#06050B` / `#0C0819`
- **Luxury Gold Accent:** `#D4AF37` / `#F59E0B`
- **Pristine White & Platinum:** `#FFFFFF` / `#F1F5F9`

---

## 🚀 Key Features

### 1. Signature Animated Intro Experience
- Cinematic opening sequence on initial visit with smooth glowing logo reveal.
- Tagline letter-spacing animation: *"Ideas That Create Impact"*.
- Category triad reveal: **DESIGN | PRINT | BRAND**.
- Web Audio synthesizer chord ambience with sound toggle.
- "Skip Intro" button for immediate access.
- Stored in `sessionStorage` to avoid annoying replays during navigation, with an on-demand **Replay Intro** button in header & footer.

### 2. Complete 18 Specialized Services
Every single commercial service is rendered with high-grade cards, hover animations, feature bullets, and direct WhatsApp quote buttons:
1. **LED Boards** (High-impact 3D illuminated letters)
2. **Backlight Boards** (Retail showroom illuminated pylons)
3. **Flex Boards** (Heavy GI frame outdoor hoardings)
4. **Auto Stickers** (Transit vehicle wrap advertising)
5. **Flex Printing** (Industrial wide-format solvent/eco-solvent printing)
6. **Umbrella Printing** (Promotional market & garden umbrellas)
7. **Rollup Standees** (Portable pull-up exhibition banner stands)
8. **Demo Tents** (Gazebo canopies for field roadshows)
9. **Visiting Cards** (Velvet matte, gold foil, spot UV executive cards)
10. **Pamphlet Printing** (Offset multi-color leaflets & brochures)
11. **T-Shirt Printing** (Custom polo & round-neck apparel printing)
12. **Cap Printing** (Custom embroidered promotional headwear)
13. **No Parking Boards** (Sunpack and metal gate signage)
14. **Pamphlet Distribution** (Targeted door-to-door Guntur campaigns)
15. **Pole Banners** (Streetlight kiosks on prime commuter corridors)
16. **Acrylic Boards** (3D laser-cut crystal edge architectural signs)
17. **Indoor Stickering** (Frosted glass & interior vinyl wall murals)
18. **Photo Frames** (Custom artisan wooden & floating frame displays)

### 3. Client Portfolio with Interactive Lightbox
- Categorized filter tabs (*LED & Sign Boards, Printing, Branding, Promotional Products, Outdoor Advertising*).
- Fullscreen Lightbox with project details, client tags, keyboard arrow navigation (`Left`/`Right`/`Esc`), and direct WhatsApp inquiry links.

### 4. Interactive Quotation Form & Lead Capture
- Client inquiry form with real-time validation (Name, 10-digit Phone, Email, Service selection, Message).
- Celebratory confetti on submission.
- Real-time persistence into local storage **Inquiries Inbox** in the Admin Panel.
- One-click instant forwarding of the full quote to WhatsApp `+91 81438 88858`.

### 5. Dedicated Business Admin Panel (Zero Database Required)
- Protected login gate (Default key: `aura@admin`).
- **Dashboard Overview:** Real-time counts of services, portfolio works, and customer leads.
- **Inquiries Inbox:** Review incoming customer quote requests with status toggles (*New, Contacted, Resolved*) and direct WhatsApp/Phone callback buttons.
- **Portfolio Manager:** Add new works with live image file upload, edit titles, and delete items.
- **Service Manager:** Modify service descriptions, categories, and tags.
- **Business Details Manager:** Live updates to phones, email, proprietor name, address, Instagram, and GSTIN.
- **Content Export:** One-click JSON backup export and reset-to-defaults mechanism.
- **Decap CMS Ready:** `public/admin/index.html` and `public/admin/config.yml` pre-configured for future Git-backed online publishing on Netlify.

---

## 📁 Project Directory Structure
```
Aura Creations Website/
├── public/
│   ├── admin/
│   │   ├── index.html            # Standalone Decap CMS Single-Page App
│   │   └── config.yml            # Decap CMS collections schema
│   ├── images/
│   │   ├── logo/
│   │   │   ├── logo-original.jpg          # Original client logo
│   │   │   ├── logo-transparent.png       # Antialiased transparent brand logo
│   │   │   ├── logo-gold-transparent.png  # Luxury gold brand crest
│   │   │   ├── visiting-card-maroon.jpg   # Original visiting card asset
│   │   │   └── visiting-card-dark.jpg     # Dark visiting card asset
│   │   ├── services/                      # Extracted authentic service photographs
│   │   └── portfolio/                     # High-res client project showcase assets
│   ├── robots.txt                # Search crawler configuration
│   └── sitemap.xml               # SEO sitemap
├── src/
│   ├── content/
│   │   ├── business.json         # Core business data (G. Shiva, phones, GSTIN)
│   │   ├── services.json         # Complete 18 services catalog
│   │   └── portfolio.json        # Authentic client portfolio pieces
│   ├── context/
│   │   └── WebsiteContext.tsx    # Reactive state & localStorage synchronization
│   ├── components/
│   │   ├── SignatureIntro.tsx    # Cinematic animated brand opening
│   │   ├── Header.tsx            # Sticky glass navigation & top announcement bar
│   │   ├── Hero.tsx              # High-impact hero section & trust metrics
│   │   ├── About.tsx             # Editorial brand narrative & identity showcase
│   │   ├── ServicesSection.tsx   # All 18 services grid with filters & search
│   │   ├── PortfolioSection.tsx  # Gallery with interactive Lightbox
│   │   ├── WhyChooseUs.tsx       # 6 core agency pillars
│   │   ├── ContactSection.tsx    # Interactive quote form & business details
│   │   ├── Footer.tsx            # Agency footer with GSTIN & quick directory
│   │   ├── FloatingWidgets.tsx   # Floating WhatsApp, Call & Back to Top
│   │   ├── AdminPanel.tsx        # Protected client dashboard & CMS
│   │   └── Icons.tsx             # Precision SVG brand icons
│   ├── App.tsx                   # Master application assembler
│   ├── main.tsx                  # React entrypoint
│   └── index.css                 # Tailwind v4 & cinematic luxury styling
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite & Tailwind configuration
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Documentation & operational guide
```

---

## 💻 Local Development & Demonstration Instructions

### Prerequisites
- Node.js (v18 or higher installed)
- npm (installed with Node)

### 1. Open the Project Folder
Open your terminal or PowerShell and navigate to the project directory on your Desktop:
```bash
cd "C:\Users\Hello\OneDrive\Desktop\Aura Creations Website"
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser at the displayed URL:
`http://localhost:5173/`

### 3. Run Production Preview
To test the optimized production build:
```bash
npm run build
npm run preview
```

---

## 🔐 Admin Panel Access
- Click the **Admin** button in the top navigation bar or the footer link.
- **Passkey:** `aura@admin`
- Inside the dashboard, you can:
  - Add or delete portfolio works (supports image upload).
  - Edit any of the 18 service cards.
  - View real inquiries submitted from the website with direct WhatsApp reply buttons.
  - Update proprietor contact info, phones, email, GSTIN, and address.
  - Export a backup JSON file anytime.

---

## 🌐 Cloud Deployment & Git-Backed CMS Setup (Optional)
When you are ready to publish this website live on the internet:
1. **GitHub Repository:**
   Initialize a Git repository inside `Aura Creations Website` and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial Aura Creations website release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aura-creations.git
   git push -u origin main
   ```
2. **Netlify One-Click Deployment:**
   - Link the GitHub repo in [Netlify](https://www.netlify.com/).
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. **Decap CMS Online Publishing:**
   - In Netlify Site Settings, enable **Identity** and enable **Git Gateway**.
   - Navigate to `https://your-domain.netlify.app/admin/` to edit content and auto-commit changes to GitHub without a database!
