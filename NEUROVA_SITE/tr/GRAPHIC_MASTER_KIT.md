# NEUROVA – Grafik Master Kit (Kanonik)

Bu belge, NEUROVA markasının görsel ve dijital tasarım sisteminin temelini oluşturur.
**Figma Component System + Marka Görsel Dili + Versiyonlama Disiplini**

---

## 1) COMPONENT + VARIANTS TANIMI
*(Figma Component Architecture)*

### 1.1 Core Component Mantığı
Her ana öğe **tek bir component**, durumlar **variant** olarak tanımlanır.

#### Örnek: `NV / Card / Ritual`
**Properties (Variants):**
*   `Type`: Ritual | Massage | Package | Kids
*   `Theme`: Dark | Light
*   `State`: Default | Hover | Selected | Disabled
*   `Image`: On | Off
*   `CTA`: On | Off

👉 Böylece **tek kart component’i** ile tüm site + A4 + sosyal medya beslenir.

### 1.2 Zorunlu Core Components
**(v1.0’da kilitli)**

#### Layout
*   `NV / Grid / Section`
*   `NV / Container / MaxWidth`

#### Text
*   `NV / Text / H1–H6`
*   `NV / Text / Body`
*   `NV / Text / Meta`

#### UI
*   `NV / Button / Primary`
*   `NV / Button / Ghost`
*   `NV / Badge`
*   `NV / Divider`

#### Cards
*   `NV / Card / Program`
*   `NV / Card / Package`
*   `NV / Card / Product`
*   `NV / Card / Kids`

### 1.3 Variant Kuralları (Quiet Luxury)
*   Hover → **scale YOK**
*   Shadow → **çok soft veya hiç**
*   Transition → 300–400ms ease-out
*   Kontrast → asla sert değil

> NEUROVA’da variant farkı “bağırmaz”, *fısıldar*.

---

## 2) 🎨 MOODBOARD + IMAGE STYLE BAĞLAMA
*(Visual Language System)*

### 2.1 Ana Moodboard (Global)
**NEUROVA LOOK**
*   Quiet luxury
*   Soft contrast
*   Warm grey tonlar
*   Minimal composition
*   Doğal ışık

**NO:**
*   Aşırı parlaklık
*   Sert siyah/beyaz
*   Stock spa pozları

### 2.2 Bölgesel Image Style Bağlantıları
*(Catalog Regions)*

#### Recovery & Performance
*   Daha kontrastlı
*   Kas dokusu / hareket hissi
*   Serin gri ton

#### Deep Relax & Anti-Stress
*   Yumuşak blur
*   Buhar / sıcaklık hissi
*   Düşük doygunluk

#### Ayurveda & Holistic Balance
*   Doğal dokular
*   Altın / toprak vurgular
*   Ritüel hissi

#### Seasonal & Detox
*   Doğa ışığı
*   Su / arınma teması
*   Ferah ama sakin

### 2.3 Component → Image Mapping
Her component’in **hangi moodboard’dan beslendiği** bellidir.

Örnek:
*   `NV / Card / Ritual` → Deep Relax
*   `NV / Card / Sport` → Recovery
*   `NV / Card / Ayurveda` → Holistic

Bu sayede ekip **yanlış görsel seçemez**.

---

## 3) 📦 v1.0 KİLİTLE + v1.1 GENİŞLETME PLANI
*(Versioning Strategy)*

### 3.1 v1.0 – KİLİTLİ ÇEKİRDEK
**DEĞİŞMEZ**
*   Brand tokens (renk, font, spacing)
*   Core components
*   Card sistemleri
*   Image style kuralları
*   A4 / Web grid oranları

> v1.0 = “Bu NEUROVA’dır” noktası

### 3.2 v1.1 – GÜVENLİ GENİŞLETME
**EKLENEBİLİR**
*   Yeni card type (örn. Event / Retreat)
*   Yeni social media formatları
*   Seasonal campaign overlay’leri
*   Animasyon preset’leri

**ASLA**
*   Renk paleti bozulmaz
*   Typo hiyerarşisi değişmez
*   Grid kırılmaz

### 3.3 Versiyon Etiketleme
Figma:
*   `NV-MASTER-KIT_v1.0`
*   `NV-MASTER-KIT_v1.1`

Component isimleri:
*   `NV / Card / Ritual / v1`
*   `NV / Card / Ritual / v1.1`

---

# NET SONUÇ (Özet)
*   **Component + Variants** → kontrol + hız
*   **Moodboard binding** → tutarlılık
*   **v1.0 kilit / v1.1 genişleme** → kaos yok, evrim var