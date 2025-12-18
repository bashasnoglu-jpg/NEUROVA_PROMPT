(function () {
  "use strict";
  const KEY = "KIDS_PREMIUM";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "KIDP_01",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Premium Karşılama – Yumuşak Başlangıç",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "Welcome. Everything here moves slowly and with care. You can take a moment to settle in, and we’ll begin when you’re ready.",
      lang: {
        tr: "Hoş geldin. Burada her şey yavaş ve özenle ilerler. İstersen önce alanı tanıyıp hazır olduğunda başlayabiliriz.",
        en: "Welcome. Everything here moves slowly and with care. You can take a moment to settle in, and we’ll begin when you’re ready."
      },
      tags: ["kids", "premium", "karsilama", "guven", "yavas"]
    },
    {
      id: "KIDP_02",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "İzin & Seçim – Kontrol Sende",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "I’ll ask you at each step. Would you like the touch very light, or a bit more noticeable? We can pause anytime.",
      lang: {
        tr: "Her adımda sana soracağım. Dokunuş çok hafif mi olsun, yoksa biraz daha belirgin mi? İstersen durabiliriz.",
        en: "I’ll ask you at each step. Would you like the touch very light, or a bit more noticeable? We can pause anytime."
      },
      tags: ["kids", "premium", "izin", "secim", "kontrol"]
    },
    {
      id: "KIDP_03",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Dingin Nefes – Ritmi Yavaşlatma",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "Now we slow the rhythm. As you breathe softly, your shoulders may start to relax on their own.",
      lang: {
        tr: "Şimdi ritmi yavaşlatıyoruz. Nefesini yumuşakça alıp verirken omuzların kendiliğinden gevşeyebilir.",
        en: "Now we slow the rhythm. As you breathe softly, your shoulders may start to relax on their own."
      },
      tags: ["kids", "premium", "nefes", "dinginlik", "rahatlama"]
    },
    {
      id: "KIDP_04",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Nazik Dokunuş Akışı – Güvenli Çerçeve",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "Touch will stay gentle and safe. If you prefer, we can stay shorter on an area, or skip it entirely.",
      lang: {
        tr: "Dokunuşlar yumuşak ve güvenli kalacak. İstersen bir bölgede daha kısa kalır, istersen atlarız.",
        en: "Touch will stay gentle and safe. If you prefer, we can stay shorter on an area, or skip it entirely."
      },
      tags: ["kids", "premium", "nazik", "guvenli", "sinir"]
    },
    {
      id: "KIDP_05",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Aileyle Premium Uyum",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "Your parent can stay close. They can hold your hand, or simply remain nearby in quiet support.",
      lang: {
        tr: "Anne/baban yanında kalabilir. İstersen elini tutar, istersen sadece sessizce yakınında durur.",
        en: "Your parent can stay close. They can hold your hand, or simply remain nearby in quiet support."
      },
      tags: ["kids", "family", "premium", "yakinlik", "destek"]
    },
    {
      id: "KIDP_06",
      category: "Kids & Family",
      role: "Reception",
      kidsOnly: true,
      title: "Premium Kapanış – Yumuşak Entegrasyon",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "We’re finishing slowly now. A little water and a short rest help the body keep this good feeling.",
      lang: {
        tr: "Şimdi yavaşça bitiriyoruz. Biraz su ve kısa bir dinlenme, bedenin bu güzel hissi korumasına yardımcı olur.",
        en: "We’re finishing slowly now. A little water and a short rest help the body keep this good feeling."
      },
      tags: ["kids", "premium", "kapanis", "aftercare", "dinlenme"]
    },
    {
      id: "KIDP_07",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Mini Signature Family – Senkron Başlangıç",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "We’re starting softly together with the family. Touch begins at the same time; pace and intensity follow the child’s signals.",
      lang: {
        tr: "Şimdi aileyle birlikte yumuşak bir başlangıç yapıyoruz. Dokunuşlar aynı anda başlar; hız ve yoğunluk çocuğun verdiği sinyallere göre ayarlanır.",
        en: "We’re starting softly together with the family. Touch begins at the same time; pace and intensity follow the child’s signals."
      },
      tags: ["kids", "family", "signature", "senkron", "uyum"]
    },
    {
      id: "KIDP_08",
      category: "Kids & Family",
      role: "Therapist",
      kidsOnly: true,
      title: "Sessiz Premium Kapanış",
      safeNote: "Kids & Family; consent first; parent can be present; non-medical, non-invasive.",
      prompt: "In closing, we keep conversation low. We leave a quiet space for the body to settle the rhythm.",
      lang: {
        tr: "Kapanışta konuşmayı azaltıyoruz. Bedenin ritmi sakinleştirmesine sessizce alan bırakıyoruz.",
        en: "In closing, we keep conversation low. We leave a quiet space for the body to settle the rhythm."
      },
      tags: ["kids", "premium", "kapanis", "sessizlik", "entegrasyon"]
    }
  ];
})(); 
