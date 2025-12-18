(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
    ? window.NV_PROMPT_PACKS
    : {};

  const PACK_ID = "pack.hamam.v1";

  const P = [
    {
      id: "HAMAM_01",
      title: "Karşılama & Ritüel Akışı",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "akış", "karşılama", "konfor", "güven"],
      safeNote: "Fully draped. Non-medical wellness. Non-sexual. Professional touch only.",
      tr: "Hoş geldiniz. Bugünkü ritüel ısınma, aralıklı kese, köpük ve dinlenme akışında ilerleyecek. Başlamadan önce basınç ve sıcaklık tercihlerinizi alacağım.",
      en: "Welcome. Today’s ritual follows a warm-up, measured exfoliation, foam cleanse, and rest. I’ll begin by checking your pressure and heat preferences."
    },
    {
      id: "HAMAM_02",
      title: "Isınma & Nefes Ayarı",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "ısınma", "nefes", "rahatlama"],
      safeNote: "Fully draped. Non-medical wellness. Non-sexual. Professional touch only.",
      tr: "Isınma bölümündeyiz. Nefesi yavaşlatıp omuzları bırakıyoruz. Isı dengesini bedeninizin verdiği sinyallere göre ayarlayacağım.",
      en: "We’re in the warming phase. We’ll slow the breath and soften the shoulders, adjusting the heat based on your body’s signals."
    },
    {
      id: "HAMAM_03",
      title: "Kese Öncesi Onay",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "kese", "onay", "basınç", "hassasiyet"],
      safeNote: "Fully draped. Non-medical wellness. Non-sexual. Professional touch only.",
      tr: "Kese öncesi küçük bir ayar yapalım. Basıncı hafif, orta ya da daha derin tercih edebilirsiniz. Hassas bir alan varsa bana bildirmeniz yeterli.",
      en: "Before exfoliation, let’s set the tone. You may choose light, medium, or deeper pressure. Please let me know if any area feels sensitive."
    },
    {
      id: "HAMAM_04",
      title: "Köpük & Temizlenme",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "köpük", "temizlik", "sakinlik"],
      safeNote: "Fully draped. Non-medical wellness. Non-sexual. Professional touch only.",
      tr: "Şimdi köpük temizliğine geçiyoruz. Köpüğü yumuşak bir katman gibi uygulayıp ritmi bilinçli olarak yavaşlatacağım.",
      en: "We now move into the foam cleanse. I’ll apply the foam as a soft layer and intentionally slow the rhythm."
    },
    {
      id: "HAMAM_05",
      title: "Ritüel Sonrası Öneri",
      category: "Hamam Ritüelleri",
      role: "Reception",
      tags: ["hamam", "aftercare", "hidrasyon", "dinlenme"],
      safeNote: "Non-medical wellness advice. No diagnoses. Professional tone.",
      tr: "Ritüel sonrası su tüketimini artırmanızı öneririm. Dilerseniz dinlenme alanında biraz daha zaman ayırabilirsiniz.",
      en: "After the ritual, increasing hydration is recommended. You’re welcome to spend a little more time in the resting area if you wish."
    },
    {
      id: "HAMAM_06",
      title: "Nazik Kapanış",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "kapanış", "denge", "rahatlama"],
      safeNote: "Fully draped. Non-medical wellness. Non-sexual. Professional touch only.",
      tr: "Kapanışta beden ısısını dengeliyorum. Kısa ve yumuşak dokunuşlarla ritüeli tamamlıyoruz.",
      en: "In the closing phase, I balance body temperature and finish the ritual with brief, gentle grounding touches."
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
