# scripts/sync_workspace.ps1
$ErrorActionPreference = "Stop"

Copy-Item -Recurse -Force ".\NEUROVA_SITE\*" ".\NV_SITE\"
Write-Host "Synced NEUROVA_SITE -> NV_SITE" -ForegroundColor Green