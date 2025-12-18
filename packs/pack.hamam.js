(function () {
  "use strict";
  const KEY = "HAMAM";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "HAMAM_01",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      title: "Nazik Karşılama & Akış",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      lang: {
        tr: "Hoş geldiniz. Bugünkü ritüel ısınma, kontrollü kese, köpük ve dinlenme akışında ilerleyecek. Basınç ve sıcaklığı tercihlerinize göre ayarlayacağım.",
        en: "Welcome. Today’s ritual follows a warm-up, measured exfoliation, foam cleanse, and rest. I’ll adjust pressure and heat to your preference."
      },
      tags: ["hamam", "karsilama", "akis", "konfor", "guven"]
    },
    {
      id: "HAMAM_02",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      title: "Isınma & Nefes Ayarı",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      lang: {
        tr: "Isınma bölümündeyiz. Nefesi yavaşlatıp omuzları bırakıyoruz. Isıyı bedeninizin verdiği sinyallere göre ayarlayacağım.",
        en: "We’re in the warming phase. We’ll slow the breath and soften the shoulders. I’ll adjust the heat based on your body’s signals."
      },
      tags: ["hamam", "isinma", "nefes", "rahatlama", "guven"]
    },
    {
      id: "HAMAM_03",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      title: "Kese Öncesi Onay",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      lang: {
        tr: "Kese öncesi küçük bir ayar yapalım. Basıncı hafif, orta ya da daha derin tercih edebilirsiniz. Hassas bir alan varsa bana bildirmeniz yeterli.",
        en: "Before exfoliation, let’s set the tone. You can choose light, medium, or deeper pressure. Tell me if any area feels sensitive."
      },
      tags: ["hamam", "kese", "onay", "basinc", "hassasiyet"]
    },
    {
      id: "HAMAM_04",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      title: "Köpük & Temizlenme",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      lang: {
        tr: "Şimdi köpük temizliğine geçiyoruz. Köpüğü yumuşak bir katman gibi uygulayıp ritmi bilinçli olarak yavaşlatacağım.",
        en: "We’re moving into the foam cleanse. I’ll apply the foam as a soft layer and intentionally slow the rhythm."
      },
      tags: ["hamam", "kopuk", "temizlik", "sakinlik"]
    },
    {
      id: "HAMAM_05",
      category: "Hamam Ritüelleri",
      role: "Reception",
      title: "Ritüel Sonrası Öneri",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      lang: {
        tr: "Ritüel sonrası su tüketimini artırmanızı öneririm. Dilerseniz dinlenme alanında biraz daha kalabilirsiniz.",
        en: "After the ritual, I recommend increasing hydration. You’re welcome to spend more time in the resting area if you wish."
      },
      tags: ["hamam", "aftercare", "hidrasyon", "dinlenme"]
    },
    {
      id: "HAMAM_06",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      title: "Nazik Kapanış",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      lang: {
        tr: "Kapanışta beden ısısını dengeliyorum. Kısa ve yumuşak dokunuşlarla ritüeli tamamlıyoruz.",
        en: "In the closing phase I balance body temperature and finish with brief, gentle grounding touches."
      },
      tags: ["hamam", "kapanis", "denge", "rahatlama"]
    },
    {
      id: "HAMAM_07",
      category: "Signature & Couples",
      role: "Therapist",
      title: "Signature Hamam – Sessiz Başlangıç",
      safeNote: "Non-medical hammam ritual; silence on request; guest comfort first.",
      lang: {
        tr: "Bu ritüeli sakin ve mümkün olduğunca sessiz yöneteceğim. Sessizlik isterseniz, dokunuş ve ritim konuşmanın yerini alır.",
        en: "I’ll guide this ritual calmly and as quietly as you prefer. If you choose silence, touch and rhythm will speak instead."
      },
      tags: ["signature", "couples", "quiet-luxury", "sessizlik", "akis"]
    },
    {
      id: "HAMAM_08",
      category: "Signature & Couples",
      role: "Therapist",
      title: "Çiftler için Senkron Akış",
      safeNote: "Non-medical hammam ritual; synchronized touch; guest comfort first.",
      lang: {
        tr: "Şimdi ritmi senkronluyorum. Dokunuşlar aynı anda başlar; nefes ve ısı dengesiyle birlikte ilerler.",
        en: "I’m synchronizing the rhythm now. Touch begins together and moves with breath and temperature in balance."
      },
      tags: ["signature", "couples", "senkron", "denge", "premium"]

    },
    {
      id: "HAMAM_09",
      category: "Hamam Ritüelleri",
      role: "Therapist",
      title: "Close-up Kese Detay",
      safeNote: "Non-medical hammam ritual; pressure/heat adjusted on request; guest comfort first.",
      prompt: "Describe the close-up kese texture, the warmth of marble, and the filtered steam hovering around the shoulder line.",
      lang: {
        tr: "Close-up kese anında yumuşak ama net dokunuşlarla ritmi yavaşlatıyoruz; konfor ve güven her zaman önce gelir.",
        en: "In this close-up moment we slow the motion, letting the kese glide over marble while the steam gently wraps the shoulders."
      },
      tags: ["hamam", "kese", "close-up", "marble", "detail"]
    },
    {
      id: "HAMAM_10",
      category: "Signature & Couples",
      role: "Therapist",
      title: "NEUROVA Close-up Kese",
      safeNote: "Non-medical signature ritual; silence and comfort paired; guest preference leads the flow.",
      prompt: "Capture the quiet luxury of a close-up kese shot where hands, steam, and marble meet in perfect stillness.",
      lang: {
        tr: "NEUROVA sessizliğiyle close-up kese dokunuşunu anlatıyoruz; eller, buhar ve mermer bir araya gelerek ritmi belirliyor.",
        en: "We narrate the NEUROVA quiet luxury in a close-up kese sequence, where hands, steam, and marble choreograph a soft rhythm."
      },
      tags: ["signature", "quiet-luxury", "kese", "marble", "close-up"]
    }
  ];
})();
