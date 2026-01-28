# SANTIS_PROMPT (SANTIS İstemleri)

README now documents the preview/checklist flow, root `package.json` declares the hygiene scripts, and `tools/nv-asset-hygiene.mjs` runs them so “missing script” failures should go away (README.md, package.json, tools/nv-asset-hygiene.mjs). Scope: docs + CI scripting only — no runtime behavior changes.

## PR comment / follow-up checklist

- [ ] Local sanity:
  - `npm install`
  - `npm run dev` → confirm `http://localhost:3000/prompt-library.html`
  - `npm run nv:verify`
  - `npm run nv:selftest`
  - (optional) `npm run quality:gate`

- [ ] CI:
  - **Mojibake Guard** stays green (`fix_tr_chars.py` runs and uploads the JSON report)
  - Asset hygiene runs without “missing script” errors

- [ ] Post-push:
  - README renders correctly on the repo landing page
  - CI jobs pass
  - If Pages is enabled, `prompt-library.html` loads on the Pages URL

If any step fails, paste the failing log excerpt and I’ll prep the exact patch.
