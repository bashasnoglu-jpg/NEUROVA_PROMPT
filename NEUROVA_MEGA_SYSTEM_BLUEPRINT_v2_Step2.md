# 🧩 NEUROVA MEGA SYSTEM BLUEPRINT v2.0 – Step 2: Data Scenarios

**Amaç:** Bu doküman, sistemin temel iş akışlarını ve bu akışlar sırasında veri katmanıyla olan etkileşimini tanımlar. Her senaryo, bir tetikleyici (trigger), ilgili aktörler ve adım adım gerçekleşen olaylar dizisi olarak modellenmiştir. Bu, hem yazılım geliştirme hem de test süreçleri için bir rehber niteliğindedir.

---

### **Senaryo 1: Yeni Misafir Kaydı ve İlk Spa Deneyimi**

**Açıklama:** Otele gelen ve daha önce spa hizmeti almamış bir misafirin sisteme kaydedilmesi ve ilk ritüelinin baştan sona loglanması süreci.

*   **Tetikleyici:** Resepsiyon personelinin, misafiri sistemde bulamaması.
*   **Aktörler:** Resepsiyon Personeli, Terapist, Sistem (Application Layer), Veritabanı.

**İş Akışı Adımları:**

1.  **Profil Oluşturma:**
    *   Personel, UI üzerinden "Yeni Misafir" formunu açar.
    *   Misafirin temel bilgileri (`full_name`, `phone_number`, `email`, `birth_date`) girilir.
    *   Sistem, `Client_Profile` tablosuna yeni bir kayıt atar (`INSERT`). Başlangıç `total_visits` değeri `0`'dır.

2.  **Ritüel Planlama:**
    *   Personel, misafirin talebine göre takvimden uygun bir "Silence Ritual" seansı seçer.
    *   Sistem, `Session_Log` tablosuna şu bilgilerle yeni bir kayıt atar (`INSERT`):
        *   `client_id`: Yeni oluşturulan misafirin ID'si.
        *   `ritual_type`: 'Silence Ritual'.
        *   `therapist_id`: Atanan terapistin ID'si.
        *   `start_time` ve `end_time` planlanan zamanlardır.
        *   Bu kaydın durumu henüz `planned` veya `upcoming` olarak işaretlenir.

3.  **Ritüel Başlangıcı:**
    *   Terapist, seans saatinde kendi arayüzünden seansı başlatır.
    *   Sistem, ilgili `Session_Log` kaydını günceller (`UPDATE`):
        *   `start_time` alanını `NOW()` ile günceller.
        *   Seans durumu `in_progress` olarak değişir.

4.  **Ritüel Tamamlama:**
    *   Seans sonunda terapist, arayüzden seansı "Tamamla" olarak işaretler.
    *   Açılan ekranda kullanılan ürünleri (`used_products`), misafirin konfor skorunu (`comfort_score`) ve özel notları (`notes`) girer.
    *   Sistem, ilgili `Session_Log` kaydını son kez günceller (`UPDATE`):
        *   `end_time`: `NOW()`.
        *   `duration_min`: `end_time` - `start_time`.
        *   `used_products`, `comfort_score`, `notes` alanları doldurulur.
        *   Seans durumu `completed` olarak değişir.

5.  **Müşteri Profili Güncelleme:**
    *   Bu `completed` olayını takiben sistem, `Client_Profile` tablosunu günceller (`UPDATE`):
        *   `total_visits` değerini `1` artırır.
        *   `last_visit_date` alanını bugünün tarihiyle günceller.
        *   Yapılan harcamaya göre `lifetime_value` güncellenir.

*   **Sonuç:** Yeni misafir, ilk ziyaretine ait tüm verilerle birlikte sisteme kaydedilmiş olur. Gelecekteki AI önerileri için ilk veri seti oluşturulmuştur.

---

### **Senaryo 2: Stok Seviyesi Düşüşü ve AI Uyarısı**

