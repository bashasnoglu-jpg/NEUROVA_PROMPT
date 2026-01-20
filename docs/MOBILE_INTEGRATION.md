# MOBILE INTEGRATION — Neurova Ops PWA & Task Link v1.0

## 1) Amaç ve Kapsam

Bu doküman, mevcut **OPS/LOGS** mimarisine mobil arayüz entegrasyonunu iki katmanda tanımlar:

* **A Seviyesi (Hızlı):** WhatsApp/SMS mesajı + **Task Link** + mobilde **Tek Kart** ekranı (OK/E1–E4)
* **B Seviyesi (Hedef):** Tam **PWA** (roller, ekranlar, offline queue, push bildirim)

Her iki seviye de aynı **LOGS Six-Field Standard** (eventName/dryRun/recipientsCount/templateKey/runId/durationMs) ile çalışır.

## 2) Kavramlar

### 2.1 Task Link

Kişisel veri içermeyen, görev kartını açan link.

Taşıdığı parametreler:

* `runId` (kısa)
* `event` (OPS_* string)
* `zone` (Z1..Zn)
* opsiyonel: `ts` (unix) + `sig` (HMAC)

Örnek:

```
/task?runId=AB12&event=OPS_WC30_TICK&zone=Z2&ts=1734442200&sig=...
```

### 2.2 Aksiyon Kodları

Mobil butonlar / SMS cevap kodları:

* `OK` → tamamlandı
* `E1` → stok bitti
* `E2` → yoğun kir/ek temizlik
* `E3` → arıza/maintenance
* `E4` → koku/derin temizlik

## 3) İsimlendirme Standardı (OPS_*)

### 3.1 WC 30dk Tur

* `eventName`: `OPS_WC30_TICK`
* `templateKey`: `OPS_WC30_TR`

### 3.2 Tamamlandı

* `eventName`: `OPS_WC30_DONE`
* `templateKey`: `OPS_WC30_ACK_TR`

### 3.3 Eskalasyon (Lead’e)

* `eventName`: `OPS_WC30_ESCALATE`
* `templateKey`: `OPS_WC30_ESC_TR`

### 3.4 Cevapsız / Kaçırıldı (opsiyonel)

* `eventName`: `OPS_WC30_MISSED`
* `templateKey`: `OPS_WC30_MISSED_TR`

> Not: Kodda farklı isimler varsa, sadece stringleri bu standarda uyarlayın (iş mantığı değişmez).

## 4) Mobil Wireframe (v1.0)

### 4.1 Tek Kart – Task Card (Task Link ile açılan ekran)

Ekran öğeleri:

* Başlık: `WC 30dk Kontrol — Z{zone}`
* Meta: `Saat {hh:mm} • Tur {runIdShort}`
* Checklist (kısa): Kağıt/Sabun/Dezenfektan • Klozet/Lavabo • Zemin/Çöp • Koku
* Büyük butonlar: `OK`, `E1`, `E2`, `E3`, `E4`
* Not alanı (opsiyonel): 140 karakter
* Gönder → Success: “Alındı ✅” ve kart kilitlenir

### 4.2 PWA ekranları (B seviye)

* Bugün (Home)
* Görevler (Task Feed)
* WC Kontrol (Housekeeping)
* Logs Viewer (Lead/Reception)
* Planlar (Tomorrow Plan)
* Ayarlar (Rol/Dil/Bildirim)

## 5) API Sözleşmesi (v1.0)

### 5.1 ACK Gönder (OK / E1–E4)

`POST /api/task/ack`

#### Request (copy/paste)

```json
{
  "runId": "AB12",
  "eventName": "OPS_WC30_TICK",
  "zone": "Z2",
  "action": "OK",
  "note": "Opsiyonel kısa not",
  "actor": {
    "role": "housekeeping",
    "actorIdMasked": "HK_03"
  },
  "client": {
    "source": "mobile",
    "appVersion": "pwa-1.0",
    "deviceIdHash": "d_9f3a..."
  },
  "ts": 1734442200,
  "sig": "hmac..."
}
```

#### Response (copy/paste)

```json
{
  "ok": true,
  "resultEventName": "OPS_WC30_DONE",
  "templateKey": "OPS_WC30_ACK_TR",
  "runId": "AB12",
  "serverTime": "2025-12-17T14:31:02+03:00"
}
```

#### Action → Result mapping

* `OK` → `OPS_WC30_DONE`
* `E1|E2|E3|E4` → `OPS_WC30_ESCALATE` (lead notify + log)

### 5.2 Bugünkü Görevler (opsiyonel)

`GET /api/tasks/today?role=housekeeping&zone=Z2`

