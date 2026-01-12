# NEUROVA Code & Project Report

## Executive Summary
- Site runtime lives under `NEUROVA_SITE` with static HTML pages and shared JS/CSS; WA tracking uses `nv_wa_click__<source>__<tier>__<yyyy-mm-dd>__<lang>` written by `NEUROVA_SITE/assets/js/wa-click-tracker.js` and surfaced by `NEUROVA_SITE/heatmap-overlay.js`.
- Paketler/Packages pages now include a hero-adjacent guidance block (Entry/Value/Premium) and Value micro-optimized copy in both TR/EN.
- Products hero CTA is split into two WA links (Value vs Entry intent) with `data-tier` for tracking; message prefill is direct WA text.
- Heatmap overlay includes export, backup, and cleanup tooling; legacy counters can be merged into v2 keys with lang marked as UNKNOWN.
- Measurement is in watch mode: 24-48h to validate Products->Value lift before any Premium changes.

## Repo Structure Summary
- Root contains prompt-library tooling, packs, server hooks, and docs; `NEUROVA_SITE/` is the live site bundle.
- `NEUROVA_SITE/` holds page HTML (paketler, packages, products), shared JS (`wa-linker.js`, `heatmap.js`, `slot-macro.js`) and CSS (`assets/paketler.css`, `assets/nav.css`).
- `assets/` (root and site) contains global nav and reservation helpers; `packs/` holds prompt packs; `docs/` includes operational guides.
- Scan summary: 107 files scanned; 289 signal hits; extensions dominated by `.js`, `.html`, `.md`.

## Architecture & Flow Diagram (Text)
- User loads `NEUROVA_SITE/paketler.html` / `NEUROVA_SITE/packages.html` / `NEUROVA_SITE/products.html`.
- Pages fetch `NEUROVA_SITE/nav.html` into `#nv-nav-slot` and apply `NEUROVA_SITE/assets/nav.js` for active nav and header padding.
- Shared styles: `NEUROVA_SITE/assets/nav.css` + `NEUROVA_SITE/assets/paketler.css`.
- Package pricing: `NEUROVA_SITE/pricing-config.js` -> `NEUROVA_SITE/pricing-linker.js` injects per-tier prices.
- WA messaging: `NEUROVA_SITE/wa-config.js` -> `NEUROVA_SITE/wa-linker.js` binds `data-wa` links and builds prefilled messages.
- WA tracking: `NEUROVA_SITE/assets/js/wa-click-tracker.js` listens to WhatsApp-target clicks and writes v2 keys.
- Heatmap UI: `NEUROVA_SITE/heatmap.js` (legacy aggregator) + `NEUROVA_SITE/heatmap-overlay.js` (overlay UI, export, debug tools).

## Key Runtime Entry Points
- `NEUROVA_SITE/paketler.html`: TR packages page; uses `data-tier` on cards; loads pricing + WA + heatmap stack.
- `NEUROVA_SITE/packages.html`: EN packages page; mirrors TR content/structure.
- `NEUROVA_SITE/products.html`: Products page; hero CTA split to WA (Value vs Entry) plus product cards with WA order CTA.
- `NEUROVA_SITE/assets/paketler.css`: shared layout + CTA styles + heatmap overlay UI styles.
- `NEUROVA_SITE/assets/js/wa-click-tracker.js`: v2 WA click tracking (source/tier/day/lang).
- `NEUROVA_SITE/heatmap-overlay.js`: overlay UI + export + cleanup tooling.
- `NEUROVA_SITE/heatmap.js`: legacy `NV_HEAT` aggregator for `nv_wa_click_` keys.
- `NEUROVA_SITE/wa-linker.js`: WA prefill messages and booking flow.
- `NEUROVA_SITE/assets/nav.js`: global nav active state, mobile menu, header padding.

## File Review (Critical)
| File | Role | Critical functions | Risk |
| --- | --- | --- | --- |
| `NEUROVA_SITE/assets/js/wa-click-tracker.js` | v2 WA click tracking | `detectSource`, `detectTier`, `nvDetectPageMixMode`, `nvBuildClickKey` | `data-source` is not used; EN page uses `data-page="paketler"` so sources can collapse. |
| `NEUROVA_SITE/heatmap-overlay.js` | Heatmap UI + export | `nvParseWaClickKey`, `buildExportText`, `nvCleanupMergeWaClicks` | Uses `NV_HEAT.readAll` first; can miss v2-only keys when legacy data exists. |
| `NEUROVA_SITE/heatmap.js` | Legacy aggregator | `NV_HEAT.readAll`, `normalizeSource/tier` | Writes/reads legacy `nv_wa_click_` keys; can split counts vs v2. |
| `NEUROVA_SITE/wa-linker.js` | WA prefill + booking flow | `buildMessageParts`, `wire` | Direct WA links bypass this flow and skip tagging. |
| `NEUROVA_SITE/wa-config.js` | WA number + brand defaults | `window.NV_WA` | WA number must match hardcoded hero links. |
| `NEUROVA_SITE/paketler.html` | TR packages page | `packages-intro-copy` block; `data-tier` cards | Hero CTA still uses `data-wa`; tracking depends on `data-tier`. |
| `NEUROVA_SITE/packages.html` | EN packages page | EN copy + `data-tier` cards | `data-page="paketler"` can merge sources with TR. |
| `NEUROVA_SITE/products.html` | Products page | dual WA hero CTAs | Direct WA links bypass `wa-linker` context tags. |
| `NEUROVA_SITE/assets/paketler.css` | Shared layout | `.packages-intro-copy`, `.nv-cta-row`, heatmap styles | CTA styles are shared across pages; avoid clashes with other components. |
| `NEUROVA_SITE/assets/nav.js` | Global nav | active tab, mobile drawer | Header padding JS can affect layout on all pages. |

