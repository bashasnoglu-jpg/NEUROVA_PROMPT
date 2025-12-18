(/* pack.face-sothys.js */ function () {
  "use strict";

  const KEY = "FACE_SOTHYS";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "FACE_01",
      category: "Face – Sothys",
      role: "Therapist",
      title: "Skin Safety Check",
      safeNote: "Face – Sothys; non-medical skincare language; no before/after promises or medical claims.",
      prompt: "Frame the face consultation as a calm check-in: ask about sensitivity, note hydration, and keep language rooted in nurture without claims.",
      lang: {
        tr: "Cilt danışmanlığında hassasiyet, hidrasyon ve konfor ön planda; hiçbir tıbbi iddia veya before-after vurgusu yok.",
        en: "During the face consultation we explore sensitivity, hydration, and comfort—always staying within nurturing, non-medical language."
      },
      tags: ["face", "sothys", "safety", "consultation"]
    },
    {
      id: "FACE_02",
      category: "Face – Sothys",
      role: "Therapist",
      title: "Hydration + Soothe",
      safeNote: "Gentle hydration focus; no medical claims; full consent.",
      prompt: "Describe the hydration sequence using lightweight touches and cellular-respect cues, mentioning cool marble bowls and soft towels.",
      lang: {
        tr: "Hidrasyon bölümünde hafif dokunuşlar, soğuk mermer kaseler ve yumuşak havlular eşlik eder.",
        en: "In the hydration sequence we apply lightweight, respectful touches with marble bowls and soft towels nearby."
      },
      tags: ["face", "hydration", "sothys", "soothe"]
    },
    {
      id: "FACE_03",
      category: "Face – Sothys",
      role: "Therapist",
      title: "Calm Radiance Pause",
      safeNote: "Relaxing pause; no acceleration, no claims of reversing aging.",
      prompt: "Highlight the calm radiance pause as a breath-friendly moment where the skin rests beneath slow, rhythmic palms and quiet lighting.",
      lang: {
        tr: "Cildin sessizce nefes aldığı an; eller yavaşça palpe edilirken ışık düşük tutulur.",
        en: "We honor the calm radiance pause with slow palming, dim light, and your breath guiding the rhythm."
      },
      tags: ["face", "radiance", "sothys", "calm"]
    },
    {
      id: "FACE_04",
      category: "Face – Sothys",
      role: "Reception",
      title: "Skin Reminder",
      safeNote: "Non-medical aftercare; hints to keep skin calm and hydrated.",
      prompt: "Close the face moment with a reminder about cool water, gentle movement, and a quiet, hydrated pause before makeup.",
      lang: {
        tr: "Cilt kapanışında serin su ve yumuşak hareketlerle sakin kalmasını öneriyoruz.",
        en: "At the end we suggest cool water, gentle movements, and giving the skin a quiet, hydrated pause."
      },
      tags: ["face", "aftercare", "sothys"]
    }
  ];
})();
