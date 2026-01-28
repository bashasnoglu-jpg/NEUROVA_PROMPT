#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  manifestEntries,
  parsePackEntriesFromSource,
  resolvePackSources,
  requiresSafeNote,
  writeJsonAtomic,
} from "./pack-parse.mjs";

const ROOT = process.cwd();
const PACKS_DIR = path.join(ROOT, "packs");
const MANIFEST_PATH = path.join(PACKS_DIR, "manifest.json");
const LONG_PROMPT_THRESHOLD = Number(process.env.NV_QUALITY_MAX_PROMPT_LEN || 420);
const MAX_TOTAL_PROMPTS = Number(process.env.NV_BUDGET_MAX_TOTAL_PROMPTS || 2000);
const LINK_RE = /(https?:\/\/|www\.)/i;
const REPORT_DIR = path.join(ROOT, "exports");
const REPORT_JSON = path.join(REPORT_DIR, "quality-report.json");
const REPORT_MD = path.join(REPORT_DIR, "quality-report.md");

const IGNORE_PATH_REGEX = /\\archive\\|\\old\\b|_old\\b/i;

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

function buildQualityMd(summary) {
  const lines = [
    "# SANTIS Quality Gate",
    `Generated: ${summary.ts}`,
    `Status: ${summary.status}`,
    `Packs: ${summary.packs.join(", ")}`,
    `Prompts: ${summary.totalPrompts}`,
    summary.metrics
      ? `Metrics: ${summary.metrics.version} packs=${summary.metrics.packCount} totalPrompts=${summary.metrics.totalPrompts}`
      : "Metrics: unavailable",
    `SafeNote coverage: ${summary.safeNoteCoverage}%`,
    `Localization health: ${summary.invalidTurkish.length ? "issues" : "clean"}`,
    "",
    "## Errors",
    summary.errors.length ? summary.errors.map((e) => `- ${e}`).join("\n") : "- none",
    "",
    "## Warnings",
    summary.warnings.length ? summary.warnings.map((w) => `- ${w}`).join("\n") : "- none",
  ];
  if (summary.invalidTurkish.length) {
    lines.push("");
    lines.push("## Localization concerns");
    summary.invalidTurkish.forEach((item) => lines.push(`- ${item}`));
  }
  return lines.join("\n");
}

function die(msg) {
  console.error("[NV_QUALITY][ERROR]", msg);
  process.exit(1);
}

function warn(msg) {
  console.warn("[NV_QUALITY][WARN]", msg);
}

function info(msg) {
  console.log("[NV_QUALITY]", msg);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function safeNoteValid(sn) {
  if (typeof sn === "string") return isNonEmptyString(sn);
  if (sn && typeof sn === "object") {
    return isNonEmptyString(sn.tr) || isNonEmptyString(sn.en) || isNonEmptyString(sn.note);
  }
  return false;
}

function detectUrl(text) {
  return typeof text === "string" && LINK_RE.test(text);
}

function hasInvalidTurkish(text) {
  return typeof text === "string" && /�/.test(text);
}

function runMegaMetrics() {
  const script = path.join(ROOT, "tools", "mega-metrics.mjs");
  if (!fs.existsSync(script)) {
    return { success: false, error: "mega-metrics script missing", raw: "" };
  }

  try {
    const raw = execFileSync(process.execPath, [script], { cwd: ROOT, encoding: "utf8" });
    const trimmed = raw.trim();
    if (!trimmed) {
      return { success: false, error: "mega-metrics produced no output", raw };
    }
    return { success: true, metrics: JSON.parse(trimmed) };
  } catch (err) {
    const raw = err.stdout ?? err.stderr ?? "";
    return { success: false, error: err.message, raw: String(raw).trim() };
  }
}

function readManifestEntries() {
  if (!fs.existsSync(MANIFEST_PATH)) die("Manifest not found.");
  const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    die(`Manifest parse failed: ${err.message}`);
  }
  const entries = manifestEntries(manifest);
  if (!entries.length) die("Manifest is empty.");
  return entries;
}

function loadPackSources() {
  const entries = readManifestEntries();
  const retained = entries.filter((entry) => !IGNORE_PATH_REGEX.test(String(entry ?? "")));
  if (retained.length !== entries.length) {
    info(`quality-gate: ignoring ${entries.length - retained.length} entries because they live under archive/old`);
  }
  return resolvePackSources(retained, PACKS_DIR);
}

