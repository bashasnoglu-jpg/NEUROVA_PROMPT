(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];

  const PACK_ID = "pack.template.v1";
  const P = [
    {
      id: "TEMPLATE_01",
      title: "Template Prompt",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["template", "example"],
      safeNote: "Fully draped. Non-medical. Non-sexual.",
      tr: "Bu şablon TR açıklamasıdır.",
      en: "This is the EN placeholder description."
    }
  ];

  const seen = new Set(window.NV_PROMPTS.map(x => x && x.id).filter(Boolean));
  for (const x of P) {
    if (!seen.has(x.id)) {
      window.NV_PROMPTS.push(x);
    }
  }

  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
    ? window.NV_PROMPT_PACKS
    : {};
  window.NV_PROMPT_PACKS[PACK_ID] = { count: P.length, ids: P.map(x => x.id) };
})();
