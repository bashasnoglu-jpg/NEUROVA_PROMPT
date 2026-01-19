$ErrorActionPreference = "Stop"

# Find repo root (must contain NEUROVA_SITE)
$root = (Get-Location).Path
while ($root -and -not (Test-Path (Join-Path $root "NEUROVA_SITE"))) {
  $p = Split-Path $root -Parent
  if ($p -eq $root) { $root = $null; break }
  $root = $p
}
if (-not $root) { Write-Host "ERROR: NEUROVA_SITE not found from PWD." -ForegroundColor Red; exit 1 }

$lockPath = Join-Path $root "NEUROVA_SITE\VISUAL_LIBRARY_LOCK.md"
Write-Host "VALIDATING: $lockPath" -ForegroundColor Cyan

if (-not (Test-Path $lockPath)) {
  Write-Host "ERROR: VISUAL_LIBRARY_LOCK.md missing." -ForegroundColor Red
  exit 1
}

# BOM check (must NOT be EF BB BF)
$first3 = [System.IO.File]::ReadAllBytes($lockPath) | Select-Object -First 3
if (($first3[0] -eq 0xEF) -and ($first3[1] -eq 0xBB) -and ($first3[2] -eq 0xBF)) {
  Write-Host "ERROR: VISUAL_LIBRARY_LOCK.md has UTF-8 BOM (EF BB BF). Must be no-BOM." -ForegroundColor Red
  exit 1
}

$txt = Get-Content $lockPath -Raw -Encoding UTF8

function Require-Contains([string]$needle, [string]$label) {
  if ($txt -notmatch [regex]::Escape($needle)) {
    Write-Host ("ERROR: Missing required block: " + $label) -ForegroundColor Red
    exit 1
  }
}

# Required headings / blocks
Require-Contains "Hammam Card Library" "Hammam section"
Require-Contains "Massage Card Library" "Massage section"
Require-Contains "Skin Care Card Library" "Skin Care section"
Require-Contains "Kids & Family Card Library" "Kids section"
Require-Contains "Signature Card Library" "Signature section"
Require-Contains "Prompt Library" "Prompt Library section"
Require-Contains "Generation Settings" "Generation Settings section"
Require-Contains "Safety / Clean Rules" "Safety / Clean Rules section"

# Expected mappings
$expected = @(
  @{ path="/assets/img/cards/hamam/01.jpg"; id="hamam_01" },
  @{ path="/assets/img/cards/hamam/02.jpg"; id="hamam_02" },
  @{ path="/assets/img/cards/hamam/03.jpg"; id="hamam_03" },
  @{ path="/assets/img/cards/hamam/04.jpg"; id="hamam_04" },
  @{ path="/assets/img/cards/hamam/05.jpg"; id="hamam_05" },
  @{ path="/assets/img/cards/hamam/06.jpg"; id="hamam_06" },

  @{ path="/assets/img/cards/masaj/01.jpg"; id="masaj_01" },
  @{ path="/assets/img/cards/masaj/02.jpg"; id="masaj_02" },
  @{ path="/assets/img/cards/masaj/03.jpg"; id="masaj_03" },
  @{ path="/assets/img/cards/masaj/04.jpg"; id="masaj_04" },
  @{ path="/assets/img/cards/masaj/05.jpg"; id="masaj_05" },
  @{ path="/assets/img/cards/masaj/06.jpg"; id="masaj_06" },

  @{ path="/assets/img/cards/cilt/01.jpg"; id="cilt_01" },
  @{ path="/assets/img/cards/cilt/02.jpg"; id="cilt_02" },
  @{ path="/assets/img/cards/cilt/03.jpg"; id="cilt_03" },
  @{ path="/assets/img/cards/cilt/04.jpg"; id="cilt_04" },
  @{ path="/assets/img/cards/cilt/05.jpg"; id="cilt_05" },
  @{ path="/assets/img/cards/cilt/06.jpg"; id="cilt_06" },

  @{ path="/assets/img/cards/kids/01.jpg"; id="kids_01"; kids=$true },
  @{ path="/assets/img/cards/kids/02.jpg"; id="kids_02"; kids=$true },
  @{ path="/assets/img/cards/kids/03.jpg"; id="kids_03"; kids=$true },
  @{ path="/assets/img/cards/kids/04.jpg"; id="kids_04"; kids=$true },
  @{ path="/assets/img/cards/kids/05.jpg"; id="kids_05"; kids=$true },
  @{ path="/assets/img/cards/kids/06.jpg"; id="kids_06"; kids=$true },

  @{ path="/assets/img/cards/signature/01.jpg"; id="signature_01" },
  @{ path="/assets/img/cards/signature/02.jpg"; id="signature_02" },
  @{ path="/assets/img/cards/signature/03.jpg"; id="signature_03" },
  @{ path="/assets/img/cards/signature/04.jpg"; id="signature_04" },
  @{ path="/assets/img/cards/signature/05.jpg"; id="signature_05" },
  @{ path="/assets/img/cards/signature/06.jpg"; id="signature_06" }
)

$seenPaths = @{}
$seenIds = @{}

foreach ($e in $expected) {
  $p = $e.path
  $id = $e.id

  if ($seenPaths.ContainsKey($p)) { Write-Host "ERROR: Duplicate path mapping: $p" -ForegroundColor Red; exit 1 }
  if ($seenIds.ContainsKey($id)) { Write-Host "ERROR: Duplicate id mapping: $id" -ForegroundColor Red; exit 1 }
  $seenPaths[$p] = $true
  $seenIds[$id] = $true

  $lineOk = $false
  $lines = $txt -split "`r?`n"
  foreach ($ln in $lines) {
    if ($ln -match "^\s*-\s+$([regex]::Escape($p))\s*->\s*$([regex]::Escape($id))\b") {
      $lineOk = $true
      if ($e.kids -eq $true -and $ln -notmatch "NO CHILD FACES") {
        Write-Host "ERROR: Kids mapping must include (NO CHILD FACES): $ln" -ForegroundColor Red
        exit 1
      }
      break
    }
  }
  if (-not $lineOk) {
    Write-Host "ERROR: Missing mapping line: $p -> $id" -ForegroundColor Red
    exit 1
  }
}

# Physical signature pool check
$sigDir = Join-Path $root "NEUROVA_SITE\assets\img\cards\signature"
if (-not (Test-Path $sigDir)) {
  Write-Host "ERROR: Signature directory missing: $sigDir" -ForegroundColor Red
  exit 1
}
1..6 | ForEach-Object {
  $n = "{0:D2}.jpg" -f $_
  $f = Join-Path $sigDir $n
  if (-not (Test-Path $f)) {
    Write-Host "ERROR: Missing signature image: $f" -ForegroundColor Red
    exit 1
  }
}

Write-Host "`nOK: VISUAL_LIBRARY_LOCK.md is consistent and locked." -ForegroundColor Green
exit 0