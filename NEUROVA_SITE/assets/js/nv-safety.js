(function () {
  const DEV = location.hostname === "localhost" || location.search.includes("nvdebug");

  // 1) Duplicate ID guard
  const ids = [...document.querySelectorAll("[id]")].map((n) => n.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);

  // 2) Missing data-section warning vs SECTION_MAP
  const page = document.body.dataset.page;
  const MAP = window.NV_SECTION_MAP?.[page];
  const missing = [];

  if (MAP) {
    MAP.sections.forEach((s) => {
      if (!document.querySelector(`section[data-section="${s.section}"]`)) {
        missing.push(s.section);
      }
    });
  }

  // 3) Legacy anchor redirect
  document.querySelectorAll('a[href="#reservation"]').forEach((a) => {
    a.setAttribute("href", "#nv-wa");
  });

  // 4) Dev console report
  if (DEV) {
    if (dupes.length) {
      console.warn("[NV] Duplicate IDs:", dupes);
    }
    if (missing.length) {
      console.warn("[NV] Missing data-section(s):", missing);
    }
    if (!dupes.length && !missing.length) {
      console.info("[NV] Section integrity OK");
    }
  }
})();
