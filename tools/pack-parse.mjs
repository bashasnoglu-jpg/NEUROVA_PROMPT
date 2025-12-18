import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export const SAFE_NOTE_REQUIRED_CATS = [
  "hamam",
  "kids & family",
  "kids",
  "family",
  "signature & couples",
  "signature",
  "couples",
  "face",
  "face - sothys",
  "face sothys",
  "sothys",
];

export function normCategory(value) {
  return String(value ?? "").toLowerCase().trim();
}

export function requiresSafeNote(category) {
  const normalized = normCategory(category);
  return SAFE_NOTE_REQUIRED_CATS.some((needle) => normalized.includes(needle));
}

export function canonicalizePackKey(raw) {
  return String(raw ?? "")
    .replace(/\\/g, "/")
    .replace(/^packs\//i, "")
    .replace(/\.js$/i, "")
    .replace(/^pack\./i, "")
    .trim()
    .toLowerCase();
}

const ARRAY_LITERAL_RE =
  /NV_PROMPT_PACKS\s*\[\s*(?:["'`])[^"'`]+(?:["'`])\s*\]\s*=\s*(\[[\s\S]*?\])\s*;/;

const PACK_KEY_RE =
  /NV_PROMPT_PACKS\s*\[\s*(?:["'`])([^"'`]+)(?:["'`])\s*\]/;

export function extractPackArrayLiteral(src) {
  const match = src.match(ARRAY_LITERAL_RE);
  return match ? match[1] : null;
}

export function extractPackKey(src) {
  const match = src.match(PACK_KEY_RE);
  return match && match[1] ? match[1].trim() : null;
}

function stripComments(str) {
  return str.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");
}

export function bestEffortParseArrayLiteral(arrLiteral) {
  try {
    let normalized = String(arrLiteral);
    normalized = stripComments(normalized);
    normalized = normalized.replace(/'/g, '"');
    normalized = normalized.replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');
    normalized = normalized.replace(/,\s*([}\]])/g, "$1");
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function parsePackVM(src) {
  try {
    const context = {
      window: { NV_PROMPT_PACKS: {} },
      console: { log() {}, warn() {}, error() {} },
    };
    context.globalThis = context.window;
    const script = new vm.Script(src, { filename: "pack.js" });
    script.runInNewContext(context, { timeout: 500 });
    const packs = context.window.NV_PROMPT_PACKS;
    if (!packs || typeof packs !== "object") return null;
    const arrays = Object.values(packs).filter(Array.isArray);
    if (!arrays.length) return null;
    return arrays.flat();
  } catch {
    return null;
  }
}

export function parsePackEntriesFromSource(src) {
  const arrLiteral = extractPackArrayLiteral(src);
  let parsed = arrLiteral ? bestEffortParseArrayLiteral(arrLiteral) : null;
  if (!parsed) parsed = parsePackVM(src);
  return Array.isArray(parsed) ? parsed : null;
}

export function readManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return null;
  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function manifestEntries(manifestData) {
  if (Array.isArray(manifestData)) return manifestData;
  if (manifestData && typeof manifestData === "object") {
    if (Array.isArray(manifestData.packs)) return manifestData.packs;
    if (Array.isArray(manifestData.files)) return manifestData.files;
  }
  return [];
}

export function resolvePackSources(entries = [], packsDir) {
  const seen = new Set();
  const normalized = [];
  for (const entry of entries) {
    const raw = String(entry ?? "").trim();
    if (!raw) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);
    const cleaned = raw.replace(/^\.?\//, "");
    const relative = cleaned.startsWith("packs/") ? cleaned.slice(6) : cleaned;
    const full = path.isAbsolute(cleaned) ? cleaned : path.join(packsDir, relative);
    normalized.push({ entry: raw, relative, full });
  }
  return normalized;
}

export function writeJsonAtomic(filePath, obj) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const payload = JSON.stringify(obj, null, 2) + "\n";
  fs.writeFileSync(tmp, payload, "utf8");
  fs.renameSync(tmp, filePath);
}

