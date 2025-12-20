(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
    ? window.NV_PROMPT_PACKS
    : {};

  const PACK_ID = "pack.signature.v1";

  const P = [
    {
      id: "HAMAM_07",
      title: "Signature Hamam – Sessiz Başlangıç",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "couples", "quiet-luxury", "sessizlik", "akış"],
      safeNote: "Fully draped. Non-medical. Non-sexual. Professional, silent flow.",
      tr: "Bu ritüeli sakin bir akışta, mümkün olduğunca sessiz yöneteceğim. Sessizlik isterseniz, dokunuş ve ritim konuşmanın yerini alır.",
      en: "I’ll guide this ritual in a calm, quiet flow. If you prefer silence, touch and rhythm will speak instead."
    },
    {
      id: "HAMAM_08",
      title: "Çiftler için Senkron Akış",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "couples", "senkron", "denge", "premium"],
      safeNote: "Fully draped. Non-medical. Non-sexual. Professional sync in motion.",
      tr: "Şimdi ritmi senkronluyorum. Dokunuşlar aynı anda başlar; nefes ve ısın dengesiyle birlikte ilerler.",
      en: "I’m synchronizing the rhythm now. Touch begins together and moves with breath and temperature in balance."
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
