#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  extractPackKey,
  manifestEntries,
  parsePackEntriesFromSource,
  requiresSafeNote,
  writeJsonAtomic,
} from "./pack-parse.mjs";

const ROOT = process.cwd();
const PACKS_DIR = path.join(ROOT, "packs");
const MANIFEST = path.join(PACKS_DIR, "manifest.json");
const IGNORE_PATH_REGEX = /\\archive\\|\\old\\b|_old\\b/i;
function die(msg) {
  console.error("[NV_GUARD][ERROR]", msg);
  process.exit(1);
}

function warn(msg) {
  console.warn("[NV_GUARD][WARN]", msg);
}

function ok(msg) {
  console.log("[NV_GUARD][PASS]", msg);
}

// ---- v1.3: CI Budget Gate (static) ----
const BUDGET_MODE = (process.env.NV_BUDGET_MODE || "warn").toLowerCase(); // "warn" | "fail"
const MAX_PACK_PROMPTS = Number(process.env.NV_BUDGET_MAX_PACK_PROMPTS || 200);
const MAX_TOTAL_PROMPTS = Number(process.env.NV_BUDGET_MAX_TOTAL_PROMPTS || 2000);
const MAX_PACK_BYTES = Number(process.env.NV_BUDGET_MAX_PACK_BYTES || 200_000);
const REQUIRE_PARSE_COVERAGE = String(process.env.NV_BUDGET_REQUIRE_PARSE_COVERAGE || "0") === "1";

let budgetTotalPrompts = 0;
let budgetParsedPacks = 0;
let budgetTotalPacks = 0;

const budgetBigPacks = [];
const budgetPromptHeavy = [];
const budgetParseMiss = [];

function budgetReportLine(msg) {
  if (BUDGET_MODE === "fail") console.error(`[NV_BUDGET] FAIL: ${msg}`);
  else console.warn(`[NV_BUDGET] WARN: ${msg}`);
}

function budgetFailIfNeeded(reason) {
  if (BUDGET_MODE === "fail") die(`BUDGET FAIL: ${reason}`);
}

// ---- v1.4: Metrics Exporter (static, opt-in) ----
const METRICS_EXPORT = String(process.env.NV_METRICS_EXPORT || "0") === "1";
const METRICS_EXPORT_PATH =
  process.env.NV_METRICS_EXPORT_PATH || path.join("packs", "metrics.json");
const METRICS_EXPORT_MODE = (process.env.NV_METRICS_EXPORT_MODE || "write").toLowerCase(); // "write" | "check"

const exportPacks = {}; // pack stats for metrics export

// ---- v1.1: schema/id/safeNote guards ----
function isNonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function isAsciiSlug(s) {
  return typeof s === "string" && /^[a-z0-9-]+$/.test(s.trim());
}

if (!fs.existsSync(MANIFEST)) {
  die(`manifest.json not found: ${MANIFEST}`);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
} catch (e) {
  die(`manifest.json could not be parsed: ${e.message}`);
}

const files = manifestEntries(manifest);
const includedFiles = files.filter((entry) => !IGNORE_PATH_REGEX.test(String(entry ?? "")));
const ignoredCount = files.length - includedFiles.length;
if (ignoredCount > 0) {
  warn(`Ignoring ${ignoredCount} manifest entries that land under archive/old paths.`);
}

if (!files || files.length === 0) die("manifest does not contain a recognisable pack list.");

budgetTotalPacks = includedFiles.length;

ok(`Manifest read successfully. Pack count: ${files.length}`);
let missing = 0;
let suspicious = 0;
const keys = new Map();

