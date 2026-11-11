# 09. Complete SEO, Structured Data & Google Ecosystem Setup

---

## 1. Technical SEO Audit & Implementation

Technical SEO ensures that search engine crawlers (Googlebot, Bingbot) can crawl, render, index, and understand the website structure without encountering errors, redirect loops, or broken assets.

| Technical SEO Element | Implementation Status | Configuration in Aura Creations |
| :--- | :--- | :--- |
| **Canonical URL** | Verified | `<link rel="canonical" href="https://www.auracreationss.com/" />` |
| **Robots Directive** | Verified | `<meta name="robots" content="index, follow, max-image-preview:large..." />` |
| **Robots File** | Verified | [https://www.auracreationss.com/robots.txt](https://www.auracreationss.com/robots.txt) |
| **XML Sitemap** | Verified | [https://www.auracreationss.com/sitemap.xml](https://www.auracreationss.com/sitemap.xml) |
| **SSL / HTTPS** | Verified | Automated Let's Encrypt TLS certificate forced across all HTTP traffic. |
| **Mobile-Friendly Viewport** | Verified | `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` |
| **Semantic Heading Hierarchy** | Verified | Single `<h1>` tag reserved for brand name, `<h2>` for major sections, `<h3>` for cards. |
| **Image Alt Attributes** | Verified | Descriptive alt text for all 18 service cards and portfolio items. |

---

## 2. On-Page SEO & Metadata Strategy

### 2.1 Primary Meta Tags (`index.html`)
- **Title Tag:**
  `AURA CREATIONS — Advertising, Printing & Branding | Guntur`
  *Character count: 57 characters (Optimal range: 50–60 characters).*
- **Meta Description:**
  `Aura Creations is Guntur's leading advertising, printing, and corporate branding studio. Specializing in 3D LED sign boards, flex printing, rollup standees, acrylic signs, T-shirt printing, visiting cards & outdoor marketing in Guntur, AP.`
  *Character count: 236 characters (Displays clear intent and call-to-action).*
- **Primary Keywords:**
  `Aura Creations, Aura Creations Guntur, Advertising Agency Guntur, Flex Printing Guntur, LED Boards Guntur, Acrylic Signage Guntur, Visiting Cards Printing, T-Shirt Printing Guntur, Rollup Standees Guntur, Commercial Branding Guntur`

### 2.2 Social Graph Metadata (OpenGraph & Twitter Cards)
- **og:title:** `AURA CREATIONS — Ideas That Create Impact | Guntur`
- **og:description:** `Premier Advertising, Printing & Branding Studio in Guntur, Andhra Pradesh. LED Boards, Flex Printing, Acrylic Boards, Corporate Merchandise.`
- **og:image:** `https://www.auracreationss.com/images/logo/hero-brand-banner.jpg`
- **og:url:** `https://www.auracreationss.com/`
- **og:type:** `website`
- **twitter:card:** `summary_large_image`

---

## 3. Schema.org JSON-LD Structured Data

Structured data provides search engines with unambiguous machine-readable information about the business entity, enabling rich snippets, local pack inclusion, and knowledge panels.

### Implemented Schema Specification
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://www.auracreationss.com/#business",
      "name": "Aura Creations",
      "legalName": "Aura Creations",
      "alternateName": ["AURA CREATIONS", "Aura Creations Advertising & Branding", "Aura Creations Guntur"],
      "url": "https://www.auracreationss.com/",
      "logo": "https://www.auracreationss.com/images/logo/logo-transparent.png",
      "image": "https://www.auracreationss.com/images/logo/hero-brand-banner.jpg",
      "description": "Guntur's premier advertising, printing, and corporate branding agency specializing in LED sign boards, flex printing, roll-up standees, corporate merchandise, and outdoor marketing in Guntur, Andhra Pradesh.",
      "telephone": ["+91-99597-37964", "+91-81438-88858", "+91-88869-30880"],
      "email": "auracreations9959@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Srinagar Colony, 4th Line, Near Sri Chaitanya College",
        "addressLocality": "Guntur",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "522002",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "16.3067",
        "longitude": "80.4365"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "21:00"
        }
      ],
      "priceRange": "₹₹",
      "paymentAccepted": "Cash, UPI, Bank Transfer",
      "currenciesAccepted": "INR",
      "areaServed": [
        { "@type": "City", "name": "Guntur" },
        { "@type": "City", "name": "Vijayawada" },
        { "@type": "State", "name": "Andhra Pradesh" }
      ],
      "sameAs": [
        "https://www.instagram.com/auracreations246/"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Advertising, Printing & Branding Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "LED Boards" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Backlight Boards" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flex Boards" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Auto Stickers" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flex Printing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "T-Shirt Printing" } }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.auracreationss.com/#website",
      "url": "https://www.auracreationss.com/",
      "name": "Aura Creations",
      "alternateName": "AURA CREATIONS",
      "publisher": { "@id": "https://www.auracreationss.com/#business" }
    }
  ]
}
```

---

## 4. Google Search Console & Expedited Indexing

### 4.1 Verification Methods Implemented
1. **HTML Meta Tag:**
   `<meta name="google-site-verification" content="F-rxNDwT8hPYcJbVt-bwUfJ_HvdwpTK11-XSAyE_pa8" />`
2. **HTML Verification File:**
   Live at `https://www.auracreationss.com/googlee0d744c2f577dcf6.html` (returns HTTP 200).

### 4.2 Step-by-Step Priority Indexing SOP
1. Log in to [Google Search Console](https://search.google.com/search-console) using `auracreations9959@gmail.com`.
2. Add Property $\rightarrow$ URL Prefix: `https://www.auracreationss.com/` (auto-verifies).
3. Under **Sitemaps**, enter `sitemap.xml` and click **Submit**.
4. In the top URL Inspection bar, enter `https://www.auracreationss.com/`.
5. Once data is retrieved from Google Index, click **"Request Indexing"**. This places the URL into the priority crawler queue.

---

## 5. Google Business Profile & Local Search Domination

For local searches (e.g. *"Aura Creations"*, *"advertising agency in Guntur"*), Google awards the entire top section of search results to the **Google Business Profile (Map Pack)**.

### Blueprint to Claim #1 Spot:
1. Navigate to [Google Business Profile](https://www.google.com/business/).
2. Register business name as: **Aura Creations**.
3. Set primary category: **Advertising Agency**; secondary: **Commercial Printer**.
4. Provide exact address: `Srinagar Colony, 4th Line, Near Sri Chaitanya College, Guntur, AP - 522002`.
5. Link official website: `https://www.auracreationss.com`.
6. Add verified phone lines: `+91 99597 37964`, `+91 81438 88858`.
7. Upload the 24 authentic workshop photographs from `public/images/services`.
8. Complete phone/video verification with Google.