```json
{
  "ok": true,
  "items": [
    {
      "runId": "AB12",
      "eventName": "OPS_WC30_TICK",
      "zone": "Z2",
      "scheduledAt": "2025-12-17T14:30:00+03:00",
      "status": "OPEN",
      "templateKey": "OPS_WC30_TR",
      "slaSec": 300
    }
  ]
}
```

### 5.3 LOGS Çek (Lead ekranı)

`GET /api/logs?limit=200&dryRun=true`

```json
{
  "ok": true,
  "items": [
    {
      "time": "2025-12-17T14:30:02+03:00",
      "eventName": "OPS_WC30_TICK",
      "dryRun": true,
      "recipientsCount": 1,
      "templateKey": "OPS_WC30_TR",
      "runId": "AB12…9Z",
      "durationMs": 842,
      "status": "OK"
    }
  ]
}
```

## 6) LOGS Standardı (Six-Field) ve Örnek Satırlar

Her log entry şu alanları içermelidir:

1. `eventName`
2. `dryRun`
3. `recipientsCount`
4. `templateKey`
5. `runId`
6. `durationMs`

Örnek:

* `DRYRUN OPS_WC30_TICK | recipients=1 | template=OPS_WC30_TR | runId=AB12…9Z | dtMs=842`
* `DRYRUN OPS_WC30_DONE | recipients=1 | template=OPS_WC30_ACK_TR | runId=AB12…9Z | dtMs=120`
* `DRYRUN OPS_WC30_ESCALATE | recipients=1 | template=OPS_WC30_ESC_TR | runId=AB12…9Z | dtMs=260`

## 7) Güvenlik Notları (Minimum Standart)

* Task Link içinde **kişisel veri yok** (telefon, isim, randevu detayı yok).
* `sig` önerilir: `HMAC(secret, runId|event|zone|ts)`.
* `ts` ile link ömrü sınırlanır (örn. 24 saat).
* LOG paylaşımında maske:

  * Telefon: `+90 5** *** ** 12`
  * İsim: `A*** K***`
  * runId: `AB12…9Z`
  * Mesaj içeriği: tam metin yok, sadece template/event ve sayılar

## 8) Offline Handling (PWA için)

* Online ise ACK anında gönderilir.
* Offline ise ACK local queue’ya yazılır: `pendingAck[]`.
* Online gelince otomatik flush yapılır.
* Flush fail olursa: `OPS_MOBILE_ACK_FAILED` (opsiyonel) log + lead uyarısı.

## 9) Unified Event Set v1.0 (Therapist + Housekeeping + Reception)

| Role | Event (Ne zaman?) | `eventName` (Trigger) | SLA | `templateKey` (Gönderim) | Personel aksiyonu | Result Event (LOGS) | Manager rapor özeti |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| Therapist | Gün açılışı 09:00 | `DAILY_0900` | 10 dk | `DAILY_START_TR` | OK | `DAILY_0900_DONE` | Done/Open/Missed sayılır |
| Therapist | Gün ortası 13:00 | `DAILY_1300` | 10 dk | `DAILY_MID_TR` | OK | `DAILY_1300_DONE` | Done/Open/Missed |
| Therapist | Kapanış öncesi 17:45 | `DAILY_1745` | 10 dk | `OPS_SHIFT_CLOSE_TR` | OK | `DAILY_1745_DONE` | Done/Open/Missed |
| Reception | Yarın planı 18:00 (ekibe) | `TOMORROW_PLAN_1800` | 15 dk | `PLAN_TOMORROW_TR` | OK | `TOMORROW_PLAN_DONE` | Done/Open/Missed (kritik) |
| Reception | 17:30 veri alarmı | `OPS_DATA_WARNING_1730` | 15 dk | `OPS_DATA_WARN_TR` | OK / E2 | `OPS_DATA_WARN_DONE` / `OPS_DATA_WARN_ESC` | Escalate listesine girer |
| Housekeeping | WC 30dk tick | `OPS_WC30_TICK` | 5 dk | `OPS_WC30_TR` | OK / E1–E4 | `OPS_WC30_DONE` / `OPS_WC30_ESCALATE` | Done + Esc (E3/E4 kritik) |
| Housekeeping | Deep clean 11:30 | `OPS_WC_DEEP_1130` | 20 dk | `OPS_WC_DEEP_TR` | OK / E3 | `OPS_WC_DEEP_DONE` / `OPS_WC_DEEP_ESC` | Done + Esc (bakım) |
| Housekeeping | Deep clean 15:30 | `OPS_WC_DEEP_1530` | 20 dk | `OPS_WC_DEEP_TR` | OK / E3 | `OPS_WC_DEEP_DONE` / `OPS_WC_DEEP_ESC` | Done + Esc |
| Housekeeping | Sarf kritik uyarı (ops.) | `OPS_STOCK_ALERT` | 30 dk | `OPS_STOCK_ALERT_TR` | OK | `OPS_STOCK_ALERT_DONE` | Escalate değil, Done/Missed |
| Reception | Missed takip (ops.) | `OPS_FOLLOWUP_MISSED` | 15 dk | `OPS_FOLLOWUP_TR` | OK | `OPS_FOLLOWUP_DONE` | Missed’leri kapatma metriği |

