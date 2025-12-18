#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  manifestEntries,
  parsePackEntriesFromSource,
  resolvePackSources,
  writeJsonAtomic,
} from "./pack-parse.mjs";

const ROOT = process.cwd();
const PACKS_DIR = path.join(ROOT, "packs");
const MANIFEST_PATH = path.join(PACKS_DIR, "manifest.json");
const OUTPUT_DIR = path.join(ROOT, "exports");
const REFERENCE_FILE = path.join(ROOT, "assets", "NEUROVA_REFERANS.md");

function die(msg) {
  console.error("[NV_EXPORT][ERROR]", msg);
  process.exit(1);
}

function info(msg) {
  console.log("[NV_EXPORT]", msg);
}

function readManifestEntries() {
  if (!fs.existsSync(MANIFEST_PATH)) die("Manifest not found.");
  const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
  try {
    const manifest = JSON.parse(raw);
    const entries = manifestEntries(manifest);
    if (!entries.length) die("Manifest is empty.");
    return entries;
  } catch (err) {
    die(`Manifest parse failed: ${err.message}`);
  }
}

function loadPrompts(packs) {
  const collected = [];

  for (const pack of packs) {
    if (!fs.existsSync(pack.full)) {
      console.warn(`[NV_EXPORT] missing pack: ${pack.entry}`);
      continue;
    }

    const src = fs.readFileSync(pack.full, "utf8");
    const parsed = parsePackEntriesFromSource(src);
    if (!parsed) {
      console.warn(`[NV_EXPORT] failed to parse ${pack.entry}`);
      continue;
    }

    parsed.forEach((prompt) => {
      collected.push({
        ...prompt,
        __pack: pack.entry,
      });
    });
  }

  return collected;
}

function dedupeById(prompts) {
  const seen = new Map();
  const extras = [];

  prompts.forEach((prompt, index) => {
    const id = String(prompt.id ?? "").trim();
    if (id) {
      if (!seen.has(id)) {
        seen.set(id, prompt);
      }
    } else {
      extras.push({ ...prompt, id: `PROMPT_${index + 1}_NO_ID` });
    }
  });

  return [...seen.values(), ...extras];
}

function buildReferenceSnippet() {
  if (!fs.existsSync(REFERENCE_FILE)) return "";
  try {
    const raw = fs.readFileSync(REFERENCE_FILE, "utf-8").trim();
    const chunks = raw.split("\n\n");
    return chunks.slice(0, 2).join("\n\n").trim();
  } catch (_) {
    return "";
  }
}

function buildMarkdown(prompts) {
  const sections = prompts.map((item) => {
    const tags = Array.isArray(item.tags) ? item.tags.map((t) => `#${t}`).join(" ") : "";
    const safeNote = item.safeNote ? `**SafeNote:** ${item.safeNote}` : "";
    const pack = item.__pack || "unknown";
    const promptBody = item.prompt || item.lang?.en || "";
    const tr = item.lang?.tr || "";
    const en = item.lang?.en || "";
    return [
      `## ${item.title || "NEUROVA Prompt"}`,
      ``,
      item.id ? `**ID:** ${item.id}` : null,
      `**Pack:** ${pack}`,
      item.category ? `**Category:** ${item.category}` : null,
      item.role ? `**Role:** ${item.role}` : null,
      tags ? `**Tags:** ${tags}` : null,
      safeNote || null,
      `**Prompt:** ${promptBody}`,
      ``,
      `### TR`,
      "```text",
      tr,
      "```",
      ``,
      `### EN`,
      "```text",
      en,
      "```",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    "# NEUROVA Prompt Export",
    `Generated: ${new Date().toISOString()}`,
    `Reference snapshot:\n${buildReferenceSnippet()}`,
    "",
    sections.join("\n\n---\n\n"),
  ].join("\n");
}

function writeExports(prompts, packs) {
  const payload = {
    generatedAt: new Date().toISOString(),
    manifest: packs.map((p) => p.entry),
    total: prompts.length,
    prompts,
  };

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const jsonPath = path.join(OUTPUT_DIR, "neurova-prompts.json");
  writeJsonAtomic(jsonPath, payload);

  const mdPath = path.join(OUTPUT_DIR, "neurova-prompts.md");
  fs.writeFileSync(mdPath, buildMarkdown(prompts), "utf8");

  info(`Wrote ${jsonPath} (${prompts.length} prompts)`);
  info(`Wrote ${mdPath}`);
}

function run() {
  const entries = readManifestEntries();
  const packs = resolvePackSources(entries, PACKS_DIR);
  const prompts = dedupeById(loadPrompts(packs));
  writeExports(prompts, packs);
}

run();
