(function () {
  "use strict";
  const KEY = "HAMAM";
  window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {};

  window.NV_PROMPT_PACKS[KEY] = [
    {
      id: "HAMAM_01",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Klasik Osmanli Hamam Ritueli",
      title_tr: "Klasik Osmanli Hamam Ritueli",
      title_en: "Classic Ottoman Hammam Ritual",
      prompt: "Traditional Ottoman hammam ritual on white marble stone, steam-filled atmosphere, natural daylight, cotton pestemals, copper bowl, exfoliating mitt and foam details, calm and timeless spa feeling, ultra realistic, quiet luxury spa photography",
      prompt_tr: "Mermer gobek tasi uzerinde geleneksel Osmanli hamam ritueli, beyaz mermer, buharla dolu atmosfer, dogal gun isigi, pamuk pestemaller, bakir tas, kese ve kopuk detaylari, sakin ve zamansiz bir spa hissi, ultra gercekci, quiet luxury spa photography",
      prompt_en: "Traditional Ottoman hammam ritual on white marble stone, steam-filled atmosphere, natural daylight, cotton pestemals, copper bowl, exfoliating mitt and foam details, calm and timeless spa feeling, ultra realistic, quiet luxury spa photography",
      negative: "crowded, modern tiles, neon light, plastic objects, low quality, blur",
      tags: ["hamam", "ottoman", "classic", "steam", "marble"],
      lang: {
        tr: "Mermer gobek tasi uzerinde geleneksel Osmanli hamam ritueli, beyaz mermer, buharla dolu atmosfer, dogal gun isigi, pamuk pestemaller, bakir tas, kese ve kopuk detaylari, sakin ve zamansiz bir spa hissi, ultra gercekci, quiet luxury spa photography",
        en: "Traditional Ottoman hammam ritual on white marble stone, steam-filled atmosphere, natural daylight, cotton pestemals, copper bowl, exfoliating mitt and foam details, calm and timeless spa feeling, ultra realistic, quiet luxury spa photography"
      },
      langCode: "TR/EN",
      safeNote: "No nudity, no explicit body exposure, towels and foam used appropriately, spa-safe composition"
    },
    {
      id: "HAMAM_02",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Kopuk & Kese Arinma Ritueli",
      title_tr: "Kopuk & Kese Arinma Ritueli",
      title_en: "Foam & Scrub Purification Ritual",
      prompt: "Foam and scrub purification moment in a traditional hammam, soft foam clouds, white marble floor, warm steam, therapeutic touch feeling, minimal Ottoman aesthetic, premium spa photography style",
      prompt_tr: "Geleneksel hamamda kopuk ve kese arinma ani, yumusak kopuk bulutlari, beyaz mermer zemin, sicak buhar, terapotik dokunus hissi, minimal Osmanli estetigi, premium spa fotograf stili",
      prompt_en: "Foam and scrub purification moment in a traditional hammam, soft foam clouds, white marble floor, warm steam, therapeutic touch feeling, minimal Ottoman aesthetic, premium spa photography style",
      negative: "explicit body, aggressive scrub, harsh light, modern spa look",
      tags: ["hamam", "foam", "scrub", "purification"],
      lang: {
        tr: "Geleneksel hamamda kopuk ve kese arinma ani, yumusak kopuk bulutlari, beyaz mermer zemin, sicak buhar, terapotik dokunus hissi, minimal Osmanli estetigi, premium spa fotograf stili",
        en: "Foam and scrub purification moment in a traditional hammam, soft foam clouds, white marble floor, warm steam, therapeutic touch feeling, minimal Ottoman aesthetic, premium spa photography style"
      },
      langCode: "TR/EN",
      safeNote: "Foam covers body areas, respectful angles, non-sexual spa depiction"
    },
    {
      id: "HAMAM_03",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Deniz Tuzu Detox Hamami",
      title_tr: "Deniz Tuzu Detox Hamami",
      title_en: "Sea Salt Detox Hammam",
      prompt: "Sea salt detox hammam ritual, natural stone textures, salt crystals, soft steam, feeling of purification and renewal, quiet luxury spa atmosphere",
      prompt_tr: "Deniz tuzu ile yapilan detox hamam ritueli, dogal tas dokular, tuz kristalleri, yumusak buhar, arinma ve yenilenme hissi, sessiz ve luks spa atmosferi",
      prompt_en: "Sea salt detox hammam ritual, natural stone textures, salt crystals, soft steam, feeling of purification and renewal, quiet luxury spa atmosphere",
      negative: "synthetic salt, bright colors, medical lab look",
      tags: ["hamam", "detox", "sea salt"],
      lang: {
        tr: "Deniz tuzu ile yapilan detox hamam ritueli, dogal tas dokular, tuz kristalleri, yumusak buhar, arinma ve yenilenme hissi, sessiz ve luks spa atmosferi",
        en: "Sea salt detox hammam ritual, natural stone textures, salt crystals, soft steam, feeling of purification and renewal, quiet luxury spa atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "Non-invasive ritual depiction, spa-safe materials only"
    },
    {
      id: "HAMAM_04",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Osmanli Serbeti & Dinlenme Ani",
      title_tr: "Osmanli Serbeti & Dinlenme Ani",
      title_en: "Ottoman Sherbet Resting Moment",
      prompt: "Post-hammam resting area with Ottoman sherbet service, marble benches, cotton pestemal, soft natural light, calm and refined spa serenity, quiet luxury",
      prompt_tr: "Hamam sonrasi dinlenme alaninda Osmanli serbeti sunumu, mermer banklar, pamuk pestemal, los dogal isik, sessiz ve rafine bir spa huzuru, quiet luxury",
      prompt_en: "Post-hammam resting area with Ottoman sherbet service, marble benches, cotton pestemal, soft natural light, calm and refined spa serenity, quiet luxury",
      negative: "modern lounge, glass cups, neon light",
      tags: ["hamam", "ottoman", "rest", "sherbet"],
      lang: {
        tr: "Hamam sonrasi dinlenme alaninda Osmanli serbeti sunumu, mermer banklar, pamuk pestemal, los dogal isik, sessiz ve rafine bir spa huzuru, quiet luxury",
        en: "Post-hammam resting area with Ottoman sherbet service, marble benches, cotton pestemal, soft natural light, calm and refined spa serenity, quiet luxury"
      },
      langCode: "TR/EN",
      safeNote: "Seated, fully covered guests, no body exposure"
    },
    {
      id: "HAMAM_05",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Sicak Mermer Gobek Tasi Ritueli",
      title_tr: "Sicak Mermer Gobek Tasi Ritueli",
      title_en: "Heated Marble Stone Ritual",
      prompt: "Deep relaxation moment on heated marble stone, soft steam, minimal Ottoman architecture, timeless hammam atmosphere",
      prompt_tr: "Isitilmis mermer gobek tasi uzerinde derin gevseme ani, yumusak buhar, sade Osmanli mimarisi, zamansiz hamam atmosferi",
      prompt_en: "Deep relaxation moment on heated marble stone, soft steam, minimal Ottoman architecture, timeless hammam atmosphere",
      negative: "crowded scene, harsh light",
      tags: ["hamam", "marble", "heat"],
      lang: {
        tr: "Isitilmis mermer gobek tasi uzerinde derin gevseme ani, yumusak buhar, sade Osmanli mimarisi, zamansiz hamam atmosferi",
        en: "Deep relaxation moment on heated marble stone, soft steam, minimal Ottoman architecture, timeless hammam atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "Towels used, non-suggestive angles"
    },
    {
      id: "HAMAM_06",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Kahve Telvesi Detox Hamami",
      title_tr: "Kahve Telvesi Detox Hamami",
      title_en: "Coffee Grounds Detox Hammam",
      prompt: "Coffee grounds detox hammam ritual, natural brown tones, purifying touch feeling, warm and luxurious spa aesthetic",
      prompt_tr: "Kahve telvesi ile yapilan detox hamam ritueli, dogal kahverengi tonlar, arindirici dokunus hissi, luks ve sicak spa estetigi",
      prompt_en: "Coffee grounds detox hammam ritual, natural brown tones, purifying touch feeling, warm and luxurious spa aesthetic",
      negative: "food styling, messy look",
      tags: ["hamam", "coffee", "detox"],
      lang: {
        tr: "Kahve telvesi ile yapilan detox hamam ritueli, dogal kahverengi tonlar, arindirici dokunus hissi, luks ve sicak spa estetigi",
        en: "Coffee grounds detox hammam ritual, natural brown tones, purifying touch feeling, warm and luxurious spa aesthetic"
      },
      langCode: "TR/EN",
      safeNote: "Spa context only, no ingestion depiction"
    },
    {
      id: "HAMAM_07",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Kil Maskesi Hamam Ritueli",
      title_tr: "Kil Maskesi Hamam Ritueli",
      title_en: "Clay Mask Hammam Ritual",
      prompt: "Natural clay mask hammam ritual, earthy tones, calm and meditative atmosphere, holistic spa feeling",
      prompt_tr: "Dogal kil maskesi uygulanan hamam ritueli, toprak tonlari, sakin ve meditatif atmosfer, holistik spa hissi",
      prompt_en: "Natural clay mask hammam ritual, earthy tones, calm and meditative atmosphere, holistic spa feeling",
      negative: "medical mask look, bright colors",
      tags: ["hamam", "clay", "detox"],
      lang: {
        tr: "Dogal kil maskesi uygulanan hamam ritueli, toprak tonlari, sakin ve meditatif atmosfer, holistik spa hissi",
        en: "Natural clay mask hammam ritual, earthy tones, calm and meditative atmosphere, holistic spa feeling"
      },
      langCode: "TR/EN",
      safeNote: "Face/body partially covered, respectful spa depiction"
    },
    {
      id: "HAMAM_08",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Aromatik Buhar Hamami",
      title_tr: "Aromatik Buhar Hamami",
      title_en: "Aromatic Steam Hammam",
      prompt: "Steam hammam enriched with herbal aromas, essential oil details, soft light and deep breathing feeling",
      prompt_tr: "Bitkisel aromalarla zenginlestirilmis buhar hamami, ucucu yag detaylari, yumusak isik ve derin nefes hissi",
      prompt_en: "Steam hammam enriched with herbal aromas, essential oil details, soft light and deep breathing feeling",
      negative: "chemical vapor, modern sauna",
      tags: ["hamam", "steam", "aroma"],
      lang: {
        tr: "Bitkisel aromalarla zenginlestirilmis buhar hamami, ucucu yag detaylari, yumusak isik ve derin nefes hissi",
        en: "Steam hammam enriched with herbal aromas, essential oil details, soft light and deep breathing feeling"
      },
      langCode: "TR/EN",
      safeNote: "Wellness context, no exaggerated steam obscuring safety"
    },
    {
      id: "HAMAM_09",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Geleneksel Bakir Tas Seremonisi",
      title_tr: "Geleneksel Bakir Tas Seremonisi",
      title_en: "Traditional Copper Bowl Ceremony",
      prompt: "Water pouring ceremony with copper bowl, ritualistic hammam scene, classic Ottoman details",
      prompt_tr: "Bakir tas ile su dokme seremonisi, rituellistik hamam sahnesi, klasik Osmanli detaylari",
      prompt_en: "Water pouring ceremony with copper bowl, ritualistic hammam scene, classic Ottoman details",
      negative: "plastic tools, modern bathroom",
      tags: ["hamam", "copper", "ritual"],
      lang: {
        tr: "Bakir tas ile su dokme seremonisi, rituellistik hamam sahnesi, klasik Osmanli detaylari",
        en: "Water pouring ceremony with copper bowl, ritualistic hammam scene, classic Ottoman details"
      },
      langCode: "TR/EN",
      safeNote: "Hands and arms only visible, spa-safe framing"
    },
    {
      id: "HAMAM_10",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Gul Suyu Arindirma Ritueli",
      title_tr: "Gul Suyu Arindirma Ritueli",
      title_en: "Rose Water Purification Ritual",
      prompt: "Gentle purification ritual with rose water, elegant use of soft pink tones, serene and refined spa atmosphere",
      prompt_tr: "Gul suyu ile yapilan nazik arindirma ritueli, pembe tonlarin zarif kullanimi, huzurlu ve rafine spa atmosferi",
      prompt_en: "Gentle purification ritual with rose water, elegant use of soft pink tones, serene and refined spa atmosphere",
      negative: "cosmetic ad look",
      tags: ["hamam", "rose", "purification"],
      lang: {
        tr: "Gul suyu ile yapilan nazik arindirma ritueli, pembe tonlarin zarif kullanimi, huzurlu ve rafine spa atmosferi",
        en: "Gentle purification ritual with rose water, elegant use of soft pink tones, serene and refined spa atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "No facial close-ups suggesting cosmetics usage"
    },
    {
      id: "HAMAM_11",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Alg Detox Hamami",
      title_tr: "Alg Detox Hamami",
      title_en: "Algae Detox Hammam",
      prompt: "Algae detox hammam ritual, marine green tones, revitalizing and cleansing spa feeling",
      prompt_tr: "Deniz yosunu ile yapilan alg detox hamami, yesil tonlar, canlandirici ve temizleyici spa hissi",
      prompt_en: "Algae detox hammam ritual, marine green tones, revitalizing and cleansing spa feeling",
      negative: "slimy texture, medical imagery",
      tags: ["hamam", "algae", "detox"],
      lang: {
        tr: "Deniz yosunu ile yapilan alg detox hamami, yesil tonlar, canlandirici ve temizleyici spa hissi",
        en: "Algae detox hammam ritual, marine green tones, revitalizing and cleansing spa feeling"
      },
      langCode: "TR/EN",
      safeNote: "Wellness depiction only, no invasive treatment"
    },
    {
      id: "HAMAM_12",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Ciftler Icin Senkron Hamam",
      title_tr: "Ciftler Icin Senkron Hamam",
      title_en: "Synchronized Couples Hammam",
      prompt: "Couple experiencing synchronized hammam ritual side by side, symmetrical composition, romantic yet minimal spa aesthetic",
      prompt_tr: "Yan yana senkron hamam ritueli yasayan cift, simetrik kompozisyon, romantik ama sade spa estetigi",
      prompt_en: "Couple experiencing synchronized hammam ritual side by side, symmetrical composition, romantic yet minimal spa aesthetic",
      negative: "romantic intimacy, physical closeness",
      tags: ["hamam", "couples"],
      lang: {
        tr: "Yan yana senkron hamam ritueli yasayan cift, simetrik kompozisyon, romantik ama sade spa estetigi",
        en: "Couple experiencing synchronized hammam ritual side by side, symmetrical composition, romantic yet minimal spa aesthetic"
      },
      langCode: "TR/EN",
      safeNote: "No touching, separate towels, respectful distance"
    },
    {
      id: "HAMAM_13",
      category: "Hamam",
      region: "Recovery & Performance",
      role: "Photographer",
      title: "Sabah Canlandirici Hamam",
      title_tr: "Sabah Canlandirici Hamam",
      title_en: "Morning Revitalizing Hammam",
      prompt: "Morning-lit hammam, fresh and energizing atmosphere, feeling of starting the day revitalized",
      prompt_tr: "Sabah isigi alan hamam, ferah ve enerjik atmosfer, gune zinde baslama hissi",
      prompt_en: "Morning-lit hammam, fresh and energizing atmosphere, feeling of starting the day revitalized",
      negative: "sun glare, overexposed",
      tags: ["hamam", "morning", "revitalize"],
      lang: {
        tr: "Sabah isigi alan hamam, ferah ve enerjik atmosfer, gune zinde baslama hissi",
        en: "Morning-lit hammam, fresh and energizing atmosphere, feeling of starting the day revitalized"
      },
      langCode: "TR/EN",
      safeNote: "Neutral poses, spa-safe setting"
    },
    {
      id: "HAMAM_14",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Aksam Derin Rahatlama Hamami",
      title_tr: "Aksam Derin Rahatlama Hamami",
      title_en: "Evening Deep Relax Hammam",
      prompt: "Low-lit evening hammam ritual, slow and calming atmosphere, deep relaxation feeling",
      prompt_tr: "Aksam saatlerinde los isikli hamam ritueli, yavaslatici atmosfer, derin gevseme hissi",
      prompt_en: "Low-lit evening hammam ritual, slow and calming atmosphere, deep relaxation feeling",
      negative: "dark shadows, night club light",
      tags: ["hamam", "evening", "relax"],
      lang: {
        tr: "Aksam saatlerinde los isikli hamam ritueli, yavaslatici atmosfer, derin gevseme hissi",
        en: "Low-lit evening hammam ritual, slow and calming atmosphere, deep relaxation feeling"
      },
      langCode: "TR/EN",
      safeNote: "Soft lighting, no obscured safety"
    },
    {
      id: "HAMAM_15",
      category: "Hamam",
      region: "Signature & Prestige",
      role: "Photographer",
      title: "Osmanli Saray Hamami Ilhami",
      title_tr: "Osmanli Saray Hamami Ilhami",
      title_en: "Ottoman Palace Hammam Inspiration",
      prompt: "Luxury hammam scene inspired by Ottoman palace baths, elegant architectural details, historic and prestigious atmosphere",
      prompt_tr: "Osmanli saray hamamindan ilham alan luks hamam sahnesi, zarif mimari detaylar, tarihi ve prestijli atmosfer",
      prompt_en: "Luxury hammam scene inspired by Ottoman palace baths, elegant architectural details, historic and prestigious atmosphere",
      negative: "museum display look",
      tags: ["hamam", "palace", "luxury"],
      lang: {
        tr: "Osmanli saray hamamindan ilham alan luks hamam sahnesi, zarif mimari detaylar, tarihi ve prestijli atmosfer",
        en: "Luxury hammam scene inspired by Ottoman palace baths, elegant architectural details, historic and prestigious atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "Architectural focus, no body emphasis"
    },
    {
      id: "HAMAM_16",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Altin Isikta Sessiz Hamam",
      title_tr: "Altin Isikta Sessiz Hamam",
      title_en: "Silent Hammam in Golden Light",
      prompt: "Silent hammam scene in golden hour light, soft shadows, white marble, timeless serenity, quiet luxury",
      prompt_tr: "Altin saat isiginda sessiz bir hamam sahnesi, yumusak golgeler, beyaz mermer, zamansiz dinginlik, quiet luxury",
      prompt_en: "Silent hammam scene in golden hour light, soft shadows, white marble, timeless serenity, quiet luxury",
      negative: "harsh glare, lens flare",
      tags: ["hamam", "golden hour", "serenity"],
      lang: {
        tr: "Altin saat isiginda sessiz bir hamam sahnesi, yumusak golgeler, beyaz mermer, zamansiz dinginlik, quiet luxury",
        en: "Silent hammam scene in golden hour light, soft shadows, white marble, timeless serenity, quiet luxury"
      },
      langCode: "TR/EN",
      safeNote: "Architectural focus, towels used"
    },
    {
      id: "HAMAM_17",
      category: "Hamam",
      region: "Ayurveda & Holistic Balance",
      role: "Photographer",
      title: "Ilik Yag Hazirligi Oncesi Hamam",
      title_tr: "Ilik Yag Hazirligi Oncesi Hamam",
      title_en: "Warm Oil Preparation Hammam",
      prompt: "Pre-massage hammam with warm oil preparation, copper vessels, calm preparation moment",
      prompt_tr: "Masaj oncesi ilik yag hazirligi yapilan hamam, bakir kaplar, sakin hazirlik ani",
      prompt_en: "Pre-massage hammam with warm oil preparation, copper vessels, calm preparation moment",
      negative: "clinical setup",
      tags: ["hamam", "preparation", "oil"],
      lang: {
        tr: "Masaj oncesi ilik yag hazirligi yapilan hamam, bakir kaplar, sakin hazirlik ani",
        en: "Pre-massage hammam with warm oil preparation, copper vessels, calm preparation moment"
      },
      langCode: "TR/EN",
      safeNote: "Preparation only, no body exposure"
    },
    {
      id: "HAMAM_18",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Lavanta Esintili Aksam Hamami",
      title_tr: "Lavanta Esintili Aksam Hamami",
      title_en: "Lavender Evening Hammam",
      prompt: "Evening hammam with lavender aroma, elegant reflections of soft purple tones, soothing atmosphere",
      prompt_tr: "Lavanta aromasiyla aksam hamami, mor tonlarin zarif yansimalari, yatistirici atmosfer",
      prompt_en: "Evening hammam with lavender aroma, elegant reflections of soft purple tones, soothing atmosphere",
      negative: "over-scent branding",
      tags: ["hamam", "lavender", "evening"],
      lang: {
        tr: "Lavanta aromasiyla aksam hamami, mor tonlarin zarif yansimalari, yatistirici atmosfer",
        en: "Evening hammam with lavender aroma, elegant reflections of soft purple tones, soothing atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "Aroma implied, non-invasive depiction"
    },
    {
      id: "HAMAM_19",
      category: "Hamam",
      region: "Ayurveda & Holistic Balance",
      role: "Photographer",
      title: "Minimal Tas & Su Ritmi",
      title_tr: "Minimal Tas & Su Ritmi",
      title_en: "Minimal Stone & Water Rhythm",
      prompt: "Minimal hammam scene with stone and water rhythm, clean composition, meditative feeling",
      prompt_tr: "Minimalist tas ve su ritmiyle hamam sahnesi, sade kompozisyon, meditasyon hissi",
      prompt_en: "Minimal hammam scene with stone and water rhythm, clean composition, meditative feeling",
      negative: "modern spa tiles",
      tags: ["hamam", "minimal", "meditation"],
      lang: {
        tr: "Minimalist tas ve su ritmiyle hamam sahnesi, sade kompozisyon, meditasyon hissi",
        en: "Minimal hammam scene with stone and water rhythm, clean composition, meditative feeling"
      },
      langCode: "TR/EN",
      safeNote: "No people emphasized"
    },
    {
      id: "HAMAM_20",
      category: "Hamam",
      region: "Recovery & Performance",
      role: "Photographer",
      title: "Soguk Su Canlandirma Ani",
      title_tr: "Soguk Su Canlandirma Ani",
      title_en: "Cold Water Revitalization Moment",
      prompt: "Post-hammam cold water revitalization moment, copper bowl, refreshing contrast",
      prompt_tr: "Hamam sonrasi soguk suyla canlandirma ani, bakir tas, ferahlatan kontrast",
      prompt_en: "Post-hammam cold water revitalization moment, copper bowl, refreshing contrast",
      negative: "shock imagery",
      tags: ["hamam", "cold water", "revitalize"],
      lang: {
        tr: "Hamam sonrasi soguk suyla canlandirma ani, bakir tas, ferahlatan kontrast",
        en: "Post-hammam cold water revitalization moment, copper bowl, refreshing contrast"
      },
      langCode: "TR/EN",
      safeNote: "Gentle depiction, no extreme temperature cues"
    },
    {
      id: "HAMAM_21",
      category: "Hamam",
      region: "Kids & Family",
      role: "Photographer",
      title: "Aile Dostu Yumusak Hamam",
      title_tr: "Aile Dostu Yumusak Hamam",
      title_en: "Family-Friendly Gentle Hammam",
      prompt: "Family-friendly gentle hammam atmosphere, safe and warm composition",
      prompt_tr: "Ailelere uygun yumusak hamam atmosferi, guvenli ve sicak kompozisyon",
      prompt_en: "Family-friendly gentle hammam atmosphere, safe and warm composition",
      negative: "children close-ups",
      tags: ["hamam", "family", "gentle"],
      lang: {
        tr: "Ailelere uygun yumusak hamam atmosferi, guvenli ve sicak kompozisyon",
        en: "Family-friendly gentle hammam atmosphere, safe and warm composition"
      },
      langCode: "TR/EN",
      safeNote: "No minors depicted; family-safe ambiance only"
    },
    {
      id: "HAMAM_22",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Seans Oncesi Sessiz Bekleme",
      title_tr: "Seans Oncesi Sessiz Bekleme",
      title_en: "Quiet Pre-Session Waiting",
      prompt: "Quiet pre-session waiting area before hammam, pestemals, simple architecture",
      prompt_tr: "Hamam seansi oncesi sessiz bekleme alani, pestemaller, sade mimari",
      prompt_en: "Quiet pre-session waiting area before hammam, pestemals, simple architecture",
      negative: "crowded waiting room",
      tags: ["hamam", "waiting", "calm"],
      lang: {
        tr: "Hamam seansi oncesi sessiz bekleme alani, pestemaller, sade mimari",
        en: "Quiet pre-session waiting area before hammam, pestemals, simple architecture"
      },
      langCode: "TR/EN",
      safeNote: "No people faces visible"
    },
    {
      id: "HAMAM_23",
      category: "Hamam",
      region: "Ayurveda & Holistic Balance",
      role: "Photographer",
      title: "Bitkisel Demleme Detayi",
      title_tr: "Bitkisel Demleme Detayi",
      title_en: "Herbal Infusion Detail",
      prompt: "Herbal infusion details in hammam, glass bottles, natural color palette",
      prompt_tr: "Hamamda bitkisel demleme detaylari, cam siseler, dogal renk paleti",
      prompt_en: "Herbal infusion details in hammam, glass bottles, natural color palette",
      negative: "product advertisement",
      tags: ["hamam", "herbal", "detail"],
      lang: {
        tr: "Hamamda bitkisel demleme detaylari, cam siseler, dogal renk paleti",
        en: "Herbal infusion details in hammam, glass bottles, natural color palette"
      },
      langCode: "TR/EN",
      safeNote: "Still-life focus only"
    },
    {
      id: "HAMAM_24",
      category: "Hamam",
      region: "Signature & Prestige",
      role: "Photographer",
      title: "Mermer Kubbede Yanki",
      title_tr: "Mermer Kubbede Yanki",
      title_en: "Echo Under Marble Dome",
      prompt: "Silence echoing under a marble dome, architectural emphasis, historical feel",
      prompt_tr: "Mermer kubbe altinda yankilanan sessizlik, mimari vurgu, tarihsel his",
      prompt_en: "Silence echoing under a marble dome, architectural emphasis, historical feel",
      negative: "tourist crowd",
      tags: ["hamam", "architecture", "dome"],
      lang: {
        tr: "Mermer kubbe altinda yankilanan sessizlik, mimari vurgu, tarihsel his",
        en: "Silence echoing under a marble dome, architectural emphasis, historical feel"
      },
      langCode: "TR/EN",
      safeNote: "Architecture-only framing"
    },
    {
      id: "HAMAM_25",
      category: "Hamam",
      region: "Seasonal & Detox",
      role: "Photographer",
      title: "Dogal Sabun Arinmasi",
      title_tr: "Dogal Sabun Arinmasi",
      title_en: "Natural Soap Purification",
      prompt: "Purification moment with natural soaps, creamy tones, gentle touch feeling",
      prompt_tr: "Dogal sabunlarla arinma ani, krem tonlar, nazik dokunus hissi",
      prompt_en: "Purification moment with natural soaps, creamy tones, gentle touch feeling",
      negative: "brand logos",
      tags: ["hamam", "soap", "purification"],
      lang: {
        tr: "Dogal sabunlarla arinma ani, krem tonlar, nazik dokunus hissi",
        en: "Purification moment with natural soaps, creamy tones, gentle touch feeling"
      },
      langCode: "TR/EN",
      safeNote: "Hands-only depiction"
    },
    {
      id: "HAMAM_26",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Yavas Rituel Akisi",
      title_tr: "Yavas Rituel Akisi",
      title_en: "Slow Ritual Flow",
      prompt: "Slow flow of a hammam ritual, sense of timelessness, calm composition",
      prompt_tr: "Hamam rituelinin yavas akisi, zamansizlik hissi, sakin kompozisyon",
      prompt_en: "Slow flow of a hammam ritual, sense of timelessness, calm composition",
      negative: "dynamic motion blur",
      tags: ["hamam", "slow", "ritual"],
      lang: {
        tr: "Hamam rituelinin yavas akisi, zamansizlik hissi, sakin kompozisyon",
        en: "Slow flow of a hammam ritual, sense of timelessness, calm composition"
      },
      langCode: "TR/EN",
      safeNote: "Non-dynamic, spa-safe"
    },
    {
      id: "HAMAM_27",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Geceye Hazirlik Hamami",
      title_tr: "Geceye Hazirlik Hamami",
      title_en: "Night Preparation Hammam",
      prompt: "Hammam for night preparation, warm soft lighting, calming atmosphere",
      prompt_tr: "Gece oncesi hazirlik icin hamam, sicak ve yumusak isik, sakinlestirici atmosfer",
      prompt_en: "Hammam for night preparation, warm soft lighting, calming atmosphere",
      negative: "nightclub lighting",
      tags: ["hamam", "night", "prepare"],
      lang: {
        tr: "Gece oncesi hazirlik icin hamam, sicak ve yumusak isik, sakinlestirici atmosfer",
        en: "Hammam for night preparation, warm soft lighting, calming atmosphere"
      },
      langCode: "TR/EN",
      safeNote: "Low light but safe visibility"
    },
    {
      id: "HAMAM_28",
      category: "Hamam",
      region: "Deep Relax & Anti-Stress",
      role: "Photographer",
      title: "Arinma Sonrasi Sessiz Cay",
      title_tr: "Arinma Sonrasi Sessiz Cay",
      title_en: "Quiet Tea After Purification",
      prompt: "Quiet tea service after hammam, minimal presentation, serene rest",
      prompt_tr: "Hamam sonrasi sessiz cay ikrami, sade sunum, dingin dinlenme",
      prompt_en: "Quiet tea service after hammam, minimal presentation, serene rest",
      negative: "food styling focus",
      tags: ["hamam", "tea", "rest"],
      lang: {
        tr: "Hamam sonrasi sessiz cay ikrami, sade sunum, dingin dinlenme",
        en: "Quiet tea service after hammam, minimal presentation, serene rest"
      },
      langCode: "TR/EN",
      safeNote: "Still-life focus"
    },
    {
      id: "HAMAM_29",
      category: "Hamam",
      region: "Signature & Prestige",
      role: "Photographer",
      title: "Klasik Hamam Detay Close-up",
      title_tr: "Klasik Hamam Detay Close-up",
      title_en: "Classic Hammam Detail Close-up",
      prompt: "Close-up details of kese, pestemal and copper bowl, high texture quality",
      prompt_tr: "Kese, pestemal ve bakir tas detay close-up, yuksek doku kalitesi",
      prompt_en: "Close-up details of kese, pestemal and copper bowl, high texture quality",
      negative: "hands holding body",
      tags: ["hamam", "detail", "close-up"],
      lang: {
        tr: "Kese, pestemal ve bakir tas detay close-up, yuksek doku kalitesi",
        en: "Close-up details of kese, pestemal and copper bowl, high texture quality"
      },
      langCode: "TR/EN",
      safeNote: "Object-only close-up"
    },
    {
      id: "HAMAM_30",
      category: "Hamam",
      region: "Signature & Prestige",
      role: "Photographer",
      title: "Zamansiz Osmanli Hamami",
      title_tr: "Zamansiz Osmanli Hamami",
      title_en: "Timeless Ottoman Hammam",
      prompt: "Timeless Ottoman hammam atmosphere, historical elegance, quiet luxury",
      prompt_tr: "Zamansiz Osmanli hamami atmosferi, tarihsel zarafet, sessiz luks",
      prompt_en: "Timeless Ottoman hammam atmosphere, historical elegance, quiet luxury",
      negative: "tourist signage",
      tags: ["hamam", "ottoman", "timeless"],
      lang: {
        tr: "Zamansiz Osmanli hamami atmosferi, tarihsel zarafet, sessiz luks",
        en: "Timeless Ottoman hammam atmosphere, historical elegance, quiet luxury"
      },
      langCode: "TR/EN",
      safeNote: "Architecture and ambiance only"
    }
  ];
})();
