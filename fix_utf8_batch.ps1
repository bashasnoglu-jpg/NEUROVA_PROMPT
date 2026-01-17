$root = "C:\dev\NEUROVA_PROMPT_FRESH\NEUROVA_SITE"
$files = Get-ChildItem -Path $root -Include *.html -Recurse

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $hasCharset = $content -match "<meta\s+charset"
    
    if (-not $hasCharset) {
        Write-Host "Fixing charset in: $($f.Name)"
        # Simple injection after <head>
        if ($content -match "<head>") {
            $content = $content -replace "<head>", "<head>`n  <meta charset=`"UTF-8`">"
            [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        }
        else {
            Write-Host "Warning: No <head> tag found in $($f.Name)"
        }
    }
    else {
        # Ensure it is saved as UTF-8 even if tag exists (fixes ANSI saved files)
        # We read it raw, now write it back as UTF-8
        # But we need to be careful not to double-encode or mess up.
        # If it reads correctly as string, writing it back as UTF-8 fixes the file encoding.
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "All EN/TR pages scan & fix complete."
