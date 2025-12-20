(/* pack.seasonal-detox.js */ function () {
  "use strict";

  const KEY = "SEASONAL_DETOX";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "SD_01",
      category: "Seasonal Detox",
      role: "Therapist",
      title: "Seasonal Intake",
      safeNote: "Detox language stays non-medical; focus on warmth, hydration, and seasonal cues.",
      prompt: "Introduce the seasonal detox through warm notes, citrus steam, and a gentle request for current stress points.",
      lang: {
        tr: "Mevsimsel detoksu sıcak notalar, turunçgil buharı ve güncel gerilim noktalarını sorarak açıyoruz.",
        en: "We open the seasonal detox with warm citrus steam, asking about current tension points and aligning the rhythm to the season."
      },
      tags: ["seasonal", "detox", "citrus", "warm"]
    },
    {
      id: "SD_02",
      category: "Seasonal Detox",
      role: "Therapist",
      title: "Water Balance Rhythm",
      safeNote: "Focus on hydration cues; non-medical.",
      prompt: "Describe the water balance step as a slow, fluid sweep that encourages gentle movement and cool glass vessels.",
      lang: {
        tr: "Su denge bölümünde yavaş, akışkan hareketler ve serin cam kaseler kullanıyoruz.",
        en: "During the water balance step we use slow, fluid sweeps and cool glass vessels to encourage gentle flow."
      },
      tags: ["seasonal", "hydration", "detox", "water"]
    },
    {
      id: "SD_03",
      category: "Seasonal Detox",
      role: "Therapist",
      title: "Purifying Breath Focus",
      safeNote: "Breath guidance only; no claims of purification beyond experience.",
      prompt: "Highlight breathing as the channel to flush warmth through limbs, pairing it with textured towels and neutral lighting.",
      lang: {
        tr: "Nefes odaklı bölümde dokulu havlular eşlik ederken ışık nötr kalarak alanı sakinleştirir.",
        en: "We pair breath focus with textured towels and neutral lighting to let warmth move freely through the limbs."
      },
      tags: ["seasonal", "breath", "detox", "neutral"]
    },
    {
      id: "SD_04",
      category: "Seasonal Detox",
      role: "Reception",
      title: "Seasonal Aftercare",
      safeNote: "Gentle, non-medical aftercare suggestions only.",
      prompt: "Suggest a quiet pause with herbal water, describing how the seasonal shift invites slowing down.",
      lang: {
        tr: "Mevsimsel değişimde sakin kalmak için bitki suları ve kısa bir dinlenme öneriyoruz.",
        en: "After the ritual we invite a quiet herbal water pause, letting the seasonal shift encourage slowing down."
      },
      tags: ["seasonal", "aftercare", "detox"]
    }
  ];
})();
