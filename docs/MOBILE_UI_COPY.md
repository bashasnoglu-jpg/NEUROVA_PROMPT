# A6 QR + PWA UI COPY — Santis Ops

## A) A6 QR Sticker Baskı Metni (Standart)

### A.1 Genel kurallar

* Boyut: A6 (105 × 148 mm), dikey
* Dil: TR ana, EN küçük satır (opsiyonel)
* İçerik: Kişisel veri yok, telefon yok
* QR altında: Zone + kısa yönerge + “OK/E1–E4” hatırlatma
* Renk: Siyah/beyaz (okunabilirlik)

### A.2 Ortak şablon (A6)

* ÜST (Header):
  * `SANTIS OPS`
  * `WC Kontrol / Restroom Check`
* ORTA (Zone):
  * `Z{zone} — {zoneName}`
* QR alanı: (QR kod burada)
* ALT (Yönerge):
  * `Scan → Task Card`
  * `✅ OK  |  ⚠ E1 Stok  E2 Kir  E3 Arıza  E4 Koku`
  * küçük satır: `No personal data • Log-based verification`

### A.3 Z1–Z4 hazır metinler

* Z1 — Lobby WC  
  * Title: `Z1 — Lobby WC`
* Z2 — Spa WC  
  * Title: `Z2 — Spa WC`
* Z3 — Gym WC  
  * Title: `Z3 — Gym WC`
* Z4 — Pool WC  
  * Title: `Z4 — Pool WC`

Not: Mekâna göre isim değişebilir; **Z kodları sabit** kalır.

## B) PWA Minimal UI Metinleri (TR/EN)

### B.1 Navigasyon

* Bugün / Today  
* Görevler / Tasks  
* WC Kontrol / Restroom  
* Kayıtlar (Logs) / Logs  
* Planlar / Plans  
* Ayarlar / Settings

### B.2 Ortak butonlar

* Görevi Aç / Open Task  
* Görevi Başlat / Start  
* Tamamlandı (OK) / Done (OK)  
* Gönder / Submit  
* Kapat / Close  
* Yenile / Refresh  
* Geri / Back

### B.3 WC Task Card

* Başlık: `WC 30dk Kontrol` / `Restroom 30-min Check`  
* Meta:
  * `Saat: {hh:mm}` / `Time: {hh:mm}`
  * `Tur: {runIdShort}` / `Run: {runIdShort}`
  * `Bölge: Z{zone}` / `Zone: Z{zone}`
* Checklist:
  * `Kağıt / Sabun / Dezenfektan` / `Paper / Soap / Sanitizer`
  * `Klozet / Lavabo` / `Toilet / Sink`
  * `Zemin / Çöp` / `Floor / Trash`
  * `Koku / Havalandırma` / `Odor / Ventilation`
* Butonlar:
  * `OK (Tamamlandı)` / `OK (Done)`
  * `E1 Stok` / `E1 Stock`
  * `E2 Yoğun kir` / `E2 Heavy soil`
  * `E3 Arıza` / `E3 Maintenance`
  * `E4 Koku / Derin` / `E4 Odor / Deep clean`
* Not alanı: `Kısa not (opsiyonel)` / `Short note (optional)`
* Mesaj:
  * `Alındı ✅ Log’a işlendi.` / `Received ✅ Logged.`
  * `Bağlantı yok. Kuyruğa alındı.` / `Offline. Queued.`
  * `Gönderim başarısız. Tekrar dene.` / `Submit failed. Retry.`

### B.4 Logs Viewer

* Filtre / Filter  
* Kırmızı Bayraklar / Red Flags  
* Cevapsız / Missed  
* Tekrarlı Çalışma / Duplicate  
* Hata / Error  
* Süre (ms) / Duration (ms)  
* Dry Run / Dry Run  
* Canlı / Live

## C) UI Metinlerinde Altın Kural

* Buton isimleri asla değişmez (OK, E1–E4 sabit).  
* TR/EN çeviriler aynı anlamı taşımalı, kısalık korunmalı.  
* Kişisel veri hiçbir ekranda görünmez (runId/zone/event dışında).

İstersen bu sözlük JSON’a çevrilerek (`uiCopy.tr.json` + `uiCopy.en.json`) PWA içinde import edilebilir hale getirilir.
