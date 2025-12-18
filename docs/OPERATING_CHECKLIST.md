# Operasyonel Hatırlatma Planı

## 09:00 Açılış Kontrol Listesi

1. Randevu listesi + oda/terapist planını gözden geçir.
2. Oda/hamam turu: ışık, klima, müzik, koku, sıcaklık ayarları.
3. Hijyen kontrolü, yüzey dezenfeksiyonu.
4. Havlu/bornoz/tek kullanımlık stoklarını hazırla.
5. Yağ, ürün, temizlik sarflarını kontrol et; eksikler `Refill List`'e.
6. POS/kasa ve WhatsApp/telefon hattını hazırla.
7. Cihaz testleri (ısıtıcı, steamer, vs.).

## 13:00 Mini Alan Kontrolü (opsiyonel)

1. Ortak alan + lobby'de genel düzen, ışık ve hava kontrolü.
2. Tuvalet ve servis alanlarında hijyen + sarf kontrolü.
3. Mini stok kontrolü (havlu, ürün, tek kullanımlık).
4. Gerekirse `PrepNote` üzerinden not bırak.

## 18:00 Kapanış Kontrol Listesi

1. Kasa/POS kapanışı ve gün sonu notu.
2. Ertesi gün randevu planı (oda/terapist/özel notlar).
3. Odaların resetlenmesi, çarşaf/havlu toplama, dezenfeksiyon.
4. Çamaşır/kat arabası düzeni.
5. Refiller: sarf/yağ/tek kullanımlık “yarın sabaha hazır”.
6. Cihaz kapatma + enerji kontrolü.
7. Güvenlik: kapılar, ışıklar, kilit prosedürü.

## Hatırlatmaların işleyişi

1. `APPOINTMENTS` Google Sheet’i (v1.0) üzerinden manuel giriş yapılır. Gerekli sütunlar `Date, Time, TherapistName, TherapistPhone, Room, Service, PrepNote, Status, Sent30, Sent30At, MessageId`.
2. Apps Script `nvRunReminderTick` fonksiyonu her 1 dakikada bir tetiklenir; `Status=BOOKED` ve `Sent30!=TRUE` satırları için 30 dakika önce SMS gönderir.
3. `Sent30`/`Sent30At`/`MessageId` alanları döngüyü önler.
4. 13:00 mini kontrol hatırlatması ihtiyaça göre `Status=BOOKED` + `PrepNote="13:00 Mini Kontrol"` gibi girişle aynı sistemde çalışır.

## Gelecek geliştirme

* v1.1 WhatsApp (Twilio `CHANNEL="WHATSAPP"` + `TWILIO_FROM="whatsapp:+1..."`).
* 15 dakika kala ikinci uyarı (`Sent15` alanı) ve gün başı özet raporu.
* Randevu bilgilerinin PMS’den senkronize aktarılması.

## Gün Sonu Raporu (18:00 — therapsit & yöneticiler)

1. `APPOINTMENTS` sayfasına `DurationMin`, `TherapistNote`, `SentDaily`, `SentDailyAt` sütunlarını ekle. (Not: `SentDaily` TRUE olduktan sonra o satır tekrar raporlanmaz.)
2. Apps Script `CFG` nesnesine `MANAGER_PHONE` ekle (`+90...` formatında).
3. `nvSendDailyReportsForAll()` fonksiyonu her terapist için günün seanslarını toplar, kendi telefonuna gönderir ve `SentDaily` bayrağını günceller; ardından yöneticinin telefonuna (mai) tüm terapistlerin seans özetini SMS olarak gönderir.
4. Trigger: Apps Script → Triggers → `nvSendDailyReportsForAll`, Time-driven → Daily → 18:00 (Europe/Istanbul).
  5. Resepsiyon `DurationMin` ve terapistler `TherapistNote` girsin; iptal edilen satırlar (CANCELLED) rapora dahil edilmez.

## Ertesi Gün Planı (17:45 — ekip & grup)