## WhatsApp CTA & Tracking
- **Key format (v2):** `nv_wa_click__<source>__<tier>__<yyyy-mm-dd>__<lang>` written in `NEUROVA_SITE/assets/js/wa-click-tracker.js`.
- **Source derivation:** `body[data-page]` if present, else file name from URL. `data-source` attributes are currently unused by the tracker.
- **Tier derivation:** closest `[data-tier]` (cards and hero CTA links). If missing, tier becomes `na` and is normalized to `base` internally.
- **Lang derivation:** URL (`lang=` or path), DOM `<html lang>`, or mixed-mode detection; normalized to `TR`, `EN`, or `TR+EN`.
- **Day derivation:** client date at click time (YYYY-MM-DD).
- **Debug keys:** `nv_heat_last_key`, `nv_heat_last_source`, `nv_heat_last_tier`, `nv_heat_last_day`, `nv_mix_last_mode`, `nv_mix_last_reason`.
- **Legacy keys:** `nv_wa_click_<source>_<tier>` and `nv_heat_counts` map from `NEUROVA_SITE/heatmap.js`.

## Gate / Audit / Heatmap
- Overlay UI in `NEUROVA_SITE/heatmap-overlay.js` renders KPIs, source/tier matrix, and page mix summary.
- Export format: `Page mix (known-only): TR / EN / TR+EN = ... | unknown: ... | total: ...` followed by CSV (`source,tier,count`).
- Debug mode: `?debug=1` or `localStorage.nv_debug=1` exposes Backup + Cleanup (dry-run/apply) actions.
- Cleanup/merge utility: `nvCleanupMergeWaClicks` merges legacy keys into v2 format with `lang=UNKNOWN`, optional delete of legacy keys.
- Backup utility: JSON dump of `nv_wa_click_*` keys for offline review.

## Copy changes
- **Paketler/Packages hero guidance block:** `packages-intro-copy` added under hero to frame Entry/Value/Premium selection.
- **Value micro-optimization:**
  - TR: "Value en cok tercih edilen; cogu misafir icin ideal sure/etki dengesi sunar."
  - EN: "Value is most chosen; it gives most guests the ideal time/impact balance."
- **Products hero CTA split:** dual WA links with `data-tier="value"` and `data-tier="entry"` for intent tracking.

## Post-release measurement plan
- **Do not change copy or CTA placement for 24-48h** to isolate the effect.
- Track in heatmap overlay:
  - Products -> Value clicks vs Entry clicks.
  - Paketler/Packages tier distribution shift.
  - Page mix (known-only vs unknown) to validate language detection.
- If Value rises and Entry stays stable -> keep copy; consider Premium micro-polish.
- If Value flat -> adjust WA conversation flow (not copy) before further CTA tweaks.

## Risks & Tech Debt
- **Source collision:** `packages.html` uses `data-page="paketler"`, collapsing EN source into TR. Fix by setting `data-page="packages"` on EN page.
- **Tracker ignores `data-source`:** Products hero CTA uses `data-source` but tracker only uses `data-page`; cannot differentiate CTA origins beyond tier.
- **Mixed v1/v2 counters:** overlay prefers `NV_HEAT.readAll`; can obscure v2-only keys when legacy data exists.
- **Normalization drift:** `heatmap.js` and v2 tracker normalize differently (diacritics/casing/hyphens), causing split counts.
- **Direct WA links bypass `wa-linker`:** hero CTAs use fixed WA text and skip automatic pack/tier tagging in message body.
- **Signals-top-files output:** `_report/signals-top-files.txt` is not actionable (Windows path parsing issue); tooling cleanup needed.

## Ready-to-ship Checklist
- [ ] Confirm WA number in `NEUROVA_SITE/wa-config.js` matches hero CTA `wa.me` links in `NEUROVA_SITE/products.html`.
- [ ] Verify `data-tier` exists on cards and hero CTAs for tracking.
- [ ] Validate heatmap overlay export and page mix line after a test click.
- [ ] Ensure `<html lang>` is set correctly on TR/EN pages.
- [ ] Check nav slot loads (`nav.html`) and header padding behaves across pages.

## Roadmap (0-2 days / 1-2 weeks / 1 month)
- **0-2 days:** Collect heatmap export after 24-48h; run cleanup dry-run if legacy keys dominate; keep copy frozen.
- **1-2 weeks:** Align sources (EN page `data-page`), add tracker support for `data-source`, and standardize tier normalization across v1/v2.
- **1 month:** Retire legacy `nv_wa_click_` counters, consolidate to v2 keys, and add server-side analytics for WA clicks.

## Next 3 commits
1) **fix: honor data-source in wa-click-tracker**
   - Prefer `data-source` on CTA elements before `body[data-page]`; enables intent-level attribution without extra pages.
2) **fix: split EN source for packages page**
   - Set `data-page="packages"` on `NEUROVA_SITE/packages.html` and update alias maps for clean TR/EN separation.
3) **refactor: align heatmap overlay to v2 keys first**
   - Update `getCells()` to prefer v2 keys and only fall back to `NV_HEAT` when v2 is empty; reduces split counts.
