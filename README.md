![NEUROVA MEGA SCAN](https://github.com/<USERNAME>/<REPO>/actions/workflows/mega-scan.yml/badge.svg)

# NEUROVA Prompts

## 🚀 Geliştirme Ortamı Kurulumu (Development Setup)

Bu proje, dinamik olarak varlık (asset) ve modül yüklediği için bir yerel web sunucusu (local web server) üzerinden çalıştırılmalıdır. Dosyaları doğrudan tarayıcıda açmak (`file:///` protokolü) tarayıcı güvenlik kısıtlamaları nedeniyle hatalara yol açacaktır.

### Adım 1: Bağımlılıkları Yükleme

Proje ana klasöründe bir terminal açın ve aşağıdaki komutu çalıştırarak gerekli tüm bağımlılıkları yükleyin:

```bash
npm install
```

### Adım 2: Geliştirme Sunucusunu Başlatma

Kurulum tamamlandıktan sonra, geliştirme sunucusunu başlatmak için aşağıdaki komutu kullanın:

```bash
npm run dev
```

Bu komut, `server/index.cjs` dosyasını çalıştırarak projeyi `http://localhost:3000` adresinde (veya terminalde belirtilen başka bir portta) sunmaya başlayacaktır.

### Adım 3: Projeye Erişim

Tarayıcınızı açın ve geliştirme sunucusunun size verdiği adrese gidin (genellikle http://localhost:3000). Sunucu, sizi otomatik olarak projenin ana sayfasına yönlendirecektir. Artık tüm özellikler beklendiği gibi çalışacaktır.

### Charset / UTF-8 Doğrulama

Sunucunun `charset=utf-8` döndüğünü hızlıca kontrol edin:

```bash
curl -I http://localhost:3000/NEUROVA_SITE/index.html | grep -i charset
```

Windows PowerShell için:

```powershell
curl.exe -I http://localhost:3000/NEUROVA_SITE/index.html | findstr /i charset
```

## 🛡️ Deployment & Kalite Kontrol

Her deploy öncesi **[DEPLOY_CHECKLIST.md](./NEUROVA_SITE/DEPLOY_CHECKLIST.md)** dosyasındaki adımları tamamlamak **ZORUNLUDUR**.
## Git hooks (mojibake guard)

This repo includes a pre-commit hook that blocks commits with common Turkish encoding artefacts (mojibake).

- First setup (required): `sh scripts/setup-hooks.sh` or `powershell -ExecutionPolicy Bypass -File scripts/setup-hooks.ps1`
- Alternative: `powershell -ExecutionPolicy Bypass -File scripts/hooks/install-hooks.ps1` or `sh scripts/hooks/install-hooks.sh`
- If needed (Git Bash): `chmod +x .githooks/pre-commit`
- To fix files: `py -3 NV_TOOLS/fix_tr_chars.py --root . --apply --backup --stats`

## Global stage (canonical)

- Spec: `NEUROVA_SITE/NEUROVA_GLOBAL_STAGE_KODEKS_v1.0.md`
