# NEUROVA v2 MİMARİ YOL HARİTASI

**Amaç:** Bu belge, NEUROVA sistem mimarisini v1'den (taslak) v2'ye (sağlamlaştırılmış ve ölçeklenebilir) taşımak için gereken teknik görevleri, öncelikleri ve teknoloji seçimlerini tanımlar. Analiz sürecinde tespit edilen eksiklikler ve riskler, bu yol haritasının temelini oluşturur.

---

## FAZ 1: TEMEL GÜVENLİK VE OTOMASYON (THE STABLE & SECURE CORE)

Bu fazın hedefi, herhangi bir iş mantığı geliştirilmeden önce sistemin üzerine inşa edileceği en temel ve kritik altyapıyı kurmaktır: Güvenlik, Otomasyon ve Tutarlılık.

| Görev | Teknoloji / Yaklaşım | Öncelik | Gerekçe |
| :--- | :--- | :--- | :--- |
| **1. Merkezi Secret Management** | HashiCorp Vault | **Kritik** | API anahtarları, DB şifreleri gibi hassas verileri koddan ve yapılandırma dosyalarından tamamen izole etmek. Güvenlik zafiyetlerini en baştan engellemek. |
| **2. Temel CI/CD Pipeline** | GitHub Actions | **Kritik** | Kodun otomatik olarak test edilmesini, derlenmesini ve Docker imajı olarak paketlenmesini sağlamak. Manuel dağıtım hatalarını ortadan kaldırmak. |
| **3. Konteynerleştirme ve Basit Orkestrasyon** | Docker, Docker Compose | **Yüksek** | Çekirdek servisleri (Booking, CRM) konteyner haline getirmek ve geliştirme/test ortamında tutarlı bir şekilde çalıştırmak. "Aşamalı Başlangıç" prensibi. |
| **4. Event Bus ve DLQ Yapılandırması** | RabbitMQ | **Yüksek** | Servisler arası asenkron iletişimi kurmak. Her kuyruk için **Dead Letter Queue (DLQ)** yapılandırarak veri kaybı riskini ortadan kaldırmak. |

---

## FAZ 2: GÖZLEMLENEBİLİRLİK VE VERİ YAPISI (OBSERVABILITY & DATA STRUCTURE)

Bu faz, çalışan sistemin "içini görebilmeyi" ve veri akışını daha yapısal ve güvenilir hale getirmeyi hedefler.

| Görev | Teknoloji / Yaklaşım | Öncelik | Gerekçe |
| :--- | :--- | :--- | :--- |
| **5. Dağıtık İzleme (Distributed Tracing)** | OpenTelemetry, Jaeger | **Yüksek** | Bir isteğin tüm mikroservisler arasındaki yolculuğunu takip ederek hata ayıklama (debugging) ve performans analizi süreçlerini basitleştirmek. "Operasyonel Körlük" riskini gidermek. |
| **6. Merkezi Log Yönetimi** | ELK Stack (Elasticsearch, Logstash, Kibana) veya Loki | **Yüksek** | Tüm servislerin loglarını tek bir yerden aranabilir, filtrelenebilir ve görselleştirilebilir hale getirmek. |
| **7. Event Şema Yönetimi** | Confluent Schema Registry + Apache Avro | **Orta** | Servisler arası olayların (events) veri yapısını standartlaştırmak ve versiyonlamak. "Geliştirme Kaosu" riskini (breaking changes) yönetmek. |
| **8. Temel Veri Ambarı (DWH) Oluşturma** | ClickHouse / DuckDB | **Orta** | BI ve analitik sorgular için raporlama katmanını besleyecek, ham veriden ayrılmış, optimize bir veri ambarı kurmak. Raporlama performansını artırmak. |

---

## FAZ 3: ÖLÇEKLENME VE İLERİ SEVİYE YETENEKLER (SCALING & ADVANCED CAPABILITIES)

Bu faz, sağlam temeller üzerine inşa edilen sistemi, artan yükü karşılayacak ve daha karmaşık iş gereksinimlerini çözecek şekilde geliştirmeyi hedefler.

| Görev | Teknoloji / Yaklaşım | Öncelik | Gerekçe |
| :--- | :--- | :--- | :--- |
| **9. Orkestrasyona Geçiş (Kubernetes)** | Kubernetes (K8s) | **Orta** | Docker Compose'dan tam teşekküllü bir orkestrasyon aracına geçerek otomatik ölçeklenme (auto-scaling), self-healing ve yüksek erişilebilirlik (high availability) sağlamak. |
| **10. Web Performansı Optimizasyonu (CDN)** | Cloudflare / AWS CloudFront | **Orta** | Statik varlıkları (JS, CSS, resimler) coğrafi olarak dağıtarak web sitesi ve panel yüklenme sürelerini global olarak iyileştirmek. |
| **11. MLOps Altyapısının Temelleri**| MLflow / DVC | **Düşük** | AI/ML modellerinin versiyonlanması, dağıtımı ve performans takibi için gerekli altyapıyı kurarak "AI & Analytics Layer"ı daha sistematik hale getirmek. |
| **12. API Gateway İyileştirmeleri** | Kong / Tyk | **Düşük** | Gelişmiş rate limiting, API anahtarı yönetimi, ve özel eklentiler (plugins) ile API ağ geçidini daha yetenekli ve güvenli kılmak. |

---

Bu yol haritası, projenin sağlıklı ve sürdürülebilir bir şekilde büyümesi için bir rehber niteliğindedir. Her fazın sonunda, hedeflere ulaşılıp ulaşılmadığı gözden geçirilmeli ve gerekirse bir sonraki faz için ayarlamalar yapılmalıdır.