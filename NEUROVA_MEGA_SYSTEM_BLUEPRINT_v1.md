# NEUROVA MEGA SYSTEM BLUEPRINT v1.0 (Simulation)

**Belge Amacı:** Bu doküman, NEUROVA platformunun tüm dijital operasyonlarını yönetmesi hedeflenen merkezi sistemin ilk sürüm (v1.0) mimari taslağıdır. Simülasyon amaçlı oluşturulmuştur ve mühendislik denetimi için bir başlangıç noktasıdır.

**Ana Felsefe:** Operasyonel verimlilik, proaktif karar alma, kişiselleştirilmiş müşteri deneyimi ve ölçeklenebilir altyapı.

---

## 1. Yüksek Seviye Mimari Katmanları

Sistem, 4 ana katmandan oluşur:

1.  **Presentation Layer (Sunum Katmanı):** Son kullanıcıların ve personelin etkileşimde bulunduğu arayüzler.
    - *Bileşenler:* Web Sitesi (React/Next.js), Mobil Uygulama (React Native), Personel Paneli (Web), Kiosk Arayüzleri.
2.  **Application Layer (Uygulama Katmanı):** İş mantığının, API'lerin ve servislerin çalıştığı katman.
    - *Bileşenler:* API Gateway, Mikroservisler (Node.js/Express), Event Bus.
3.  **Data Layer (Veri Katmanı):** Verilerin depolandığı, işlendiği ve yönetildiği katman.
    - *Bileşenler:* SQL Veritabanı, NoSQL Veritabanı, Cache, Data Lake.
4.  **AI / Analytics Layer (Yapay Zeka & Analitik Katmanı):** Verilerden anlam çıkaran, anomali tespiti yapan ve sistemi optimize eden zeka katmanı.
    - *Bileşenler:* Machine Learning Modelleri, Raporlama Motoru, İzleme ve Uyarı Sistemi.

---

## 2. Data Mimarisi (Data Layer)

### 2.1. Veri Kaynakları (Data Sources)
- **Transactional:** Müşteri rezervasyonları, satış noktası (POS) işlemleri, envanter hareketleri.
- **Behavioral:** Web/Mobil site tıklama akışı, kullanıcı seans verileri, ısı haritaları (heatmap).
- **Operational:** Personel görev tamamlama logları, oda/ekipman sensör verileri (IoT), sistem sağlık metrikleri.

