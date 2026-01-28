# SANTIS LAN IP Sabitleme & Firewall Talimatı

## 1) Router Arayüzü Checklist
**IP Reservation / DHCP Reservation ile PC’ye Sabit IP**

### Hazırlık
* PC adı: `SANTIS-PROMPT-SERVER`
* Hedef sabit IP: `192.168.1.20`
* PC'nin aktif adaptörünün MAC adresi

### MAC nasıl alınır (Windows)
* Başlat → CMD → `ipconfig /all`
* Karşılık gelen adaptörde “Physical Address” = MAC

### Router'da yapılacaklar
1. Router paneli (örn. `192.168.1.1`) açılır.
2. Menüde DHCP / LAN / Address Reservation / Static DHCP / IP & MAC Binding bulunur.
3. “DHCP Client List / Attached Devices”’ten PC seçilir.
4. “Reserve / Bind / Add Reservation” seçilir.
5. Kayıt girilir:
   * MAC: `AA-BB-CC-DD-EE-FF`
   * IP: `192.168.1.20`
   * Name: `SANTIS-PROMPT-SERVER`
6. Save / Apply ile kaydedilir.
7. Gerekirse DHCP lease renew veya router reboot yapılır.

### Doğrulama
* PC’de `ipconfig` → IPv4 `192.168.1.20` mi?!
* Aynı Wi-Fi’de telefonda `http://192.168.1.20:5500/prompt-library.html` açılıyor mu?

> IP değişiyorsa rezervasyon yanlış adaptöre (Wi-Fi yerine Ethernet gibi) yapılmıştır.

## 2) Windows Firewall Ekran Adımları
**TCP Port 5500 Inbound**

### Adımlar
1. Windows Defender Firewall with Advanced Security açılır.
2. Sol menüden **Inbound Rules** seç.
3. Sağdan **New Rule…** tıkla.
4. Rule Type = **Port**.
5. Protocol = **TCP**.
6. Specific local ports: `5500` (gerekirse `8080`).
7. Action = **Allow the connection**.
8. Profile = Domain + Private (Public gerekmez).
9. Name = `SANTIS Prompt Server TCP 5500`.
10. Finish.

### Hızlı Doğrulama
* Aynı PC: `http://127.0.0.1:5500/prompt-library.html`.
* Başka cihaz: `http://192.168.1.20:5500/prompt-library.html`.

### Sorun Giderme
* Live Server gerçekten 5500 dinliyor mu?
* Port çakışması var mı?
* Public profildeysen Private network’te tekrar test et.

## Mini Not
* `127.0.0.1` sadece o cihaz içindir.
* `192.168.1.20` aynı Wi-Fi/LAN’daki tüm cihazlar için çalışır → QR’lar bu adresi görmeli.
