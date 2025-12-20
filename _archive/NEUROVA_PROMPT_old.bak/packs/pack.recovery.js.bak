(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object"
    ? window.NV_PROMPT_PACKS
    : {};

  const PACK_ID = "pack.recovery.v1";

  const P = [
    {
      id: "REC_01",
      title: "Hızlı Check-in (Ağırlık/Yoğunluk)",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "check-in", "basınç", "ağır"],
      safeNote: "Fully draped. Performance-oriented. Non-sexual.",
      tr: "Başlamadan önce iki şey soracağım: en çok gerginlik nerede ve basınç tercihiniz nedir (hafif/orta/yoğun)?",
      en: "Before we start: where do you feel the most tension, and what pressure do you prefer (light/medium/firm)?"
    },
    {
      id: "REC_02",
      title: "Nefesle Sinir Sistemi Denge",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "nefes", "sinir-sistemi", "gevşeme"],
      safeNote: "Fully draped. Nervous-system reset. Non-sexual.",
      tr: "Nefesi uzatarak sinir sistemini daha düşük bir vitese alıyoruz. Bu, kas çalışmasının etkisini yumuşatır.",
      en: "We’ll lengthen the breath to downshift the nervous system, allowing the effects of muscle work to soften."
    },
    {
      id: "REC_03",
      title: "Bacak Recovery (Dolaşım)",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "bacak", "dolaşım", "ritim"],
      safeNote: "Fully draped. Circulation-focused. Non-sexual.",
      tr: "Bacaklarda dolaşımı destekleyen akıcı ve ritmik bir çalışma uygulayacağım. Herhangi bir hassasiyet olursa hemen ayarlarım.",
      en: "I’ll use a flowing, rhythmic approach to support circulation in the legs. We’ll adjust immediately if anything feels sensitive."
    },
    {
      id: "REC_04",
      title: "Omuz-Boyun Reset",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "boyun", "omuz", "reset", "kontrol"],
      safeNote: "Fully draped. Controlled release. Non-sexual.",
      tr: "Omuz ve boyun hattında ölçülü, derin ama kontrollü bir baskıyla ilerliyorum. Amaç gevşeme, zorlamak değil.",
      en: "I’ll work the shoulders and neck with measured, deep yet controlled pressure. The intention is release, not force."
    },
    {
      id: "REC_05",
      title: "Seans Sonrası Mini Plan",
      category: "Recovery & Performance",
      role: "Reception",
      tags: ["recovery", "aftercare", "uyku", "hidrasyon"],
      safeNote: "Guidance only. Non-medical.",
      tr: "Seans sonrası için basit bir plan yeterli: su, hafif hareket ve mümkünse erken bir akşam.",
      en: "A simple post-session plan is enough: hydrate, gentle movement, and if possible, an early evening."
    },
    {
      id: "REC_06",
      title: "Yoğunluk Kademesi",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "yoğunluk", "iletişim", "güven"],
      safeNote: "Fully draped. Gradual intensity. Non-sexual.",
      tr: "Yoğunluğu kademeli tutuyorum. Dilerseniz burada bir adım derinleşebilir ya da aynı yumuşaklıkta kalabiliriz.",
      en: "I’m keeping intensity gradual. If you’d like, we can deepen one step here or remain at the same softness."
    },
    {
      id: "REC_07",
      title: "Signature Recovery – Derin Reset",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "recovery", "reset", "sinir-sistemi", "quiet-luxury"],
      safeNote: "Fully draped. Deep nervous-system reset. Non-sexual.",
      tr: "Niyet performans değil; sinir sistemine derin bir reset alanı açmak. Dokunuşlar yavaş, net ve topraklayıcı olacak.",
      en: "The intention isn’t performance; it’s space for a deep nervous-system reset. Touch will be slow, clear, and grounding."
    },
    {
      id: "REC_08",
      title: "Premium Kapanış – Sessiz Entegrasyon",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "recovery", "kapanış", "entegrasyon", "premium"],
      safeNote: "Fully draped. Quiet integration space. Non-sexual.",
      tr: "Kapanışta konuşmayı azaltıyoruz. Bedenin çalışmayı sindirmesi için sessiz bir entegrasyon alanı bırakıyorum.",
      en: "In the closing phase, we reduce conversation. I’ll leave a quiet space for the body to integrate the work."
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
