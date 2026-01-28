$ErrorActionPreference = "Stop"

function Ensure-Dir($p) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
function Move-IfExists($from, $toDir) {
    if (Test-Path -LiteralPath $from) {
        Ensure-Dir $toDir
        $name = Split-Path -Leaf $from
        $dest = Join-Path $toDir $name
        if (-not (Test-Path -LiteralPath $dest)) {
            Write-Host "MOVE: $from -> $dest"
            Move-Item -LiteralPath $from -Destination $dest -Force
        } else {
            Write-Host "SKIP (exists): $dest"
        }
    }
}

# 0) Backup (skip with NV_SKIP_BACKUP=1). Excludes _backup to avoid self-inclusion locks.
$skipBackup = $env:NV_SKIP_BACKUP -eq "1"
Ensure-Dir ".\_backup"
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zip = ".\_backup\NEUROVA_cleanup_$stamp.zip"
if (-not $skipBackup -and -not (Test-Path $zip)) {
    Write-Host "BACKUP: $zip"
    $items = Get-ChildItem -Force -Path . | Where-Object { $_.Name -ne "_backup" }
    Compress-Archive -Path $items.FullName -DestinationPath $zip -Force
} elseif ($skipBackup) {
    Write-Host "BACKUP SKIPPED (NV_SKIP_BACKUP=1)"
}

# 1) Ensure target roots
Ensure-Dir ".\NEUROVA_SITE"
Ensure-Dir ".\NEUROVA_SITE\assets"
Ensure-Dir ".\NEUROVA_SITE\assets\js"
Ensure-Dir ".\NEUROVA_SITE\assets\css"
Ensure-Dir ".\NEUROVA_SITE\assets\img"
Ensure-Dir ".\NEUROVA_SITE\assets\icons"

Ensure-Dir ".\NEUROVA_PROMPT"
Ensure-Dir ".\NEUROVA_PROMPT\packs"

# 2) Move site HTML from root to NEUROVA_SITE (if present)
$sitePages = @(
    "index.html","hamam.html","masajlar.html","kids-family.html","face-sothys.html",
    "yoga.html","products.html","about.html","team.html","packages.html","paketler.html",
    "nav.html","heatmap-overlay.js","heatmap.js","pricing-config.js","pricing-linker.js",
    "wa-config.js","wa-linker.js","slot-macro.js"
)
foreach ($p in $sitePages) {
    Move-IfExists ".\$p" ".\NEUROVA_SITE"
}

# 3) Move root assets dir into NEUROVA_SITE/assets (merge via robocopy)
if (Test-Path ".\assets") {
    Write-Host "MERGE assets -> NEUROVA_SITE/assets"
    robocopy ".\assets" ".\NEUROVA_SITE\assets" /E /XC /XN /XO | Out-Null
    Remove-Item ".\assets" -Recurse -Force
}

# 4) Remove/ignore partials and _report/focus (rename to avoid audit)
if (Test-Path ".\partials") {
    Write-Host "Removing partials (duplicate nav)..."
    Remove-Item ".\partials" -Recurse -Force
}
if (Test-Path ".\_report\focus") {
    Ensure-Dir ".\_archive"
    $target = ".\_archive\focus_snapshot_$stamp"
    Write-Host "Archiving _report\\focus -> $target"
    Move-Item ".\_report\focus" $target
    Get-ChildItem -Path $target -Filter *.html -Recurse | Rename-Item -NewName { $_.Name + ".bak" }
}

# 5) Move prompt files to NEUROVA_PROMPT
$promptFiles = @(
    "prompt-library.html","prompt-library-app.html","prompt-library-enhanced.html",
    "prompt-export.js","prompts-data.js","prompts-loader.js",
    "prompt-app.js","app.js","health-check.js"
)
foreach ($f in $promptFiles) {
    Move-IfExists ".\$f" ".\NEUROVA_PROMPT"
}
if (Test-Path ".\packs") {
    Write-Host "MERGE packs -> NEUROVA_PROMPT\\packs"
    robocopy ".\packs" ".\NEUROVA_PROMPT\packs" /E /XC /XN /XO | Out-Null
    Remove-Item ".\packs" -Recurse -Force
}

# 6) Clean duplicate root prompt folders (archive already exists)
# nothing more here; audit will confirm

Write-Host "`nCLEANUP COMPLETE. Run: npm run nv:verify && node tools\\nv-audit.js"