> Manager raporunu bu event’ler üzerinden hazırla; `MISSED` ve `ESCALATE` listeleri zone+runId ile.

## 10) Status kuralı (Manager raporu için)

* **DONE:** ilgili `*_DONE` log’u var  
* **OPEN:** trigger çalıştı ama DONE/ESC yok ve SLA dolmadı  
* **MISSED:** SLA doldu, DONE/ESC yok → `*_MISSED` üret (veya raporda missed say)  
* **ESCALATE:** `*_ESC*` log’u var (E1–E4 veya E2/E3)

## 11) E-kod standart anlamı (tüm roller için tek)

* **OK:** Tamamlandı  
* **E1:** Stok/Sarf (kritik değil ama takip)  
* **E2:** Yoğun iş/temizlik/kalabalık (operasyonel)  
* **E3:** Arıza/Maintenance (kritik)  
* **E4:** Koku/Derin temizlik ihtiyacı (kritik)

## 12) Manager raporunda nasıl görünür? (özet format)

* Toplam: `Done / Open / Missed / Esc`  
* **Escalate listesi:** (zone + event + E-code + saat + runIdShort)  
* **Missed listesi:** (event + zone + scheduledAt + runIdShort)

## 13) DRY_RUN Test Prosedürü (Mobil)

1. `NV_DEBUG.DRY_RUN = true`
2. Test task link üret:

   * `/task?runId=TEST1&event=OPS_WC30_TICK&zone=Z2`
3. Mobilde Task Card aç → `OK` gönder
4. LOGS kontrol:

   * `OPS_WC30_TICK` ve `OPS_WC30_DONE` satırları DRYRUN olarak görünmeli
   * Six-field 6/6 dolu olmalı
5. Eskalasyon testi:

   * Aynı linkte `E3` gönder
   * LOGS’ta `OPS_WC30_ESCALATE` görünmeli (lead notify simüle/DRYRUN)

Go-Live öncesi:

* DRYRUN log ilk 10 satır (maskeli) paylaşılır.

## 10) QR Zone Etiket Standardı (Z1–Z4)

QR etiketi metni **tek format**:

* Üst satır: `NEUROVA OPS`
* Orta: `WC Kontrol — Z{zone}`
* Alt: `Scan → Task Card`

### Önerilen Zone isimleri (örnek)

* `Z1 — Lobby WC`
* `Z2 — Spa WC`
* `Z3 — Gym WC`
* `Z4 — Pool WC`

> Not: Mekâna göre isim değişebilir; “Z kodu” sabit kalır.

## 11) Versiyonlama

* Bu doküman: `MOBILE_INTEGRATION v1.0`
* Değişiklikler: “v1.1” altında eklenir; v1.0 formatı bozulmaz.

## Ek: Mesaj Şablonları (Referans)

Şablon anahtarları:

* `OPS_WC30_TR` (HK görev)
* `OPS_WC30_ACK_TR` (OK dönüş)
* `OPS_WC30_ESC_TR` (lead eskalasyon)
* `OPS_WC30_MISSED_TR` (cevapsız)

## 14) Manager dashboard + otomatik rapor API

### 14.1 Gün özeti (Done/Open/Missed/Esc)

`GET /api/manager/summary?date=YYYY-MM-DD`

```json
{
  "ok": true,
  "date": "2025-12-17",
  "counts": { "done": 42, "open": 3, "missed": 2, "esc": 5 },
  "byRole": {
    "therapist": { "done": 18, "open": 1, "missed": 0, "esc": 1 },
    "reception": { "done": 6, "open": 0, "missed": 1, "esc": 1 },
    "housekeeping": { "done": 18, "open": 2, "missed": 1, "esc": 3 }
  },
  "byZone": {
    "Z1": { "done": 8, "open": 0, "missed": 0, "esc": 1 },
    "Z2": { "done": 20, "open": 2, "missed": 1, "esc": 3 }
  }
}
```

### 14.2 Exception listesi (MISSED + ESC)

`GET /api/manager/exceptions?date=2025-12-17&types=missed,esc&limit=200`

