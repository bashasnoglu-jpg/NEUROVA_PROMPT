param(
  [string]$Root = "NEUROVA_SITE",
  [string[]]$Extensions = @("html", "css", "js", "json", "md"),
  [string[]]$ExcludeDirs = @("node_modules", ".git"),
  [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$utf8Strict = New-Object System.Text.UTF8Encoding($false, $true)
$utf8Bom    = New-Object System.Text.UTF8Encoding($true)
$utf8NoBom  = New-Object System.Text.UTF8Encoding($false)
$enc1252    = [System.Text.Encoding]::GetEncoding(1252) # Windows-1252
$enc1254    = [System.Text.Encoding]::GetEncoding(1254) # Windows-1254 (Turkish ANSI)

function New-StrFromCodepoints([int[]]$cps) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($cp in $cps) { [void]$sb.Append([char]$cp) }
  return $sb.ToString()
}

function Apply-KnownTokenFixes([string]$text) {
  if ($null -eq $text) { return $text }

  # Remove BOM if it ended up as a literal character in the content.
  if ($text.Length -gt 0 -and [int][char]$text[0] -eq 0xFEFF) {
    $text = $text.Substring(1)
  }

  # Some files were saved with a literal leading '?' before <!DOCTYPE or <html.
  if ($text.Length -ge 2 -and $text[0] -eq '?' -and $text[1] -eq '<') {
    $text = $text.Substring(1)
  }

  # Ordered replacements for the project's common mojibake tokens -> real characters.
  # NOTE: All tokens are expressed by codepoints to keep this script ASCII-only.
  $map = @(
    # Standard UTF-8-as-Windows-1252 mojibake sequences (safe to fix via direct replacement)
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x00BC)); To = (New-StrFromCodepoints @(0x00FC)) }, # Ã¼ -> ü
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x009C)); To = (New-StrFromCodepoints @(0x00DC)) }, # Ãœ -> Ü (0x9C in Win1252)
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x0096)); To = (New-StrFromCodepoints @(0x00D6)) }, # Ã– -> Ö (ISO-8859-1/Win1252 control variant)
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x00B6)); To = (New-StrFromCodepoints @(0x00F6)) }, # Ã¶ -> ö
    @{ From = (New-StrFromCodepoints @(0x00C4, 0x00B1)); To = (New-StrFromCodepoints @(0x0131)) }, # Ä± -> ı
    @{ From = (New-StrFromCodepoints @(0x00C4, 0x00B0)); To = (New-StrFromCodepoints @(0x0130)) }, # Ä° -> İ
    @{ From = (New-StrFromCodepoints @(0x00C4, 0x0178)); To = (New-StrFromCodepoints @(0x011F)) }, # ÄŸ -> ğ
    @{ From = (New-StrFromCodepoints @(0x00C4, 0x017E)); To = (New-StrFromCodepoints @(0x011E)) }, # Äž -> Ğ
    @{ From = (New-StrFromCodepoints @(0x00C4, 0x009E)); To = (New-StrFromCodepoints @(0x011E)) }, # Äž -> Ğ (ISO-8859-1 control variant)
    @{ From = (New-StrFromCodepoints @(0x00C4, 0x009F)); To = (New-StrFromCodepoints @(0x011F)) }, # ÄŸ -> ğ (ISO-8859-1 control variant)
    @{ From = (New-StrFromCodepoints @(0x00C5, 0x0178)); To = (New-StrFromCodepoints @(0x015F)) }, # ÅŸ -> ş
    @{ From = (New-StrFromCodepoints @(0x00C5, 0x017E)); To = (New-StrFromCodepoints @(0x015E)) }, # Åž -> Ş
    @{ From = (New-StrFromCodepoints @(0x00C5, 0x009E)); To = (New-StrFromCodepoints @(0x015E)) }, # Åž -> Ş (ISO-8859-1 control variant)
    @{ From = (New-StrFromCodepoints @(0x00C5, 0x009F)); To = (New-StrFromCodepoints @(0x015F)) }, # ÅŸ -> ş (ISO-8859-1 control variant)
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x00A7)); To = (New-StrFromCodepoints @(0x00E7)) }, # Ã§ -> ç
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x2021)); To = (New-StrFromCodepoints @(0x00C7)) }, # Ã‡ -> Ç
    @{ From = (New-StrFromCodepoints @(0x00C3, 0x0087)); To = (New-StrFromCodepoints @(0x00C7)) }, # Ã‡ -> Ç (ISO-8859-1 control variant)
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x20AC, 0x201C)); To = (New-StrFromCodepoints @(0x2013)) }, # â€“ -> –
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x20AC, 0x201D)); To = (New-StrFromCodepoints @(0x2014)) }, # â€” -> —
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x20AC, 0x0153)); To = (New-StrFromCodepoints @(0x201C)) }, # â€œ -> “
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x20AC, 0x009D)); To = (New-StrFromCodepoints @(0x201D)) }, # â€� -> ”
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x0080, 0x0093)); To = (New-StrFromCodepoints @(0x2013)) }, # â -> – (ISO-8859-1 control variant)
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x0080, 0x009C)); To = (New-StrFromCodepoints @(0x201C)) }, # â -> “
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x0080, 0x009D)); To = (New-StrFromCodepoints @(0x201D)) }, # â -> ”
    @{ From = (New-StrFromCodepoints @(0x00E2, 0x0080, 0x0099)); To = (New-StrFromCodepoints @(0x2019)) }, # â -> ’
    @{ From = (New-StrFromCodepoints @(0x00C2, 0x00A9)); To = (New-StrFromCodepoints @(0x00A9)) }, # Â© -> ©
    @{ From = (New-StrFromCodepoints @(0x00C2, 0x00B0)); To = (New-StrFromCodepoints @(0x00B0)) }, # Â° -> °

    @{ From = (New-StrFromCodepoints @(0x017D, 0x00F8)); To = (New-StrFromCodepoints @(0x0130)) }, # Žø -> İ
    @{ From = (New-StrFromCodepoints @(0x017D, 0x00F1)); To = (New-StrFromCodepoints @(0x0131)) }, # Žñ -> ı
    @{ From = (New-StrFromCodepoints @(0x00C7, 0x006F)); To = (New-StrFromCodepoints @(0x00DC)) }, # Ço -> Ü
    @{ From = (New-StrFromCodepoints @(0x00C7, 0x00AC)); To = (New-StrFromCodepoints @(0x00FC)) }, # Ç¬ -> ü
    @{ From = (New-StrFromCodepoints @(0x00C7, 0x00F4)); To = (New-StrFromCodepoints @(0x00F6)) }, # Çô -> ö
    @{ From = (New-StrFromCodepoints @(0x00C7, 0x00F5)); To = (New-StrFromCodepoints @(0x00E7)) }, # Çõ -> ç
    @{ From = (New-StrFromCodepoints @(0x017D, 0x0059)); To = (New-StrFromCodepoints @(0x011F)) }, # ŽY -> ğ
    @{ From = (New-StrFromCodepoints @(0x008F, 0x0059)); To = (New-StrFromCodepoints @(0x015F)) }, # \x8F Y -> ş
    @{ From = (New-StrFromCodepoints @(0x00B6, 0x00B8)); To = (New-StrFromCodepoints @(0x00A9)) }, # ¶¸ -> ©
    @{ From = (New-StrFromCodepoints @(0x00B6, 0x00F8)); To = (New-StrFromCodepoints @(0x00B0)) }, # ¶ø -> °
    @{ From = (New-StrFromCodepoints @(0x0192, 0x003F, 0x0022)); To = (New-StrFromCodepoints @(0x2013)) } # ƒ?" -> –
  )

  foreach ($pair in $map) {
    $text = $text.Replace($pair.From, $pair.To)
  }

  # Programmatic fixes for common single/double-mojibake of Turkish letters.
  # Example: Ü (UTF-8) -> "Ãœ" (cp1252 decode) -> "ÃƒÅ“" (saved as UTF-8, decoded as cp1252).
  $turkishCodepoints = @(
    0x00E7, 0x00C7, # ç Ç
    0x011F, 0x011E, # ğ Ğ
    0x0131, 0x0130, # ı İ
    0x00F6, 0x00D6, # ö Ö
    0x015F, 0x015E, # ş Ş
    0x00FC, 0x00DC  # ü Ü
  )

  foreach ($cp in $turkishCodepoints) {
    $to = [string][char]$cp
    foreach ($enc in @($enc1252, $enc1254)) {
      $b1 = $utf8NoBom.GetBytes($to)
      $moji1 = $enc.GetString($b1)
      if ($moji1 -and $moji1 -ne $to) { $text = $text.Replace($moji1, $to) }

      $b2 = $utf8NoBom.GetBytes($moji1)
      $moji2 = $enc.GetString($b2)
      if ($moji2 -and $moji2 -ne $to -and $moji2 -ne $moji1) { $text = $text.Replace($moji2, $to) }

      $b3 = $utf8NoBom.GetBytes($moji2)
      $moji3 = $enc.GetString($b3)
      if ($moji3 -and $moji3 -ne $to -and $moji3 -ne $moji2) { $text = $text.Replace($moji3, $to) }
    }
  }

  return $text
}

