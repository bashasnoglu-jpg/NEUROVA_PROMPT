# NEUROVA MEGA — MASTER BLUEPRINT v1.0 (Decision Matrix uyumlu)

## A) Microservice Catalog (Servis Listesi)

### 1) Platform & Güvenlik (Cross-Cutting)

1. **Identity Service**
   * SSO/OAuth2, staff/guest auth, token minting, session policies
2. **Consent Service**
   * Opt-in/out, amaç bazlı izin (personalization / marketing / location / IoT), kanıt kayıtları
3. **Policy Engine**
   * ABAC/RBAC kararları (örn. “concierge şu alanı görebilir mi?”), OPA uyumlu
4. **PII Vault Service**
   * PII saklama/şifreleme, tokenization, erişim audit
5. **Audit Log Service**
   * Değiştirilemez (append-only) kayıt: “kim neyi gördü/ yaptı/ önerdi”

### 2) Veri & Entegrasyon

6. **Connector Gateway**
   * PMS/POS/Booking Engine/Web/App/IoT adaptörleri, rate limit, retry
7. **Event Bus / Stream Router**
   * Topic yönlendirme, DLQ, idempotency, replay
8. **Schema Registry**
   * Event şemaları, versiyonlama, breaking change kontrolü
9. **Operational Store Service**
   * Online state: guest status, room state, task state (Postgres)
10. **Data Lake Loader**
    * S3/objeye ham event dump + partitioning

### 3) MEGA Intelligence Core (v1.0’da “kontrollü”)

11. **Guest Profile Service**
    * Guest “golden record” (PII token ile), stay context, preferences snapshot
12. **Preference Vector Service**
    * Kural + istatistik (v1.0), online hesaplama, explainable output
13. **Decision Engine Service (Decision Matrix v1.0)**
    * Aksiyon sınıfı (Passive/Assistive/Hard), risk/consent/policy gating
14. **Brand Guard Service**
    * Ton skoru + öneri metinleri, şablonlar, PII redaction enforced
15. **Anomaly Service (Ops)**
    * Su/enerji/IoT anomali v1.0 “basit eşik + sezgisel”
16. **Monitoring Intelligence (Self-Debug Lite)**
    * SLO ihlali öngörüsü değil; önce “anomaly on observability metrics”
17. **Risk Assessment Service (v1.1)**
    * Hard action riskini skorlar, onay seviyesini belirler.

### 4) Otomasyon & Operasyon

18. **Workflow Orchestrator**
    * Temporal/Step-like: “arrival”, “housekeeping dispatch”, “post-stay followup”
19. **Action Dispatcher**
    * Komut yürütme (set climate, notify staff), rollback, retries
20. **Notification Service**
    * Staff: Slack/Teams/Email/SMS; Guest: app/push/WhatsApp (opsiyonel)
21. **Tasking Service**
    * Housekeeping/maintenance görev oluşturma, SLA, durum makinesi

### 5) Sunum Katmanı

22. **Concierge Dashboard Backend (BFF)**
    * Concierge ekranı için özel API, düşük gecikme
23. **GM/Ops Dashboard Backend (BFF)**
    * KPI, alerts, anomalies, staffing view
24. **BI Export Service**
    * Warehouse/BI tools besleme, scheduled extracts

&gt; **Decision Matrix kuralı:** “Hard action” (fiyat indirimi uygulama, rezervasyon yaratma, ödeme vb.) v1.0’da **default kapalı** veya **çift onay + audit + consent** ile.

---

## B) Topic/Event Sözlüğü (Kafka/Kinesis uyumlu)

### Naming

* Format: `domain.entity.event.v1`
* Ör: `guest.arrival.detected.v1`

### Core Topics

**Guest & Stay**
* `guest.profile.updated.v1` (non-PII snapshot + PII token)
* `guest.consent.updated.v1`
* `stay.status.changed.v1` (Arriving/Checked-in/In-house/Departing)
* `guest.arrival.detected.v1` (geo-fence veya PMS check-in sinyali)
* `guest.sentiment.updated.v1` (feedback/CSAT)

**Booking & Spa**
* `booking.created.v1`
* `booking.updated.v1`
* `spa.requested.v1` (manual/assistant suggestion follow)
* `spa.service.completed.v1`

**Web/App**
* `web.click.v1` (anon/guest_token, page_id, action)
* `app.session.v1`
* `recommendation.shown.v1`
* `recommendation.accepted.v1`
* `recommendation.rejected.v1`

**IoT / Room**
* `room.state.reported.v1` (temp, humidity, occupancy proxy — PII yok)
* `room.command.requested.v1`
* `room.command.succeeded.v1`
* `room.command.failed.v1`

**Operations**
* `ops.task.created.v1`
* `ops.task.assigned.v1`
* `ops.task.completed.v1`
* `ops.anomaly.detected.v1`

**Comms / Brand**
* `comms.message.drafted.v1` (Brand Guard output)
* `comms.message.sent.v1` (kanal, template_id, audit ref)
* `brand.voice.score.updated.v1`

**Hard Actions (v1.1)**
* `hard_action.proposed.v1`
* `hard_action.approved.v1`
* `hard_action.rejected.v1`
* `hard_action.executed.v1`
* `hard_action.failed.v1`

**Observability (ops)**
* `platform.slo.breached.v1`
* `platform.incident.created.v1`

### DLQ / Retry

* `dlq.<original-topic>` (payload + error + retry_count)

---

## C) API Surface (Guest / Ops / BI)

&gt; Hepsi **API Gateway** arkasında; auth + policy enforced. Örnek: `/v1/...`

### 1) Guest Experience API