1. Apps Script’te `nvSendNextDayPlan()` fonksiyonu yaz; `APPOINTMENTS` tablosundan yarın tarihli `Status=BOOKED` satırları alır, terapist bazında seansları listeler ve yukarıdaki WhatsApp şablonunu her terapistin telefonuna gönderir. (Varsa `TherapistPhone`’u kullan; telefon yoksa satırı atla.)
2. `CFG.CHANNEL` SMS/WhatsApp tercihini kontrol eder; WhatsApp için `to` alanını `whatsapp:+90…` formatına çeviren helper kullan. Yöneticinin numarası (`CFG.MANAGER_PHONE`) da aynı template ile toplu planı alır.
3. Trigger: Apps Script → `nvSendNextDayPlan`, Time-driven → Daily → 17:45 (Europe/Istanbul). Run-once guard olarak `PropertiesService.getScriptProperties()` içinde `lastNextDayPlan=${date}` kaydı tut; sonraki çalışmalarda aynı gün için tekrar gönderimi engelle.
4. Hazır mesaj şablonu (kopyala/yapıştır) grupta paylaşıma uygun; sahadaki rutine `docs/NEUROVA_WHATSAPP_TEMPLATES.md` gibi yeni bir belgeyle destek sağlamayı düşünebilirsin (hazır kurguyu alt dosyada detaylandırdım).

## Test Modu + Sahte Veri ile Doğrulama

1. `Code.gs` en üstüne aşağıdaki global’ı ekle (test modunu açar):

```js
const NV_DEBUG = {
  DRY_RUN: true, // true: SMS atmaz, LOGS'a DRYRUN yazar | false: gerçek Twilio gönderir
};
```

2. `safeSend_` helper’ını aşağıdaki gibi güncelle (tüm SMS’ler DRYRUN loguna düşer):

```js
function safeSend_(to, body, logType, refId) {
  try {
    if (NV_DEBUG && NV_DEBUG.DRY_RUN) {
      nvLog_("DRYRUN", to, refId, logType, { bodyPreview: String(body).slice(0, 250) });
      return { sid: "DRYRUN" };
    }
    const resp = twilioSendSms_(to, body);
    nvLog_("SMS", to, refId, logType, { sid: resp.sid });
    return resp;
  } catch (e) {
    nvLog_("ERROR", to, refId, logType, { error: String(e) });
    return null;
  }
}
```

3. Sheet’te demo veriler gir:
   * `STAFF`: R1/O1/T1 rolleri olan en az 3 kişi; telefon yerine `+900000000000` gibi placeholder (DRY_RUN açıkken sorun olmaz).
   * `APPOINTMENTS`: bugünün tarihi için 1 satır (18:00 rapor testi), yarın için 2 satır (17:45 plan testi). `Status=BOOKED`, `DurationMin=60`, `RoomId`/`TherapistId` dolu olsun.

4. Apps Script → Run ile şu fonksiyonları sırayla çalıştır:
   * `nvOpsReminderOpen()`
   * `nvOpsReminderMid()`
   * `nvSendTomorrowPlanToAll()`
   * `nvOpsReminderClose()`
   * `nvSendDailyReportsForAll()`

5. `LOGS` tabında `Type=DRYRUN` kayıtlarını kontrol et:
   * `Message` alanları `OPS_OPEN`, `OPS_MID`, `TOMORROW_PLAN`, `OPS_CLOSE`, `DAILY_THERAPIST`, `DAILY_MANAGER` içermeli.

6. `nvRunReminderTick()` testleri:
   * APPOINTMENTS’taki bir randevuyu şu andan 30–31 dk aralığına ayarla.
   * Fonksiyonu çalıştır, `LOGS`’ta `REMINDER_30` ve `Sent30=TRUE/Sent30At` satırını gör.

7. Canlıya geçmeden önce checklist:
   * `CONFIG.Timezone = Europe/Istanbul`.
   * `STAFF` içindeki herkes `Active=TRUE`, telefonlar E.164 formatında (`+90…`).
   * `ROOMS`’ta aktif odalar doğru listelenmiş.
   * `APPOINTMENTS`: tarih `YYYY-MM-DD`, status `BOOKED`, `RoomId`/`TherapistId`/`DurationMin`/`TherapistPhone` dolu.
   * `NV_DEBUG.DRY_RUN = false` yapıldıktan sonra SMS logları `twilioSendSms_`’u kullanır.

8. Trigger doğrulaması:
   * Apps Script → Triggers ekranında 09:00/13:00/17:30/17:45/18:00/1dk reminder tetiklerinin “Enabled” ve son çalıştırma logları “Success” olsun.

9. Ek öneri: 17:30 “Eksik veri alarmı” fonksiyonu eklemek, `TherapistPhone`, `RoomId`, `DurationMin` boş olan satırlarda resepsiyona DRYRUN logu atarak yarın planından önce düzeltme sağlar.

10. Test sonrası `LOGS`’tan ilk 10 satırı kopyala; plan mesajı formatı, sent guard’lar ve v1.1’e alabileceğimiz iyileştirmeler konusunda geri bildirim sağlayacağım.
## LOGS Beklenen Çıktı Kontrol Listesi (Six-Field Standard)

