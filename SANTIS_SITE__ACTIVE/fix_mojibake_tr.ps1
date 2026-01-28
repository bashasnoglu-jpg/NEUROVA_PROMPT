$root = "C:\dev\SANTIS_PROMPT_FRESH\SANTIS_SITE\tr"
$files = Get-ChildItem $root -Filter *.html -Recurse

function Backup-Once($p) {
  $bak = "$p.bak"
  if ((Test-Path $p) -and (-not (Test-Path $bak))) { Copy-Item $p $bak -Force }
}

$map = [ordered]@{
  "Ã¼"="ü"; "Ãœ"="Ü";
  "Ã¶"="ö"; "Ã–"="Ö";
  "Ã§"="ç"; "Ã‡"="Ç";
  "Ä±"="ı"; "Ä°"="İ";
  "ÄŸ"="ğ"; "Äž"="Ğ";
  "ÅŸ"="ş"; "Åž"="Ş";

  "Î²"="β";
  "â„¢"="™";

  "â€“"="–";
  "â€”"="—";
  "â€˜"="‘"; "â€™"="’";
  "â€œ"="“"; "â€"="”";

  "Â "=""
}

$changed = 0
foreach ($f in $files) {
  $p = $f.FullName
  $txt = Get-Content $p -Raw
  $new = $txt
  foreach ($k in $map.Keys) { $new = $new -replace [regex]::Escape($k), $map[$k] }

  if ($new -ne $txt) {
    Backup-Once $p
    Set-Content -Path $p -Value $new -Encoding utf8
    $changed++
    Write-Host "FIXED: $p"
  }
}

Write-Host ""
Write-Host "DONE. Degisen dosya sayisi: $changed"
Write-Host ""

Select-String -Path "$root\*.html" -Pattern "Ã|Ä|Å|Î|â€|Â " -List
