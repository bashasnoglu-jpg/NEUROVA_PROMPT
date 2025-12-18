# Personel Hızlı Kullanım + Sorun Çözme (A4)

**Amaç:** Bu sayfa, sahadaki personelin “tek bakışta” en önemli rutini görmesini sağlar. A4'e uygun, sıkıştırılmış ama okunaklı bir düzen için:

- Print ayarları: Kenar boşlukları 12 mm, yazı tipi `Helvetica/Arial`, 10.5 pt; siyah-beyaz çıktı yeterli.
- Bu dosyayı PDF’e aktarıp `Fit to page`/`Shrink to fit` olmadan yazdır; dilersen duvara asmak için laminate edebilirsin.

## 1. Tek kısayol dosyası

- Masaüstüne iki kısayol sabitleyin:
  1. **NEUROVA Prompt (Kullanım)** → `http://127.0.0.1:5500/prompt-library.html`
  2. **NEUROVA Prompt (QA / Yönetici)** → `http://127.0.0.1:5500/prompt-library.html?qa=1`
- Kısayol adlarını kısaltarak, kullanıcıların doğru moda yanlışlıkla geçmesini engelleyebilirsin.

## 2. 30 saniyelik gün başı kontrolü

- Vardiya başında sadece 3 değer:
  1. `promptsLen > 0` (kartlar gelmiş mi?)
  2. `packErrors = 0`
  3. Haftada 1 kez `?qa=1` ➜ “Run QA Tests”
- Eğer ikisi de yeşilse (Health, Selftest OK) devam edin; değilse teknik ekibe anında haber verin.

## 3. “Ekran boşsa 3 hamle”

| Adım | Yapılacak |
|------|-----------|
| 1 | `Ctrl+Shift+R` ile yenile |
| 2 | Linkin `127.0.0.1:5500/prompt-library.html` olduğuna bak |
| 3 | Hâlâ boşsa yöneticiyi/IT’yi bilgilendir |

## 4. Rol kilidi ile tutarlılık

- Resepsiyon cihazlarında **Reception**, terapist cihazlarında **Therapist** olarak rol filtresini kilitleyin.
- Bu, personelin yanlış rolde içerik arayıp zaman kaybetmesini ve yanlış içerik paylaşmasını engeller.

## 5. Misafir tipine göre hızlı preset

- Üç buton/preset tanımlayın:
  1. **Jet Lag / Recovery** – enerji sebebiyle dinlenme odaklı paketler.
  2. **Deep Relax** – premium sakinlik/vitality için.
  3. **Kids & Family** – ebeveyn izni, sessizlik ve konfor öncelikli.
- Butona basınca ilgili kategori/dil/rolü hızlıca filtreleyin; menü içinde kaybolmayın.

## 6. SafeNote görünür uyarı

- Kids, Hamam, Face kartları “safeNote” satırını vurgulanmış (kalın/çerçeveli) şekilde gösterin.
- Personel bu uyarıyı görene kadar işlem başlatmasın; özellikle ebeveyn izni ve sessizlik kurallarını unutmasın.

## 7. Çıktı adlandırma standardı

- Her görsel kayıt `YYYY-MM-DD_KATEGORI_ROL_DIL_XX.jpg` formatında olmalı. Örnek:
  `2025-12-17_REC_Thai_Therapist_TR_01.jpg`
- Arşiv ve kalite kontrol için bu biçim zorunlu; hatalı dosya varsa geri bildirim kanallarına ekleyin.

## 8. Onay gerektiren 3 alan

- Personel tek başına karar vermesin:
  1. **Kids görselleri**
  2. **Signature & Couples**
  3. **Face – Sothys**
- Her üçünde en az bir yönetici onayı alınmadan yayına geçmeyin.

## 9. Hızlı geri bildirim kanalı

- Kötü/uygunsuz çıktı: kod (örn. `REC_03`) + ekran görüntüsü + kısa not.
- Tek kanalda (WhatsApp/Slack kanalına) gönderin; teknik ekip aynı gün müdahale eder.

## 10. Sürüm etiketi

- Footer’da minimal satır:
  `Prompt Library vX.Y | packs: N | QA: PASS`
- Personel “ben eski sayfayı mı açtım?” demesin; bu satır hangi sürümde olduklarını teyit eder.
