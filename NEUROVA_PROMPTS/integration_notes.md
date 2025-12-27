# NEUROVA Entegrasyon Notları (v5.0)

## 1. Dosya Yerleşimi

- `store_fix.js` dosyasını `/assets/js/` klasörüne taşıyın.
- `mock/curation.json` dosyasını sitenizin kök dizininde `/mock/` klasörü oluşturarak içine atın.

## 2. HTML Düzenlemeleri (products.html)

Aşağıdaki ID ve Class'ların HTML elementlerinde tanımlı olduğundan emin olun:

### Sepet (Cart)

- Sepet Sayacı (Badge): `id="cart-count"`
- Toplam Fiyat Göstergesi: `id="cart-total-display"`
- Ürün Ekleme Butonları: `class="add-to-cart-btn"`
  - Butonlarda `data-id`, `data-name`, `data-price` öznitelikleri olmalı.

### Kürasyon (Curation)

- Form: `id="curation-form"`
- Mood Seçimi (Select/Input): `id="curation-mood"`
- Bütçe Girişi (Input): `id="curation-budget"`
- Sonuç Alanı (Div): `id="curation-results"`

### Teslimat (Delivery)

- Radyo Butonları: `name="delivery_method"` (value="pickup" ve value="courier")

## 3. Script Ekleme

`</body>` etiketinden hemen önce şu satırı ekleyin:

```html
<script src="./assets/js/store_fix.js"></script>
```

## 4. Canlıya Geçiş

- `store_fix.js` içindeki `fetch('./mock/curation.json')` satırını gerçek backend endpoint'i ile değiştirin.
