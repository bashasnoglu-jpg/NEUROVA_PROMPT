# SANTIS Internal Staff Guide (EN) v1.0

## 1. What is Prompt Library?
- A single technical surface that hosts every pack, language block, and safeNote you use on site—this is the SANTIS İstek Kütüphanesi (Prompt Library).
- The interface is the same for every team: the `prompt-library.html` page, driven by `app.js`, `packs/*.js`, and the QA harness.
- You interact with the same cards, tags, and filters whether the content is TR or EN; only the guidance language changes.

## 2. Roles explained
- **Therapist:** therapeutic content, rituals, and wellbeing messaging. Use this role on treatment-room machines and never swap to Reception while serving a guest.
- **Reception:** sales, scheduling, and guest coordination. This role lives on front-desk workstations and has its own curated prompt subset.
- Role filters must stay locked per station to avoid misusing promos from the other discipline.

## 3. Kids / Hammam / Face safe rules
- **Kids/Family:** always ask for parental consent and confirm quiet, comfort, and permission before you proceed. The SafeNote line must stay visible and respected.
- **Hammam:** rely on wellness language only. No medical promises, no therapies. Keep voice calm and respectful.
- **Face – Sothys:** honor the brand tone. Quiet area, premium language, and no over-promising results.
- If any card is missing a SafeNote or shows a red warning, stop and ask a supervisor.

## 4. When to ask approval
- Always escalate before publishing:
  1. Kids imagery / messaging
  2. Signature & Couples rituals
  3. Face – Sothys experiences
- Document the prompt code (e.g., `REC_03`), a screenshot, and who you notified in the shared WhatsApp/Slack channel.
- Technical issues? Submit errors via the QA panel by pressing the `Run QA Tests` button when `?qa=1` is active.

## 5. QA link & manager mode
- Managers open `prompt-library.html?qa=1` for selftests; the QA harness runs automatically, showing `Selftest: OK` and `ERRORS: 0`.
- The page footer always reads `Prompt Library vX.Y | packs: N | QA: PASS` to reassure staff they use the latest version.
- Any mismatch between `TR` and `EN` guidance? Alert the content lead, but never fork the prompts themselves.

## 6. Resources (TR / EN)
- Staff Quick Guide (TR): `docs/personel-hizli-kullanim-tr.md`
- Staff Quick Guide (EN): `docs/SANTIS_Staff_Quick_Guide_EN_A4.md`
- QA/Internal Guide (EN) – this document, use it during onboarding or refresh training before every shift.
