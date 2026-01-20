param(
  [string]$Root = (Get-Location).Path
)

Write-Host ""
Write-Host ("Root: " + $Root)
Write-Host ""

if (-not (Test-Path -LiteralPath $Root)) {
  Write-Host ("ERROR: Root path not found: " + $Root)
  exit 1
}

# Only files in ROOT (not folders), excluding .git folder by design
$files = Get-ChildItem -LiteralPath $Root -File -Force

# Heuristics for "junk" / accidental artifacts:
# - zero-byte files
# - names starting with "t-Path"
# - names containing "dizini" and ending with .html
# - backup/temporary suffixes
$targets = $files | Where-Object {
  ($_.Length -eq 0) -or
  ($_.Name -like "t-Path*") -or
  ($_.Name -match "dizini.*\.html$") -or
  ($_.Name -like "*.bak") -or
  ($_.Name -like "*.tmp")
}

if (-not $targets -or $targets.Count -eq 0) {
  Write-Host "Nothing to delete (no target files found)."
  exit 0
}

Write-Host "Files that will be DELETED:"
$targets | Select-Object Name, FullName, Length, LastWriteTime | Format-Table -AutoSize

$ans = Read-Host "Type Y to delete these files (anything else cancels)"
if ($ans -ne "Y") { Write-Host "Cancelled."; exit 0 }

$targets | Remove-Item -Force
Write-Host "Deleted."