**Amaç:** DRY_RUN ve Live modda her çalıştırmanın tek satırda hızlı doğrulanması.  
**Kural:** Her LOG entry’de aşağıdaki 6 alan olmak zorunda:

1. `eventName`
2. `dryRun` (true/false)
3. `recipientsCount` (integer)
4. `templateKey` (string)
5. `runId` (maskeli)
6. `durationMs` (integer)

### Önerilen Tek Satır Format

> `DRYRUN <eventName> | recipients=<n> | template=<templateKey> | runId=<AB12…9Z> | dtMs=<1234>`  
> `LIVE <eventName> | recipients=<n> | template=<templateKey> | runId=<AB12…9Z> | dtMs=<1234>`

### Event Bazında “Beklenen Minimumlar”

* **09:00 (Gün açılışı / daily ops)**  
  * `eventName`: `DAILY_0900`  
  * `templateKey`: `DAILY_START_*`  
  * `recipientsCount`: > 0

* **13:00 (Gün ortası)**  
  * `eventName`: `DAILY_1300`  
  * `templateKey`: `DAILY_MID_*`

* **17:30 (Veri alarmı / completeness check)**  
  * `eventName`: `OPS_DATA_WARNING_1730`  
  * `templateKey`: `OPS_DATA_WARN_*`

* **17:45 (Kapanış öncesi)**  
  * `eventName`: `DAILY_1745`  
  * `templateKey`: `OPS_SHIFT_CLOSE_*`

* **18:00 (Yarın planı dağıtımı)**  
  * `eventName`: `TOMORROW_PLAN_1800`  
  * `templateKey`: `PLAN_TOMORROW_*`

* **REMINDER_30 (30dk hatırlatma tick)**  
  * `eventName`: `REMINDER_30`  
  * `templateKey`: `REMINDER_30_*`
  * Ek: aynı dakika içinde tekrar etmiyorsa runId/lock bilgisi log’da gözükmeli

### Hızlı PASS/FAIL Kuralları

**PASS:**  
* 6 alanın tamamı var  
* `dryRun=true` ise `recipientsCount` = SMS sayısı 0, send bypass aktif  
* `durationMs` makul (ör. 0–60.000ms)  
* `recipientsCount` beklendiği gibi (>0)

**FAIL:**  
* `templateKey` boş  
* `runId` yok  
* `dryRun=false` ama Twilio hazır değil (error artışı)  
* Aynı `eventName` birkaç dakika içinde tekrar çalıştı (duplicate trigger/lock yok)

### Maskeleme Standardı (Log paylaşımı)

* Telefon: `+90 5** *** ** 12`  
* İsim: `A*** K***` veya `Ahmet K.`  
* `runId`: `AB12…9Z`  
* Mesaj içeriği: sadece `templateKey` + sayılar (tam metin yok)

## Team Lead Kontrol Kartı — Günlük LOGS Disiplini (1 Sayfa)

**Amaç:** Operasyon gün boyunca sessizce doğru akıyor mu?  
**Yöntem:** Günde **3 kısa bakış** + **6 alan kontrolü**.

### ⏱ Günlük 3 Kontrol Zamanı

#### 1️⃣ **13:05 — Gün Ortası Kontrolü**

LOGS’ta şunları görmelisin:

* `DAILY_0900`
* `DAILY_1300`

Kontrol et:

* `dryRun` doğru mu? (test gününde true / live’da false)
* `recipientsCount` mantıklı mı?
* `templateKey` doğru paket mi?

---

#### 2️⃣ **17:35 — Veri & Kapanış Öncesi**

LOGS’ta şunları görmelisin:

* `OPS_DATA_WARNING_1730` *(varsa)*
* `DAILY_1745` *(henüz çalışmadıysa birazdan gelecek)*

Alarm varsa:

* Eksik veri (randevu, terapist çıkışı, oda/cihaz) hızla tamamlanır.
* 17:45/18:00 öncesi düzeltme şansı vardır.

---

#### 3️⃣ **18:05 — Gün Kapanışı**

LOGS’ta **mutlaka**:

* `DAILY_1745`
* `TOMORROW_PLAN_1800`

Ek kontrol:

* `recipientsCount` = yarın çalışacak ekip
* Aynı event iki kez çalışmamış olmalı

---

### ✅ 6 Alan Hızlı Kontrol (Her Event için)

Her log satırında **tek bakışta** şunları gör:

