Param(
  [Parameter(Mandatory)]
  [string]$RootA,
  [Parameter(Mandatory)]
  [string]$RootB
)

$ErrorActionPreference = 'Stop'

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outDir = Join-Path $env:TEMP ("NV_MERGE_REPORT_" + $stamp)
New-Item -ItemType Directory -Path $outDir | Out-Null
$report = Join-Path $outDir "NV_ROOT_MERGE_REPORT.txt"

function W($line = "") {
  Add-Content -Path $report -Value $line
}

function FileIndex($root) {
  $files = Get-ChildItem -Path $root -Recurse -File -Force -Attributes !ReparsePoint -ErrorAction SilentlyContinue
  $index = @()
  foreach ($f in $files) {
    $rel = $f.FullName.Substring($root.Length).TrimStart("\", "/")
    $hash = ""
    try { $hash = (Get-FileHash $f.FullName -Algorithm SHA256).Hash } catch {}
    $index += [PSCustomObject]@{
      Root = $root
      Rel  = $rel
      Name = $f.Name
      Ext  = $f.Extension.ToLower()
      Size = $f.Length
      LastWrite = $f.LastWriteTime
      Hash = $hash
      Full = $f.FullName
    }
  }
  return $index
}

function SearchRefs($root) {
  $path = Join-Path $root "prompt-library.html"
  if (-not (Test-Path $path)) { return @() }
  $lines = Get-Content $path
  $refs = @()
  for ($i = 0; $i -lt $lines.Length; $i++) {
    $ln = $lines[$i]
    if ($ln -match '<script[^>]+src="([^"]+)"') {
      $refs += [PSCustomObject]@{ Kind = "script"; Ref = $matches[1]; Line = $i + 1 }
    }
    if ($ln -match '<link[^>]+href="([^"]+)"') {
      $refs += [PSCustomObject]@{ Kind = "link"; Ref = $matches[1]; Line = $i + 1 }
    }
  }
  return $refs
}

function ResolveRefs($root, $refs) {
  $rows = @()
  foreach ($r in $refs) {
    $ref = $r.Ref
    if ($ref -match '^(https?:)?//') { continue }
    if ($ref -match '^data:') { continue }
    $clean = $ref.Split("?")[0].Split("#")[0]
    $clean2 = $clean
    if ($clean2.StartsWith("/")) { $clean2 = $clean2.TrimStart("/") }
    $rows += [PSCustomObject]@{
      Kind = $r.Kind
      Ref  = $ref
      Line = $r.Line
      Exists = (Test-Path (Join-Path $root $clean2))
      Resolved = Join-Path $root $clean2
    }
  }
  return $rows
}

function QuickGrep($root, $pattern) {
  $files = Get-ChildItem -Path $root -Recurse -File -Include *.html,*.js,*.css,*.json -Force -Attributes !ReparsePoint -ErrorAction SilentlyContinue
  $results = @()
  foreach ($file in $files) {
    $matchResults = Select-String -Path $file.FullName -Pattern $pattern -List -ErrorAction SilentlyContinue
    if ($matchResults) {
      foreach ($match in $matchResults) {
        $results += [PSCustomObject]@{
          File = $file.FullName.Substring($root.Length).TrimStart("\", "/")
          Line = $match.LineNumber
          Text = $match.Line.Trim()
        }
      }
    }
  }
  return $results
}

function DupReport($index, $label) {
  W ("-- $label --")
  $groups = $index | Group-Object Hash | Where-Object { $_.Name -and $_.Count -gt 1 }
  W ("Duplicate groups: $($groups.Count)")
  foreach ($group in $groups | Select-Object -First 20) {
    W ("HASH: $($group.Name) (x$($group.Count))")
    foreach ($member in $group.Group | Select-Object -First 10) {
      W ("  $($member.Rel)")
    }
  }
  W ""
}

W "SANTIS ROOT+MERGE REPORT v1.0"
W ("Timestamp: " + (Get-Date).ToString("s"))
W ""
W ("A: $RootA")
W ("B: $RootB")
W ""
W "============================================================"
W "0) ROOT VALIDATION"
W "============================================================"
W ("A exists: " + (Test-Path $RootA))
W ("B exists: " + (Test-Path $RootB))
W ""

W "============================================================"
W "1) MUST-HAVE FILES (root check)"
W "============================================================"
$must = @(
  "prompt-library.html","app.js","prompts-loader.js","health-check.js",
  (Join-Path "packs" "manifest.json")
)
W "A:"
foreach ($item in $must) {
  W ("  {0,-20} {1}" -f $item, (Test-Path (Join-Path $RootA $item)))
}
W "B:"
foreach ($item in $must) {
  W ("  {0,-20} {1}" -f $item, (Test-Path (Join-Path $RootB $item)))
}

W "============================================================"
W "2) HTML REFS CHECK (prompt-library.html -> script/link exists?)"
W "============================================================"
$refsA = ResolveRefs $RootA (SearchRefs $RootA)
$refsB = ResolveRefs $RootB (SearchRefs $RootB)
W "A refs:"
$refsA | Sort-Object Exists,Kind,Ref | Format-Table -AutoSize | Out-String | ForEach-Object { W $_ }
W "B refs:"
$refsB | Sort-Object Exists,Kind,Ref | Format-Table -AutoSize | Out-String | ForEach-Object { W $_ }

W "============================================================"
W "3) FILE INDEX + CONFLICTS (same rel path, different content?)"
W "============================================================"
$indexA = FileIndex $RootA
$indexB = FileIndex $RootB
$mapB = @{}
foreach ($b in $indexB) {
  if (-not $mapB.ContainsKey($b.Rel)) { $mapB[$b.Rel] = $b }
}
$join = foreach ($a in $indexA) {
  if ($mapB.ContainsKey($a.Rel)) {
    $b = $mapB[$a.Rel]
    [PSCustomObject]@{
      Rel = $a.Rel
      SameHash = ($a.Hash -and $b.Hash -and $a.Hash -eq $b.Hash)
      A_Size = $a.Size
      B_Size = $b.Size
      A_Time = $a.LastWrite
      B_Time = $b.LastWrite
      A_Hash = $a.Hash
      B_Hash = $b.Hash
    }
  }
}
$conflicts = $join | Where-Object { $_.SameHash -ne $true }
W ("Total shared paths: " + ($join | Measure-Object).Count)
W ("Conflicts (same path, different content): " + ($conflicts | Measure-Object).Count)
W ""
W "Top conflicts (first 60):"
$conflicts | Select-Object -First 60 | Format-Table -AutoSize | Out-String | ForEach-Object { W $_ }

W "============================================================"
W "3b) ONLY IN A / ONLY IN B (missing files)"
W "============================================================"
$relA = $indexA | ForEach-Object Rel
$relB = $indexB | ForEach-Object Rel
$onlyA = $relA | Where-Object { $_ -notin $relB } | Sort-Object
$onlyB = $relB | Where-Object { $_ -notin $relA } | Sort-Object
W ("Only in A: " + $onlyA.Count)
$onlyA | Select-Object -First 80 | ForEach-Object { W ("  " + $_) }
W ""
W ("Only in B: " + $onlyB.Count)
$onlyB | Select-Object -First 80 | ForEach-Object { W ("  " + $_) }
W ""

W "============================================================"
W "4) DUPLICATES (same hash appears multiple times inside each root)"
W "============================================================"
DupReport $indexA "A"
DupReport $indexB "B"

W "============================================================"
W "5) QUICK GREP (root path killers)"
W "============================================================"
$patterns = @(
  'src="[^"]*packs\/',
  'href="[^"]*assets\/',
  'NV_PACK_LIST',
  'manifest\.json',
  '__NV_PACK_ERRORS__',
  'NV_OBS_SELFTEST_RUN',
  '__NV_SELFTEST_OK__',
  '\bnvLoadPromptPacks\b',
  '\bnvOnPromptsReady\b',
  '\bnvDownloadText\b',
  '\bnvBuildMD\b',
  'http:\/\/127\.0\.0\.1:55(00|01)',
  'file:\/\/\/'
)
foreach ($pattern in $patterns) {
  W ("--- FIND: $pattern (A) ---")
  (QuickGrep $RootA $pattern | Select-Object -First 40) | Format-Table -AutoSize | Out-String | ForEach-Object { W $_ }
  W ("--- FIND: $pattern (B) ---")
  (QuickGrep $RootB $pattern | Select-Object -First 40) | Format-Table -AutoSize | Out-String | ForEach-Object { W $_ }
}

W "============================================================"
W "6) MERGE DECISION HINTS (heuristic)"
W "============================================================"
W "Kural: Ayni path cakisiyorsa, genelde daha yeni LastWriteTime olan dosya 'aday'dir."
W "Ama: prompt-library.html + loader + app.js gibi cekirdeklerde once referans/exports uyumu kontrol edilmelidir."
W "Altin kural: prompt-library.html icin bir root sec; o HTML'in referans verdigi app.js / prompts-loader.js / health-check.js / tools/* ayni root'tan gelsin (karisik olursa Unexpected token < / undefined export hatasi olur)."
W "Altin kural: packs/manifest.json + packs/pack.*.js ayni set olmali."
W ""
W "En kritik catismalar (cekirdek):"
$critical = $conflicts | Where-Object { $_.Rel -match "prompt-library\.html|app\.js|prompts-loader\.js|health-check\.js|packs\\manifest\.json" }
$critical | Format-Table -AutoSize | Out-String | ForEach-Object { W $_ }

W ""
W "REPORT PATH:"
W $report
W "OUTDIR:"
W $outDir
W "✅ NV ROOT+MERGE REPORT hazır:"
W $report
