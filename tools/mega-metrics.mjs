#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  manifestEntries,
  parsePackEntriesFromSource,
  readManifest,
  resolvePackSources,
} from "./pack-parse.mjs";

const ROOT = process.cwd();
const PACKS_DIR = path.join(ROOT, "packs");
const MANIFEST = path.join(PACKS_DIR, "manifest.json");

function die(msg) {
  console.error("[NV_METRICS][ERROR]", msg);
  process.exit(1);
}

function buildPackStats(entries) {
  const sources = resolvePackSources(entries, PACKS_DIR);
  const summary = [];
  let totalPrompts = 0;
  const errors = [];
  const idOccurrences = new Map();

  for (const source of sources) {
    const packPath = `./packs/${source.relative}`;
    const packSummary = {
      path: packPath,
      prompts: 0,
      ids: 0,
    };

    if (!fs.existsSync(source.full)) {
      errors.push({ pack: source.entry, error: "missing file" });
      summary.push(packSummary);
      continue;
    }

    let parsed;
    try {
      const src = fs.readFileSync(source.full, "utf8");
      parsed = parsePackEntriesFromSource(src);
    } catch (err) {
      errors.push({ pack: source.entry, error: err.message });
      summary.push(packSummary);
      continue;
    }

    if (!Array.isArray(parsed)) {
      errors.push({ pack: source.entry, error: "could not parse pack entries" });
      summary.push(packSummary);
      continue;
    }

    packSummary.prompts = parsed.length;
    parsed.forEach((prompt) => {
      totalPrompts += 1;
      const id = String(prompt?.id ?? "").trim();
      if (id) {
        packSummary.ids += 1;
        const prev = idOccurrences.get(id) ?? { count: 0, packs: new Set() };
        prev.count += 1;
        prev.packs.add(packPath);
        idOccurrences.set(id, prev);
      }
    });

    summary.push(packSummary);
  }

  const duplicateIds = [];
  for (const [id, occ] of idOccurrences.entries()) {
    if (occ.count > 1) {
      duplicateIds.push({
        id,
        count: occ.count,
        packs: Array.from(occ.packs),
      });
    }
  }

  return {
    totalPrompts,
    packs: summary,
    duplicateIds,
    errors,
  };
}

function main() {
  const manifest = readManifest(MANIFEST);
  if (!manifest) die(`Manifest not found or unreadable: ${MANIFEST}`);
  const entries = manifestEntries(manifest);

  if (!entries.length) die("manifest does not contain any packs");

  const metrics = buildPackStats(entries);
  const payload = {
    version: "mega-metrics.v1",
    generatedAt: new Date().toISOString(),
    root: ROOT,
    manifestPath: "./packs/manifest.json",
    packCount: entries.length,
    totalPrompts: metrics.totalPrompts,
    packs: metrics.packs,
    duplicateIds: metrics.duplicateIds,
    errors: metrics.errors,
  };

  if (metrics.errors.length) {
    process.exitCode = 1;
  }

  console.log(JSON.stringify(payload));
}

main();