1. `eventName` → doğru event mi?
2. `dryRun` → mod doğru mu?
3. `recipientsCount` → 0 mı? Neden?
4. `templateKey` → doğru şablon mu?
5. `runId` → var mı? (maskeli)
6. `durationMs` → anormal mi?

> 6/6 tamam → **PASS**  
> 1 eksik → **NOT AL / FOLLOW-UP**

---

### 🚨 Anında Eskalasyon Gerektiren Durumlar

* `templateKey` boş / undefined
* Aynı event kısa sürede 2 kez çalışmış
* `dryRun=false` ama Twilio hataları düşüyor
* `durationMs` aşırı yükselmiş (loop / veri patlaması)

👉 Bu durumda: **Ops Manager + Tech Owner** bilgilendirilir, canlı gönderim durdurulur.

---

### 🔐 Log Paylaşım Kuralı (Hatırlatma)

* Telefon / isim **maskeli**
* Mesaj metni **yok**
* Sadece: `eventName + templateKey + recipientsCount + runId`

---

### 🎯 Altın Kural

> “LOGS temizse, operasyon sessizdir.”

---

### Son Not (senin mimarine özel)

Bu yapı sayesinde:

* Kod repo’da olmasa bile **operasyonel kalite ölçülebilir**
* Team lead’ler **kod bilmeden** sistem doğrular
* DRY_RUN → Live geçişi **kontrollü ve geri alınabilir** olur

İstersen bir sonraki adımda bunu:

* **A4 tek sayfa PDF**
* veya **duvara asılacak ops kartı**
  formatına da dönüştürebilirim.

## HK_WC_30 / OPS_* Şablonları

### 1) İsimlendirme (OPS_* standardına uyum)

* EventName: `OPS_WC30_TICK`
* TemplateKey: `OPS_WC30_TR`
* Eskalasyon EventName: `OPS_WC30_ESCALATE`
* Eskalasyon TemplateKey: `OPS_WC30_ESC_TR`
* Miss/Timeout: `OPS_WC30_MISSED` / `OPS_WC30_MISSED_TR`
* Deep Clean: `OPS_WC_DEEP_1130` / `OPS_WC_DEEP_TR`

Six-field log: `eventName,dryRun,recipientsCount,templateKey,runId,durationMs`

### 2) TR kısa görev mesajı (`OPS_WC30_TR`)

> **WC 30dk Kontrol (Z{zone})**  
> Saat: {hh:mm} — Tur ID: {runIdShort}  
> ✅ Bitince **OK {runIdShort}** yaz.  
> ⚠ Sorun varsa: **E1/E2/E3/E4 {runIdShort}**  
> E1=Stok bitti  E2=Kir/yoğun  E3=Arıza  E4=Koku/derin temizlik  
>
> Checklist (tek satır): Kağıt/Sabun/Dezenfektan • Klozet/Lavabo • Zemin • Çöp • Koku

### 3) Tamamlandı yanıtı (`OPS_WC30_ACK_TR`)

> Alındı ✅ Tur kapatıldı. Teşekkürler.  
> (Z{zone} / {hh:mm} / {runIdShort})  

Logs: `eventName=OPS_WC30_DONE`, `templateKey=OPS_WC30_ACK_TR`, `recipientsCount=1`

### 4) Eskalasyon mesajı (`OPS_WC30_ESC_TR`)

> ⚠ **WC Alarm (Z{zone})** — {hh:mm} — {runIdShort}  
> Kod: {Ecode}  
> Not: {optionalNote}  
> Aksiyon: {actionHint}  
> ✅ Kapatmak için: **CLOSE {runIdShort}**

ActionHint:
* E1: Sarf yenile (sabun/kağıt/dezenfektan)
* E2: +15 dk ekstra temizlik + ops foto notu
* E3: Bakım ticket / teknik çağır
* E4: Derin temizlik + havalandırma

### 5) Miss/Timeout (`OPS_WC30_MISSED_TR`)

> ⏱ **WC Tur Cevapsız** — Z{zone} — {hh:mm} — {runIdShort}  
> Atanan: {assigneeMasked}  
> Aksiyon: Yedek ata / yerinde kontrol et.

### 6) Zone ölçekleme

`Z1 Lobby WC`, `Z2 Spa WC`, `Z3 Gym WC` gibi zone adlarını template’te kullan.

### 7) LOG örnek

> `DRYRUN OPS_WC30_TICK | recipients=1 | template=OPS_WC30_TR | runId=AB12…9Z | dtMs=842`

## Bir sonraki adım önerisi

* E-code setine `E5=Personel molada / reassign`
* Checklist’i tek satırda tutup detayları lead mesajında ver (2 dakikada bitecek huts).
