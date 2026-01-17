# NEUROVA DEPLOY CHECKLIST v1.0
Canonical • Minimal • Mandatory
Version: v1.0
Last reviewed: 2026-01

Bu dosya, her deploy veya büyük güncelleme öncesinde **ZORUNLU** olarak kontrol edilmelidir.
Referans: **NEUROVA_UPDATE_TEST_RULE v1.0**

---

## 🔴 1. KRİTİK ALTYAPI KONTROLLERİ

### 🌐 HTTP/HTTPS Protokolü
- [ ] Site `http://` veya `https://` protokolü ile açıldı.
- [ ] ❌ `file://` protokolü kullanılmıyor.

### 🧹 Console Temizliği
- [ ] **CORS** hatası yok.
- [ ] **Manifest** hatası yok (404 veya syntax).
- [ ] **"Origin null"** hatası yok.
- [ ] *Not: Sadece opsiyonel warning'ler kabul edilebilir.*

### 📱 Manifest Doğrulama
- [ ] `<link rel="manifest">` etiketi tek satır.
- [ ] Path doğru yapılandırılmış (`/manifest.json`).
- [ ] TR master sayfada sadece **1 adet** manifest linki var.

---

## 🖱️ 2. INTERACTION & SMOKE TEST

### 👆 Hero & Overlay
- [ ] Hero butonları (`<a>` / `<button>`) tıklanabilir durumda.
- [ ] Overlay elementleri (`z-index`) tıklamayı engellemiyor.
- [ ] Hover efektleri (soft transition) çalışıyor.

### 🧪 Temel Fonksiyonlar (Smoke Test)
- [ ] **Home:** En az 1 buton aksiyon alıyor.
- [ ] **Paketler:** Kartlar düzgün render ediliyor.
- [ ] **CTA:** WhatsApp / Rezervasyon butonu çalışıyor.

---

## 🌳 3. DEBUG KARAR AĞACI (KANONİK)

**Senaryo:** Console'da `Manifest: property 'start_url' ignored, origin null` hatası var.

1. **Soru:** Siteyi `file://` üzerinden mi açtın?
   - **EVET** ➡️ ✅ **Problem yok.** (Tarayıcı güvenlik politikası, beklenen davranış).
   - **HAYIR** ➡️ ❌ **Kritik Hata.** Kod incelenmeli.

---

## 🔒 KALICI REFERANSLAR (TARTIŞMAYA KAPALI)
- **NEUROVA – HERO POINTER EVENTS FIX v1.0**
- **NEUROVA – LOCAL FILE MANIFEST WARNING (EXPECTED)**
- **NEUROVA – LOCAL DEV HTTP RULE v1.0**

---

🚫 Bu checklist tamamlanmadan deploy yapılmaz.

Owner: NEUROVA Core Standards
Status: Canonical / Mandatory