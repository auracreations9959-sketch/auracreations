# 05. UI/UX Design & Frontend Component Architecture

---

## 1. Visual Design Philosophy & Aesthetics

The Aura Creations user interface is engineered to evoke **architectural precision, luminous night-time signage aesthetics, and luxury craft**. 

Unlike standard corporate websites that utilize stark white backgrounds with generic clip-art, Aura Creations utilizes an immersive, dark-room obsidian canvas (`#06040d` and `#070510`) that mimics the dramatic contrast of 3D illuminated LED channel letters glowing in the night.

### Color Hierarchy
- **Canvas Base:** Deep Obsidian `#06040d` / `#070510`
- **Primary Ambient Glows:** Radial Fuchsia `#d946ef` (30% opacity) and Royal Indigo `#4f46e5` (20% opacity) with 160px Gaussian blur.
- **Brand Text Gradient:** Linear 135deg gradient across `#f43f5e` (Rose) $\rightarrow$ `#d946ef` (Fuchsia) $\rightarrow$ `#8b5cf6` (Purple) $\rightarrow$ `#60a5fa` (Sky Blue).
- **Gold Accents:** Radiant Amber `#f59e0b` and `#fbbf24` used for ratings, badges, and verified proprietor badges.
- **Border Treatments:** Delicate 1px translucent borders (`border-white/10` and `border-purple-500/20`) providing dimensional glassmorphism.

---

## 2. Component-by-Component Documentation

### 2.1 Header & Navigation (`src/components/Header.tsx`)
- **Visual Design:** Sticky, floating glassmorphic bar with `backdrop-blur-md` and `bg-[#070510]/80` anchored to the top of the viewport (`z-50`).
- **Elements:**
  - **Brand Mark:** Vector Aura Creations logo card with soft glow.
  - **Desktop Navigation Links:** Smooth-scrolling anchors targeting `#home`, `#about`, `#services`, `#portfolio`, `#why-choose-us`, and `#contact`.
  - **Dynamic CTA:** Glowing "Get Quote" button with hover micro-interaction that scrolls the visitor directly to the quotation calculator.
  - **Mobile Hamburger Drawer:** Accessible sliding menu drawer for screen widths $< 768px$ with automated auto-close upon navigation item selection.

---

### 2.2 Hero Section & Planetary Orbital Animation (`src/components/Hero.tsx`)
The Hero section is the crown jewel of the website, combining typographic brand storytelling with a custom interactive 3-ring planetary orbit.

1. **Typographic Composition:**
   - **Eyebrow:** Pill badge featuring `DESIGN • PRINT • BRAND | GUNTUR, AP`.
   - **Main Brand Logo:** High-definition custom vector "AURA CREATIONS" letters in crisp white with a 30px white radial glow.
   - **Handwritten Signature Tagline:** *"Ideas That Create Impact"* rendered in fluid cursive script angled at $-1^\circ$ with an organic calligraphic SVG swoop underline.
2. **The 3-Ring Concentric Planetary Orbit:**
   - **Orbit 3 (Outer Ring - 92% diameter):**
     - Rotates clockwise over 45 seconds (`animate-orbit-outer`).
     - Hosts **Dynamic Planet 1 (LED Boards)** with a blue glow badge and `<Lightbulb />` icon.
     - Hosts **Dynamic Planet 2 (Backlight Boards)** with a crimson glow badge and `<Flag />` icon.
   - **Orbit 2 (Middle Ring - 68% diameter):**
     - Rotates counter-clockwise over 32 seconds (`animate-orbit-middle`).
     - Hosts **Dynamic Planet 3 (Flex Boards)** with an amber glow badge and `<Palette />` icon.
     - Hosts **Dynamic Planet 4 (Auto Stickers)** with a cyan glow badge and `<Printer />` icon.
   - **Orbit 1 (Inner Ring - 46% diameter):**
     - Rotates clockwise over 22 seconds (`animate-orbit-inner`).
     - Hosts **Dynamic Planet 5 (Flex Printing)** with an emerald glow badge and `<Tent />` icon.
     - Hosts **Dynamic Planet 6 (T-Shirt Printing)** with a purple glow badge and `<Shirt />` icon.
