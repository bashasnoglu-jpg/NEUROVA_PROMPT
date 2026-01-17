Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location (git rev-parse --show-toplevel)
try {
  git config core.hooksPath .githooks
  Write-Host "Installed git hooks via core.hooksPath=.githooks" -ForegroundColor Green
  Write-Host "Note: Git Bash may require: chmod +x .githooks/pre-commit" -ForegroundColor Yellow
} finally {
  Pop-Location
}