function Count-Codepoint([string]$text, [int]$codepoint) {
  $count = 0
  foreach ($ch in $text.ToCharArray()) {
    if ([int][char]$ch -eq $codepoint) { $count++ }
  }
  return $count
}

function Get-TextScore([string]$s) {
  if ($null -eq $s) { return -999999 }

  $replacement = Count-Codepoint $s 0xFFFD
  $c1controls = 0
  foreach ($ch in $s.ToCharArray()) {
    $cp = [int][char]$ch
    if ($cp -ge 0x80 -and $cp -le 0x9F) { $c1controls++ }
  }

  # Common mojibake markers (UTF-8 decoded as Windows-1252, then saved again)
  $suspicious = 0
  $suspicious += Count-Codepoint $s 0x00C3 # U+00C3
  $suspicious += Count-Codepoint $s 0x00C2 # U+00C2
  $suspicious += Count-Codepoint $s 0x00C4 # U+00C4
  $suspicious += Count-Codepoint $s 0x00C5 # U+00C5
  $suspicious += Count-Codepoint $s 0x00E2 # U+00E2

  # Turkish letters (both cases) as a quality hint
  $turkish = 0
  $turkish += Count-Codepoint $s 0x00E7
  $turkish += Count-Codepoint $s 0x011F
  $turkish += Count-Codepoint $s 0x0131
  $turkish += Count-Codepoint $s 0x0130
  $turkish += Count-Codepoint $s 0x00F6
  $turkish += Count-Codepoint $s 0x015F
  $turkish += Count-Codepoint $s 0x00FC
  $turkish += Count-Codepoint $s 0x00C7
  $turkish += Count-Codepoint $s 0x011E
  $turkish += Count-Codepoint $s 0x00D6
  $turkish += Count-Codepoint $s 0x015E
  $turkish += Count-Codepoint $s 0x00DC

  # Higher is better
  return (200 * $turkish) - (2000 * $replacement) - (50 * $c1controls) - (10 * $suspicious)
}

