# Santis Pack Checklist

- **2 dakikalık acil kontrol:** ID benzersiz mi? `lang.tr`/`lang.en` dolu mu? SafeNote gerekli kategoride var mı? Tag'ler slug (ascii) mi? `npm run nv:guard` → PASS mı?
- **Zorunlu alanlar:** `id`, `category`, `role`, `title`, `lang.tr`, `lang.en`, `tags` (dizi). `safeNote` opsiyonel ama bazı kategorilerde mecburi.
- **safeNote zorunlu kategoriler:** hamam, kids & family, kids, family, signature & couples, signature, couples, face, face - sothys, face sothys, sothys.
- **ID standardı:** benzersiz, büyük harf + altçizgi tercih edilir (ör. `KID_01`, `HAMAM_03`). Pack KEY ile uyumlu prefix seç; örnekler: `KID_` (Kids & Family), `HAMAM_`, `REC_`, `AYU_`.
- **Dil alanları:** `lang.tr` ve `lang.en` boş bırakma. Ton yumuşak, izin/güven odaklı, net sınır sorar; medikal vaat yok.
- **Tags:** küçük harf, ASCII/slug biçimi (`kids`, `kapanis`, `aftercare`). Diyakritik ve boşluk kullanma.
- **Pack formatı:** Her `packs/pack.*.js` `window.NV_PROMPT_PACKS[KEY]` altında dizilere prompt nesneleri ekler; loader `id`, `category`, `role`, `title`, `lang.tr`, `lang.en`, `tags` ve isteğe bağlı `safeNote` alanlarını normalize eder. `safeNote` zorunlu kategorilerde kısa, medikal vaadi olmayan uyarı; `lang` ifadeleri aynı mesajı iki dilde taşır.
- **Dedupe:** Aynı ID’yi tekrar kullanma; çakışmalara karşı guard uyarır.
- **Bütçe:** Varsayılan limitler: pack ≤ 200 prompt, toplam ≤ 2000. Gerekirse env ile özelleştir (`NV_BUDGET_MAX_PACK_PROMPTS`, `NV_BUDGET_MAX_TOTAL_PROMPTS`).
- **Guard çalıştır:** `npm run nv:guard` (veya `NV_BUDGET_MODE=fail npm run nv:guard`) ile CI/yerel kontrol; safeNote/dil/tag/ID/bütçe uyarılarını incele.
- **QA / selftest:** Sayfayı `prompt-library.html?qa=1` aç, Ctrl+Shift+R yap; sağ alt panelde Selftest = OK olmalı, konsolda `window.__NV_SELFTEST_OK__ === true`.