**Açıklama:** Bir ürünün stok seviyesinin, önceden tanımlanmış minimum eşiğin altına düşmesi ve "Miyase Core" AI motorunun bu durumu tespit edip uyarı üretmesi.

*   **Tetikleyici:** Bir ürünün satışı veya bir ritüelde kullanılması.
*   **Aktörler:** Sistem (Transaction Service), Veritabanı, AI Engine ("Miyase Core").

**İş Akışı Adımları:**

1.  **Stok Hareketi:**
    *   Bir "Sothys Serum" satıldığında, sistem `Transaction_Log` tablosuna `action_type: 'sale'` ile yeni bir kayıt atar (`INSERT`).
    *   Eş zamanlı olarak, sistem `Product_Master` tablosundaki ilgili ürünün `stock_quantity` değerini `1` azaltır (`UPDATE`).

2.  **Eşik Kontrolü:**
    *   `Product_Master` tablosundaki `UPDATE` işlemi tamamlandıktan sonra, bir veritabanı tetikleyicisi (trigger) veya uygulama katmanı kontrolü, yeni `stock_quantity` değerini aynı kaydın `min_stock_threshold` değeriyle karşılaştırır.

3.  **Anomali Tespiti:**
    *   Eğer `stock_quantity <= min_stock_threshold` ise, sistem bu durumu bir "olay" (event) olarak işaretler ve Event Bus'a (örn: RabbitMQ) `low_stock_detected` mesajı gönderir.

4.  **AI Müdahalesi:**
    *   AI Engine ("Miyase Core"), bu `low_stock_detected` olayını dinlemektedir.
    *   Olayı yakaladığında, durumu analiz eder ve `AI_Log` tablosuna yeni bir anomali kaydı atar (`INSERT`):
        *   `anomaly_type`: 'Low Stock Threshold Reached'.
        *   `severity_level`: 'warning'.
        *   `related_table`: 'Product_Master'.
        *   `record_id`: İlgili `product_id`.
        *   `description`: "Sothys Serum (SKU: STH101) stok seviyesi (4) minimum eşiğin (5) altına düştü."
        *   `resolved`: `FALSE`.

5.  **Bildirim:**
    *   Sistemin "Notifier" servisi, `AI_Log` tablosuna atanan `severity_level: 'warning'` veya `'critical'` olan yeni kayıtları dinler.
    *   İlgili yöneticilere (örn: Spa Müdürü) e-posta veya anlık bildirim gönderir.

*   **Sonuç:** Stok yönetimi otomatize edilmiş, insan hatasına yer bırakmadan proaktif bir şekilde uyarı mekanizması çalıştırılmıştır.

---

### **Senaryo 3: Personelin Ritüeli Tamamlaması ve Otomatik Raporlama**

**Açıklama:** Bir terapistin bir seansı tamamlamasının, gün sonu veya haftalık raporlamayı besleyecek verileri otomatik olarak nasıl hazırladığını gösterir.

*   **Tetikleyici:** `Session_Log` tablosundaki bir kaydın durumunun `completed` olarak güncellenmesi.
*   **Aktörler:** Terapist, Sistem (Application Layer), Reporting Engine.

**İş Akışı Adımları:**

1.  **Tamamlama Olayı:**
    *   Terapist, Senaryo 1'de olduğu gibi seansı tamamlar. `Session_Log` kaydı `completed` olur.
    *   Bu `UPDATE` işlemi, Event Bus'a `session_completed` olayını, `session_id` ile birlikte yayınlar.

2.  **Raporlama Servisi Devrede:**
    *   `Reporting Engine` (ayrı bir mikroservis olabilir), bu `session_completed` olayını dinler.
    *   Olayı yakalayınca, `session_id`'yi kullanarak `Session_Log` tablosundan tüm seans detaylarını çeker (`SELECT`).
    *   Ayrıca `Client_Profile` ve `Product_Master` tablolarından da ilgili misafir ve ürün bilgilerini alır.