3. **Physics & Usability:**
   - Every planet badge utilizes an inverse CSS counter-rotation (`animate-counter-rotate-*`) so all text labels remain perfectly horizontal and legible at every degree of the orbit.
   - Hovering the mouse anywhere over the orbit pauses all animations (`group-hover/orbit:[animation-play-state:paused]`), allowing effortless inspection and clicking.

---

### 2.3 About Section & Office Location Card (`src/components/About.tsx`)
- **Story Narrative:** Highlights the company's manufacturing philosophy with the highlighted multi-color gradient name:
  `<span className="brand-gradient-text font-bold">Aura Creations</span>`.
- **Verified Studio Lead Card:** Displays proprietor details (Managing Director / Shiva), verified studio badge, physical shop address, and direct telephone line.
- **Interactive Google Maps Office Card:**
  - Designed as a dark luxury map card matching the dark UI theme.
  - Features an embedded Google Maps iframe centered directly over **Srinagar Colony, 4th Line, Guntur**.
  - Displays a customized location pin, pulsing radar wave, and a top-right **"GET DIRECTIONS"** button.
  - Clicking anywhere on the preview card opens Google Maps in a new tab with turn-by-turn directions directly to the Aura Creations studio.

---

### 2.4 Services Section (`src/components/ServicesSection.tsx`)
- **Filter Pills:** Dynamic category switcher allowing users to isolate:
  `All (18)` | `Signage` | `Printing` | `Branding` | `Promotional` | `Outdoor`
- **Instant Search Filter:** Real-time fuzzy filter searching service names and feature descriptions as the user types.
- **Service Cards (18 Total):**
  - High-definition authentic photograph with subtle hover zoom (`scale-105 duration-500`).
  - Badge overlays: Category tag (e.g. `Signage`) and Commercial tag (e.g. `BEST SELLER`, `POPULAR`, `ESSENTIAL`).
  - Starting price indicator (e.g. `Starting from ₹120 / sq.ft`).
  - Feature bullet points with checkmark icons.
  - Direct **"WhatsApp"** button (pre-fills the message with the selected service name) and **"Get Quote"** button (populates the inquiry form).

---

### 2.5 Portfolio Gallery (`src/components/PortfolioSection.tsx`)
- Displays authentic project installations photographed across commercial clients in Guntur.
- Includes category filter pills and interactive zoom modals.
- Clicking any project opens an expanded lightbox with full specifications, installation context, materials used, and client identity.

---

### 2.6 Contact Section & Custom Quotation Generator (`src/components/ContactSection.tsx`)
- **3 Key Contact Cards:**
  1. **Administrator & WhatsApp:** J. Vani (`+91 99597 37964`) with direct Call and WhatsApp buttons.
  2. **Marketing & Creative Head:** Shiva (`+91 81438 88858`) with direct Call button.
  3. **Customer Inquiries Desk:** Supporting Team (`+91 88869 30880`) with direct Call button.
- **Custom Quotation Form:**
  - Captures Full Name, Mobile Phone, Optional Email, Selected Service (dropdown with all 18 options), and Project Dimensions / Quantity notes.
  - Features client-side validation, anti-spam safeguards, and automatic submission into the Vercel Blob lead registry.
  - Submitting triggers a celebration confetti burst (`canvas-confetti`) and a success confirmation state.

---

### 2.7 Floating Interaction Widgets (`src/components/FloatingWidgets.tsx`)
- **Sticky Call Button:** Floating amber circle widget triggering instant telephone dialing (`tel:+919959737964`).
- **Instant WhatsApp Bubble:** Expanding green widget with live messaging prompt *"Chat with Aura"* that directs to `https://wa.me/919959737964`.
- **Back-to-Top Button:** Smooth-scrolling arrow that appears dynamically once the visitor scrolls 400px past the hero.