function Try-DecodeUtf8Strict([byte[]]$bytes) {
  try { return $utf8Strict.GetString($bytes) } catch { return $null }
}

function Try-DecodeBytes([byte[]]$bytes, [System.Text.Encoding]$enc) {
  try { return $enc.GetString($bytes) } catch { return $null }
}

function Try-Demojibake1252ToUtf8([string]$s) {
  try {
    $b = $enc1252.GetBytes($s)
    return $utf8Strict.GetString($b)
  } catch {
    return $null
  }
}

function Try-DemojibakeToUtf8([string]$s, [System.Text.Encoding]$enc) {
  try {
    $b = $enc.GetBytes($s)
    return $utf8Strict.GetString($b)
  } catch {
    return $null
  }
}

function Ensure-Utf8Meta([string]$html) {
  if ($null -eq $html) { return $html }

  $rx = "(?i)<meta\s+charset\s*=\s*[`"]?utf-8[`"]?\s*/?>"
  $matches = [regex]::Matches($html, $rx)

  if ($matches.Count -eq 1) { return $html }

  $clean = [regex]::Replace($html, $rx, "")
  if ($clean -match "(?i)<head\b[^>]*>") {
    return [regex]::Replace($clean, "(?i)(<head\b[^>]*>)", "`$1`r`n    <meta charset=`"UTF-8`" />", 1)
  }

  return $clean
}

