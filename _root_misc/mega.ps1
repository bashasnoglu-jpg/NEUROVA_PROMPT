# =========================
# NEUROVA MEGA SCAN v1.1
# Hata ayıkla + raporla
# =========================
$ErrorActionPreference = "SilentlyContinue"
$root = (Get-Location).Path
$out  = Join-Path $root "NV_MEGA_REPORT.txt"
if (Test-Path $out) { Remove-Item $out -Force }

function W($s=""){ Add-Content -Path $out -Value $s }

W "NEUROVA MEGA SCAN v1.1"
W ("ROOT: " + $root)
W ("TIME: " + (Get-Date).ToString("s"))
W ""

# ignore helpers
$IgnorePathPatterns = @(
  "\\node_modules\\",
  "\\dist\\",
  "\\build\\",
  "\\.git\\",
  "\\.vscode\\",
  "\\archive\\",
  "\\old\\",
  "\\[^\\]+_old\\"
)
$IgnorePathRegex = ($IgnorePathPatterns -join "|")

function NotIgnored($path) {
  return -not ($path -match $IgnorePathRegex)
}

$MetricsScript = ".\\tools\\mega-metrics.mjs"
$MetricTimeout = 15000

function Get-PackMetrics() {
  if (-not (Test-Path $MetricsScript)) {
    return @{ success = $false; error = "mega-metrics script missing" }
  }
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    return @{ success = $false; error = "node executable not found" }
  }

  $raw = & node $MetricsScript 2>&1
  $exit = $LASTEXITCODE
  $trimmed = ($raw | Where-Object { $_.Trim() -ne "" }) -join "`n"

  if ($exit -ne 0) {
    return @{ success = $false; error = "mega-metrics exited with code $exit"; raw = $trimmed }
  }

  try {
    $json = $trimmed | ConvertFrom-Json
    return @{ success = $true; metrics = $json }
  } catch {
    return @{ success = $false; error = ("JSON parse error: " + $_.Exception.Message); raw = $trimmed }
  }
}

$nodeCheckFailed = $false
$missingAssetFound = $false

# 0) Quick sanity
W "== 0) BASIC CHECKS =="
W ("package.json: " + (Test-Path ".\package.json"))
W ("server\index.cjs: " + (Test-Path ".\server\index.cjs"))
W ("server\webhook.cjs: " + (Test-Path ".\server\webhook.cjs"))
W ""

# 1) npm scripts
W "== 1) NPM SCRIPTS =="
if (Test-Path ".\package.json") {
  try {
    $pj = Get-Content ".\package.json" -Raw | ConvertFrom-Json
    $scripts = $pj.scripts.PSObject.Properties | ForEach-Object { $_.Name + " = " + $_.Value }
    $scripts | ForEach-Object { W $_ }
  } catch { W ("package.json JSON parse ERROR: " + $_) }
} else {
  W "package.json bulunamadı."
}
W ""

# 2) Node syntax check (JS/CJS/MJS)
W "== 2) NODE SYNTAX CHECK (node --check) =="
$jsFiles = Get-ChildItem -Recurse -File -Include *.js,*.cjs,*.mjs -ErrorAction SilentlyContinue |
  Where-Object { NotIgnored $_.FullName }
foreach ($f in $jsFiles) {
  $p = $f.FullName
  $res = & node --check $p 2>&1
  if ($LASTEXITCODE -ne 0) {
    W ("[FAIL] " + $p)
    $res | ForEach-Object { W ("   " + $_) }
    $nodeCheckFailed = $true
  }
}
if ($nodeCheckFailed) {
  W "Node --check tamamlanamadı (hata)."
} else {
  W "Node --check tamamlandı."
}
W ""

# 3) JSON files parse check (skip lockfiles)
W "== 3) JSON FILE PARSE CHECK =="

$jsonFiles = Get-ChildItem -Recurse -File -Include *.json -ErrorAction SilentlyContinue |
  Where-Object {
    NotIgnored $_.FullName -and
    $_.Name -notin @("package-lock.json","yarn.lock","pnpm-lock.yaml")
  }

foreach ($f in $jsonFiles) {
  try {
    if ((Get-Command ConvertFrom-Json).Parameters.ContainsKey('Depth')) {
      Get-Content $f.FullName -Raw | ConvertFrom-Json -Depth 200 | Out-Null
    } else {
      Get-Content $f.FullName -Raw | ConvertFrom-Json | Out-Null
    }
  }
  catch {
    W ("[BAD JSON] " + $f.FullName)
    W ("   " + $_.Exception.Message)
  }
}
W "JSON parse check tamamlandı."
W ""

