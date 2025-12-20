## Heatmap Overlay — Kullanım ve Kabul Kriterleri

### Kullanıcıya Görünen Metin (Help/Tooltip/README Kısa)
- Heatmap’i açmak için sol alttaki “Isı haritası” chip’ine tıkla. “Kapat” butonu veya ESC (desktop) ile kapat.
- WhatsApp CTA’larına tıklayınca sayaçlar artar; panel veriyi localStorage’dan okur.
- “Kopyala” → CSV + Page mix panoya kopyalanır; toast mesajı sayfa diline göre TR/EN gösterilir.
- “Sıfırla” → sayaçları temizler; onay ister, dil korunur.
- Veri yoksa: “Henüz veri yok. WhatsApp CTA’larına tıkla” (TR/EN uyumlu).

### QA Kabul Kriterleri (“Olması Gereken”)
- **Aç/Kapa**: Chip açar; Kapat butonu ve ESC kapatır; backdrop tıklaması kapatıyorsa sadece dış boşluk kapatsın.
- **Layout/Scroll**: Head sticky; KPI hemen altında; data alanı kendi içinde dikey scroll; tablolar yatay scroll; collapse’ta mini total, expand’de detay geri gelir.
- **Dil Senkronu**: Sayfa lang değişince tüm metinler (toast, empty state dahil) doğru dilde; collapse/expand/reset dil kaydırmaz.
- **Veri Üretimi/Okuma**: WhatsApp CTA click → `nv_wa_click_*` artar; refresh sonrası veriler okunur; varsa `NV_HEAT.readAll()` kullanılır, yoksa prefix taraması.
- **Copy/Export**: Çıktı deterministik (count desc → source asc → tier asc); format “Page mix” şablonu + CSV (`source,tier,count`); clipboard fallback textarea çalışır; toast TR/EN.
- **Reset**: Onay diyalogu; `nv_wa_click_*` silinir; render tazelenir, dil korunur.
- **Debug**: `?debug=1` veya `localStorage.nv_debug=1` → debug kutusu; key sayımı gerçek tarama ile; `NV_HEAT.readAll` tipi doğru gösterilir.
- **Konum/Boyut**: Drag/resize desktop’ta çalışır; snap-to-edges; viewport/resize sonrası clamp (viewport, both axes) ile ekran içinde kalır; pos/size localStorage’dan restore edilir.

### Teknik Sözleşme
- **LocalStorage**: `nv_wa_click_<source>_<tier>` (tier yoksa `N/A`), `nv_heat_overlay_collapsed`, `nv_heat_overlay_pos`, `nv_heat_overlay_size`, `nv_debug` (opsiyonel).
- **DOM id/class**: `#nv-heat-overlay`, `#nv-heat-panel`, `#nv-heat-head`, `#nv-heat-kpis`, `#nv-heat-data`, `#nv-heat-body`, `#nv-heat-resize`, `#nv-heat-close`.
- **Dosyalar**: `NEUROVA_SITE/heatmap-overlay.js` (UI + logic), `NEUROVA_SITE/assets/paketler.css` (layout + scroll + styling).

### Nice-to-have (opsiyonel)
- CSV’ye toplam satırı ekleme (`TOTAL,,<n>`).
- Source filter/search.
- “dock-right” tek tık butonu (sağ alta hizalama).
