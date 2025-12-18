(function () {
  "use strict";
  const KEY = "KIDS";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "KID_01",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Nazik Karşılama",
      safeNote: "Kids & Family; always ask consent; parent can be present; non-medical, non-invasive.",
      prompt: "Welcome. Everything here moves slowly and gently. You can look around first, and we’ll begin only when you feel ready.",
      lang: {
        tr: "Hoş geldin. Burada her şey yavaş ve yumuşak ilerler. İstersen önce etrafa bakabilir, hazır olduğunda başlayabiliriz.",
        en: "Welcome. Everything here moves slowly and gently. You can look around first, and we’ll begin only when you feel ready."
      },
      tags: ["kids", "karsilama", "guven", "yumusak"]
    },
    {
      id: "KID_02",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Dokunuş Öncesi İzin",
      safeNote: "Kids & Family; always ask consent; parent can be present; non-medical, non-invasive.",
      prompt: "Before we start, I’ll ask you. Would you like the touch to be very light, or a little bit more noticeable?",
      lang: {
        tr: "Başlamadan önce sana soracağım. Dokunuşun çok hafif mi yoksa biraz daha belirgin mi olsun istersin?",
        en: "Before we start, I’ll ask you. Would you like the touch to be very light, or a little bit more noticeable?"
      },
      tags: ["kids", "izin", "secim", "dokunus"]
    },
    {
      id: "KID_03",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Rahatlatıcı Nefes",
      safeNote: "Kids & Family; always ask consent; parent can be present; non-medical, non-invasive.",
      prompt: "Now we’ll breathe slowly together. Imagine filling a balloon, then gently letting it float away.",
      lang: {
        tr: "Şimdi birlikte yavaşça nefes alıyoruz. Nefesini balon gibi şişirip, sonra yavaşça bırakabilirsin.",
        en: "Now we’ll breathe slowly together. Imagine filling a balloon, then gently letting it float away."
      },
      tags: ["kids", "nefes", "rahatlama", "oyun"]
    },
    {
      id: "KID_04",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Yumuşak Dokunuş Akışı",
      safeNote: "Kids & Family; always ask consent; parent can be present; non-medical, non-invasive.",
      prompt: "The touches will be very gentle. If you want me to stop anywhere, just tell me right away.",
      lang: {
        tr: "Dokunuşlar çok yumuşak olacak. Bir yerde durmamı istersen bana hemen söyleyebilirsin.",
        en: "The touches will be very gentle. If you want me to stop anywhere, just tell me right away."
      },
      tags: ["kids", "yumusak", "guven", "kontrol"]
    },
    {
      id: "KID_05",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Ebeveynle Birlikte Güven",
      safeNote: "Kids & Family; always ask consent; parent can be present; non-medical, non-invasive.",
      prompt: "Your parent is here with you. They can hold your hand or simply stay close—whichever you prefer.",
      lang: {
        tr: "Anne ya da baban burada seninle. İstersen elini tutabilir ya da sadece yanında durabilir.",
        en: "Your parent is here with you. They can hold your hand or simply stay close—whichever you prefer."
      },
      tags: ["kids", "family", "guven", "ebeveyn"]
    },
    {
      id: "KID_06",
      category: "Kids & Family",
      role: "Reception",
      kidsOnly: true,
      title: "Nazik Kapanış",
      safeNote: "Kids & Family; always ask consent; parent can be present; non-medical, non-invasive.",
      prompt: "We’re finishing slowly now. Drinking some water and taking a short rest can feel really nice.",
      lang: {
        tr: "Şimdi yavaşça bitiriyoruz. Biraz su içmek ve kısa bir dinlenme iyi hissettirebilir.",
        en: "We’re finishing slowly now. Drinking some water and taking a short rest can feel really nice."
      },
      tags: ["kids", "kapanis", "aftercare", "dinlenme"]
    }
  ];
})(); 
