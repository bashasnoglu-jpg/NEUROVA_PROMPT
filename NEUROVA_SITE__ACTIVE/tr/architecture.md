# Architecture Overview

## Technology Stack

The NEUROVA website is built as a static site with Progressive Web App (PWA) capabilities.

- **HTML5**: Semantic structure for accessibility and SEO.
- **CSS3**: Modern layout techniques (Grid, Flexbox) and CSS Variables for theming.
- **JavaScript (ES6+)**: Vanilla JavaScript for DOM manipulation and Service Worker registration.

## File Structure

```text
NEUROVA_SITE/
├── tr/                 # Turkish localization (Main content)
├── assets/             # Shared resources
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side scripts
│   └── img/            # Images and icons
├── docs/               # Documentation (You are here)
├── sw.js               # Service Worker for offline support
└── manifest.json       # PWA Manifest
```

## Key Features

1.  **PWA Support**: Offline access via Service Workers and installability via Web App Manifest.
2.  **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox.
3.  **Dark Mode**: Default dark aesthetic implemented via CSS variables.