# NEUROVA Codebase Guide

## Architecture Overview
- **Static Website**: HTML/CSS/JS site for NEUROVA wellness center, bilingual (TR/EN)
- **Key Directories**:
  - NEUROVA_SITE/: Main site files (HTML pages, assets/)
  - server/: Express.js dev server with webhook handler
  - 	ools/: Custom Node.js scripts for verification, export, quality gates
  - packs/: Prompt data files (referenced in prompt-library.html)

## Core Conventions
- **CSS Classes**: Use 
v-* prefix (e.g., 
v-card, 
v-tier-entry, 
v-cta)
- **Data Attributes**: 
  - data-tier: "Entry"/"Value"/"Premium"
  - data-family: Package category (e.g., "Hamam + Masaj")
  - data-wa: "1" for WhatsApp links
- **Language Detection**: Based on URL paths (paketler = TR, packages = EN) or <html lang>
- **Navigation**: Dynamic inclusion via etch('./nav.html') in each page

## WhatsApp Integration
- **Config**: wa-config.js sets phone number and brand
- **Message Building**: wa-linker.js creates prefilled messages with tier/package tags
- **Tracking**: heatmap.js counts clicks, stored in localStorage with source/tier keys
- **Inference**: Automatically detects package from card's section h2, tier from class/h3 text

## Development Workflow
- **Local Dev**: 
pm run dev starts Express server on port 3000
- **Verification**: 
pm run nv:verify checks pack files for duplicates/missing fields
- **Quality Gate**: 
pm run quality:gate runs comprehensive checks
- **CI/CD**: GitHub Actions deploy to Pages on main branch push

## Key Files
- paketler.html: Turkish packages page with tiered cards
- pricing-config.js: Price placeholders (currently 0)
- wa-linker.js: Builds WA URLs with structured messages
- heatmap-overlay.js: UI for viewing click heatmaps
- 
av.js: Handles active nav states and mobile menu

## Patterns to Follow
- Tier structure: Entry/Value/Premium with distinct styling (
v-tier-*)
- Card layout: h3 title, meta paras, ul list, upgrade note, CTA button
- Async nav loading: Use IIFE with fetch for nav.html inclusion
- Event tracking: Bump heatmap on WA clicks with normalized source/tier
