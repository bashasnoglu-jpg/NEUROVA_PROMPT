(function () {
  "use strict";
  const KEY = "TEEN";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "TEEN_01",
      category: "Kids & Family",
      role: "Therapist",
      title: "Teen Karşılaşma (Saygılı Ton)",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Hoş geldin. Burada senin konforun öncelik. Başlamadan önce neye odaklanalım: boyun, omuz, sırt mı?",
        en: "Welcome. Your comfort comes first here. Before we start, what should we focus on: neck, shoulders, or back?"
      },
      tags: ["teen", "karşılama", "saygı", "konfor"]
    },
    {
      id: "TEEN_02",
      category: "Kids & Family",
      role: "Therapist",
      title: "Sınırlar & İzin",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Her adımı senin onayınla ilerleteceğim. İstemediğin bir bölge varsa söylemen yeterli; her an durabiliriz.",
        en: "We'll move step by step with your consent. If there's any area you don't want touched, tell me — we can pause or stop anytime."
      },
      tags: ["teen", "izin", "sınır", "güven"]
    },
    {
      id: "TEEN_03",
      category: "Kids & Family",
      role: "Therapist",
      title: "Basınç Ayarı (Kontrol Sende)",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Basınç için üç seviye düşün: hafif, orta, daha derin. Şu an hangisi iyi olur? İstediğin anda değiştiririz.",
        en: "Think of pressure in three levels: light, medium, deeper. What feels right right now? We can change it anytime."
      },
      tags: ["teen", "basınç", "kontrol", "iletişim"]
    },
    {
      id: "TEEN_04",
      category: "Kids & Family",
      role: "Therapist",
      title: "Ekran Yorgunluğu (Boyun/Omuz)",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Ekran kullanımı boyun ve omuzları yorabiliyor. Burada yavaş, ölçülü bir gevşeme akışı uygulayacağım.",
        en: "Screen time can build tension in the neck and shoulders. I'll use a slow, measured release flow here."
      },
      tags: ["teen", "boyun", "omuz", "ekran", "rahatlama"]
    },
    {
      id: "TEEN_05",
      category: "Kids & Family",
      role: "Therapist",
      title: "Mahremiyet & Rahatlık",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Rahat hissetmen önemli. İstersen konuşmadan ilerleyebiliriz; sadece gerekli yerlerde kısa check-in yaparım.",
        en: "Feeling comfortable matters. We can continue without talking; I'll only do brief check-ins when needed."
      },
      tags: ["teen", "mahremiyet", "sessizlik", "saygı"]
    },
    {
      id: "TEEN_06",
      category: "Kids & Family",
      role: "Reception",
      title: "Seans Sonrası Mini Öneri",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Seans sonrası su içmek ve kısa bir yürüyüş iyi gelir. Bu akşam erken dinlenmek de bedenin toparlanmasına yardımcı olur.",
        en: "After the session, drinking water and a short walk can help. An earlier rest tonight also supports recovery."
      },
      tags: ["teen", "aftercare", "hidrasyon", "dinlenme"]
    },
    {
      id: "TEEN_07",
      category: "Kids & Family",
      role: "Therapist",
      title: "Spor Sonrası Yumuşak Recovery",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Antrenman sonrası bedeni toparlamaya odaklanıyoruz. Dokunuşlar hafif ve akıcı olacak; amaç rahatlama, zorlamak değil.",
        en: "We'll focus on helping your body recover after training. Touch will be light and flowing; the goal is ease, not pushing."
      },
      tags: ["teen", "spor", "recovery", "yumuşak", "güven"]
    },
    {
      id: "TEEN_08",
      category: "Kids & Family",
      role: "Therapist",
      title: "Bacak & Bel Rahatlatma (Kontrollü)",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Bacaklar ve bel için kontrollü bir rahatlatma uygulayacağım. Basıncını istediğin an ayarlayabilir ya da durdurabilirsin.",
        en: "I'll use a controlled release for the legs and lower back. You can adjust the pressure or ask to stop at any time."
      },
      tags: ["teen", "spor", "bacak", "bel", "kontrol"]
    },
    {
      id: "TEEN_09",
      category: "Kids & Family",
      role: "Therapist",
      title: "Sınav Stresi Sonrası Gevşeme",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Bugün zihni biraz yavaşlatmaya odaklanacağız. Dokunuşlar sakin ve aralıklı olacak; bedenin rahatlamasına alan açıyoruz.",
        en: "Today we'll focus on slowing the mind down. Touch will be calm and spaced, creating room for the body to relax."
      },
      tags: ["teen", "sınav", "stres", "gevşeme", "yavaşlama"]
    },
    {
      id: "TEEN_10",
      category: "Kids & Family",
      role: "Therapist",
      title: "Uyku Öncesi Yumuşak Kapanış",
      safeNote: "Teen/young guest program. Non-medical wellness; respect boundaries; stop or adjust anytime; therapist-led.",
      lang: {
        tr: "Şimdi ritmi daha da yavaşlatıyoruz. Amaç uykuya geçişi desteklemek; beden kendi hızında sakinleşsin.",
        en: "We'll slow the rhythm even further now. The goal is to support sleep; your body can settle at its own pace."
      },
      tags: ["teen", "uyku", "kapanış", "sakinleşme"]
    }
  ];
})();
