Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location (git rev-parse --show-toplevel)
try {
  if (Test-Path "scripts/hooks/install-hooks.ps1") {
    & powershell -ExecutionPolicy Bypass -File scripts/hooks/install-hooks.ps1
    exit 0
  }

  git config core.hooksPath .githooks
  Write-Host "NEUROVA hooks enabled: core.hooksPath=.githooks" -ForegroundColor Green
} finally {
  Pop-Location
}

