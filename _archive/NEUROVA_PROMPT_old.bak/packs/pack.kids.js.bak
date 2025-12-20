(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
    ? window.NV_PROMPT_PACKS
    : {};

  const PACK_ID = "pack.kids.v1";

  const P = [
    {
      id: "KID_01",
      title: "Nazik Karşılama",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "karşılama", "güven", "yumuşak"],
      safeNote: "Fully draped. Gentle non-medical touch. Non-sexual.",
      tr: "Hoş geldin. Burada her şey yavaş ve yumuşak ilerler. İstersen önce etrafa bakabilir, hazır olduğunda başlayabiliriz.",
      en: "Welcome. Everything here moves slowly and gently. You can look around first, and we’ll begin only when you feel ready."
    },
    {
      id: "KID_02",
      title: "Dokunuş Önce İzin",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "izin", "dokunuş"],
      safeNote: "Fully draped. Gentle pediatric approach. Non-sexual.",
      tr: "Başlamadan önce sana soracağım. Dokunuşun çok hafif mi yoksa biraz daha güçlü mü olmasını istersin?",
      en: "Before we start, I’ll ask you. Would you like the touch to be very light, or a little bit stronger?"
    },
    {
      id: "KID_03",
      title: "Rahatlatıcı Nefes",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "nefes", "rahatlama", "oyun"],
      safeNote: "Fully draped. Gentle rhythm. Non-sexual.",
      tr: "Şimdi birlikte yavaşça nefes alıyoruz. Nefesini balon gibi şişirip, sonra yavaşça bırakabilirsin.",
      en: "Now we’ll breathe slowly together. You can imagine filling a balloon, then letting it gently float away."
    },
    {
      id: "KID_04",
      title: "Yumuşak Dokunuş Akışı",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "yumuşak", "güven", "kontrol"],
      safeNote: "Fully draped. Gentle touch. Non-sexual.",
      tr: "Dokunuşlar çok yumuşak olacak. Eğer bir yerde durmamı istersen, bana hemen söyleyebilirsin.",
      en: "The touches will be very gentle. If you want me to stop anywhere, you can tell me right away."
    },
    {
      id: "KID_05",
      title: "Ebeveynle Birlikte Güven",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "family", "güven", "ebeveyn"],
      safeNote: "Fully draped. Family presence encouraged. Non-sexual.",
      tr: "Anne ya da baban burada seninle. İstersen elini tutabilir ya da sadece yanında durabilir.",
      en: "Your parent is here with you. They can hold your hand or simply stay close, however you prefer."
    },
    {
      id: "KID_06",
      title: "Nazik Kapanış",
      category: "Kids & Family",
      role: "Reception",
      tags: ["kids", "kapanış", "aftercare", "dinlenme"],
      safeNote: "Non-medical aftercare guidance. Non-sexual.",
      tr: "Şimdi yavaşça bitiriyoruz. Biraz su içmek ve kısa bir dinlenme iyi hissettirebilir.",
      en: "We’re finishing slowly now. Drinking some water and taking a short rest can feel very nice."
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
