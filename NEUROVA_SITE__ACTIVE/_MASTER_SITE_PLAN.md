# NEUROVA - MASTER SITE ARCHITECTURE PLAN v2.0
**Status:** DRAFT
**Date:** 2026-01-22
**Standard:** Google-Style Modern Web Architecture (Semantic HTML5 + Modular CSS)

## 1. Core Philosophy
The entire site must adhere to the **"Quiet Luxury"** aesthetic and **Google-Style** engineering standards.
- **Visuals:** Minimalist, high-quality imagery, negative space, refined typography.
- **Code:** Semantic HTML5, CSS Variables (`core.css`), Reusable Components (`components.css`).
- **Performance:** Lazy loading, localized assets, zero layout shift (CLS).

## 2. Global Structure (All Pages)
Every HTML file in the project MUST share this identical shell:

### 2.1. Head Stack
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] | NEUROVA</title>
    <meta name="description" content="[SEO Description]">
    <!-- CSS -->
    <link rel="stylesheet" href="/assets/css/core.css">
    <link rel="stylesheet" href="/assets/css/components.css">
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32x32.png">
    <!-- Canonical -->
    <link rel="canonical" href="https://neurova.com/tr/[filename].html">
</head>
```

### 2.2. Header (Navigation)
Standard `nv-navbar` component.
**Links:**
- Ana Sayfa (`/tr/index.html`)
- Hamam (`/tr/hamam.html`)
- Masajlar (`/tr/masajlar.html`)
- Face - Sothys (`/tr/face-sothys.html`)
- İletişim (`/tr/contact.html`)

### 2.3. Footer
Standard `nv-footer` component with 4-column layout (Brand, Discover, Contact, Copyright).

## 3. Page Templates

### 3.1. Home Page (`index.html`)
- **Hero:** Full-screen, Video/Image Background, Strong Value Prop.
- **Philosophy:** Editorial text block (Manifesto).
- **Discovery Grid:** 3-Column Service Preview (Hamam, Massage, Face).
- **Spotlight:** Feature section (e.g., Couples Retreat).

### 3.2. Category Pages (`hamam.html`, `masajlar.html`, `face-sothys.html`, `paketler.html`)
- **Hero:** 50-60vh height, Image Background, Category Title.
- **Intro:** Brief standard text describing the category.
- **Card Grid:** 2 or 3 columns listing services.
    - **Card:** Image, Title, Description, Duration/Price, "İncele" Button.

### 3.3. Detail Pages (e.g., `klasik-masaj.html`)
- **Structure:** `hero` -> `grid (content + visual)` -> `related services`.
- **Content:** Detailed description, benefits list, duration/price matrix.

### 3.4. Utility Pages (`about.html`, `contact.html`, `privacy.html`)
- Simple, readable layouts focusing on text content or forms.

## 4. Implementation Checklist
The following pages must be verified against this new standard:

- [x] `index.html` (Done)
- [ ] `hamam.html` (Verify Hero & Footer)
- [ ] `masajlar.html` (Verify Hero & Footer)
- [ ] `face-sothys.html` (Verify Hero & Footer)
- [ ] `paketler.html` (Verify Layout consistency)
- [ ] `contact.html` (Verify Hero visual)
- [ ] `about.html` (Verify text readability)

## 5. Cleaning & Consolidation
- **Legacy Files:** Identify and remove any files that do not fit the new structure or are duplicates (e.g., check `klasik-masajlar.html` redundancy).
- **Assets:** Ensure all images use Unsplash source or optimized local assets.
