# scripts/sync_workspace.ps1
$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force ".\NV_SITE" | Out-Null

# clean old workspace files (keep .keep)
Get-ChildItem ".\NV_SITE" -Force |
  Where-Object { $_.Name -ne ".keep" } |
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Copy-Item -Recurse -Force ".\NEUROVA_SITE\*" ".\NV_SITE\"
Write-Host "Synced NEUROVA_SITE -> NV_SITE" -ForegroundColor Green

# ensure index.html exists inside NV_SITE language roots (nav links use relative index.html)
Copy-Item -Force ".\index.html" ".\NV_SITE\tr\index.html"
Copy-Item -Force ".\index.html" ".\NV_SITE\en\index.html"

