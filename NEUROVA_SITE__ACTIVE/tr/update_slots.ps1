$path = "C:\dev\NEUROVA_PROMPT_FRESH\NEUROVA_SITE\tr"
$files = Get-ChildItem -Path $path -Filter *.html
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content -match "app\.js" -and $content -notmatch "nv-slots\.js") {
        # Regex to capture the script tag parts
        # Matches: <script src="[PATH]app.js" defer></script>
        # Captures: 1=<script src=", 2=[PATH], 3=app.js" defer></script>
        $pattern = '(<script src=")(.*?)(app\.js" defer></script>)'
        
        if ($content -match $pattern) {
            $newContent = $content -replace $pattern, '$1$2nv-slots.js"></script>
    $1$2$3'
            
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Fixed: $($file.Name)"
        } else {
            Write-Warning "Skipped (Pattern mismatch): $($file.Name)"
        }
    }
}
