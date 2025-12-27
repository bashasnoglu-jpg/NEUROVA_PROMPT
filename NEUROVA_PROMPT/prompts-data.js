// cSpell:language tr,en
// cSpell:words NEUROVA
// NEUROVA prompts data (v1.0)
window.NV_PROMPTS = [
    {
        id: "P001",
        category: "Kar??lama",
        role: "Therapist",
        title: "?lk Kar??lama C?mlesi",
        lang: {
            tr: "Merhaba, ben [?sminiz], bug?n size e?lik edece?im. Nas?ls?n?z, haz?r m?s?n?z?",
            en: "Hello, my name is [Name], I will take care of you today. How are you, are you ready?"
        },
        tags: ["kar??lama", "ilk temas", "giri?"]
    },
    {
        id: "P002",
        category: "Rit?el ?ncesi",
        role: "Therapist",
        title: "Hassasiyet ve Odak Sorgulama",
        lang: {
            tr: "Rit?elimiz yakla??k [s?re] dakika s?recek. Herhangi bir hassasiyetiniz veya ?zellikle odaklanmam? istedi?iniz b?lge var m??",
            en: "Do you have any pain, injury or sensitive area I should know about?"
        },
        tags: ["kons?ltasyon", "g?venlik", "ki?iselle?tirme"]
    },
    {
        id: "P003",
        category: "Rit?el Sonras?",
        role: "Therapist",
        title: "Rit?el Sonras? Kapan??",
        lang: {
            tr: "Rit?elimiz tamamland?. ?u an nas?l hissediyorsunuz? Bug?n bol su i?menizi ?neririm.",
            en: "Your ritual is complete. How do you feel now? I recommend drinking plenty of water today."
        },
        tags: ["kapan??", "?neri", "bak?m sonras?"]
    },
    {
        id: "P004",
        category: "Rit?el ?ncesi",
        role: "Therapist",
        title: "Bas?n? ve Hassasiyet Onay?",
        safeNote: "Consent check language; non-medical.",
        lang: {
            tr: "Rit?ele ba?lamadan ?nce bas?n? tercihlerinizi bir kez daha onaylayal?m. Hangi b?lgede daha hafif kalmam? veya ekstra dikkat etmemi isterseniz hemen s?yleyin.",
            en: "Before we begin, let me reconfirm your pressure preferences. Please say if any area should stay lighter or if you need extra care."
        },
        tags: ["hassasiyet", "bas?n?", "onay"]
    },
    {
        id: "P005",
        category: "Rit?el Sonras?",
        role: "Reception",
        title: "Sessiz Kapan??",
        safeNote: "Aftercare reminder; non-medical wording.",
        lang: {
            tr: "Rit?elin kapan???nda sessizli?i koruyarak nefesinizi sakinle?tiriyor ve suyla dinlenmeyi ?neriyorum.",
            en: "As we close the ritual I keep the tone quiet, guiding the breath into stillness and offering water or rest."
        },
        tags: ["kapan??", "sessizlik", "aftercare"]
    }
];
