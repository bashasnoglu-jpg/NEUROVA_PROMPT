# Personel Hızlı Kullanım Talimatı (TR)

**SANTIS İstek Kütüphanesi (Prompt Library)**

**Sabit linkler**
- Personel erişimi: `http://127.0.0.1:5500/prompt-library.html` (packs yerelde, internet bağımlılığı yok).
- Yönetici/QA modu: `http://127.0.0.1:5500/prompt-library.html?qa=1` (Selftest otomatik, panelde `Selftest: OK`, `ERRORS: 0`).

## 1. Giriş ve günlük 30 saniye kontrolü
- Dosyayı açtıktan sonra sağ alt köşedeki selftest paneline bak: yeşil çubuk, `Health: OK`, `Selftest: OK`.
- Eğer `NV_OBS_SELFTEST_RUN()` işe yaramıyorsa konsola yaz; `window.__NV_SELFTEST_OK__ === true` olmalı.
- Panelde hata varsa (`ERRORS > 0`) `Ctrl+Shift+R` ile sayfayı yenile ve pack’ların yüklenmesini bekle; devam ederse teknik ekibe bildir.
- **Günde bir kez (30 sn)** paneli kontrol et, hatasızsa devam et; acil durumlarda teknik destekle haberleş.

## 2. Rol, dil ve kategori seçimi
- Rol filtresi: `Therapist` terapötik içerikler, `Reception` rezervasyon/sales içerikler için kullan; her rolün kartına sadık kal.
- Dil seçimi: TR veya EN filtresiyle doğru içeriği sıralayın; yanlış dilde prompt paylaşmayın.
- Kategori çubuğu (Ayurveda, Recovery, Kids, Signature vs.) doğru tema bazlı prompt’ları öne çıkarır; butonlardan hızlı seçim yapın.
- Karttaki “Ton Rezervasyon” notu referans verir; kopyalamak yerine kartı kullanın.

## 3. Safe rules (SANTIS tonu)
- Çocuk/teen içeriklerinde ebeveyn izni her seferinde sorulmalı; sessizlik, konfor ve izin kurallarına dikkat.
- Wellness modunda medikal teşhis ya da tedavi sözü yok; ritüel, konfor ve farkındalık dilini kullanın.
- Premium/sakin alanlarda ses düzeyini düşük tutun; kartı okuduktan sonra konumu onaylayın.
- Export kapalı ortamlarda form içinden kopyala, dış ortama transfer etmeyin.

## 4. Prompt ekleme/düzenleme/silme
- Yeni prompt eklemek için kutuya yaz, “Add Prompt” tuşuna bas ve toast mesajını takip et; sistem boş ya da tekrar eden promptu engeller.
- Kart üstündeki “Edit” veya “Delete” tuşunun açtığı modalı kullanarak değişikliği onayla/iptal et.
- Duplicate uyarısı gelirse kelimeyi değiştiren yeni varyasyon hazırla.

## 5. Yapılmayacaklar
- Yanlış dilde prompt paylaşma; önce dil filtresini değiştir.
- Medikal teşhis/tedavi sözü (özellikle Kids / Hamam / Face / Signature & Family) kesinlikle yasak.
- Sessizlik/konfor kurallarını ihlal eden ifadeleri kullanma.
- Prompt’ları dışa aktarırken prod ortamdan kopyalama yapma; sadece sayfa içi kopyalama ya da export modülleriyle çalış.

## 6. QA / Selftest örnekleri
- `http://127.0.0.1:5500/prompt-library.html?qa=1` – QA modu (buton görünür, selftest otomatik).
- `http://127.0.0.1:5500/prompt-library.html` – normal personel modu (QA butonu yok).
- `http://127.0.0.1:5500/prompt-library.html?qa=abc` – geçersiz parametre, normal mod kalır.

## 7. Personel Hızlı Kullanım + Sorun Çözme
- **Kısayolları sabitleyin:** Masaüstüne “SANTIS Prompt (Kullanım)” ve “SANTIS Prompt (QA / Yönetici)” linklerini koyarak doğru sayfaya tek tıklamada ulaşın.
- **30 saniye vardiya rutini:** Her vardiyada selftest panelini aç, `promptsLen > 0` ve `packErrors = 0` olduğundan emin ol; haftada bir `?qa=1` ile “Run QA Tests” butonunu çalıştır.
- **Ekran boşsa 3 hamle:** İçerik gelmiyorsa sırasıyla `Ctrl+Shift+R`, linkin `127.0.0.1:5500/prompt-library.html` olduğunu doğrula, hâlâ boşsa yönetici/IT’ye haber ver.
- **Rol kilidi:** Resepsiyon cihazlarında varsayılan “Reception”, terapist cihazlarında “Therapist” seçili kalsın; bu sayede açık kalması muhtemel yanlış role geçişleri engellenir.
- **Hızlı preset’ler:** “Jet Lag / Recovery”, “Deep Relax”, “Kids & Family” gibi üç hazır buton tanımlayarak sık kullanılan temaları tek tuşla aç; personel menüde kaybolmaz.