3.  **Veri İşleme ve Birleştirme (Aggregation):**
    *   `Reporting Engine`, bu ham verileri işleyerek gün sonu raporlaması için anlamlı hale getirir. Örneğin:
        *   "Bugün tamamlanan toplam ritüel sayısı" metriğini `1` artırır.
        *   "En çok tercih edilen ritüel tipi" metriğini günceller.
        *   "Terapist performans" tablosuna ilgili terapist için `+1` tamamlanan seans ekler.
        *   Bu işlenmiş verileri, analitik sorgular için optimize edilmiş ayrı bir `Analytics_Daily_Stats` tablosuna yazar (`INSERT` veya `UPDATE`).

*   **Sonuç:** Her tamamlanan operasyon, manuel bir müdahaleye gerek kalmadan, merkezi raporlama sistemini gerçek zamanlı olarak besler. Bu, yöneticilerin anlık ve doğru verilere dayalı kararlar almasını sağlar.

---

### **Senaryo 4: Online Satış ve Transaction_Log Entegrasyonu**

**Açıklama:** Harici bir e-ticaret platformundan (örn: Shopify) gelen bir satışın, NEUROVA'nın merkezi `Transaction_Log` sistemine nasıl entegre edildiği.

*   **Tetikleyici:** E-ticaret platformunda başarılı bir siparişin tamamlanması.
*   **Aktörler:** E-ticaret Platformu, Sistem (API Gateway, Integration Service).

**İş Akışı Adımları:**

1.  **Webhook Çağrısı:**
    *   E-ticaret platformu, sipariş tamamlandığında önceden tanımlanmış bir NEUROVA API endpoint'ine (Webhook) bir `POST` isteği gönderir.
    *   İsteğin gövdesi (body), sipariş detaylarını içerir: `{ "sku": "STH101", "quantity": 1, "customer_email": "...", "total_price": "950.00", ... }`.

2.  **API Gateway ve Güvenlik:**
    *   İstek, NEUROVA'nın API Gateway'i tarafından karşılanır. Gateway, isteğin geçerli bir kaynaktan geldiğini doğrular (örn: `X-Shopify-Hmac-Sha256` header'ını kontrol ederek).
    *   Doğrulanan istek, `Integration Service`'e yönlendirilir.

3.  **Veri İşleme ve Kayıt:**
    *   `Integration Service`, gelen `sku_code`'u kullanarak `Product_Master` tablosundan `product_id`'yi bulur.
    *   Gelen `customer_email`'i kullanarak `Client_Profile` tablosunda bir müşteri arar; yoksa yeni bir tane oluşturur.
    *   Tüm bu bilgilerle, `Transaction_Log` tablosuna yeni bir kayıt atar (`INSERT`):
        *   `product_id`, `client_id` doldurulur.
        *   `action_type`: 'sale'.
        *   `source_channel`: 'online_ecommerce'.
        *   `checksum`: Kurala göre hash oluşturulur.
        *   `verified`: `TRUE` (çünkü ödeme zaten alındı).

4.  **Stok Güncelleme:**
    *   `Transaction_Log` kaydı başarılı olduğunda, servis `Product_Master` tablosundaki ilgili ürünün `stock_quantity` değerini düşürür (`UPDATE`).
    *   (Senaryo 2'deki gibi, bu işlem de stok uyarısını tetikleyebilir).

5.  **Yanıt:**
    *   Tüm işlemler başarılı olursa, `Integration Service` e-ticaret platformunun webhook'una `200 OK` HTTP durum koduyla yanıt döner.

*   **Sonuç:** Fiziksel ve dijital satış kanalları tek bir merkezi sistemde birleştirilmiş olur. Stok, müşteri ve finansal verilerin bütünlüğü tüm kanallarda korunur.

---

`#CHECKPOINT [Blueprint_v2_Step2_Scenarios] 2025-12-27T14:40:00Z`
`State 'Data Scenarios Design' saved successfully.`
`Ready to proceed to Step 3: "Miyase Core" Algorithm Drafts.`