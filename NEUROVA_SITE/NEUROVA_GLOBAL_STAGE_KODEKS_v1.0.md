# NEUROVA_GLOBAL_STAGE_KODEKS v1.0

## 1) Kanonik dosya

- Dosya: `NEUROVA_SITE/assets/css/nv-global-stage.css`
- Sürüm: `v1.0`
- Amaç: tüm sayfalarda arka plan sahnesi + grain + görsel frame standardı

## 2) Head snippet standardı (TR/EN)

Kanonik include sırası:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel="stylesheet" href="/assets/css/nv-palette-smoke.css">
<link rel="stylesheet" href="/assets/css/paketler.css">
<link rel="stylesheet" href="/assets/css/nv-global-stage.css?v=1.0">
```

Not:
- Bu repo geliştirme sırasında sayfalar çoğunlukla `.../NEUROVA_SITE/...` altında servis edildiği için `/assets/...` yolu sunucu köküne göre değişebilir.
- Bu nedenle projede sahne CSS’i otomatik olarak enjekte edilir (aşağıdaki madde).

## 3) Kural seti (değişmez)

- Her sayfada tek kaynak: `nv-palette-smoke.css` (renkler) + ana css + `nv-global-stage.css` (sahne).
- `nv-global-stage.css` en sonda uygulanır (global override mantığı).

## 4) Kullanım standartları

- Premium görsel: `.nv-media` wrapper önerilir.
- İkon/mini görsellerde köşe yuvarlama istemiyorsan: `data-no-frame`.

Örnek:

```html
<a class="nv-media" href="/assets/img/galeri/01.jpg">
  <img src="/assets/img/galeri/01.jpg" alt="NEUROVA" loading="lazy" decoding="async">
</a>

<img src="/assets/img/icon.svg" data-no-frame alt="">
```

## 5) Otomatik include (repo standardı)

Bu repoda `nv-global-stage.css` dosyası her sayfada otomatik olarak head’e eklenir:

- `NEUROVA_SITE/assets/js/nav-slot-loader.js` `nv-global-stage.css?v=1.0` linkini inject eder.

