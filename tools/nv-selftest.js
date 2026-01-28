#!/usr/bin/env node
/**
 * NEUROVA nv:selftest v1.1 (safe smoke)
 * - entry HTML exists?
 * - packs folder exists?
 * - nv:verify proof ok?
 * Note: Browser/headless runner can be added in v1.2 if needed.
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const ENTRY_CANDIDATES = [
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

function main() {
  const problems = [];

  const entry = ENTRY_CANDIDATES.find(exists) || null;
  if (!entry) problems.push("Entry HTML not found (prompt-library.html/index.html).");

  const packsDir = path.join(ROOT, "packs");
  if (!exists(packsDir)) problems.push("packs/ folder not found.");

  const proof = path.join(ROOT, "_audit", "NV_VERIFY_PROOF.json");
  if (exists(proof)) {
    try {
      const j = JSON.parse(fs.readFileSync(proof, "utf8"));
      if (j && j.ok === false) problems.push("NV_VERIFY_PROOF.json indicates verify FAILED (run nv:verify).");
    } catch {
      problems.push("Could not parse _audit/NV_VERIFY_PROOF.json");
    }
  }

  const outDir = path.join(ROOT, "_audit");
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch {}
  const outFile = path.join(outDir, "NV_SELFTEST_PROOF.json");
  const summary = {
    ok: problems.length === 0,
    entryHtml: entry ? path.relative(ROOT, entry) : null,
    problems,
  };
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2), "utf8");

  if (!summary.ok) {
    console.error("❌ nv:selftest FAILED");
    console.error(`Proof: ${path.relative(ROOT, outFile)}`);
    summary.problems.forEach((p, i) => console.error(`${i + 1}. ${p}`));
    process.exit(1);
  }

  console.log("✅ nv:selftest PASSED");
  console.log(`Proof: ${path.relative(ROOT, outFile)}`);
}

main();
