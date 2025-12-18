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
    }
];
