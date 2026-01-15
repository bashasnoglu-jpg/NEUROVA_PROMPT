# scripts/hooks/pre-commit.ps1 (Windows PowerShell safe)
$ErrorActionPreference = "Stop"

$files = git diff --cached --name-only
if (-not $files) { exit 0 }

$extOk = @(".js",".cjs",".mjs",".ts",".css",".html",".json",".md",".yml",".yaml",".py",".txt")
$targets = $files | Where-Object { $extOk -contains ([IO.Path]::GetExtension($_).ToLower()) }

# 1) CRLF kontrolü: staged içerikte CR var mı?
$bad = @()
foreach ($f in $targets) {
  try {
    $content = git show ":$f"
    if ($content -match "`r") { $bad += $f }
  } catch { }
}

if ($bad.Count -gt 0) {
  Write-Host "ERROR: CRLF found in staged files:" -ForegroundColor Red
  $bad | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  Write-Host "Fix: ensure LF only (gitattributes) then re-add." -ForegroundColor Yellow
  exit 1
}

# 2) Mojibake kontrolü (bilgilendirme amaçlı; commit'i bloklamaz)
$fixer = ".\NV_TOOLS\fix_tr_chars.py"
if (Test-Path $fixer) {
  try { & py -3 $fixer --root . --dry-run | Out-Null } catch { }
}

exit 0
