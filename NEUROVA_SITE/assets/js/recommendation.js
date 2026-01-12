(function () {
  const page = (document.body.dataset.page || "").toLowerCase();
  if (!page || !window.NV_RECO_MAP) return;

  const rules = window.NV_RECO_MAP[page];
  if (!rules) return;

  let currentSection = null;

  function applyRecommendation(sectionKey) {
    const rule = rules[sectionKey];
    if (!rule) return;

    window.NV_CURRENT_RECO = {
      page,
      section: sectionKey,
      topic: rule.topic,
      label: rule.label,
      waTR: rule.waTR,
      waEN: rule.waEN,
    };

    if (location.search.includes("nvdebug")) {
      console.info("[NV RECO]", window.NV_CURRENT_RECO);
    }
  }

  const sections = document.querySelectorAll("section[data-section]");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sec = e.target.dataset.section;
        if (sec !== currentSection) {
          currentSection = sec;
          applyRecommendation(sec);
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => io.observe(s));
})();
