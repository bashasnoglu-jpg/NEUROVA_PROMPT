# NEUROVA – Site Layout & Grid Plan (v1.0)

Bu belge, Grafik Master Kit ve Visual Guide ile uyumlu olarak, web sitesindeki tüm sayfaların yapısal yerleşim kurallarını tanımlar.

---

## 1. GLOBAL YERLEŞİM KURALLARI

*   **Container (Max Width):** `1100px` (Ortalanmış)
*   **Padding (X-Ekseni):** `24px` (Mobil), `48px` (Desktop)
*   **Grid Sistemi:**
    *   **Mobil:** 1 Sütun (Gap: 24px)
    *   **Tablet:** 2 Sütun (Gap: 32px)
    *   **Desktop:** 3 Sütun (Gap: 32px) veya 4 Sütun (küçük öğeler için)
*   **Bölüm Boşlukları (Y-Ekseni):** `80px` - `120px` (Desktop), `60px` (Mobil)

---

## 2. SAYFA TİPİNE GÖRE YERLEŞİMLER

### 2.1 Ana Sayfa (`index.html`)

*   **Hero Section:**
    *   **Yükseklik:** `100vh` (Tam Ekran) veya `min-h-[600px]`
    *   **İçerik:** Merkez hizalı (H1 + Alt Başlık + CTA)
    *   **Arka Plan:** Video veya Yüksek Çözünürlüklü Görsel (Dark Overlay: %40-50)
    *   **Animasyon:** `fade-in-up`
*   **Intro Section:**
    *   **Düzen:** Tek Sütun Metin (Merkez)
    *   **Genişlik:** `max-w-2xl` (Okunabilirlik için daraltılmış)
*   **Öne Çıkanlar Grid:**
    *   **Düzen:** 3 Sütun
    *   **Bileşen:** `NV / Card / Ritual` (Varyasyon: Image On, Featured)

### 2.2 Listeleme Sayfaları (`hamam.html`, `masajlar.html`, vb.)

*   **Hero Section:**
    *   **Yükseklik:** `70vh` (Min: 500px)
    *   **İçerik:** Merkez hizalı
    *   **Arka Plan:** Kategoriye özel atmosferik görsel (Yüzsüz, Doku odaklı)
*   **Grid Section:**
    *   **Düzen:** 3 Sütun (Desktop), 2 Sütun (Tablet), 1 Sütun (Mobil)
    *   **Bileşen:** `NV / Card / Ritual` (Varyasyon: Default)
    *   **Gap:** `32px`

### 2.3 Kurumsal Sayfalar (`about.html`, `team.html`)

*   **Hero Section:**
    *   **Yükseklik:** `50vh` (Daha kompakt) veya `pt-8 pb-16` (Sadece metin)
    *   **İçerik:** Sol veya Merkez hizalı
*   **İçerik Bölümleri:**
    *   **Düzen:** 2 Sütun (Metin + Görsel) veya Tek Sütun Metin
    *   **Bileşen:** `NV / Grid / Section`

### 2.4 Galeri (`galeri.html`)

*   **Hero Section:**
    *   **Yükseklik:** `70vh`
*   **Grid Section:**
    *   **Düzen:** Masonry (Duvar Örme)
    *   **Sütunlar:** 3 (Desktop), 2 (Tablet), 1 (Mobil)
    *   **Bileşen:** Görsel Kartı (Metinsiz veya sadece hover'da caption)

### 2.5 İletişim (`contact.html`)

*   **Hero Section:**
    *   **Yükseklik:** `pt-8 pb-16` (Metin odaklı)
*   **Grid Section:**
    *   **Düzen:** 12 Sütunlu Grid
        *   **Bilgi:** 4 Sütun (Sol)
        *   **Harita:** 8 Sütun (Sağ)

---

## 3. BİLEŞEN KULLANIM HARİTASI

| Sayfa Tipi | Hero Stili | Kart Tipi | Grid Düzeni |
| :--- | :--- | :--- | :--- |
| **Home** | Tam Ekran (Video/Img) | Ritual Card (Featured) | 3 Col |
| **Hamam** | 70vh (Atmosfer) | Ritual Card (List) | 3 Col |
| **Massage** | 70vh (Atmosfer) | Ritual Card (List) | 3 Col |
| **Face** | 70vh (Klinik/Temiz) | Product/Service Card | 3 Col |
| **Products** | 70vh (Boutique) | Product Card | 3 Col |
| **Gallery** | 70vh (Atmosfer) | Image Card | Masonry |

---

## 4. RESPONSIVE KIRILMA NOKTALARI (Tailwind)

Tasarım kararları aşağıdaki genişliklere göre uygulanır:

*   **sm:** 640px (Mobil Yatay / Küçük Tablet)
*   **md:** 768px (Tablet Dikey)
*   **lg:** 1024px (Tablet Yatay / Küçük Laptop)
*   **xl:** 1280px (Desktop)
*   **2xl:** 1536px (Geniş Ekran)