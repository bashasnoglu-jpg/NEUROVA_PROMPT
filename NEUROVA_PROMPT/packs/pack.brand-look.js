(/* pack.brand-look.js */ function () {
  "use strict";

  const KEY = "BRAND_LOOK";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "BL_01",
      category: "NEUROVA Look",
      role: "Designer",
      title: "Quiet Luxury Mood",
      safeNote: "Reference language; describes style, no procedural claims.",
      prompt: "Spell out the quiet luxury mood: marble plateaus, brushed brass, and soft diffusion that keeps light warm.",
      lang: {
        tr: "NEUROVA sessiz lüksünü mermer, fırçalanmış pirinç ve yumuşak ışıklarla tanımlıyoruz.",
        en: "We describe the NEUROVA quiet luxury through marble planes, brushed brass, and warm diffused light."
      },
      tags: ["brand", "quiet-luxury", "marble", "brass", "light"]
    },
    {
      id: "BL_02",
      category: "NEUROVA Look",
      role: "Designer",
      title: "NEUROVA Palette",
      safeNote: "Reference language only.",
      prompt: "Frame the palette as warm neutrals with charcoal contrast, pairing soft textures with reflective surfaces.",
      lang: {
        tr: "Paleti sıcak nötrlerle koyu kontrastlar bir araya getirir; yumuşak dokularla yansıtıcı yüzeyleri dengeler.",
        en: "The palette blends warm neutrals with charcoal contrast, balancing soft textures against reflective surfaces."
      },
      tags: ["brand", "palette", "quiet-luxury", "texture"]
    },
    {
      id: "BL_03",
      category: "NEUROVA Look",
      role: "Photographer",
      title: "Atmospheric Quiet",
      safeNote: "Reference imagery only.",
      prompt: "Suggest capturing atmospheric quiet with steam echoes, low light, and close-up marble details.",
      lang: {
        tr: "Atmosferi, buhar izleri, loş ışık ve close-up mermer detaylarla yakalayın.",
        en: "Capture atmospheric quiet using steam echoes, muted light, and close-up marble details."
      },
      tags: ["brand", "photography", "close-up", "quiet-luxury"]
    }
  ];
})();