# 4) HTML -> script/src + link/href existence scan (local)
W "== 4) HTML ASSET LINK CHECK (src/href exists) =="
$htmlFiles = Get-ChildItem -Recurse -File -Include *.html -ErrorAction SilentlyContinue |
  Where-Object { NotIgnored $_.FullName }

function Resolve-LocalPath($baseFile, $ref) {
  if ($ref -match "^(https?:)?//") { return $null }
  if ($ref -match "^(data:|mailto:|tel:)") { return $null }
  $ref2 = $ref.Split("?")[0].Split("#")[0]
  if ($ref2.StartsWith("/")) { return Join-Path $root $ref2.TrimStart("/") }
  return Join-Path (Split-Path $baseFile -Parent) $ref2
}

foreach ($hf in $htmlFiles) {
  $content = Get-Content $hf.FullName -Raw
  $refs = @()
  $refs += ([regex]::Matches($content, '<script[^>]+src=["'']([^"'']+)["'']', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value })
  $refs += ([regex]::Matches($content, '<link[^>]+href=["'']([^"'']+)["'']', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value })
  foreach ($r in $refs) {
  $lp = Resolve-LocalPath $hf.FullName $r
  if ($lp -and !(Test-Path $lp)) {
    $missingAssetFound = $true
    W ("[MISSING ASSET] " + $hf.FullName)
      W ("   ref: " + $r)
      W ("   path: " + $lp)
    }
  }
}
W "HTML asset check tamamlandı."
W ""

# 5) Pack metrics (manifest + pack prompt counts)
W "== 5) PACK METRICS =="
$packMetrics = Get-PackMetrics
if ($packMetrics.success) {
  W ("packs count = " + $packMetrics.metrics.packCount)
  W ("total prompts = " + $packMetrics.metrics.totalPrompts)
  foreach ($pack in @($packMetrics.metrics.packs)) {
    $entry = $pack.path
    $prompts = $pack.prompts
    $ids = $pack.ids
    W ("  " + $entry + " → prompts=" + $prompts + " ids=" + $ids)
  }
  $dups = @($packMetrics.metrics.duplicateIds)
  if ($dups.Count -gt 0) {
    $dupIds = ($dups | ForEach-Object { $_.id }) -join ", "
    W ("[WARN] duplicate IDs detected: " + $dupIds)
  }
} else {
  W ("[FAIL] mega-metrics: " + $packMetrics.error)
  if ($packMetrics.raw) {
    W ("  raw: " + $packMetrics.raw)
  }
  W ("packs count = N/A")
  W ("total prompts = N/A")
}
W ""

# 5) Common "oops" patterns
W "== 5) COMMON OOPS PATTERNS =="
$patterns = @(
  @{ name="Unexpected token '<' (HTML served as JS)"; rx="Unexpected token\s*'<'" },
  @{ name="ERR_CONNECTION_REFUSED"; rx="ERR_CONNECTION_REFUSED" },
  @{ name="payload=%7B (form payload)"; rx="payload=%7B" },
  @{ name="NV_PACK_LIST"; rx="NV_PACK_LIST" },
  @{ name="manifest.json"; rx="manifest\.json" }
)
$txtFiles = Get-ChildItem -Recurse -File -Include *.js,*.cjs,*.mjs,*.html,*.md,*.txt -ErrorAction SilentlyContinue |
  Where-Object { NotIgnored $_.FullName }

foreach ($p in $patterns) {
  $hits = @()
  foreach ($f in $txtFiles) {
    $c = Get-Content $f.FullName -Raw
    if ($c -match $p.rx) { $hits += $f.FullName }
  }
  if ($hits.Count -gt 0) {
    W ("[HIT] " + $p.name + "  (" + $hits.Count + ")")
    $hits | Select-Object -First 30 | ForEach-Object { W ("   " + $_) }
  }
}
W ""

# 6) Summary
W "== 6) SUMMARY =="
W "Rapor üretildi: NV_MEGA_REPORT.txt"
$priorityNotes = @()
if ($nodeCheckFailed) {
  $priorityNotes += "[FAIL] node --check"
} else {
  $priorityNotes += "[OK] node --check"
}
if ($missingAssetFound) {
  $priorityNotes += "[MISSING ASSET]"
} else {
  $priorityNotes += "[OK] assets"
}
W ("Öncelik: " + ($priorityNotes -join " "))
W ""
Write-Host "OK -> $out"
