// packs/pack.ayurveda.js
(function () {
  "use strict";

  const KEY = "AYURVEDA";
  const entries = [
    {
      id: "AYU_01",
      category: "Ayurveda",
      role: "Therapist",
      title: "Abhyanga Yağlı Masaj Akışı",
      tags: ["ayurveda", "abhyanga", "denge"],
      safeNote: "Non-medical wellness; fully draped; respectful, non-sexual service.",
      lang: {
        tr: "Sıcak yağla uzun ve akışkan hareketlerle dengeyi destekleyen bir uygulama yapıyoruz.",
        en: "We apply a balancing flow with warm oil and long, grounding strokes."
      }
    },
    {
      id: "AYU_02",
      category: "Ayurveda",
      role: "Therapist",
      title: "Shirodhara Zihin Sakinliği",
      tags: ["shirodhara", "anti-stress", "rituel"],
      safeNote: "Non-medical; calm/relax focus; fully draped.",
      lang: {
        tr: "Ritmik akış ve sessiz ortamla zihni sakinleştirmeye odaklanıyoruz.",
        en: "We focus on calming the mind through rhythmic flow and a quiet setting."
      }
    }
  ];

  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};
  window.NV_PROMPT_PACKS[KEY] = window.NV_PROMPT_PACKS[KEY] || [];
  window.NV_PROMPT_PACKS[KEY].push(...entries);
})();