* `GET /v1/guest/me/profile`
* `POST /v1/guest/me/consent` (opt-in/out)
* `GET /v1/guest/me/recommendations` (Decision Engine filtreli)
* `POST /v1/guest/me/feedback` (sentiment)
* `GET /v1/guest/me/bookings`
* `POST /v1/guest/me/spa-request` (rezervasyon isteği; hard action değil, request)

### 2) Operational Automation API

* `GET /v1/ops/guests?status=arriving|inhouse`
* `GET /v1/ops/guest/{guest_token}/context` (PII değil; gerekirse vault token)
* `POST /v1/ops/tasks` (create housekeeping/maintenance)
* `POST /v1/ops/actions/notify` (concierge alert vs.)
* `POST /v1/ops/actions/room-command` (Passive; policy+consent gate)
* `GET /v1/ops/anomalies`
* `POST /v1/ops/comms/draft` (Brand Guard)
* `POST /v1/ops/comms/send` (audit required)

### 3) Hard Action API (v1.1)

* `POST /v1/ops/hard-actions/propose`
* `POST /v1/ops/hard-actions/{id}/approve`
* `POST /v1/ops/hard-actions/{id}/reject`
* `GET  /v1/ops/hard-actions/{id}/status`

### 4) Business Intelligence API

* `GET /v1/bi/kpi/daily?date=YYYY-MM-DD`
* `GET /v1/bi/spa/usage?from=&to=`
* `GET /v1/bi/recommendations/performance?from=&to=`
* `POST /v1/bi/exports/schedule` (Airflow tetikleyebilir)

---

## D) Veri Sınıflandırma (PII / non-PII)

(Content unchanged)

---

## E) Decision Matrix v1.0 (Sistem davranış kuralı)

(Content unchanged, v1.1 details are in the new section below)

---

## F) v1.0 Sprint Planı (8 Sprint / 2 haftalık öneri)

(Content unchanged)

---

## “v1.0 Done” Kriterleri (net kabul ölçütü)

(Content unchanged)

---

# v1.1 Patch: Hard Actions Governance

Bu bölüm, Master Spec v1.0’a EK olarak tasarlanmıştır. Mevcut v1.0 davranışlarını bozmaz, sadece "Hard Action" olarak sınıflandırılan yüksek riskli operasyonlar için kontrol ve güvenlik mekanizmaları ekler.

## 1. Decision Matrix v1.1 — Genişletilmiş Model

### Aksiyon Sınıfları (Güncel)

| Sınıf     | Otomasyon     | Risk   | v1.1 Durumu           |
| --------- | ------------- | ------ | --------------------- |
| Passive   | Auto          | Low    | Açık                  |
| Assistive | Human-in-loop | Medium | Açık                  |
| **Hard**  | Restricted    | High   | **Controlled Enable** |

## 2. Hard Action Türleri (Explicit Liste)

"Hard action"lar **event-driven değil**, yalnızca **command-driven** çalışır.

### Finansal
* İndirim uygulama
* Özel fiyat tanımlama
* Ödeme tetikleme / iade

### Rezervasyon
* Spa booking yaratma
* Booking iptal/değişiklik
* Overbooking override

### Kimlik & Hukuk
* Otomatik check-in / check-out
* Misafir profili birleştirme
* VIP / blacklist flag

## 3. Risk Scoring Engine (Yeni Servis Detayları)

**Servis:** `Risk Assessment Service` (Servis Kataloğuna eklendi)

**Girdi Parametreleri:**
* Action type (hard subtype)
* Guest segment (VIP, first-time, flagged)
* Financial impact (€)
* Consent scope
* Staff role
* Historical reversal rate
* Context confidence score (AI)

**Örnek Çıktı:**
```json
{
  "risk_score": 0.82,
  "risk_level": "HIGH",
  "required_approvals": 2,
  "auto_execute": false
}
```

**Risk Seviyeleri:**
| Skor    | Seviye | Davranış    |
| ------- | ------ | ----------- |
| 0.0–0.3 | Low    | Auto        |
| 0.3–0.6 | Medium | 1 onay      |
| 0.6–1.0 | High   | 2 onay + GM |

## 4. Çift Onay (Dual Approval Flow)

**Roller:**
* **Primary Approver:** Concierge / Supervisor
* **Secondary Approver:** GM / Duty Manager

**Workflow:**
1. `Decision Engine` → Hard Action önerir
2. `Risk Service` → Skoru hesaplar (örn: HIGH)
3. `Workflow Orchestrator` → Onay akışını başlatır
4. Approver #1 → `approve/reject`
5. Approver #2 → `approve/reject`
6. `Action Dispatcher` → Onaylanırsa komutu yürütür
7. `Audit Log` → Tüm adımları değiştirilemez şekilde kaydeder

## 5. Explainability (Zorunlu Alan)

Her Hard Action için, kararın nedenini açıklayan bir `why` alanı zorunludur. Bu alan, Concierge Dashboard, GM Dashboard ve Audit Log'da gösterilir.

**Örnek:**
```json
{
  "why": [
    "Guest is VIP tier",
    "Historical acceptance rate: 92%",
    "Context confidence: 0.88",
    "Consent: active"
  ]
}
```

## 6. Kill Switch & Rollback

* **Kill Switch:** Sistem, servis bazlı, aksiyon tipi bazlı veya tüm Hard Action'ları kapsayacak şekilde anında durdurma yeteneğine sahip olmalıdır.
* **Rollback:** Her Hard Action için bir geri alma prosedürü tanımlanmalıdır (finansal için denkleştirici işlem, rezervasyon için ters kayıt vb.).
