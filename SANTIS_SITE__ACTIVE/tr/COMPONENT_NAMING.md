# SANTIS – Component Naming Convention (BEM + Tailwind)

Bu belge, SANTIS projesinde kullanılan **Hybrid CSS Mimarisi**ni tanımlar.
Amaç: Tailwind'in hızını BEM'in (Block Element Modifier) anlamsal yapısıyla birleştirmek.

---

## 1. Temel Felsefe (Hybrid Approach)

*   **Yapı (Structure) & Semantik:** BEM (`nv-card`, `nv-navbar`)
*   **Görünüm (Skin) & Düzen (Layout):** Tailwind Utility (`p-4`, `flex`, `bg-nv-panel`)
*   **Durum (State):** Global state sınıfları (`is-active`, `is-hidden`)

> **Kural:** Her ana bileşen (component) bir `nv-` sınıfı taşımalıdır. Bu, kodun okunabilirliğini artırır ve global stilleri yönetmeyi kolaylaştırır.

---

## 2. İsimlendirme Kuralları (Syntax)

Tüm özel sınıflar **`nv-`** ön eki ile başlar.

### 2.1 Block (Ana Bileşen)
Bağımsız çalışabilen ana yapı.
*   `nv-card`
*   `nv-btn`
*   `nv-hero`

### 2.2 Element (Alt Parça)
Block'a bağımlı parça. Tailwind kullanıldığında element sınıfı yazmak **zorunlu değildir**, ancak karmaşık yapılarda önerilir.
*   `nv-card__image`
*   `nv-hero__title`

### 2.3 Modifier (Varyasyon)
Block veya Element'in farklı bir versiyonu.
*   `nv-btn--ghost`
*   `nv-card--featured`

---

## 3. Tailwind ile Birlikte Kullanım

BEM sınıflarını "çapa" (anchor) olarak kullanın, stil detaylarını Tailwind ile verin.

**✅ DOĞRU:**
```html
<article class="nv-card flex flex-col bg-nv-panel rounded-nv shadow-nv overflow-hidden">
  <div class="nv-card__image relative h-64">
    <img src="..." class="object-cover w-full h-full" alt="...">
  </div>
  <div class="nv-card__content p-6">
    <h3 class="text-xl font-bold text-nv-text">Ritüel Adı</h3>
  </div>
</article>
```

**❌ YANLIŞ (Sadece Utility - Anlamsız):**
```html
<article class="flex flex-col bg-[#41464A] rounded-[18px] shadow-lg overflow-hidden">
  ...
</article>
```
*Neden yanlış? "Bu bir kart mı?" sorusunun cevabı kodda yok.*

---

## 4. State (Durum) Yönetimi

Durumlar için `nv-` prefix'i yerine standart `is-` veya `has-` ön ekleri kullanılır. Bu sınıflar JavaScript ile tetiklenir.

*   `is-active` (Menü açık, tab seçili)
*   `is-loading` (Spinner aktif)
*   `is-visible` (Scroll animasyonu tetiklendi)
*   `has-error` (Form validasyonu)

**Örnek:**
```html
<nav class="nv-mobile-menu fixed inset-0 z-50 transition-transform duration-nv" data-nv-mobile-panel>
  <!-- JS ile 'is-open' eklenince görünür olur -->
</nav>
```

---

## 5. Özel Utility Sınıfları (Tailwind Config)

`tailwind.config.js` içinde tanımlanan özel değerler, tasarım sisteminin (Master Kit) kod karşılığıdır.

| Class | Değer | Kullanım |
| :--- | :--- | :--- |
| `bg-nv-bg` | `#34393D` | Ana arka plan |
| `bg-nv-panel` | `#41464A` | Kart zeminleri |
| `text-nv-text` | `#ECECEC` | Ana metin |
| `rounded-nv` | `18px` | Standart köşe yuvarlama |
| `shadow-nv` | `0 12px 30px...` | Standart gölge |
| `shadow-nv-soft` | `0 8px 24px...` | Quiet Luxury gölge |
| `duration-nv` | `400ms` | Standart geçiş süresi |
| `ease-nv` | `ease-out` | Standart akış |

---

## 6. Örnek Bileşen: "Ritual Card"

Master Kit v1.0 standartlarına uygun bir kart yapısı.

```html
<!-- Block -->
<div class="nv-card group relative overflow-hidden rounded-nv bg-nv-panel shadow-nv-soft transition-all duration-nv hover:-translate-y-1 hover:shadow-nv">
  <!-- Element: Image Wrapper -->
  <div class="nv-card__media aspect-[4/3] overflow-hidden">
    <img src="..." alt="Ritual" class="h-full w-full object-cover transition-transform duration-nv-slow group-hover:scale-105">
  </div>
  <!-- ... -->
</div>
```