for (const entry of includedFiles) {
  const file = String(entry).trim();
  if (!file) continue;

  const full = path.join(PACKS_DIR, file);
  if (!fs.existsSync(full)) {
    console.error(`[NV_GUARD][ERROR] Missing pack file: packs/${file}`);
    missing++;
    continue;
  }

  const src = fs.readFileSync(full, "utf8");
  // v1.3 budget: file size
  const bytes = fs.statSync(full).size;

  const packKey = `packs/${file}`;
  exportPacks[packKey] = exportPacks[packKey] || {
    bytes: 0,
    prompts: 0,
    ms: 0,
    errors: 0,
    parseOk: false,
  };
  exportPacks[packKey].bytes = bytes;

  if (bytes > MAX_PACK_BYTES) {
    budgetBigPacks.push({ pack: packKey, bytes });
  }

  const hasAnySignature =
    /NV_PROMPT_PACKS/.test(src) ||
    /NV_PROMPTS/.test(src) ||
    /nvOnPromptsReady/.test(src);

  if (!hasAnySignature) {
    console.error(`[NV_GUARD][WARN] Suspicious pack content (missing expected signature): packs/${file}`);
    suspicious++;
  }

  const packKeyName = extractPackKey(src);
  if (packKeyName) {
    if (keys.has(packKeyName)) {
      console.error(
        `[NV_GUARD][ERROR] Pack KEY collision: "${packKeyName}" is defined both in ${keys.get(packKeyName)} and packs/${file}`,
      );
      missing++;
    } else {
      keys.set(packKeyName, `packs/${file}`);
    }
  }

  // ---- v1.1: duplicate id + safeNote enforcement (best effort) ----
  const arr = parsePackEntriesFromSource(src);

  if (!arr) {
    budgetParseMiss.push(packKey);
    exportPacks[packKey].parseOk = false;
    exportPacks[packKey].prompts = 0;
    warn(`Pack parse edilemedi (v1.1 kontrolleri sinirli): packs/${file}`);
  } else {
    budgetParsedPacks++;
    const promptsInPack = Array.isArray(arr) ? arr.length : 0;
    budgetTotalPrompts += promptsInPack;

    exportPacks[packKey].parseOk = true;
    exportPacks[packKey].prompts = promptsInPack;

    if (promptsInPack > MAX_PACK_PROMPTS) {
      budgetPromptHeavy.push({ pack: packKey, prompts: promptsInPack });
    }

    for (let i = 0; i < arr.length; i++) {
      const p = arr[i];
      if (!p || typeof p !== "object") continue;

      const id = String(p.id ?? "").trim();
      if (id) {
        if (!globalThis.__NV_IDS__) globalThis.__NV_IDS__ = new Map();
        const seen = globalThis.__NV_IDS__.get(id);
        const loc = `${packKey}#${i}`;

        if (seen) {
          console.error(`Duplicate prompt id: "${id}" (${seen} AND ${loc})`);
          missing++;
          exportPacks[packKey].errors = (exportPacks[packKey].errors || 0) + 1;
        } else {
          globalThis.__NV_IDS__.set(id, loc);
        }
      } else {
        warn(`id eksik (oneri): ${packKey}#${i}`);
      }

      const lang = p.lang && typeof p.lang === "object" ? p.lang : {};
      const hasTr = isNonEmptyString(lang.tr);
      const hasEn = isNonEmptyString(lang.en);
      if (!hasTr || !hasEn) {
        console.error(`lang.tr/lang.en eksik veya bos: ${packKey}#${i}`);
        missing++;
        exportPacks[packKey].errors = (exportPacks[packKey].errors || 0) + 1;
      }

      const tags = Array.isArray(p.tags) ? p.tags : [];
      tags.forEach((t) => {
        if (!isAsciiSlug(String(t || ""))) {
          warn(`tag ASCII/slug degil (oneri): ${packKey}#${i} -> "${t}"`);
        }
      });

      const cat = p.category ?? "";
      const need = requiresSafeNote(cat);
      if (need) {
        const sn = p.safeNote;
        const okSafe =
          isNonEmptyString(sn) ||
          (sn &&
            typeof sn === "object" &&
            (isNonEmptyString(sn.tr) || isNonEmptyString(sn.en) || isNonEmptyString(sn.note)));

        if (!okSafe) {
          console.error(`safeNote zorunlu ama eksik/bos: ${packKey}#${i} (category="${p.category}")`);
          missing++;
          exportPacks[packKey].errors = (exportPacks[packKey].errors || 0) + 1;
        }
      }
    }
  }
}

// ---- v1.3: budget evaluation ----
const coverage = budgetTotalPacks ? Math.round((budgetParsedPacks / budgetTotalPacks) * 100) : 0;

console.log(
  `NV_BUDGET: coverage=${budgetParsedPacks}/${budgetTotalPacks} (${coverage}%) totalPrompts=${budgetTotalPrompts}`,
);

