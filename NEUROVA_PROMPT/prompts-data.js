// NEUROVA prompts data (v1.0)
window.NV_PROMPTS = [
    {
        id: "P001",
        category: "Karşılama",
        role: "Therapist",
        title: "İlk Karşılama Cümlesi",
        lang: {
            tr: "Merhaba, ben [İsminiz], bugün size eşlik edeceğim. Nasılsınız, hazır mısınız?",
            en: "Hello, my name is [Name], I will take care of you today. How are you, are you ready?"
        },
        tags: ["karşılama", "ilk temas", "giriş"]
    },
    {
        id: "P002",
        category: "Ritüel Öncesi",
        role: "Therapist",
        title: "Hassasiyet ve Odak Sorgulama",
        lang: {
            tr: "Ritüelimiz yaklaşık [süre] dakika sürecek. Herhangi bir hassasiyetiniz veya özellikle odaklanmamı istediğiniz bölge var mı?",
            en: "Do you have any pain, injury or sensitive area I should know about?"
        },
        tags: ["konsültasyon", "güvenlik", "kişiselleştirme"]
    },
    {
        id: "P003",
        category: "Ritüel Sonrası",
        role: "Therapist",
        title: "Ritüel Sonrası Kapanış",
        lang: {
            tr: "Ritüelimiz tamamlandı. Şu an nasıl hissediyorsunuz? Bugün bol su içmenizi öneririm.",
            en: "Your ritual is complete. How do you feel now? I recommend drinking plenty of water today."
        },
        tags: ["kapanış", "öneri", "bakım sonrası"]
    },
    {
        id: "P004",
        category: "Ritüel Öncesi",
        role: "Therapist",
        title: "Basınç ve Hassasiyet Onayı",
        safeNote: "Consent check language; non-medical.",
        lang: {
            tr: "Ritüele başlamadan önce basınç tercihlerinizi bir kez daha onaylayalım. Hangi bölgede daha hafif kalmamı veya ekstra dikkat etmemi isterseniz hemen söyleyin.",
            en: "Before we begin, let me reconfirm your pressure preferences. Please say if any area should stay lighter or if you need extra care."
        },
        tags: ["hassasiyet", "basınç", "onay"]
    },
    {
        id: "P005",
        category: "Ritüel Sonrası",
        role: "Reception",
        title: "Sessiz Kapanış",
        safeNote: "Aftercare reminder; non-medical wording.",
        lang: {
            tr: "Ritüelin kapanışında sessizliği koruyarak nefesinizi sakinleştiriyor ve suyla dinlenmeyi öneriyorum.",
            en: "As we close the ritual I keep the tone quiet, guiding the breath into stillness and offering water or rest."
        },
        tags: ["kapanış", "sessizlik", "aftercare"]
    }
];
