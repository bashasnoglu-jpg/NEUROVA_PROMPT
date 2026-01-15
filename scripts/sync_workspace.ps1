# scripts/sync_workspace.ps1
$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force ".\NV_SITE" | Out-Null

# eski dosyaları temizle (gizli/system dahil), .keep hariç
Get-ChildItem ".\NV_SITE" -Force |
  Where-Object { $_.Name -ne ".keep" } |
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Copy-Item -Recurse -Force ".\NEUROVA_SITE\*" ".\NV_SITE\"
Write-Host "Synced NEUROVA_SITE -> NV_SITE" -ForegroundColor Green