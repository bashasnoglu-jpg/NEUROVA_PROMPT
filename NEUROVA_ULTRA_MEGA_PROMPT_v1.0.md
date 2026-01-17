# �  **NEUROVA — ULTRA MEGA PROMPT v1.0**

### (Canonical Site Architecture & Maintenance Contract)

## 🎯 AMAÇ (NON-NEGOTIABLE)

Bu prompt’un amacı:

* NEUROVA sitesini **tek mimari evrende** tutmak
* Gelecekte:

  * saçma sapma
  * paralel sistemler
  * “burası niye böyleydi?” soruları
    **ASLA oluşmamasını sağlamak**
* Bakımın **kolay**, **öngörülebilir** ve **tek yerden** yapılabilmesini garanti etmek

Bu bir **estetik prompt değil**, bir **mühendislik sözleşmesi**dir.

---

## 🧱 1. KANONİK SİSTEM TANIMI (FOUNDATION)

### 1.1 Tek Kanonik İskelet

Sistemin **tek doğru iskeleti** aşağıdaki prensipleri **eksiksiz** uygular:

* Slot tabanlı global yapı
  (`nav`, `footer`, `floating-cta`, `reservation`)
* Merkezi JS motorları
  (`nav.js`, `wa-linker.js`, `section-map.js`, `recommendation.js`)
* Merkezi semantik katman
  (`data-page`, `data-section`)
* Tek rezervasyon hedefi
  👉 `#nv-wa`

❌ Başka iskelet YOK
❌ “Bu sayfa biraz farklı” YOK
❌ “Bunu hızlıca yapalım” YOK

---

## 🧭 2. SAYFA KURALLARI (PAGE CONTRACT)

### 2.1 Her sayfa **ZORUNLU** olarak:

```html
<body data-page="SAYFA_KEY">
```

**Geçerli page key’leri (örnek):**

```
home
hamam
massages
face
packages
kids-family
signature-couples
products
gallery
```

❌ `home-en`, `hamam-tr`, `signaturePage` gibi key’ler **ASLA** kullanılmaz.

---

### 2.2 Dil Kuralı (EN / TR)

* Dil **URL’den** anlaşılır (`/en/`)
* `data-page` **asla değişmez**
* `data-section` **TR ve EN’de birebir aynıdır**

Dil = içerik katmanı
Yapı = değişmez

---

## 🧩 3. SECTION SÖZLEŞMESİ (SEMANTIC LAYER)

### 3.1 Ana Kural

* **SADECE** `<section>` elementleri `data-section` alır
* `data-section`:

  * analytics
  * heatmap
  * recommendation
  * AI
    için **tek referanstır**

```html
<section data-section="hamam-details">
```

### 3.2 Section Naming Kuralları

* kebab-case
* kısa
* anlamlı
* **home ile inner page karışmaz**

Örnek:

```
home: hamam-feature
inner: hamam-details
```

---

## 📚 4. TEK KAYNAK PRENSİBİ (SINGLE SOURCE OF TRUTH)

### 4.1 Yasaklı şeyler

❌ Sayfa içine gömülü nav
❌ Sayfa içine gömülü WhatsApp script
❌ Dosya adına göre çalışan JS
❌ Aynı işlevi yapan 2 farklı JS
❌ Aynı içeriği üreten 2 farklı CSS evreni

### 4.2 İzin verilenler

✅ Slot loader
✅ Merkezi config dosyaları
✅ Tek `SECTION_MAP`
✅ Tek `RECO_MAP`

---

## 📲 5. REZERVASYON & WHATSAPP SÖZLEŞMESİ

### 5.1 Tek Gerçek Hedef

```html
<section id="nv-wa" data-section="nv-wa">
```

### 5.2 Kurallar

* `id="reservation"` **YASAK**
* Tüm CTA’lar:

```html
href="#nv-wa" data-wa="1"
```

WhatsApp mesajları:

* **ASLA** inline script ile yazılmaz
* **SADECE** `wa-linker.js` üzerinden yönetilir

---

## �  6. NAV & DAVRANIŞ KURALLARI

* Nav **her zaman** slot üzerinden gelir
* Nav logic:

  * home → anchor
  * inner → route
* Active state:

  * home → section based
  * inner → page based

Nav:

> bir bileşendir, **sayfa değildir**

---

## 📊 7. ANALYTICS / HEATMAP / AI HAZIRLIĞI

### 7.1 Ölçüm Birimi

> **page + section**

Başka hiçbir şey ölçüm birimi değildir.

### 7.2 Recommendation

* Recommendation:

  * `data-page`
  * `data-section`
  * `SECTION_MAP`
    üzerinden çalışır
* UI’ya müdahale **ancak v1.1+**

---

## 🧼 8. ENCODING & KALİTE KURALLARI

* Tüm dosyalar: **UTF-8**
* Mojibake (``, `g`) **kritik hata** kabul edilir
* Deploy öncesi:

  * encoding
  * duplicate id
  * missing data-section
    **kontrol edilmeden yayın YASAK**

---

## 🧑‍🔧 9. BAKIM & GELECEK STRATEJİSİ

Bu sistem:

* yeni sayfa eklemeyi
* EN/TR genişlemeyi
* AI recommendation
* CMS entegrasyonunu
* A/B testlerini

**yeniden yazım gerektirmeden** destekleyecek şekilde tasarlanmıştır.

Bir sayfa eklemek:

> “copy + content + data-page + data-section”

olmalıdır.
Bundan daha karmaşık hale geliyorsa **yanlış yapılıyor** demektir.

---

## 🚫 10. EN KRİTİK KURAL (MEGA KURAL)

> **Bir çözüm bu prompt’a uyuyorsa doğrudur.**
> **Uymuyorsa — çalışsa bile — YANLIŞTIR.**

---

## ✅ BU PROMPT NASIL KULLANILIR?

Bundan sonra şunu yazman yeterli:

> **“NEUROVA ULTRA MEGA PROMPT v1.0’a göre düzelt”**
> veya
> **“Bu dosyayı ULTRA MEGA PROMPT’a göre refactor et”**

Ben:

* hangi satır yanlış
* neden yanlış
* nasıl düzeltilir

**yorum yapmadan**, **net patch mantığıyla** ilerlerim.

---

## �  SON SÖZ (MÜHENDİSLİK YEMİNİ)

Bu prompt ile:

* site büyür
* karmaşıklaşmaz
* yeni gelen geliştirici bile 1 günde sistemi çözer
* 1 yıl sonra “bunu kim yaptı?” demezsin