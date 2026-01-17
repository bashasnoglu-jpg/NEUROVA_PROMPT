# NEUROVA Asset Standard v1.0

## 1. Amaç
Bu doküman, NEUROVA projesindeki tüm statik varlıkların
(dosya adları, klasör yapısı ve referanslar)
tek tip, güvenli ve otomatik doğrulanabilir olmasını garanti altına alır.

## 2. Dosya Adı Kuralları
- Sadece küçük harf
- ASCII karakterler (a–z, 0–9)
- Kelimeler arasında `-`
- Boşluk YOK
- Türkçe karakter YOK

Örnek:
✅ `hero-bg-dark.jpg`  
❌ `Hero Arka Planı.jpg`

## 3. Klasör Yapısı
```
assets/
  img/
  icons/
  video/
  fonts/
```

## 4. Otomatik Araçlar
| Araç | Amaç |
|----|----|
| sanitize:assets | Dosya adlarını düzeltir |
| sanitize:assets:check | CI doğrulaması |
| scan:assets | Broken reference kontrolü |

## 5. Geliştirme Akışı
1. Asset eklenir
2. Commit sırasında otomatik sanitize edilir
3. CI referansları doğrular
4. Standart dışı durum **fail** verir

## 6. Yasaklı Davranışlar
- `file://` ile test
- Manuel rename
- Absolute path (`C:/`, `/assets/...`)

## 7. Sorumluluk
Bu standart CI tarafından zorunlu tutulur.
İhlaller merge edilemez.