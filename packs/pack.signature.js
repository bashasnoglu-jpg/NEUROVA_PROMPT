(/* pack.signature.js */ function () {
  "use strict";

  const KEY = "SIGNATURE";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "SIG_01",
      category: "Signature",
      role: "Therapist",
      title: "Quiet Luxury Welcome",
      safeNote: "Signature ritual; non-medical, comfort-first language; flow slows at guest request.",
      prompt: "Frame the NEUROVA quiet-luxury welcome as a slow inhale, marble steps, and gentle lighting that envelopes the guest.",
      lang: {
        tr: "Bu Signature karşılama, mermer zemin, sıcak tonlar ve sakin ışıklarla yavaşça kabullenilir. Konforunuz her adımda sorulur.",
        en: "This Signature welcome absorbs you with marble steps, warm light, and a gentle rhythm that asks for consent at every turn."
      },
      tags: ["signature", "quiet-luxury", "marble", "welcome", "slow"]
    },
    {
      id: "SIG_02",
      category: "Signature",
      role: "Therapist",
      title: "Synchronized Breath Path",
      safeNote: "Non-medical, calming breath focus; pressure always adjustable.",
      prompt: "Guide synchronized breath cues as choreography: hands, marble columns, and a slow rhythm that mirrors the guest's own inhale.",
      lang: {
        tr: "Nefeslerimizi senkronize ediyoruz; eller mermer sütunlara nazikçe değiyor, ritim sizin nefesinizle uyumlanıyor.",
        en: "We sync our breath flow to yours, letting hands glide alongside marble pillars while the rhythm mirrors your inhale."
      },
      tags: ["signature", "breath", "quiet-luxury", "marble", "sync"]
    },
    {
      id: "SIG_03",
      category: "Signature & Couples",
      role: "Therapist",
      title: "Premium Couples Pause",
      safeNote: "Non-medical couple focus; comfortable silence honored; fully draped.",
      prompt: "Describe the couples pause as a mirrored stillness where marble benches and soft steam cradle both bodies in sync.",
      lang: {
        tr: "Çiftler için bu an, mermer banklarda sessizlikte senkronludur; yavaş buhar ve dokunuşlar birlikte uyumlanır.",
        en: "This couples pause is mirrored stillness: marble benches, soft steam, and synchronized touches that respect comfort."
      },
      tags: ["signature", "couples", "quiet-luxury", "sync", "pause"]
    },
    {
      id: "SIG_04",
      category: "Signature",
      role: "Reception",
      title: "Grounding Departure",
      safeNote: "Quiet aftercare reminder; hydration and rest suggested without claims.",
      prompt: "Wrap the signature finish with marble fountain reflections, whispering reminders to hydrate and pause before stepping back into daylight.",
      lang: {
        tr: "Signature kapanışta mermer havuzun yansıması eşliğinde suyunuzu tamamlamanızı ve güneş öncesi kısa bir dinlenme yapmanızı öneriyoruz.",
        en: "We close the signature ritual with marble reflections, soft whispers to hydrate, and a short pause before you return to daylight."
      },
      tags: ["signature", "aftercare", "quiet-luxury", "hydration"]
    }
  ];
})();
