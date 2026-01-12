# Style Guide

This document outlines the design system and coding standards for the NEUROVA website.

## Design Tokens

### Colors

The color palette is defined using CSS variables in `:root`.

| Variable      | Hex Code  | Usage                          |
| :---          | :---      | :---                           |
| `--bg`        | `#34393D` | Main background color          |
| `--panel`     | `#41464A` | Card and panel backgrounds     |
| `--frame`     | `#2C2F32` | Darker frames/borders          |
| `--highlight` | `#9F9F9F` | Accents and highlights         |
| `--text`      | `#ECECEC` | Primary text color             |
| `--muted`     | `#B9B9B9` | Secondary/meta text color      |

### Typography

- **Font Family**: System UI stack (`ui-sans-serif`, `-apple-system`, `Segoe UI`, etc.) for maximum performance and native feel.
- **Weights**: Default (400) and Bold (700) mostly.
- **Headings**: `.nv-h1` class or `<h1>` tags inside `.page-hero`.

### Spacing & Layout

- **Grid System**: `.nv-grid` creates a 12-column grid.
  - `.nv-col-4`: Spans 4 columns (1/3 width).
  - `.nv-col-8`: Spans 8 columns (2/3 width).
- **Container**: `.nv-shell` or `main` limits content width to `1100px`.
- **Border Radius**: `--r: 18px` is the standard radius for cards and panels.

## Components

### Buttons (CTA)

Use the `.nv-cta` class for primary actions.

```html
<a href="#" class="nv-cta">Rezervasyon</a>
```

### Cards

Use `.nv-card` for grouping content.

```html
<div class="nv-card">
  <h3>Title</h3>
  <p class="nv-sub">Subtitle or description.</p>
</div>
```

### Navigation

- **Header**: `.nv-header` (Sticky, backdrop-blur).
- **Links**: `.nv-link` for nav items, `.nv-link.is-active` for current page.

## CSS Naming Convention

> **Note:** For the full naming convention and hybrid architecture documentation, see COMPONENT_NAMING.md.

We use a simplified BEM-like syntax prefixed with `nv-` (NEUROVA) to avoid conflicts.

- Block: `.nv-card`
- Element: `.nv-card__title` (if needed, though often nested tags are used for simplicity)
- Modifier: `.nv-link--active` or `.is-active` state class.

## Images

> **Note:** For detailed visual guidelines, AI prompts, and the Graphic Master Kit, please refer to VISUAL_GUIDE.md, HAMAM_PROMPTS.md, and GRAPHIC_MASTER_KIT.md.

- All images should have `loading="lazy"` and `decoding="async"`.
- Use `aspect-ratio` in CSS to prevent layout shifts.
- Placeholders are currently used; replace with optimized WebP or JPG assets in production.