```json
{
  "ok": true,
  "date": "2025-12-17",
  "items": [
    {
      "type": "esc",
      "eventName": "OPS_WC30_ESCALATE",
      "ecode": "E3",
      "zone": "Z2",
      "scheduledAt": "2025-12-17T14:30:00+03:00",
      "time": "2025-12-17T14:31:10+03:00",
      "runId": "AB12…9Z",
      "templateKey": "OPS_WC30_ESC_TR"
    },
    {
      "type": "missed",
      "eventName": "TOMORROW_PLAN_1800",
      "zone": "ALL",
      "scheduledAt": "2025-12-17T18:00:00+03:00",
      "runId": "PL77…Q2",
      "templateKey": "PLAN_TOMORROW_TR"
    }
  ]
}
```

### 14.3 Manager rapor payload (13:05 / 18:05)

`GET /api/manager/report?date=2025-12-17&slot=mid`

```json
{
  "ok": true,
  "slot": "mid",
  "templateKey": "OPS_MANAGER_MID_REPORT_TR",
  "title": "Ara Ops Raporu — 17.12.2025",
  "counts": { "done": 21, "open": 2, "missed": 0, "esc": 2 },
  "missed": [],
  "esc": [
    "Z2 OPS_WC30_TICK E3 14:30 AB12…9Z",
    "Z1 OPS_DATA_WARNING_1730 E2 17:30 DW10…K1"
  ]
}
```

## 15) Status hesaplama kuralı (server-side)

Her planlı trigger için:

* `hasDone = exists(log.eventName in [<DONE>])`
* `hasEsc = exists(log.eventName in [<ESC>])`
* `deadline = scheduledAt + SLA`
* `if hasDone → DONE`
* `else if hasEsc → ESC`
* `else if now < deadline → OPEN`
* `else → MISSED`

## 16) Trigger örnekleri (copy/paste konsept)

* `OPS_MANAGER_REPORT_1305` → `/api/manager/report?slot=mid` (Template: `OPS_MANAGER_MID_REPORT_TR`)
* `OPS_MANAGER_REPORT_1805` → `/api/manager/report?slot=eod` (Template: `OPS_MANAGER_DAILY_REPORT_TR`)

Log (six-field):

* `DRYRUN OPS_MANAGER_REPORT_1305 | recipients=1 | template=OPS_MANAGER_MID_REPORT_TR | runId=MR13…A1 | dtMs=540`
* `LIVE OPS_MANAGER_REPORT_1805 | recipients=1 | template=OPS_MANAGER_DAILY_REPORT_TR | runId=MR18…B2 | dtMs=610`

## 17) Manager Dashboard endpoints

* `/api/manager/summary?date=today`
* `/api/manager/exceptions?date=today&types=missed,esc`

Bu endpointler PWA’deki `logs` ve `dashboard` kartlarını besler; UI copy anahtarları hazır.

## 18) QR + UI PDF önerileri

* A6 sticker sheet (Z1–Z4)  
* PWA Quick Guide (OK/E1–E4 + Scan → Task Card + log standard)
İstersen bir sonraki adımda, bu dosyaya ek olarak **QR etiketlerinin baskı metnini** (A6 sticker) ve **PWA için minimal UI metinlerini** (TR/EN) de standartlaştırayım; böylece sahada “aynı dil ve aynı buton isimleri” ile ilerleriz.

## 19) Deploy varyantları ve QR konfigürasyonu

### Node/Express (Vercel/Render/Fly)

* Base URL: `https://ops.neurova.com/task-card`
* Query format: `/task-card?event={EVENT}&zone={ZONE}&ts={unix}&sig={hmac}`
* Sig/Ts: `&ts={unix}&sig={hmac}` (HMAC(secret, event|zone|ts), TTL=24h)
* Zones: Z1 = Lobby WC, Z2 = Spa WC, Z3 = Gym WC, Z4 = Pool WC

### Google Apps Script Web App + Twilio

* Base URL: `https://script.google.com/macros/s/{DEPLOY_ID}/exec`
* Query format: `/exec?route=task-card&event={EVENT}&zone={ZONE}&ts={unix}&sig={hmac}`
* Sig/Ts: `&ts={unix}&sig={hmac}` (HMAC(secret, route|event|zone|ts), TTL=24h)
* Tek endpoint: `route=task-card` (task card), `route=api-task-ack` (ACK/API), vs.
* Zones: Z1 = Lobby WC, Z2 = Spa WC, Z3 = Gym WC, Z4 = Pool WC

> Not: Apps Script’te `doGet(e)`/`doPost(e)` içinde HMAC + TTL kontrolü yap; tek endpoint üzerinden hem Task Card hem API işlemlerini yönlendirebilirsin.
