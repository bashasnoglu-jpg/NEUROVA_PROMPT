"use strict";

// pricing-config.js — single source for tier "from" prices (fill values as needed)
window.NV_PRICING = {
  currency: { tr: "₺", en: "TRY" },
  updatedAt: "2025-12-20",

  // Global defaults per tier (shown if no family override)
  tiers: {
    Entry: { trFrom: 0, enFrom: 0 },
    Value: { trFrom: 0, enFrom: 0 },
    Premium: { trFrom: 0, enFrom: 0 },
  },

  // Optional per-family overrides (match the data-family text in pages)
  families: {
    "Hamam + Masaj": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Hamam + Spor Recovery": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Hamam + Ayurveda": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Kids & Family": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Cilt Bakım Kombinleri": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Signature & Prestige / Couples": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    // EN labels for the EN page
    "Hammam + Massage": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Hammam + Sports Recovery": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Hammam + Ayurveda": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
    "Face Care Combos": { Entry: { trFrom: 0, enFrom: 0 }, Value: { trFrom: 0, enFrom: 0 }, Premium: { trFrom: 0, enFrom: 0 } },
  }
};
