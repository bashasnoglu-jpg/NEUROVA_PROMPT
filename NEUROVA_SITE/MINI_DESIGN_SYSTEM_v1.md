# NEUROVA DESIGN SYSTEM — CORE LOCK v1.0

> NEUROVA için kilit referans – üretim standardı. Görünür bir tasarım değil, ama bundan sonra her şeyin aynı kalitede olması için temel.

## 1️⃣ Foundation

### 🎨 Renkler
* Arka plan: **Karasen Dark**
* Metin: Soft white / muted grey
* Aksiyon: **Altın ton (var(--nv-gold))**

❌ Yeni renk eklenmez  
❌ Gradient şov yok

### ✍️ Tipografi
* Tek font ailesi (sistem stack / Inter)
* Ağırlıklar:
  * **H1, H2:** 300 (Light) — *Editorial Elegance*
  * **H3, H4:** 400 (Regular) — *Structural*
  * **Body:** 400 (Regular) — *Readable*

❌ Bold satış dili yok  
❌ Caps sadece küçük navigasyonlarda
❌ 500, 600, 700 ağırlıkları yasak (Nav hariç)

## 2️⃣ Component Kataloğu (KanoniK)

* **Header / Nav** — sticky, soft, scroll’da sadece renk değişir.
* **Hero** — tek hero, az metin, görsel varsa ADIM 8 oran sistemi ile.
* **Section Intro** — ortalanmış, kısa ama anlatı odaklı.
* **Cards** — 4:5 oran, hover yumuşak lifti, içerik başlık + 1 satır açıklama.
* **CTA** — bağırmaz, sayfa sonunda, her yerde aynı stil.
* **Buttons** — `.nv-btn` (Pill shape), `.nv-btn-primary` (Gold border/text), `.nv-btn-ghost` (Text only).
* **Inputs** — `.nv-input` (Transparan zemin, Gold focus border).

## 3️⃣ Sayfa Akış Şablonları

| Sayfa | Akış |
| --- | --- |
| Home | Hero → Sections (cards) → CTA |
| List Page (Hamam / Packages) | Intro → Feature Strip → Content Grid → CTA |
| Signature (Long-form) | Hero → Story Intro → Ritual Flow → Sensory → Who It’s For → CTA |

Bu sıralar değişmez.

## 4️⃣ Dil Kuralı
* Yapı **her zaman aynı**
* Dil farkı = sadece metin
* TR root, EN `/en/`

❌ JS ile metin çevirme yok  
❌ Aynı sayfada iki dil yok

## 5️⃣ Yapılmayacaklar
* ❌ Service Worker
* ❌ SPA routing
* ❌ Inline CSS/JS karmaşası
* ❌ “Bir deneyelim” animasyonlar
* ❌ Her sayfaya farklı tasarım

## Kilit Prensip
> **NEUROVA = sessiz lüks.** Göstermez, hissettirir. Hızlı satmaz, bağ kurar.

**CORE LOCK v1.0** — Bu doküman artık projenin anayasasıdır. Değişiklik teklif edilemez, sadece genişletilebilir.