function Should-ExcludePath([string]$fullPath, [string[]]$excludeDirs) {
  if (-not $excludeDirs -or $excludeDirs.Count -eq 0) { return $false }
  $p = $fullPath.ToLowerInvariant()
  foreach ($d in $excludeDirs) {
    if (-not $d) { continue }
    $token = ("\" + $d + "\").ToLowerInvariant()
    if ($p.Contains($token)) { return $true }
  }
  return $false
}

function Get-Files([string]$root, [string[]]$exts, [string[]]$excludeDirs) {
  $filters = $exts | ForEach-Object { "*.$_" }
  $files = New-Object System.Collections.Generic.List[System.IO.FileInfo]
  foreach ($filter in $filters) {
    Get-ChildItem -LiteralPath $root -Recurse -File -Filter $filter -ErrorAction SilentlyContinue | ForEach-Object {
      if (-not (Should-ExcludePath $_.FullName $excludeDirs)) { $files.Add($_) }
    }
  }
  return $files
}

if (-not (Test-Path -LiteralPath $Root)) {
  throw "Root not found: $Root"
}

$targets = Get-Files $Root $Extensions $ExcludeDirs
Write-Host ("Scanning {0} files under {1}..." -f $targets.Count, $Root)

$changed = 0
$mojibakeFixed = 0
$ansiToUtf8Fixed = 0
$metaInjected = 0

foreach ($file in $targets) {
  $path = $file.FullName
  $bytes = [System.IO.File]::ReadAllBytes($path)

  $textUtf8 = Try-DecodeUtf8Strict $bytes
  $final = $null
  $reason = $null

  if ($null -ne $textUtf8) {
    $best = $textUtf8
    $bestScore = Get-TextScore $textUtf8

    # Some files end up "double-mojibaked" (e.g., Ü -> Ãœ -> ÃƒÅ“). Try multiple passes and keep the best result.
    foreach ($enc in @($enc1252, $enc1254)) {
      $cand = $textUtf8
      for ($pass = 1; $pass -le 3; $pass++) {
        $cand = Try-DemojibakeToUtf8 $cand $enc
        if ($null -eq $cand) { break }
        $score = Get-TextScore $cand
        if ($score -gt $bestScore) {
          $best = $cand
          $bestScore = $score
          $reason = ("demojibake:{0}:cp{1}" -f $pass, $enc.CodePage)
        }
      }
    }

    $final = $best
  } else {
    $as1254 = Try-DecodeBytes $bytes $enc1254
    $as1252 = Try-DecodeBytes $bytes $enc1252

    $best = $as1254
    if ((Get-TextScore $as1252) -gt (Get-TextScore $as1254)) { $best = $as1252 }

    $final = $best
    $reason = "ansi-to-utf8"
  }

  if ($null -eq $final) { continue }

  $final = Apply-KnownTokenFixes $final

  if ($file.Extension.ToLowerInvariant() -eq ".html") {
    $withMeta = Ensure-Utf8Meta $final
    if ($withMeta -ne $final) {
      $final = $withMeta
      $metaInjected++
    }
  }

  $shouldWrite = $false
  if ($null -eq $textUtf8) { $shouldWrite = $true }
  elseif ($reason -eq "demojibake") { $shouldWrite = $true }
  elseif ($final -ne $textUtf8) { $shouldWrite = $true }

  if ($shouldWrite) {
    if (-not $WhatIf) {
      [System.IO.File]::WriteAllText($path, $final, $utf8Bom)
    }
    $changed++
    if ($reason -eq "demojibake") { $mojibakeFixed++ }
    if ($reason -eq "ansi-to-utf8") { $ansiToUtf8Fixed++ }
  }
}

Write-Host ("Done. Changed: {0} | demojibake: {1} | ansi-to-utf8: {2} | meta injected: {3}" -f $changed, $mojibakeFixed, $ansiToUtf8Fixed, $metaInjected)
