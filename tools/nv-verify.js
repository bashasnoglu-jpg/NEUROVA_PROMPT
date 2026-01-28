#!/usr/bin/env node
/**
 * SANTIS nv:verify v1.1
 * - scans packs/*.js
 * - detects duplicate ids, missing heuristic fields (role/category/safeNote/TR/EN)
 * - cross-checks NV_PACK_LIST style references in prompt-library.html (and fallbacks)
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PACKS_DIR_CANDIDATES = [
  path.join(ROOT, "SANTIS_PROMPT", "packs"),
  path.join(ROOT, "packs"),
];
const ENTRY_CANDIDATES = [
  path.join(ROOT, "SANTIS_PROMPT", "prompt-library.html"),
  path.join(ROOT, "prompt-library.html"),
  path.join(ROOT, "index.html"),
  path.join(ROOT, "public", "prompt-library.html"),
  path.join(ROOT, "public", "index.html"),
];

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function resolvePacksDir() {
  for (const d of PACKS_DIR_CANDIDATES) if (exists(d)) return d;
  return null;
}

function listPackFiles(packsDir) {
  if (!packsDir) return [];
  return fs
    .readdirSync(packsDir)
    .filter((f) => f.toLowerCase().endsWith(".js"))
    .filter((f) => f.toLowerCase() !== "pack-index.js") // auto-generated, skip
    .map((f) => path.join(packsDir, f));
}

function findEntryHtml() {
  for (const p of ENTRY_CANDIDATES) if (exists(p)) return p;
  return null;
}

function parseNVPackListFromHtml(htmlText) {
  // tolerant regex: captures "./packs/pack.xxx.js" occurrences
  const re = /["'](\.?\/?packs\/[^"']+\.js)["']/g;
  const out = new Set();
  let m;
  while ((m = re.exec(htmlText))) out.add(m[1]);
  return [...out];
}

function scanPackText(packPath, text) {
  const issues = [];

  // ids: id: "REC_01" or id:'REC_01'
  const idRe = /\bid\s*:\s*["']([^"']+)["']/g;
  const ids = [];
  let m;
  while ((m = idRe.exec(text))) ids.push(m[1]);

  // heuristic presence checks
  const hasRole = /\brole\s*:\s*["'][^"']+["']/.test(text);
  const hasCategory = /\bcategory\s*:\s*["'][^"']+["']/.test(text);
  const hasSafeNote = /\bsafeNote\s*:\s*["'][^"']+["']/.test(text);
  const hasTR = /\btr\s*:\s*["']/.test(text) || /\bTR\s*:\s*["']/.test(text);
  const hasEN = /\ben\s*:\s*["']/.test(text) || /\bEN\s*:\s*["']/.test(text);

  if (ids.length === 0) issues.push("No prompt ids found (expected `id: \"...\"`).");
  if (!hasRole) issues.push("No `role: \"...\"` found (heuristic).");
  if (!hasCategory) issues.push("No `category: \"...\"` found (heuristic).");
  if (!hasSafeNote) issues.push("No `safeNote: \"...\"` found (heuristic).");
  if (!hasTR) issues.push("No TR content key found (`tr:` or `TR:` heuristic).");
  if (!hasEN) issues.push("No EN content key found (`en:` or `EN:` heuristic).");

  return { ids, issues };
}

function main() {
  const problems = [];
  const packsDir = resolvePacksDir();
  const packFiles = listPackFiles(packsDir);

  if (packFiles.length === 0) {
    problems.push({ where: "packs/", issue: "No pack files found under SANTIS_PROMPT/packs or /packs. Expected pack.*.js" });
  }

  // Scan packs
  const globalIds = new Map(); // id -> first file
  let totalIds = 0;

  for (const p of packFiles) {
    const rel = path.relative(ROOT, p);
    const text = read(p);
    const { ids, issues } = scanPackText(p, text);

    totalIds += ids.length;

    // duplicate id check
    for (const id of ids) {
      if (globalIds.has(id)) {
        problems.push({ where: rel, issue: `Duplicate id: ${id} (already in ${globalIds.get(id)})` });
      } else {
        globalIds.set(id, rel);
      }
    }

    // per-file issues
    for (const iss of issues) problems.push({ where: rel, issue: iss });
  }

  // Entry HTML pack list check (if present)
  const entry = findEntryHtml();
  if (entry) {
    const html = read(entry);
    const refs = parseNVPackListFromHtml(html);
    for (const r of refs) {
      const abs = path.resolve(path.dirname(entry), r);
      if (!exists(abs)) problems.push({ where: path.relative(ROOT, entry), issue: `Pack reference missing: ${r}` });
    }
  } else {
    problems.push({ where: "root", issue: "No entry HTML found (prompt-library.html/index.html). Skipping pack-list cross-check." });
  }

  // Report
  const summary = {
    ok: problems.length === 0,
    totalPackFiles: packFiles.length,
    totalIds,
    entryHtml: entry ? path.relative(ROOT, entry) : null,
    problems,
  };

  const outDir = path.join(ROOT, "_audit");
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch {}
  const outFile = path.join(outDir, "NV_VERIFY_PROOF.json");
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2), "utf8");

  if (!summary.ok) {
    console.error("❌ nv:verify FAILED");
    console.error(`Proof: ${path.relative(ROOT, outFile)}`);
    summary.problems.slice(0, 50).forEach((p, i) => {
      console.error(`${i + 1}. [${p.where}] ${p.issue}`);
    });
    if (summary.problems.length > 50) console.error(`... +${summary.problems.length - 50} more`);
    process.exit(1);
  }

  console.log("✅ nv:verify PASSED");
  console.log(`Proof: ${path.relative(ROOT, outFile)}`);
}

main();
