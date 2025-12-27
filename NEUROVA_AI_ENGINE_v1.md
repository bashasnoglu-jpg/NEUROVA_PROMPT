
# NEUROVA AI & DEBUG ENGINE - v1.0

**Protocol:** PROTU v1.0
**Document ID:** NEUROVA_AI_ENGINE_v1.md
**Status:** DRAFT

---

## 1. GENEL BAKIŞ

Bu belge, NEUROVA MEGA sisteminin "beyni" olarak işlev görecek olan **AI & Debug Motoru**'nun mantığını, algoritmalarını ve işleyişini tanımlar. Motorun üç ana görevi vardır:
1.  **Anomali Tespiti:** Sistemdeki olağandışı durumları proaktif olarak belirlemek.
2.  **Tahminleme (Predictive Analytics):** Gelecekteki olayları (satış, misafir davranışı vb.) öngörmek.
3.  **Otomatik Hata Ayıklama ve Raporlama (Debug & Reporting):** Tespit edilen sorunlara müdahale etmek ve günlük sistem sağlığı raporları üretmek.

---

## 2. ANOMALI TESPİT MODELİ

Bu modül, sistemin sinir sistemidir ve beklenmedik olayları tespit eder.

### 2.1. Model Mantığı ve Algoritma
- **Algoritma:** **Isolation Forest**. Bu algoritma, büyük veri setleri içinde "normal"den ayrışan aykırı değerleri hızlı ve verimli bir şekilde tespit etmek için seçilmiştir. Özellikle yüksek boyutlu verilerde (çok sayıda sensör ve log verisi) etkilidir.
- **Çalışma Prensibi:** Model, veri noktalarını rastgele özellikler ve rastgele eşik değerleri ile ayırarak "izole etmeye" çalışır. Anomaliler, normal noktalara göre çok daha az sayıda ayırma ile izole edilebildikleri için kolayca tespit edilirler.

### 2.2. Veri Kaynakları ve Analiz
- **İşlem Verileri:** `transactions` tablosundaki anormal derecede yüksek/düşük tutarlar, gece yarısı yapılan işlemler.
- **Sensör Verileri (IoT):** Hamam veya saunadaki ani sıcaklık düşüşleri/yükselişleri, su kullanımındaki aşırılıklar (potansiyel sızıntı).
- **Sistem Logları:** Belirli bir servisten gelen hata loglarının sayısındaki ani artış.

### 2.3. Öğrenme Döngüsü
- **İlk Eğitim (Baseline Training):** Sistemin ilk 1 aylık normal operasyon verisi kullanılarak bir "normal davranış profili" (baseline) oluşturulur.
- **Artımlı Öğrenme (Incremental Learning):** Her 24 saatte bir, son günün verileri kullanılarak model, mevcut normal davranış profiline adapte edilir. Bu, mevsimsel veya trende bağlı değişimlere uyum sağlamayı mümkün kılar.

---

## 3. TAHMİNLEME MOTORU (PREDICTIVE ANALYTICS)

Bu modül, iş kararlarını desteklemek ve misafir deneyimini kişiselleştirmek için geleceğe yönelik öngörüler üretir.

### 3.1. Satış ve Talep Tahminlemesi
- **Model:** **ARIMA (Autoregressive Integrated Moving Average)**. Bu model, zaman serisi verilerindeki (örn. günlük satışlar) trendleri ve mevsimselliği analiz ederek gelecekteki satışları tahmin etmek için idealdir.
- **Hedef:** Gelecek 7 gün için ürün ve hizmet bazında satış adedi ve ciro tahmini. Bu, stok ve personel planlaması için kullanılır.

### 3.2. Misafir Davranışı Tahminlemesi
- **Model:** **Gradient Boosting Classifier (XGBoost)**.
- **Hedef:** Bir misafirin belirli bir hizmeti (örn. spa masajı) satın alma olasılığını tahmin etmek.
- **Özellikler (Features):** Misafirin geçmiş harcamaları, konaklama süresi, sadakat seviyesi, geldiği ülke, daha önceki tercihleri.
- **Kullanım Senaryosu:** `P(spa_booking) > 0.75` ise, concierge dashboard'unda "Bu misafire özel bir spa teklifi sun" şeklinde bir öneri belirir.

---

## 4. DEBUG & SELF-HEALING MODÜLÜ

Bu modül, Anomali Tespit motorundan gelen uyarıları eyleme dönüştürür.

### 4.1. Kural Tabanlı Eylem Mantığı
Modül, `IF [anomaly_type] AND [severity > X] THEN [action]` şeklinde basit kural setleri ile çalışır.
- **Örnek 1:** `IF [anomaly_type = 'API_ERROR_RATE_HIGH'] AND [severity > 0.8] THEN [RESTART_SERVICE('payment-api')]`
- **Örnek 2:** `IF [anomaly_type = 'WATER_USAGE_SPIKE'] AND [source = 'Room-301'] THEN [CREATE_TICKET('maintenance', 'Check for leak in Room 301')]`

### 4.2. Self-Healing (Kendi Kendini İyileştirme) Aksiyonları
- **Cache Temizleme:** Bir servisin yavaşladığı tespit edilirse, ilişkili Redis cache'ini otomatik olarak temizler.
- **Servis Yeniden Başlatma:** Hata oranı belirli bir eşiği geçen bir mikroservisi otomatik olarak yeniden başlatır.
- **Veri Karantinası:** Bütünlüğü bozulmuş (örn: `data_hash` uyuşmazlığı) bir işlem kaydını ana tablodan çıkarıp `quarantined_data` tablosuna taşır ve inceleme için işaretler.

---

## 5. "AI MİYASE REPORT" ÜRETİMİ

Bu, protokolün "D. RAPORLAMA VE İZLEME SİSTEMİ" bölümünde belirtilen günlük rapordur.

### 5.1. Rapor Üretim Algoritması
1.  **Zamanlama:** Her sabah 05:00'te otomatik olarak çalışır.
2.  **Veri Toplama:**
    - Son 24 saatteki `transactions` tablosundan işlem sayısını alır.
    - `anomaly_reports` tablosundan tespit edilen anomali sayısını alır.
    - Tahminleme motorundan son 24 saatteki satış tahmin doğruluğunu (`prediction_accuracy`) alır.
    - `self_healing_logs` tablosundan otomatik iyileştirme aksiyonlarının kaydını alır.
3.  **Metin Oluşturma (Text Generation):**
    - Toplanan metrikler, önceden tanımlanmış bir şablona yerleştirilir.
    - **AI Notes** bölümü için, basit bir kural motoru kullanılır:
        - `IF prediction_accuracy < 85% THEN note = "Prediction model may need retraining."`
        - `IF anomaly_count > 10 THEN note = "High number of anomalies detected. System requires review."`
4.  **Dağıtım:** Oluşturulan metin raporu, `reports_archive` klasörüne kaydedilir ve yöneticilere e-posta ile gönderilir.

---
**Belge Sonu**
