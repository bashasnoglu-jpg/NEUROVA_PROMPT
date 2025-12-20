(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
    ? window.NV_PROMPT_PACKS
    : {};

  const PACK_ID = "pack.ayurveda.v1";

  const P = [
    {
      id: "AYU_01",
      title: "Abhyanga Yağlı Masaj Akışı",
      category: "Ayurveda Ritüelleri",
      role: "Therapist",
      tags: ["ayurveda", "abhyanga", "denge"],
      safeNote: "Fully draped. Ayurvedic flow. Non-sexual.",
      tr: "Sıcak yağla uzun ve akışkan hareketlerle dengeyi destekleyen bir uygulama yapıyoruz.",
      en: "We apply a balancing flow with warm oil and long, grounding strokes."
    },
    {
      id: "AYU_02",
      title: "Shirodhara Zihin Sakinliği",
      category: "Ayurveda Ritüelleri",
      role: "Therapist",
      tags: ["shirodhara", "anti-stress", "ritüel"],
      safeNote: "Fully draped. Calm focus. Non-sexual.",
      tr: "Ritmik akış ve sessiz ortamla zihni sakinleştirmeye odaklanıyoruz.",
      en: "We focus on calming the mind through rhythmic flow and a quiet setting."
    }
  ];

  const seen = new Set(window.NV_PROMPTS.map(x => x && x.id).filter(Boolean));
  for (const x of P) {
    if (!seen.has(x.id)) {
      window.NV_PROMPTS.push(x);
    }
  }

  window.NV_PROMPT_PACKS[PACK_ID] = { count: P.length, ids: P.map(x => x.id) };
})();