if (REQUIRE_PARSE_COVERAGE && budgetParsedPacks !== budgetTotalPacks) {
  budgetReportLine(
    `Parse coverage dÃ¼ÅŸÃ¼k: ${budgetParsedPacks}/${budgetTotalPacks}. Missed: ${budgetParseMiss
.slice(0, 10).join(", ")}${budgetParseMiss.length > 10 ? " ..." : ""}`,
  );
  budgetFailIfNeeded("Parse coverage 100% deÄŸil (NV_BUDGET_REQUIRE_PARSE_COVERAGE=1).");
} else if (budgetParseMiss.length) {
  budgetReportLine(
    `Parse edilemeyen pack var (prompt budget kÃ¶r kalÄ±r): ${budgetParseMiss.slice(0, 10).join(", ")}${budgetParseMiss.length > 10 ? " ..." : ""}`,
  );
}

if (budgetBigPacks.length) {
  const top = [...budgetBigPacks].sort((a, b) => b.bytes - a.bytes).slice(0, 5);
  budgetReportLine(
    `BÃ¼yÃ¼k pack dosyalarÄ± (>${MAX_PACK_BYTES} bytes). Top 5: ${top.map((x) => `${x.pack}=${x.bytes}`).join(" | ")}`,
  );
  budgetFailIfNeeded(`Pack bytes budget aÅŸÄ±ldÄ± (max ${MAX_PACK_BYTES}).`);
}

if (budgetPromptHeavy.length) {
  const top = [...budgetPromptHeavy].sort((a, b) => b.prompts - a.prompts).slice(0, 5);
  budgetReportLine(
    `Prompt-heavy packâ€™ler (>${MAX_PACK_PROMPTS} prompts). Top 5: ${top.map((x) => `${x.pack}=${x.prompts}`).join(" | ")}`,
  );
  budgetFailIfNeeded(`Pack prompt budget aÅŸÄ±ldÄ± (max ${MAX_PACK_PROMPTS}).`);
}

if (budgetTotalPrompts > MAX_TOTAL_PROMPTS) {
  budgetReportLine(`Toplam prompt budget aÅŸÄ±ldÄ±: ${budgetTotalPrompts} > ${MAX_TOTAL_PROMPTS}`);
  budgetFailIfNeeded(`Total prompts budget aÅŸÄ±ldÄ± (max ${MAX_TOTAL_PROMPTS}).`);
}

// ---- v1.4: export metrics.json (opt-in) ----
(function exportMetricsIfEnabled() {
  if (!METRICS_EXPORT) return;

  const out = {
    generatedAt: new Date().toISOString(),
    source: "nv-guard-packs",
    meta: {
      sha: process.env.NV_METRICS_META_SHA || "",
      ref: process.env.NV_METRICS_META_REF || "",
      refName: process.env.NV_METRICS_META_REF_NAME || "",
      runId: process.env.NV_METRICS_META_RUN_ID || "",
      runNumber: process.env.NV_METRICS_META_RUN_NUMBER || "",
      workflow: process.env.NV_METRICS_META_WORKFLOW || "",
      actor: process.env.NV_METRICS_META_ACTOR || "",
      repo: process.env.NV_METRICS_META_REPO || "",
    },
    root: process.cwd(),
    manifestPacks: budgetTotalPacks,
    parsedPacks: budgetParsedPacks,
    coverage,
    totals: {
      totalPrompts: budgetTotalPrompts,
      bigPacks: budgetBigPacks.length,
      promptHeavyPacks: budgetPromptHeavy.length,
      parseMiss: budgetParseMiss.length,
    },
    budgets: {
      mode: BUDGET_MODE,
      maxPackPrompts: MAX_PACK_PROMPTS,
      maxTotalPrompts: MAX_TOTAL_PROMPTS,
      maxPackBytes: MAX_PACK_BYTES,
      requireParseCoverage: REQUIRE_PARSE_COVERAGE,
    },
    packs: exportPacks,
  };

  const fullPath = path.isAbsolute(METRICS_EXPORT_PATH)
    ? METRICS_EXPORT_PATH
    : path.join(process.cwd(), METRICS_EXPORT_PATH);

  if (METRICS_EXPORT_MODE === "check") {
    if (!fs.existsSync(fullPath)) {
      budgetReportLine(`metrics.json yok (check mode): ${fullPath}`);
      budgetFailIfNeeded("metrics.json check mode: dosya bulunamadÄ±.");
      return;
    }
    console.log(`NV_METRICS: check OK (${fullPath})`);
    return;
  }

  writeJsonAtomic(fullPath, out);
  console.log(`[NV_METRICS] WROTE: ${fullPath}`);
})();

if (missing > 0) die(`Guard FAIL. Error count: ${missing}`);
if (suspicious > 0) warn(`Guard WARN. Suspicious pack count: ${suspicious}`);

ok("Guard PASS. Pack chain is clean for CI.");
