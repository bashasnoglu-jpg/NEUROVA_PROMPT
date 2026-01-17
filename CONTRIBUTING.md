# Contributing

## UTF-8 / Mojibake (NEUROVA UTF-8 KODEKS)

This repo uses a pre-commit hook to block commits that contain common Turkish encoding artefacts (mojibake) or staged files that are not UTF-8 decodable.

### Enable hooks (recommended)

- İlk kurulum (zorunlu):
  - macOS/Linux/Git Bash: `sh scripts/setup-hooks.sh`
  - Windows PowerShell: `powershell -ExecutionPolicy Bypass -File scripts/setup-hooks.ps1`

- Alternatif:
  - Windows (PowerShell): `powershell -ExecutionPolicy Bypass -File scripts/hooks/install-hooks.ps1`
  - macOS/Linux (sh): `sh scripts/hooks/install-hooks.sh`
- If needed (Git Bash): `chmod +x .githooks/pre-commit`

### Fix mojibake / normalize to UTF-8

Run from repo root:

- Dry-run: `py -3 NV_TOOLS/fix_tr_chars.py --root . --dry-run --stats`
- Apply + backups: `py -3 NV_TOOLS/fix_tr_chars.py --root . --apply --backup --stats`

### VS Code tips (encoding)

- Show encoding: click the encoding label in the status bar (bottom-right).
- Reopen with encoding: Command Palette → “Reopen with Encoding” → try `Windows 1254` for Turkish ANSI files.
- Save with encoding: Command Palette → “Save with Encoding” → `UTF-8`.
