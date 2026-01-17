# NEUROVA DEPLOY CHECKLIST v1.0

**Canonical • Minimal • Mandatory**  
**Version:** v1.0  
**Last reviewed:** 2026-01  
**Referans:** `NEUROVA_UPDATE_TEST_RULE v1.0`  
**Owner:** NEUROVA Core Standards  
**Status:** Canonical / Mandatory

> 🚫 Bu checklist tamamlanmadan deploy yapılmaz.

---

## 1) Kritik Altyapı Kontrolleri

### 1.1 HTTP/HTTPS Protokolü

- [ ] Site **http://** veya **https://** ile açılıyor
- [ ] **file://** ile test yapılmıyor (yalnızca lokal debug senaryosu hariç)

### 1.2 Console Temizliği (Kabul Kriteri)

- [ ] **CORS error yok**
- [ ] **Manifest error yok** (404 / syntax)
- [ ] **“Origin null” error yok** *(file:// değilse kritik)*
- [ ] Sadece **opsiyonel warning** seviyesinde mesajlar kabul

### 1.3 Manifest Doğrulama (TR Master)

- [ ] `<link rel="manifest" ...>` **tek satır**
- [ ] Path doğru: **`/manifest.json`**
- [ ] TR master sayfada **tek adet** manifest link var

---

## 2) Interaction & Smoke Test

### 2.1 Hero & Overlay

- [ ] Hero butonları (`<a>` / `<button>`) **tıklanabilir**
- [ ] Overlay / katmanlar (z-index) **tıklamayı engellemiyor**
- [ ] Hover efektleri **soft transition** ile çalışıyor

### 2.2 Temel Fonksiyonlar (Smoke Test)

- [ ] **Home:** En az 1 buton aksiyon alıyor
- [ ] **Paketler:** Kartlar düzgün render ediliyor
- [ ] **CTA:** WhatsApp / Rezervasyon butonu çalışıyor

---

## 3) Debug Karar Ağacı (Kanonik)

**Senaryo:** Console’da  
`Manifest: property 'start_url' ignored, origin null` göründü.

**Soru:** Siteyi `file://` üzerinden mi açtın?

- **EVET** → ✅ Problem yok (tarayıcı güvenlik politikası, beklenen davranış)
- **HAYIR** → ❌ Kritik hata (kod/manifest/path incelenmeli)

---

## Kalıcı Referanslar (Tartışmaya Kapalı)

- `NEUROVA – HERO POINTER EVENTS FIX v1.0`
- `NEUROVA – LOCAL FILE MANIFEST WARNING (EXPECTED)`
- `NEUROVA – LOCAL DEV HTTP RULE v1.0`