### 2.2. Veri Depolama (Data Storage)
- **Primary DB (PostgreSQL):** İlişkisel veriler için. Müşteriler, rezervasyonlar, faturalar, personel bilgileri.
- **Time-Series DB (InfluxDB):** Zaman serisi verileri için. Sensör verileri, sistem metrikleri, anlık performans göstergeleri.
- **Cache (Redis):** Sık erişilen veriler ve seans yönetimi için. Ana sayfa paketleri, fiyat listeleri, kullanıcı yetkileri.
- **Data Lake (AWS S3/MinIO):** Ham ve işlenmemiş verilerin (loglar, tıklama akışı JSON'ları) depolandığı yer.

### 2.3. Veri Akışı (Data Flow - Basit ETL)
1.  **Ingestion:** Uygulama servisleri veriyi PostgreSQL'e yazar. Eş zamanlı olarak, ilgili olaylar (events) bir Event Bus'a gönderilir.
2.  **Processing:** Event Bus'taki olayları dinleyen "worker" servisler, veriyi zenginleştirir ve raporlama için uygun formatta Data Lake'e veya Time-Series DB'ye yazar.
3.  **Serving:** Raporlama ve AI katmanı, bu işlenmiş verileri kullanır.

---

## 3. Uygulama Mimarisi (Application Layer)

### 3.1. Mikroservisler (Örnekler)
- **Booking Service:** Rezervasyon oluşturma, takvim yönetimi, oda/terapist uygunluğu.
- **CRM Service:** Müşteri profilleri, geçmiş işlemleri, sadakat programı.
- **Inventory Service:** Stok takibi (havlu, yağ, içecek), tedarikçi siparişleri.
- **Staffing Service:** Personel vardiya planlama, görev atama, performans takibi.
- **Payment Service:** Ödeme ağ geçidi (payment gateway) entegrasyonu.
- **Notifier Service:** E-posta, SMS ve WhatsApp bildirimleri.

### 3.2. İletişim Mimarisi
- **API Gateway (Kong / Express Gateway):** Tüm dış istemci (web, mobil) istekleri için tek giriş noktası. Kimlik doğrulama, rate limiting ve request routing işlemlerini yönetir.
- **Event Bus (RabbitMQ):** Servisler arası asenkron iletişim için kullanılır. Bir servis bir işlemi tamamladığında (örn: `booking_created`), diğer servislerin bu olaydan haberdar olmasını sağlar. Bu, sistemi daha esnek ve hataya dayanıklı kılar.

---

## 4. AI & Analitik Katmanı ("NEUROVA Engine")

### 4.1. Ana Modüller
- **Anomaly Detection:** Operasyonel akışta anormallik tespiti. (Örn: "Hamam sıcaklığı 15 dakikadır hedefin 10 derece altında", "Bir personel 30 dakikadır görev tamamlamadı").
- **Predictive Analytics:** Gelecek talep tahmini. (Örn: "Gelecek hafta sonu masaj talebi %40 artacak, 2 ek terapiste ihtiyaç olabilir").
- **Recommendation Engine:** Müşteriye özel paket ve hizmet önerileri. (Örn: "Geçmiş hamam ziyaretlerinize göre 'Sultan Paketi'ni beğenebilirsiniz").

### 4.2. Geri Besleme Döngüsü (Feedback Loop)
- AI modellerinin tahminleri (`prediction_log`) ve gerçekleşen sonuçlar (`outcome_log`) ayrı bir veritabanında saklanır.
- Bu veriler, modellerin düzenli olarak yeniden eğitilmesi (retraining) için kullanılır.

---

## 5. Güvenlik & Erişim Kontrolü

- **Authentication:** JWT (JSON Web Token) tabanlı kimlik doğrulama.
- **Authorization:** Rol Tabanlı Erişim Kontrolü (RBAC). Roller: `guest`, `staff`, `manager`, `admin`. Her rolün erişebileceği API endpoint'leri ve veri aralıkları tanımlıdır.
- **Veri Güvenliği:** Tüm veritabanlarında "Encryption at Rest". Servisler arası iletişimde "Encryption in Transit" (TLS).

---

## 6. Performans & Ölçeklenebilirlik

- **Caching:** Redis, veritabanı yükünü azaltmak için yoğun olarak kullanılır.
- **Containerization:** Tüm servisler Docker container'ları olarak paketlenir.
- **Orchestration:** Kubernetes (veya Docker Swarm), container'ların dağıtımı, ölçeklenmesi ve yönetimi için kullanılır. Yoğun saatlerde `Booking Service` otomatik olarak 3 pod'a çıkabilir.
- **Load Balancing:** API Gateway ve Kubernetes Ingress, gelen trafiği servisler arasında dağıtır.

---

## 7. Raporlama & BI Katmanı

- **Dashboarding:** Gerçek zamanlı operasyonel metrikler (anlık doluluk, personel durumu, satışlar) için Grafana panelleri.
- **Business Intelligence:** Yönetimsel raporlar (aylık ciro, müşteri segmentasyonu, en popüler hizmetler) için Metabase veya Power BI entegrasyonu.
- **Alerting:** Kritik eşikler aşıldığında (örn: "Stok seviyesi %10'un altında", "API Gateway response time > 500ms") ilgili personele otomatik uyarı gönderen sistem (Prometheus Alertmanager).

---

## 8. Örnek Sistem Akışı (ASCII Diagram)

Bir müşterinin web sitesinden rezervasyon yapması:

```
[User on Web] -> [API Gateway] -> [Booking Service]
     |                 |                  |
     |                 |                  +--> [PostgreSQL] (Write Booking)
     |                 |                  |
     |                 |                  +--> [RabbitMQ] (Publish 'booking_created' event)
     |                 |
     |                 +--------------------> [CRM Service] (Update Customer History)
     |                                          (Listens to 'booking_created')
     |
     +--------------------------------------> [Notifier Service] (Send Confirmation Email)
                                                (Listens to 'booking_created')
```

Bu taslak, NEUROVA'nın karmaşıklığını ve potansiyelini yansıtan bir ilk adımdır. Şimdi, bu mimariyi sizinle birlikte daha derinlemesine incelemeye hazırım.