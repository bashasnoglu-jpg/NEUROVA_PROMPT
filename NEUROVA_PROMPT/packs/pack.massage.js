(function () {
  "use strict";
  const KEY = "MASSAGE";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "MASAJ_01",
      category: "Klasik Masajlar",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "İsveç Masajı – Derin Gevşeme",
      title_tr: "İsveç Masajı – Derin Gevşeme",
      title_en: "Swedish Massage – Deep Relaxation",
      prompt: "Swedish massage with soft rhythmic strokes, natural light, calm spa room, quiet luxury aesthetic",
      prompt_tr: "İsveç masajı sırasında yumuşak ritmik dokunuşlar, doğal ışık, sakin spa odası, quiet luxury estetiği",
      prompt_en: "Swedish massage with soft rhythmic strokes, natural light, calm spa room, quiet luxury aesthetic",
      negative: "oily shine, harsh shadows",
      tags: ["massage", "swedish", "relax"],
      lang: {
        tr: "İsveç masajı sırasında yumuşak ritmik dokunuşlar, doğal ışık, sakin spa odası, quiet luxury estetiği",
        en: "Swedish massage with soft rhythmic strokes, natural light, calm spa room, quiet luxury aesthetic"
      },
      langCode: "TR/EN",
      safeNote: "Fully covered body with towels, non-sexual depiction"
    },
    {
      id: "MASAJ_02",
      category: "Spor & Terapi Masajları",
      region: "Recovery & Performance",
      role: "Photographer",
      title: "Derin Doku Masajı",
      title_tr: "Derin Doku Masajı",
      title_en: "Deep Tissue Massage",
      prompt: "Controlled pressure deep tissue massage, muscle-focused work, minimal professional spa environment",
      prompt_tr: "Derin doku masajında kontrollü basınç, kas odaklı çalışma, sade ve profesyonel spa ortamı",
      prompt_en: "Controlled pressure deep tissue massage, muscle-focused work, minimal professional spa environment",
      negative: "aggressive pain cues",
      tags: ["massage", "deep tissue", "muscle"],
      lang: {
        tr: "Derin doku masajında kontrollü basınç, kas odaklı çalışma, sade ve profesyonel spa ortamı",
        en: "Controlled pressure deep tissue massage, muscle-focused work, minimal professional spa environment"
      },
      langCode: "TR/EN",
      safeNote: "Therapeutic context, respectful angles"
    },
    {
      id: "MASAJ_03",
      category: "Spor & Terapi Masajları",
      region: "Recovery & Performance",
      role: "Photographer",
      title: "Sporcu Masajı (Recovery)",
      title_tr: "Sporcu Masajı (Recovery)",
      title_en: "Sports Massage (Recovery)",
      prompt: "Sports massage for muscle recovery, calm post-performance setting, functional approach",
      prompt_tr: "Sporcu masajı ile kas toparlanması, performans sonrası sakin ortam, fonksiyonel yaklaşım",
      prompt_en: "Sports massage for muscle recovery, calm post-performance setting, functional approach",
      negative: "gym clutter",
      tags: ["massage", "sports", "recovery"],
      lang: {
        tr: "Sporcu masajı ile kas toparlanması, performans sonrası sakin ortam, fonksiyonel yaklaşım",
        en: "Sports massage for muscle recovery, calm post-performance setting, functional approach"
      },
      langCode: "TR/EN",
      safeNote: "Non-invasive recovery depiction"
    },
    {
      id: "MASAJ_04",
      category: "Asya Masajları",
      region: "Ayurveda & Holistic Balance",
      role: "Photographer",
      title: "Thai Masajı – Esnek Akış",
      title_tr: "Thai Masajı – Esnek Akış",
      title_en: "Thai Massage – Flexible Flow",
      prompt: "Thai massage with stretching and flow, natural floor setting, balanced composition",
      prompt_tr: "Thai masajında esneme ve akış, doğal zemin, dengeli kompozisyon",
      prompt_en: "Thai massage with stretching and flow, natural floor setting, balanced composition",
      negative: "forceful stretching",
      tags: ["massage", "thai", "stretch"],
      lang: {
        tr: "Thai masajında esneme ve akış, doğal zemin, dengeli kompozisyon",
        en: "Thai massage with stretching and flow, natural floor setting, balanced composition"
      },
      langCode: "TR/EN",
      safeNote: "Clothed technique, respectful distance"
    },
    {
      id: "MASAJ_05",
      category: "Asya Masajları",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Bali Aroma Masajı",
      title_tr: "Bali Aroma Masajı",
      title_en: "Balinese Aroma Massage",
      prompt: "Balinese aroma massage, warm oils, tropical calm feeling, soft lighting",
      prompt_tr: "Bali aroma masajı, sıcak yağlar, tropikal sakinlik hissi, yumuşak ışık",
      prompt_en: "Balinese aroma massage, warm oils, tropical calm feeling, soft lighting",
      negative: "strong branding",
      tags: ["massage", "balinese", "aroma"],
      lang: {
        tr: "Bali aroma masajı, sıcak yağlar, tropikal sakinlik hissi, yumuşak ışık",
        en: "Balinese aroma massage, warm oils, tropical calm feeling, soft lighting"
      },
      langCode: "TR/EN",
      safeNote: "Covered body, spa-safe framing"
    },
    {
      id: "MASAJ_06",
      category: "Ayurveda Ritüelleri",
      region: "Ayurveda & Holistic Balance",
      role: "Photographer",
      title: "Abhyanga – Ayurvedik Yağ Masajı",
      title_tr: "Abhyanga – Ayurvedik Yağ Masajı",
      title_en: "Abhyanga – Ayurvedic Oil Massage",
      prompt: "Abhyanga massage with warm herbal oils, holistic balance, serene atmosphere",
      prompt_tr: "Abhyanga masajı, ılık bitkisel yağlar, holistik denge, sakin atmosfer",
      prompt_en: "Abhyanga massage with warm herbal oils, holistic balance, serene atmosphere",
      negative: "medical lab look",
      tags: ["massage", "abhyanga", "ayurveda"],
      lang: {
        tr: "Abhyanga masajı, ılık bitkisel yağlar, holistik denge, sakin atmosfer",
        en: "Abhyanga massage with warm herbal oils, holistic balance, serene atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "Holistic wellness depiction only"
    },
    {
      id: "MASAJ_07",
      category: "Spor & Terapi Masajları",
      region: "Recovery & Performance",
      role: "Photographer",
      title: "Refleksoloji – Ayak Odaklı",
      title_tr: "Refleksoloji – Ayak Odaklı",
      title_en: "Reflexology – Foot Focus",
      prompt: "Reflexology session with precise foot-focused touch, minimal spa setting",
      prompt_tr: "Refleksoloji uygulaması, ayak odaklı hassas dokunuşlar, minimal spa",
      prompt_en: "Reflexology session with precise foot-focused touch, minimal spa setting",
      negative: "clinical charts",
      tags: ["massage", "reflexology", "feet"],
      lang: {
        tr: "Refleksoloji uygulaması, ayak odaklı hassas dokunuşlar, minimal spa",
        en: "Reflexology session with precise foot-focused touch, minimal spa setting"
      },
      langCode: "TR/EN",
      safeNote: "Feet-only depiction"
    },
    {
      id: "MASAJ_08",
      category: "Klasik Masajlar",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Sıcak Taş Masajı",
      title_tr: "Sıcak Taş Masajı",
      title_en: "Hot Stone Massage",
      prompt: "Hot stone massage with basalt stones, deep relaxation feeling",
      prompt_tr: "Sıcak taş masajı, bazalt taşlar, derin gevşeme hissi",
      prompt_en: "Hot stone massage with basalt stones, deep relaxation feeling",
      negative: "overheated stones",
      tags: ["massage", "hot stone", "relax"],
      lang: {
        tr: "Sıcak taş masajı, bazalt taşlar, derin gevşeme hissi",
        en: "Hot stone massage with basalt stones, deep relaxation feeling"
      },
      langCode: "TR/EN",
      safeNote: "Temperature implied safely"
    },
    {
      id: "MASAJ_09",
      category: "Spor & Terapi Masajları",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Lenf Drenaj Masajı",
      title_tr: "Lenf Drenaj Masajı",
      title_en: "Lymphatic Drainage Massage",
      prompt: "Lymphatic drainage massage with gentle rhythmic strokes, purifying effect",
      prompt_tr: "Lenf drenaj masajı, nazik ve ritmik dokunuşlar, arındırıcı etki",
      prompt_en: "Lymphatic drainage massage with gentle rhythmic strokes, purifying effect",
      negative: "medical devices",
      tags: ["massage", "lymphatic", "detox"],
      lang: {
        tr: "Lenf drenaj masajı, nazik ve ritmik dokunuşlar, arındırıcı etki",
        en: "Lymphatic drainage massage with gentle rhythmic strokes, purifying effect"
      },
      langCode: "TR/EN",
      safeNote: "Gentle, non-invasive depiction"
    },
    {
      id: "MASAJ_10",
      category: "Klasik Masajlar",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Sırt & Omuz Rahatlatma",
      title_tr: "Sırt & Omuz Rahatlatma",
      title_en: "Back & Shoulder Relief",
      prompt: "Relaxing massage focused on back and shoulders, calm environment reducing work stress",
      prompt_tr: "Sırt ve omuzlara odaklı rahatlatıcı masaj, iş stresini azaltan sakin ortam",
      prompt_en: "Relaxing massage focused on back and shoulders, calm environment reducing work stress",
      negative: "office props",
      tags: ["massage", "back", "shoulder"],
      lang: {
        tr: "Sırt ve omuzlara odaklı rahatlatıcı masaj, iş stresini azaltan sakin ortam",
        en: "Relaxing massage focused on back and shoulders, calm environment reducing work stress"
      },
      langCode: "TR/EN",
      safeNote: "Upper-body only, covered"
    },
    {
      id: "MASAJ_11",
      category: "Klasik Masajlar",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Baş & Boyun Masajı",
      title_tr: "Baş & Boyun Masajı",
      title_en: "Head & Neck Massage",
      prompt: "Head and neck massage for mental relaxation, soft lighting",
      prompt_tr: "Baş ve boyun masajı, zihinsel rahatlama, yumuşak ışık",
      prompt_en: "Head and neck massage for mental relaxation, soft lighting",
      negative: "hair salon look",
      tags: ["massage", "head", "neck"],
      lang: {
        tr: "Baş ve boyun masajı, zihinsel rahatlama, yumuşak ışık",
        en: "Head and neck massage for mental relaxation, soft lighting"
      },
      langCode: "TR/EN",
      safeNote: "Seated or reclined, respectful angles"
    },
    {
      id: "MASAJ_12",
      category: "Ayurveda Ritüelleri",
      region: "Ayurveda & Holistic Balance",
      role: "Photographer",
      title: "Ayurvedik Marma Noktaları",
      title_tr: "Ayurvedik Marma Noktaları",
      title_en: "Ayurvedic Marma Points",
      prompt: "Ayurvedic massage focusing on marma points, sense of energy balance",
      prompt_tr: "Marma noktalarına odaklanan ayurvedik masaj, enerji dengesi hissi",
      prompt_en: "Ayurvedic massage focusing on marma points, sense of energy balance",
      negative: "acupuncture needles",
      tags: ["massage", "ayurveda", "marma"],
      lang: {
        tr: "Marma noktalarına odaklanan ayurvedik masaj, enerji dengesi hissi",
        en: "Ayurvedic massage focusing on marma points, sense of energy balance"
      },
      langCode: "TR/EN",
      safeNote: "Hands-only technique"
    },
    {
      id: "MASAJ_13",
      category: "Spor & Terapi Masajları",
      region: "Recovery & Performance",
      role: "Photographer",
      title: "Jet Lag Recovery Masajı",
      title_tr: "Jet Lag Recovery Masajı",
      title_en: "Jet Lag Recovery Massage",
      prompt: "Massage for post-jet lag recovery, light and revitalizing touch",
      prompt_tr: "Jet lag sonrası toparlanmaya yönelik masaj, hafif ve canlandırıcı dokunuşlar",
      prompt_en: "Massage for post-jet lag recovery, light and revitalizing touch",
      negative: "airport imagery",
      tags: ["massage", "jet lag", "recovery"],
      lang: {
        tr: "Jet lag sonrası toparlanmaya yönelik masaj, hafif ve canlandırıcı dokunuşlar",
        en: "Massage for post-jet lag recovery, light and revitalizing touch"
      },
      langCode: "TR/EN",
      safeNote: "Wellness recovery context"
    },
    {
      id: "MASAJ_14",
      category: "Signature & Couples Ritüelleri",
      region: "Signature & Prestige",
      role: "Photographer",
      title: "Çiftler İçin Senkron Masaj",
      title_tr: "Çiftler İçin Senkron Masaj",
      title_en: "Synchronized Couples Massage",
      prompt: "Side-by-side synchronized massage experience, symmetrical calm composition",
      prompt_tr: "Yan yana senkron masaj deneyimi, simetrik ve sakin kompozisyon",
      prompt_en: "Side-by-side synchronized massage experience, symmetrical calm composition",
      negative: "romantic intimacy",
      tags: ["massage", "couples", "sync"],
      lang: {
        tr: "Yan yana senkron masaj deneyimi, simetrik ve sakin kompozisyon",
        en: "Side-by-side synchronized massage experience, symmetrical calm composition"
      },
      langCode: "TR/EN",
      safeNote: "No touching between guests, separate towels"
    },
    {
      id: "MASAJ_15",
      category: "Klasik Masajlar",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Akşam Yavaşlatıcı Masaj",
      title_tr: "Akşam Yavaşlatıcı Masaj",
      title_en: "Evening Slow-Down Massage",
      prompt: "Evening slow-down massage, warm tones, pre-sleep preparation feeling",
      prompt_tr: "Akşam saatlerinde yavaşlatıcı masaj, sıcak tonlar, uykuya hazırlık hissi",
      prompt_en: "Evening slow-down massage, warm tones, pre-sleep preparation feeling",
      negative: "dark dramatic lighting",
      tags: ["massage", "evening", "sleep"],
      lang: {
        tr: "Akşam saatlerinde yavaşlatıcı masaj, sıcak tonlar, uykuya hazırlık hissi",
        en: "Evening slow-down massage, warm tones, pre-sleep preparation feeling"
      },
      langCode: "TR/EN",
      safeNote: "Calm, non-stimulating depiction"
    }
  ];
})();
