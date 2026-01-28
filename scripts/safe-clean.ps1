param(
  [string]$Root = (Get-Location).Path,
  [string[]]$Keep = @("SANTIS_SITE__ACTIVE")
)

# If Keep arrives as a single comma-separated string, split it
if ($Keep.Count -eq 1 -and $Keep[0] -match ",") {
  $Keep = $Keep[0].Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}

# Always keep these (failsafe)
$ScriptDirName = Split-Path -Leaf $PSScriptRoot
$AlwaysKeep = @(".git", $ScriptDirName)

$Keep = @($Keep + $AlwaysKeep) | Select-Object -Unique

Write-Host ""
Write-Host ("Root: " + $Root)
Write-Host ("Keep: " + ($Keep -join ", "))
Write-Host ""

if (-not (Test-Path -LiteralPath $Root)) {
  Write-Host ("ERROR: Root path not found: " + $Root)
  exit 1
}

$dirs = Get-ChildItem -LiteralPath $Root -Directory -Force
$targets = $dirs | Where-Object { $Keep -notcontains $_.Name }

if (-not $targets -or $targets.Count -eq 0) {
  Write-Host "Nothing to delete (no target folders found)."
  exit 0
}

Write-Host "Folders that will be DELETED:"
$targets | Select-Object Name, FullName, LastWriteTime | Format-Table -AutoSize

$ans = Read-Host "Type Y to delete these folders (anything else cancels)"
if ($ans -ne "Y") { Write-Host "Cancelled."; exit 0 }

$targets | Remove-Item -Recurse -Force
Write-Host "Deleted."
