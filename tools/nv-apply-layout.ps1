$ErrorActionPreference="Stop"

function Ensure-Dir($p){ New-Item -ItemType Directory -Force -Path $p | Out-Null }
function Move-IfExists($from, $toDir){
  if (Test-Path -LiteralPath $from){
    Ensure-Dir $toDir
    $name = Split-Path -Leaf $from
    $dest = Join-Path $toDir $name
    Write-Host "MOVE: $from -> $dest"
    Move-Item -LiteralPath $from -Destination $dest -Force
  }
}

# 0) Safety backup
$stamp = Get-Date -Format "yyyyMMdd_HHmm"
Ensure-Dir ".\_backup"
$zip = ".\_backup\NEUROVA_repo_$stamp.zip"
if (!(Test-Path $zip)){
  Write-Host "BACKUP: $zip"
  Compress-Archive -Path ".\*" -DestinationPath $zip -Force
}

# 1) Layout
Ensure-Dir ".\NEUROVA_SITE"
Ensure-Dir ".\NEUROVA_SITE\assets\css"
Ensure-Dir ".\NEUROVA_SITE\assets\js"
Ensure-Dir ".\NEUROVA_SITE\assets\img"
Ensure-Dir ".\NEUROVA_SITE\assets\icons"

Ensure-Dir ".\NEUROVA_PROMPT"
Ensure-Dir ".\NEUROVA_PROMPT\packs"
Ensure-Dir ".\NEUROVA_PROMPT\tools"
Ensure-Dir ".\NEUROVA_PROMPT\assets\css"
Ensure-Dir ".\NEUROVA_PROMPT\assets\img"

# 2) Move site html
Get-ChildItem -File -Filter *.html -Path . | ForEach-Object {
  if ($_.Name -ieq "prompt-library.html") { return }
  Move-IfExists $_.FullName ".\NEUROVA_SITE"
}

# 3) Move site assets
Move-IfExists ".\style.css" ".\NEUROVA_SITE\assets\css"
Move-IfExists ".\tokens.css" ".\NEUROVA_SITE\assets\css"
Move-IfExists ".\app.js" ".\NEUROVA_SITE\assets\js"
Move-IfExists ".\nav.js" ".\NEUROVA_SITE\assets\js"

# 4) Prompt files
Move-IfExists ".\prompt-library.html" ".\NEUROVA_PROMPT"
Move-IfExists ".\prompts-loader.js" ".\NEUROVA_PROMPT"
Move-IfExists ".\health-check.js" ".\NEUROVA_PROMPT"

# 5) packs dir
if (Test-Path ".\packs"){
  Write-Host "MOVE DIR: .\packs -> .\NEUROVA_PROMPT\packs"
  Get-ChildItem ".\packs" -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring((Resolve-Path ".\packs").Path.Length).TrimStart("\")
    $dest = Join-Path (Resolve-Path ".\NEUROVA_PROMPT\packs").Path $rel
    Ensure-Dir (Split-Path $dest -Parent)
    Copy-Item -LiteralPath $_.FullName -Destination $dest -Force
  }
  Remove-Item ".\packs" -Recurse -Force
}

Write-Host "`nDONE: layout applied."
Write-Host "Next: node .\tools\nv-rewrite-site-links.js (optional) then node .\tools\nv-audit.js"
