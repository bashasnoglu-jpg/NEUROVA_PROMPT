#!/usr/bin/env node
"use strict";

/**
 * SANTIS_PROMPT Agent Fix v1.0
 * Run from SANTIS_PROMPT root:
 *   node ./tools/nv-agent-fix.js
 *
 * What it does:
 * - Verifies "single true root" structure
 * - Verifies tools/obs-test-harness.js exists
 * - Patches prompt-library.html harness src if needed
 * - Detects duplicate selftest blocks and warns
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const FILE = (p) => path.join(ROOT, p);

function exists(p) {
  try {
    fs.accessSync(FILE(p), fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function read(p) {
  return fs.readFileSync(FILE(p), "utf8");
}

function write(p, s) {
  fs.writeFileSync(FILE(p), s, "utf8");
}

function log(title, obj) {
  console.log("\n== " + title + " ==");
  console.log(JSON.stringify(obj, null, 2));
}

function main() {
  const report = {
    root: ROOT,
    ok: true,
    checks: {},
    actions: [],
    warnings: [],
  };

  const mustHave = [
    "prompt-library.html",
    "app.js",
    "prompts-loader.js",
    "packs",
    "tools",
  ];
  report.checks.mustHave = Object.fromEntries(mustHave.map((k) => [k, exists(k)]));

  const harnessRel = "tools/obs-test-harness.js";
  report.checks.harnessExists = exists(harnessRel);

  const missing = Object.entries(report.checks.mustHave)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    report.ok = false;
    report.warnings.push("Missing expected items in root: " + missing.join(", "));
  }

  if (!report.checks.harnessExists) {
    report.ok = false;
    report.warnings.push(
      `Missing ${harnessRel}. If tools/ folder is elsewhere, you are NOT in the true root.`
    );
  }

  if (exists("prompt-library.html")) {
    let html = read("prompt-library.html");

    const hasQueryAutorun = /obs-test-harness\.js[\s\S]{0,200}selftest/i.test(html);
    const hasUiSelftest = /nv-run-selftest|nv-selftest-pill|UI selftest/i.test(html);

    report.checks.hasQueryAutorun = !!hasQueryAutorun;
    report.checks.hasUiSelftest = !!hasUiSelftest;

    const harnessRefs = (html.match(/obs-test-harness\.js/g) || []).length;
    report.checks.harnessRefCount = harnessRefs;
    if (harnessRefs > 2) {
      report.warnings.push(
        `Found ${harnessRefs} references to obs-test-harness.js in prompt-library.html. Likely duplicate blocks.`
      );
    }

    const before = html;
    html = html.replace(/(["'])\.\/tools\/obs-test-harness\.js\1/g, `"/tools/obs-test-harness.js"`);
    html = html.replace(
      /s\.src\s*=\s*["']\.\/tools\/obs-test-harness\.js["']/g,
      `s.src = "/tools/obs-test-harness.js"`
    );

    if (html !== before) {
      write("prompt-library.html", html);
      report.actions.push('Patched prompt-library.html: enforced harness src to "/tools/obs-test-harness.js"');
    } else {
      report.actions.push("No harness src patch needed in prompt-library.html");
    }

    const domLoadedInit = /addEventListener\s*\(\s*["']DOMContentLoaded["']/i.test(html);
    report.checks.hasDOMContentLoaded = !!domLoadedInit;
    if (domLoadedInit) {
      report.warnings.push(
        "Detected DOMContentLoaded-based init. If the script is injected late, init can be missed. Prefer readyState-safe init."
      );
    }
  }

  log("NV_AGENT_FIX_REPORT", report);

  if (!report.ok) {
    console.log("\nNEXT STEPS:");
    console.log("- Make sure you run this from the real SANTIS_PROMPT root (same folder that contains prompt-library.html, tools/, packs/).");
    console.log("- If tools/obs-test-harness.js is missing here, move/copy the tools folder into this root.");
    process.exitCode = 1;
  } else {
    console.log("\nOK: Root structure looks consistent. Reload the page and re-run the harness fetch test.");
  }
}

main();
