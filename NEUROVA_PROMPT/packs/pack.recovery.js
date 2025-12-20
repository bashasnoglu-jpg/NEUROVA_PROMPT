(function () {
  "use strict";
  const KEY = "RECOVERY";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "REC_01",
      category: "Recovery & Performance",
      role: "Therapist",
      title: "Hızlı Check-in (Ağrı/Yoğunluk)",
      safeNote: "Non-medical wellness session; pressure always adjustable; stop/modify on request; no medical claims.",
      lang: {
        tr: "Başlamadan önce iki şey soracağım: en çok gerginlik nerede ve basınç tercihiniz nedir (hafif/orta/yoğun)?",
        en: "Before we start: where do you feel the most tension, and what pressure do you prefer (light/medium/firm)?"
      },
      tags: ["recovery", "check-in", "basinc", "agri"]
    },
    {
      id: "REC_02",
      category: "Recovery & Performance",
      role: "Therapist",
      title: "Nefesle Sinir Sistemi İnişi",
      safeNote: "Non-medical wellness session; pressure always adjustable; stop/modify on request; no medical claims.",
      lang: {
        tr: "Nefesi uzatarak sinir sistemini daha düşük bir vitese alıyoruz. Bu, kas çalışmasının etkisini yumuşatır.",
        en: "We’ll lengthen the breath to downshift the nervous system, softening the impact of the muscle work."
      },
      tags: ["recovery", "nefes", "sinir-sistemi", "gevseme"]
    },
    {
      id: "REC_03",
      category: "Recovery & Performance",
      role: "Therapist",
      title: "Bacak Recovery (Dolaşım)",
      safeNote: "Non-medical wellness session; pressure always adjustable; stop/modify on request; no medical claims.",
      lang: {
        tr: "Bacaklarda dolaşımı destekleyen akıcı ve ritmik bir çalışma yapacağım. Herhangi bir hassasiyet olursa hemen ayarlarız.",
        en: "I’ll use a flowing, rhythmic approach to support circulation in the legs. We’ll adjust immediately if anything feels sensitive."
      },
      tags: ["recovery", "bacak", "dolasim", "ritim"]
    },
    {
      id: "REC_04",
      category: "Recovery & Performance",
      role: "Therapist",
      title: "Omuz-Boyun Reset",
      safeNote: "Non-medical wellness session; pressure always adjustable; stop/modify on request; no medical claims.",
      lang: {
        tr: "Omuz ve boyun hattında ölçülü, derin ama kontrollü bir baskıyla ilerliyorum. Amaç gevşeme, zorlamak değil.",
        en: "I’ll work the shoulders and neck with measured, deep yet controlled pressure. The intention is release, not force."
      },
      tags: ["recovery", "boyun", "omuz", "reset", "kontrollu"]
    },
    {
      id: "REC_05",
      category: "Recovery & Performance",
      role: "Reception",
      title: "Seans Sonrası Mini Plan",
      safeNote: "Non-medical wellness session; pressure always adjustable; stop/modify on request; no medical claims.",
      lang: {
        tr: "Seans sonrası için basit bir plan yeterli: su, hafif hareket ve mümkünse erken bir akşam.",
        en: "A simple post-session plan is enough: hydrate, gentle movement, and if possible, an early evening."
      },
      tags: ["recovery", "aftercare", "uyku", "hidrasyon"]
    },
    {
      id: "REC_06",
      category: "Recovery & Performance",
      role: "Therapist",
      title: "Yoğunluk Kademesi",
      safeNote: "Non-medical wellness session; pressure always adjustable; stop/modify on request; no medical claims.",
      lang: {
        tr: "Yoğunluğu kademeli tutuyorum. Dilerseniz burada bir adım derinleşebilir ya da aynı yumuşaklıkta kalabiliriz.",
        en: "I’m keeping intensity gradual. If you’d like, we can deepen one step here or stay at the same softness."
      },
      tags: ["recovery", "yogunluk", "iletisim", "guven"]
    },
    {
      id: "REC_07",
      category: "Signature & Couples",
      role: "Therapist",
      title: "Signature Recovery – Derin Reset",
      safeNote: "Non-medical; calm, deep recovery focus; guest comfort first.",
      lang: {
        tr: "Niyet performans değil; sinir sistemine derin bir reset alanı açmak. Dokunuşlar yavaş, net ve topraklayıcı olacak.",
        en: "The intention isn’t performance; it’s space for a deep nervous-system reset. Touch will be slow, clear, and grounding."
      },
      tags: ["signature", "recovery", "reset", "sinir-sistemi", "quiet-luxury"]
    },
    {
      id: "REC_08",
      category: "Signature & Couples",
      role: "Therapist",
      title: "Premium Kapanış – Sessiz Entegrasyon",
      safeNote: "Non-medical; calm closing; guest comfort first.",
      lang: {
        tr: "Kapanışta konuşmayı azaltıyoruz. Bedenin çalışmayı sindirmesi için sessiz bir entegrasyon alanı bırakıyorum.",
        en: "In the closing phase, we reduce conversation. I’ll leave a quiet space for the body to integrate the work."
      },
      tags: ["signature", "recovery", "kapanis", "entegrasyon", "premium"]
    }
  ];
})();