function run() {
  const metricsResult = runMegaMetrics();
  const packs = loadPackSources();
  ensureReportDir();
  const errors = [];
  const warnings = [];
  const idMap = new Map();
  let totalPrompts = 0;
  let promptCount = 0;
  let safeNotesFound = 0;
  const invalidTurkish = [];

  for (const pack of packs) {
    if (!fs.existsSync(pack.full)) {
      errors.push(`Missing pack file: ${pack.entry}`);
      continue;
    }

    const src = fs.readFileSync(pack.full, "utf8");
    const parsed = parsePackEntriesFromSource(src);
    if (!parsed) {
      warnings.push(`Could not parse pack: ${pack.entry}`);
      continue;
    }

    parsed.forEach((prompt, index) => {
      const context = `${pack.entry}#${index}`;
      const id = String(prompt.id ?? "").trim();
      const title = String(prompt.title ?? "").trim();
      const role = String(prompt.role ?? "").trim();
      const category = String(prompt.category ?? "").trim();
      const lang = prompt.lang && typeof prompt.lang === "object" ? prompt.lang : {};
      const tr = String(lang.tr ?? "").trim();
      const en = String(lang.en ?? "").trim();
      const promptText = String(prompt.prompt ?? en ?? "").trim();

      totalPrompts += 1;
      promptCount += 1;

      if (!id) {
        errors.push(`${context}: id missing`);
      } else if (idMap.has(id)) {
        errors.push(`${context}: duplicate id (${idMap.get(id)} and ${context})`);
      } else {
        idMap.set(id, context);
      }

      ["category", "role", "title"].forEach((field) => {
        if (!prompt[field] || !String(prompt[field]).trim()) {
          errors.push(`${context}: ${field} is empty`);
        }
      });

      if (!tr || !en) {
        errors.push(`${context}: lang.tr/lang.en required`);
      }

      if (promptText.length > LONG_PROMPT_THRESHOLD) {
        warnings.push(`${context}: prompt length ${promptText.length} exceeds ${LONG_PROMPT_THRESHOLD}`);
      }

      if (detectUrl(promptText) || detectUrl(tr) || detectUrl(en)) {
        warnings.push(`${context}: contains URL-like text`);
      }

      const safeNote = prompt.safeNote ?? "";
      if (!safeNoteValid(safeNote)) {
        errors.push(`${context}: safeNote missing or invalid`);
      } else {
        safeNotesFound += 1;
      }

      if (hasInvalidTurkish(tr)) {
        invalidTurkish.push(`${context}: tr text contains replacement characters`);
      }
    });
  }

  if (!metricsResult.success) {
    errors.push(`mega-metrics failed: ${metricsResult.error}`);
    if (metricsResult.raw) {
      warnings.push(`mega-metrics raw output: ${metricsResult.raw}`);
    }
  } else {
    if (Array.isArray(metricsResult.metrics.errors) && metricsResult.metrics.errors.length) {
      metricsResult.metrics.errors.forEach((err) =>
        errors.push(`mega-metrics error: ${err.pack || "pack?"} ${err.error || err}`),
      );
    }
    if (Array.isArray(metricsResult.metrics.duplicateIds) && metricsResult.metrics.duplicateIds.length) {
      metricsResult.metrics.duplicateIds.forEach((dup) =>
        errors.push(`duplicate id "${dup.id}" found in ${dup.packs.join(", ")}`),
      );
    }
    if (typeof metricsResult.metrics.totalPrompts === "number") {
      if (metricsResult.metrics.totalPrompts > MAX_TOTAL_PROMPTS) {
        budgetPromptHeavy.push({
          pack: "manifest-wide",
          prompts: metricsResult.metrics.totalPrompts,
        });
        budgetReportLine(`total prompts (${metricsResult.metrics.totalPrompts}) exceeds ${MAX_TOTAL_PROMPTS}`);
        budgetFailIfNeeded("total prompts budget exceeded");
      }
    }
  }

  info(`packs=${packs.length} prompts=${totalPrompts}`);
  const summary = {
    ts: new Date().toISOString(),
    packs: packs.map((p) => p.entry),
    totalPrompts,
    errors,
    warnings,
    status: errors.length ? "FAIL" : warnings.length ? "WARN" : "PASS",
    metrics: metricsResult.success ? metricsResult.metrics : null,
    safeNoteCoverage: promptCount ? Math.round((safeNotesFound / promptCount) * 100) : 0,
    invalidTurkish,
  };
  writeJsonAtomic(REPORT_JSON, summary);
  fs.writeFileSync(REPORT_MD, buildQualityMd(summary), "utf8");

  if (errors.length) {
    console.error("[NV_QUALITY] FAIL");
    errors.forEach((msg) => console.error("  -", msg));
    process.exit(1);
  }

  if (warnings.length) {
    console.warn("[NV_QUALITY] WARN");
    warnings.forEach((msg) => console.warn("  -", msg));
    process.exit(0);
  }

  info("PASS");
  process.exit(0);
}

run();
