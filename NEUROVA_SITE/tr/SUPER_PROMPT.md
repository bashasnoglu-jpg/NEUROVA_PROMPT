# NEUROVA – Master Codex Prompt

Copy and paste the following block into your AI coding assistant to scaffold or verify the project structure.

---

**ACT AS:** Expert Senior Web Developer & UI/UX Designer.

**PROJECT:** NEUROVA Spa & Wellness (Static PWA).

**GOAL:** Create a high-end, "quiet luxury" spa website with a dual-language structure (TR/EN).

**TECH STACK:**
-   **Core:** HTML5 (Semantic), CSS3 (Tailwind CSS), Vanilla JavaScript (ES6+).
-   **Build:** Tailwind CLI.
-   **Testing:** Cypress (E2E), Jest (Unit).
-   **PWA:** Service Worker, Manifest.json.

**VISUAL LANGUAGE (CANONICAL):**
-   **Mood:** Silence, Ritual, Timeless, Natural, Low Contrast.
-   **Palette:**
    -   Background: `#34393D` (Dark Grey)
    -   Frame/Cards: `#2C2F32` (Warm Stone)
    -   Text: `#ECECEC` (Off-white)
    -   Accents: `#E6E2DC` (Marble), `#9F9F9F` (Muted Highlight)
-   **Typography:** System UI / Sans-serif (Clean, readable).
-   **Imagery:** Cinematic, soft lighting, no faces, focus on textures (steam, marble, water, hands).

**FILE STRUCTURE & ARCHITECTURE:**

1.  **Root:**
    -   `index.html` (Redirects to `/tr/` based on browser lang).
    -   `sw.js` (Service Worker).
    -   `manifest.json` (Web App Manifest).
    -   `robots.txt`, `sitemap.xml`.

2.  **Languages (`/tr/` and `/en/`):**
    -   `index.html` (Home)
    -   `hamam.html` (Hammam Rituals)
    -   `masajlar.html` (Massages)
    -   `signature-couples.html` (Signature & Couples)
    -   `kids-family.html` (Kids & Family)
    -   `face-sothys.html` (Face Care)
    -   `paketler.html` (Packages)
    -   `products.html` (Boutique)
    -   `about.html` (Corporate)
    -   `team.html` (Corporate)
    -   `galeri.html` (Corporate)
    -   `contact.html` (Contact)
    -   `404.html`, `offline.html`

**NAVIGATION (Canonical Order):**
1.  Home
2.  Hammam
3.  Massages
4.  Signature & Couples
5.  Kids & Family
6.  Face – Sothys
7.  Packages
8.  Products
9.  Corporate (Dropdown: About, Team, Gallery, Contact)
10. Reservation (CTA)

**FUNCTIONAL REQUIREMENTS:**
-   **Responsive:** Mobile-first, hamburger menu on mobile, sticky header.
-   **Dark Mode:** Default is dark/dim. Toggle available but design centers on dark luxury.
-   **Performance:** Lazy loading images, `content-visibility`, minimal layout shifts (CLS < 0.1).
-   **SEO:** Unique Title tags, Meta Descriptions, Canonical tags, Open Graph tags, JSON-LD Schema (Spa).
-   **Accessibility:** Semantic tags (`<main>`, `<nav>`), ARIA labels, Skip-to-content link, Focus states.
-   **PWA:** Offline fallback page, cache-first strategy for assets.

**CONTENT RULES:**
-   **Catalog:** Refer to `CATALOG.md` for the single source of truth regarding services, durations, and descriptions.
-   **CTA:** Single primary call-to-action: "Rezervasyon (WhatsApp)" / "Reservation (WhatsApp)".

**EXECUTION INSTRUCTIONS:**
1.  Ensure all HTML files are valid UTF-8.
2.  Use Tailwind utility classes for all styling (no custom CSS files except input).
3.  Ensure consistent header/footer across all pages.
4.  Implement the language switcher logic in `app.js`.

**FAIL CONDITIONS:**
-   Do not use jQuery or Bootstrap.
-   Do not use placeholder Lorem Ipsum; use context-aware dummy text (e.g., "Relaxing massage...").
-   Do not break the directory structure (`/tr/` vs `/en/`).