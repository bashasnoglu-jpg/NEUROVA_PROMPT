/* pack.flow.v1.js — NEUROVA Flow Scripts (Hamam/Kids/Ayurveda/Recovery/Signature)
   Drop-in pack: pushes prompts into window.NV_PROMPTS
*/
(() => {
  "use strict";

  window.NV_PROMPTS = Array.isArray(window.NV_PROMPTS) ? window.NV_PROMPTS : [];

  const P = [
    {
      id: "HAMAM_01",
      title: "Karşılama & Ritüel Akışı",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "akış", "karşılama", "konfor", "güven"],
      safeNote: "Fully draped guest. Non-medical wellness language. Non-sexual.",
      tr: "Hoş geldiniz. Bugünkü ritüel ısınma, aralıklı kese, köpük ve dinlenme akışında ilerleyecek. Başlamadan önce basınç ve sıcaklık tercihlerinizi alacağım.",
      en: "Welcome. Today’s ritual follows a warm-up, measured exfoliation, foam cleanse, and rest. I’ll begin by checking your pressure and heat preferences."
    },
    {
      id: "HAMAM_02",
      title: "Isınma & Nefes Ayarı",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "ısınma", "nefes", "rahatlama"],
      safeNote: "Fully draped guest. Calm guidance only. Non-sexual.",
      tr: "Isınma bölümündeyiz. Nefesi yavaşlatıp omuzları bırakıyoruz. Isı dengesini bedeninizin verdiği sinyallere göre ayarlayacağım.",
      en: "We’re in the warming phase. We’ll slow the breath and soften the shoulders, adjusting the heat based on your body’s signals."
    },
    {
      id: "HAMAM_03",
      title: "Kese Öncesi Onay",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "kese", "onay", "basınç", "hassasiyet"],
      safeNote: "Consent + pressure preference check. Fully draped. Non-sexual.",
      tr: "Kese öncesi küçük bir ayar yapalım. Basıncı hafif, orta ya da daha derin tercih edebilirsiniz. Hassas bir alan varsa bana bildirmeniz yeterli.",
      en: "Before exfoliation, let’s set the tone. You may choose light, medium, or deeper pressure. Please let me know if any area feels sensitive."
    },
    {
      id: "HAMAM_04",
      title: "Köpük & Temizlenme",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "köpük", "temizlik", "sakinlik"],
      safeNote: "Fully draped guest. Non-medical. Non-sexual.",
      tr: "Şimdi köpük temizliğine geçiyoruz. Köpüğü yumuşak bir katman gibi uygulayıp ritmi bilinçli olarak yavaşlatacağım.",
      en: "We now move into the foam cleanse. I’ll apply the foam as a soft layer and intentionally slow the rhythm."
    },
    {
      id: "HAMAM_05",
      title: "Ritüel Sonrası Öneri",
      category: "Hamam Ritüelleri",
      role: "Reception",
      tags: ["hamam", "aftercare", "hidrasyon", "dinlenme"],
      safeNote: "General wellness aftercare. No medical claims.",
      tr: "Ritüel sonrası su tüketimini artırmanızı öneririm. Dilerseniz dinlenme alanında biraz daha zaman ayırabilirsiniz.",
      en: "After the ritual, increasing hydration is recommended. You’re welcome to spend a little more time in the resting area if you wish."
    },
    {
      id: "HAMAM_06",
      title: "Nazik Kapanış",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      tags: ["hamam", "kapanış", "denge", "rahatlama"],
      safeNote: "Fully draped guest. Brief grounding touches. Non-sexual.",
      tr: "Kapanışta beden ısısını dengeliyorum. Kısa ve yumuşak dokunuşlarla ritüeli tamamlıyoruz.",
      en: "In the closing phase, I balance body temperature and finish the ritual with brief, gentle grounding touches."
    },

    {
      id: "HAMAM_07",
      title: "Signature Hamam – Sessiz Başlangıç",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "couples", "quietLuxury", "sessizlik", "akış"],
      safeNote: "Silence preference + consent-forward tone. Fully draped. Non-sexual.",
      tr: "Bu ritüeli sakin bir akışta, mümkün olduğunca sessiz yöneteceğim. Sessizlik isterseniz, dokunuş ve ritim konuşmanın yerini alır.",
      en: "I’ll guide this ritual in a calm, quiet flow. If you prefer silence, touch and rhythm will speak instead."
    },
    {
      id: "HAMAM_08",
      title: "Çiftler için Senkron Akış",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "couples", "senkron", "denge", "premium"],
      safeNote: "Couples synchronization as timing/flow only. Fully draped. Non-sexual.",
      tr: "Şimdi ritmi senkronluyorum. Dokunuşlar aynı anda başlar; nefes ve ısı dengesiyle birlikte ilerler.",
      en: "I’m synchronizing the rhythm now. Touch begins together and moves with breath and temperature in balance."
    },

    {
      id: "KID_01",
      title: "Nazik Karşılama",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "karşılama", "güven", "yumuşak"],
      safeNote: "Child-friendly language. Guardian present/available. Fully appropriate, non-sexual.",
      tr: "Hoş geldin. Burada her şey yavaş ve yumuşak ilerler. İstersen önce etrafa bakabilir, hazır olduğunda başlayabiliriz.",
      en: "Welcome. Everything here moves slowly and gently. You can look around first, and we’ll begin only when you feel ready."
    },
    {
      id: "KID_02",
      title: "Dokunuş Öncesi İzin",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "izin", "seçim", "dokunuş"],
      safeNote: "Consent-forward. Guardian present/available. Non-sexual.",
      tr: "Başlamadan önce sana soracağım. Dokunuşun çok hafif mi yoksa biraz daha güçlü mü olmasını istersin?",
      en: "Before we start, I’ll ask you. Would you like the touch to be very light, or a little bit stronger?"
    },
    {
      id: "KID_03",
      title: "Rahatlatıcı Nefes",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "nefes", "rahatlama", "oyun"],
      safeNote: "Child-friendly breathing cue. Non-medical.",
      tr: "Şimdi birlikte yavaşça nefes alıyoruz. Nefesini balon gibi şişirip, sonra yavaşça bırakabilirsin.",
      en: "Now we’ll breathe slowly together. You can imagine filling a balloon, then letting it gently float away."
    },
    {
      id: "KID_04",
      title: "Yumuşak Dokunuş Akışı",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "yumuşak", "güven", "kontrol"],
      safeNote: "Stop-anytime language. Guardian present/available. Non-sexual.",
      tr: "Dokunuşlar çok yumuşak olacak. Eğer bir yerde durmamı istersen, bana hemen söyleyebilirsin.",
      en: "The touches will be very gentle. If you want me to stop anywhere, you can tell me right away."
    },
    {
      id: "KID_05",
      title: "Ebeveynle Birlikte Güven",
      category: "Kids & Family",
      role: "Therapist",
      tags: ["kids", "family", "güven", "ebeveyn"],
      safeNote: "Guardian presence and comfort options. Non-sexual.",
      tr: "Anne ya da baban burada seninle. İstersen elini tutabilir ya da sadece yanında durabilir.",
      en: "Your parent is here with you. They can hold your hand or simply stay close, however you prefer."
    },
    {
      id: "KID_06",
      title: "Nazik Kapanış",
      category: "Kids & Family",
      role: "Reception",
      tags: ["kids", "kapanış", "aftercare", "dinlenme"],
      safeNote: "General aftercare suggestion only. Non-medical.",
      tr: "Şimdi yavaşça bitiriyoruz. Biraz su içmek ve kısa bir dinlenme iyi hissettirebilir.",
      en: "We’re finishing slowly now. Drinking some water and taking a short rest can feel very nice."
    },

    {
      id: "AYU_01",
      title: "Abhyanga Yağlı Masaj Akışı",
      category: "Ayurveda Ritüelleri",
      role: "Therapist",
      tags: ["ayurveda", "abhyanga", "denge"],
      safeNote: "Fully draped guest. Non-medical wellness description. Non-sexual.",
      tr: "Sıcak yağla uzun ve akışkan hareketlerle dengeyi destekleyen bir uygulama yapıyoruz.",
      en: "We apply a balancing flow with warm oil and long, grounding strokes."
    },
    {
      id: "AYU_02",
      title: "Shirodhara Zihin Sakinliği",
      category: "Ayurveda Ritüelleri",
      role: "Therapist",
      tags: ["shirodhara", "anti-stress", "ritüel"],
      safeNote: "Non-medical. Calm/relax only. Fully draped.",
      tr: "Ritmik akış ve sessiz ortamla zihni sakinleştirmeye odaklanıyoruz.",
      en: "We focus on calming the mind through rhythmic flow and a quiet setting."
    },

    {
      id: "REC_01",
      title: "Hızlı Check-in (Ağrı/Yoğunluk)",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "check-in", "basınç", "ağrı"],
      safeNote: "Preference check only. Non-medical. Refer out if needed.",
      tr: "Başlamadan önce iki şey soracağım: en çok gerginlik nerede ve basınç tercihiniz nedir (hafif/orta/yoğun)?",
      en: "Before we start: where do you feel the most tension, and what pressure do you prefer (light/medium/firm)?"
    },
    {
      id: "REC_02",
      title: "Nefesle Sinir Sistemi İnişi",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "nefes", "sinir-sistemi", "gevşeme"],
      safeNote: "Relaxation language only. Non-medical claims avoided.",
      tr: "Nefesi uzatarak sinir sistemini daha düşük bir vitese alıyoruz. Bu, kas çalışmasının etkisini yumuşatır.",
      en: "We’ll lengthen the breath to downshift the nervous system, allowing the effects of muscle work to soften."
    },
    {
      id: "REC_03",
      title: "Bacak Recovery (Dolaşım)",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "bacak", "dolaşım", "ritim"],
      safeNote: "General wellness language. Adjust for sensitivity. Non-medical.",
      tr: "Bacaklarda dolaşımı destekleyen akıcı ve ritmik bir çalışma uygulayacağım. Herhangi bir hassasiyet olursa hemen ayarlarız.",
      en: "I’ll use a flowing, rhythmic approach to support circulation in the legs. We’ll adjust immediately if anything feels sensitive."
    },
    {
      id: "REC_04",
      title: "Omuz-Boyun Reset",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "boyun", "omuz", "reset", "kontrollü"],
      safeNote: "Measured pressure. Stop/adjust anytime. Non-medical.",
      tr: "Omuz ve boyun hattında ölçülü, derin ama kontrollü bir baskıyla ilerliyorum. Amaç gevşeme, zorlamak değil.",
      en: "I’ll work the shoulders and neck with measured, deep yet controlled pressure. The intention is release, not force."
    },
    {
      id: "REC_05",
      title: "Seans Sonrası Mini Plan",
      category: "Recovery & Performance",
      role: "Reception",
      tags: ["recovery", "aftercare", "uyku", "hidrasyon"],
      safeNote: "General aftercare suggestions only. Non-medical.",
      tr: "Seans sonrası için basit bir plan yeterli: su, hafif hareket ve mümkünse erken bir akşam.",
      en: "A simple post-session plan is enough: hydrate, gentle movement, and if possible, an early evening."
    },
    {
      id: "REC_06",
      title: "Yoğunluk Kademesi",
      category: "Recovery & Performance",
      role: "Therapist",
      tags: ["recovery", "yoğunluk", "iletişim", "güven"],
      safeNote: "Consent-forward intensity scaling. Non-sexual.",
      tr: "Yoğunluğu kademeli tutuyorum. Dilerseniz burada bir adım derinleşebilir ya da aynı yumuşaklıkta kalabiliriz.",
      en: "I’m keeping intensity gradual. If you’d like, we can deepen one step here or remain at the same softness."
    },

    {
      id: "REC_07",
      title: "Signature Recovery – Derin Reset",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "recovery", "reset", "sinir-sistemi", "quietLuxury"],
      safeNote: "Slow, grounding, non-medical language. Fully draped. Non-sexual.",
      tr: "Niyet performans değil; sinir sistemine derin bir reset alanı açmak. Dokunuşlar yavaş, net ve topraklayıcı olacak.",
      en: "The intention isn’t performance; it’s space for a deep nervous-system reset. Touch will be slow, clear, and grounding."
    },
    {
      id: "REC_08",
      title: "Premium Kapanış – Sessiz Entegrasyon",
      category: "Signature & Couples Ritüelleri",
      role: "Therapist",
      tags: ["signature", "recovery", "kapanış", "entegrasyon", "premium"],
      safeNote: "Quiet closing + integration time. Fully draped. Non-sexual.",
      tr: "Kapanışta konuşmayı azaltıyoruz. Bedenin çalışmayı sindirmesi için sessiz bir entegrasyon alanı bırakıyorum.",
      en: "In the closing phase, we reduce conversation. I’ll leave a quiet space for the body to integrate the work."
    }
  ];

  // de-dupe by id (safe if pack reloaded)
  const seen = new Set(window.NV_PROMPTS.map(x => x && x.id).filter(Boolean));
  for (const x of P) if (!seen.has(x.id)) window.NV_PROMPTS.push(x);

  // optional pack marker
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS && typeof window.NV_PROMPT_PACKS === "object" ? window.NV_PROMPT_PACKS : {};
  window.NV_PROMPT_PACKS["pack.flow.v1"] = { count: P.length, ids: P.map(x => x.id) };
})();
