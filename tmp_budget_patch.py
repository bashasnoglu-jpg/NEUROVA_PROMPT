from pathlib import Path

path = Path("tools/nv-guard-packs.mjs")
text = path.read_text(encoding="utf-8")

loop_start = text.index("    for (let i = 0; i < arr.length; i++) {")
budget_start = text.index("// ---- v1.3: budget evaluation ----")

new_loop = """    for (let i = 0; i < arr.length; i++) {
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

"""

new_budget = """// ---- v1.3: budget evaluation ----
const coverage = budgetTotalPacks ? Math.round((budgetParsedPacks / budgetTotalPacks) * 100) : 0;

console.log(
  `NV_BUDGET: coverage=${budgetParsedPacks}/${budgetTotalPacks} (${coverage}%) totalPrompts=${budgetTotalPrompts}`,
);

if (REQUIRE_PARSE_COVERAGE && budgetParsedPacks !== budgetTotalPacks) {
  budgetReportLine(
    `Parse coverage düşük: ${budgetParsedPacks}/${budgetTotalPacks}. Missed: ${budgetParseMiss
.slice(0, 10).join(", ")}${budgetParseMiss.length > 10 ? " ..." : ""}`,
  );
  budgetFailIfNeeded("Parse coverage 100% değil (NV_BUDGET_REQUIRE_PARSE_COVERAGE=1).");
} else if (budgetParseMiss.length) {
  budgetReportLine(
    `Parse edilemeyen pack var (prompt budget kör kalır): ${budgetParseMiss.slice(0, 10).join(", ")}${budgetParseMiss.length > 10 ? " ..." : ""}`,
  );
}

if (budgetBigPacks.length) {
  const top = [...budgetBigPacks].sort((a, b) => b.bytes - a.bytes).slice(0, 5);
  budgetReportLine(
    `Büyük pack dosyaları (>${MAX_PACK_BYTES} bytes). Top 5: ${top.map((x) => `${x.pack}=${x.bytes}`).join(" | ")}`,
  );
  budgetFailIfNeeded(`Pack bytes budget aşıldı (max ${MAX_PACK_BYTES}).`);
}

if (budgetPromptHeavy.length) {
  const top = [...budgetPromptHeavy].sort((a, b) => b.prompts - a.prompts).slice(0, 5);
  budgetReportLine(
    `Prompt-heavy pack’ler (>${MAX_PACK_PROMPTS} prompts). Top 5: ${top.map((x) => `${x.pack}=${x.prompts}`).join(" | ")}`,
  );
  budgetFailIfNeeded(`Pack prompt budget aşıldı (max ${MAX_PACK_PROMPTS}).`);
}

if (budgetTotalPrompts > MAX_TOTAL_PROMPTS) {
  budgetReportLine(`Toplam prompt budget aşıldı: ${budgetTotalPrompts} > ${MAX_TOTAL_PROMPTS}`);
  budgetFailIfNeeded(`Total prompts budget aşıldı (max ${MAX_TOTAL_PROMPTS}).`);
}

// ---- v1.4: export metrics.json (opt-in) ----
(function exportMetricsIfEnabled() {
  if (!METRICS_EXPORT) return;

  const out = {
    generatedAt: new Date().toISOString(),
    source: "nv-guard-packs",
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
      budgetFailIfNeeded("metrics.json check mode: dosya bulunamadı.");
      return;
    }
    console.log(`NV_METRICS: check OK (${fullPath})`);
    return;
  }

  writeJsonAtomic(fullPath, out);
  console.log(`[NV_METRICS] WROTE: ${fullPath}`);
})();

"""

text = text[:loop_start] + new_loop + text[budget_start:]
text = text[:loop_start] + new_loop + text[budget_start:]
text = text[:budget_start] + new_budget + text[budget_start + len("// ---- v1.3: budget evaluation ----"):]
path.write_text(text, encoding="utf-8")
