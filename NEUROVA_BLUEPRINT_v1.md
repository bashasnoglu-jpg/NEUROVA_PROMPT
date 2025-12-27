
# NEUROVA MEGA SYSTEM BLUEPRINT - v1.0

**Protocol:** PROTU v1.0
**Document ID:** NEUROVA_BLUEPRINT_v1.md
**Status:** DRAFT

---

## 1. AMAÇ VE KAPSAM

Bu belge, NEUROVA markasının tüm dijital ve operasyonel süreçlerini yönetecek olan **NEUROVA MEGA (Meta-learning, Evolving, Guest-centric Automation)** sisteminin mimari tasarımını ve yol haritasını tanımlar. Sistem, lüks spa ve wellness deneyimini akıllı otomasyon ve derinlemesine veri analitiği ile birleştirmeyi hedefler.

---

## 2. MİMARİ YAKLAŞIM

Sistem, **Katmanlı Hizmet Odaklı Mimari (Layered SOA)** prensibine dayanır. Bu yaklaşım, modülerlik, ölçeklenebilirlik, güvenlik ve bakım kolaylığı sağlar. Beş ana katman ve bu katmanları besleyen bir modül ağacı üzerine inşa edilmiştir.

### 2.1. Katmanlı Sistem Mimarisi

1.  **Sunum (Presentation) Katmanı:** Son kullanıcı arayüzleri (Web, Mobil, Personel Panelleri).
2.  **İş Mantığı (Business Logic) Katmanı:** API'ler, otomasyon kuralları ve iş akışları.
3.  **Veri İşleme (Data Processing) Katmanı:** Gerçek zamanlı ve periyodik veri işleme, zenginleştirme.
4.  **Zeka (Intelligence - AI) Katmanı:** Makine öğrenmesi modelleri, tahmin ve anomali tespiti.
5.  **Veri Depolama (Data Storage) Katmanı:** Veri gölü, veri ambarı ve operasyonel veritabanları.

---

## 3. MODÜL AĞACI (MODULE TREE)

Sistemin kalbini oluşturan modüller ve alt bileşenleri aşağıda tanımlanmıştır.

### 3.1. 🛍️ PRODUCT (Ürün ve Stok Yönetimi)
- **İşlev:** Ürünlerin, hizmetlerin, paketlerin ve stok seviyelerinin yönetimi.
- **Veri Akışı:**
    - **Girdi:** Tedarikçi faturaları, manuel stok girişleri, POS satış verileri.
    - **Çıktı:** Güncel stok sayıları, düşük stok uyarıları, satış raporları.
- **API Bağlantıları:** `POST /product`, `GET /stock/{productId}`, `PUT /inventory/adjust`.
- **Tablo Yapıları:** `products`, `stock_levels`, `suppliers`, `purchase_orders`.

### 3.2. 👥 CRM (Müşteri İlişkileri Yönetimi)
- **İşlev:** Misafir profilleri, tercihleri, sadakat programı ve iletişim geçmişinin yönetimi.
- **Veri Akışı:**
    - **Girdi:** Rezervasyon sistemi, misafir anketleri, mobil uygulama etkileşimleri, manuel notlar.
    - **Çıktı:** 360° misafir profili, kişiselleştirilmiş teklifler, segmentasyon.
- **API Bağlantıları:** `GET /guest/{guestId}`, `POST /guest/preference`, `GET /guest/segment/{segmentName}`.
- **Tablo Yapıları:** `guests`, `guest_preferences`, `interaction_logs`, `loyalty_status`.

### 3.3. 🧠 AI (Yapay Zeka Motoru)
- **İşlev:** Tahminleme, anomali tespiti, kişiselleştirme ve sistemin kendi kendini denetlemesi.
- **Veri Akışı:**
    - **Girdi:** Tüm sistemden toplanan anonimleştirilmiş veriler (transaction logları, sensör verileri).
    - **Çıktı:** Anomali uyarıları, satış tahminleri, misafir davranış öngörüleri, "Miyase Core Report".
- **API Bağlantıları:** `POST /ai/predict/sales`, `GET /ai/anomaly/latest`, `POST /ai/self-heal`.
- **Tablo Yapıları:** `ml_models`, `training_data_log`, `prediction_results`, `anomaly_reports`.

### 3.4. 🛡️ SECURITY (Güvenlik ve Uyumluluk)
- **İşlev:** Kimlik doğrulama, yetkilendirme, veri şifreleme ve yasal uyumluluk (KVKK/GDPR).
- **Veri Akışı:**
    - **Girdi:** Giriş denemeleri, API istek logları, yetki değişiklikleri.
    - **Çıktı:** Denetim (audit) kayıtları, güvenlik ihlali uyarıları, erişim raporları.
- **API Bağlantıları:** Entegre Middleware olarak çalışır (örn: OAuth 2.0 provider). `GET /security/audit?user={userId}`.
- **Tablo Yapıları:** `users`, `roles`, `permissions`, `auth_logs`, `pii_access_log`.

### 3.5. 📊 REPORT (Raporlama ve İş Zekası - BI)
- **İşlev:** Gerçek zamanlı dashboard'lar, periyodik PDF raporlar ve KPI takibi.
- **Veri Akışı:**
    - **Girdi:** Veri ambarındaki işlenmiş veriler, AI modülünden gelen içgörüler.
    - **Çıktı:** Görselleştirilmiş dashboard'lar (Grafana/PowerBI), `NEUROVA_DAILY_REPORT.pdf`.
- **API Bağlantıları:** `GET /report/kpi/{kpiName}`, `GET /dashboard/{dashboardId}/data`.
- **Tablo Yapıları:** Veri ambarındaki `fact_sales`, `dim_guests`, `agg_daily_performance` gibi tablarlardan beslenir.

---

## 4. VERİ TABLOSU YAPILARI (ÖRNEK)

### `guests`
| Alan Adı | Türü | Açıklama |
| :--- | :--- | :--- |
| `guest_id` | `UUID` | Primary Key |
| `first_name` | `VARCHAR(255)` | Şifrelenmiş |
| `last_name` | `VARCHAR(255)` | Şifrelenmiş |
| `email` | `VARCHAR(255)` | Şifrelenmiş, Unique |
| `created_at` | `TIMESTAMPZ` | |
| `loyalty_tier`| `ENUM` | ('Bronze', 'Silver', 'Gold') |

### `transactions`
| Alan Adı | Türü | Açıklama |
| :--- | :--- | :--- |
| `transaction_id`| `UUID` | Primary Key |
| `guest_id` | `UUID` | Foreign Key -> guests |
| `product_id` | `UUID` | Foreign Key -> products |
| `amount` | `DECIMAL(10, 2)`| |
| `transaction_time`| `TIMESTAMPZ` | |
| `data_hash` | `CHAR(64)` | `SHA-256` ile doğrulanmış veri bütünlüğü |

---

## 5. ENTEGRASYON NOKTALARI

- **Otel Yönetim Sistemi (PMS):** Rezervasyon ve oda durumu senkronizasyonu.
- **E-ticaret Platformu (Shopify/WooCommerce):** Online ürün satışları ve stok takibi.
- **Ödeme Sağlayıcı (Stripe/PayTR):** Güvenli ödeme işlemleri.
- **IoT Cihazları (MQTT Broker):** Hamam, sauna, tuz odası gibi alanlardan sıcaklık, nem ve kullanım verilerinin toplanması.

---
**Belge Sonu**
