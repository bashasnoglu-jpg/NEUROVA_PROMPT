# NEUROVA v1.1 Sprint Plan – Production Hardening

**Hedef:** v1.0 MVP sürümünü gerçek dünya kullanımına hazırlamak, performans, ölçümleme ve içerik kalitesini artırmak.

## 1. Varlık Yönetimi (Real Assets)
*   **Video:** `hero.mp4` placeholder'ı lisanslı stok video veya çekim ile değiştirilecek.
    *   *Action:* `assets/video/` klasörü oluşturulacak.
    *   *Optimization:* Handbrake ile web optimize (1080p, <10MB) edilecek.
    *   *Fallback:* `hero-poster.jpg` oluşturulacak.
*   **Görseller:** Tüm `placehold.co` görselleri `GRAPHIC_MASTER_KIT.md` kurallarına uygun Midjourney v6 çıktıları veya stok görsellerle değiştirilecek.
    *   *Format:* WebP (Lossy, 80% quality).
    *   *Naming:* SEO uyumlu dosya isimleri (örn: `neurova-hamam-kurnasi.webp`).

## 2. Analytics & Legal (Ölçümleme ve Yasal)
*   **GA4 Kurulumu:** Google Analytics 4 mülkü oluşturulacak.
*   **GTM (Google Tag Manager):** Tüm scriptler GTM üzerinden yönetilecek.
*   **Cookie Consent:** GDPR/KVKK uyumlu çerez onayı banner'ı eklenecek.
    *   *Sayfalar:* `privacy.html` ve `terms.html` oluşturulacak (v1.1 kapsamında eklendi).
    *   *Component:* `nv-cookie-banner` (BEM) eklenecek.

## 3. Performans Optimizasyonu (Lighthouse)
*   **LCP (Largest Contentful Paint):** Hero video/görseli için `preload` etiketi eklenecek.
*   **CLS (Cumulative Layout Shift):** Tüm `<img>` etiketlerine `width` ve `height` nitelikleri eklenecek.
*   **Caching:** `sw.js` önbellek stratejisi "Stale-while-revalidate" olarak güncellenecek (dinamik içerik için).
*   **Minification:** HTML/CSS/JS minify süreçleri `build` scriptine eklenecek.

## 4. İçerik & SEO (Content)
*   **Meta Etiketler:** Her sayfa için özgün `title` ve `description` kontrolü yapılacak.
*   **Microcopy:** Buton ve link metinleri "Quiet Luxury" tonuna göre revize edilecek.
*   **Schema.org:** `LocalBusiness` ve `Spa` yapısal verileri `index.html` ve `contact.html` içine eklenecek.

## 5. Erişilebilirlik (A11y)
*   **Alt Text:** Tüm görseller için açıklayıcı alt metinler yazılacak.
*   **Focus States:** Klavye navigasyonu için focus ring stilleri (`ring-nv-highlight`) güçlendirilecek.
*   **Contrast:** Metin/Arka plan kontrast oranları AA seviyesine getirilecek.

---

**Durum:** Planlandı
**Tahmini Süre:** 1 Sprint (1 Hafta)
**Öncelik:** 1. Assets, 2. Analytics, 3. Performance