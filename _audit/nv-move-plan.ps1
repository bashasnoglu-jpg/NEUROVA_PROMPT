$ErrorActionPreference="Stop"
# NV MOVE PLAN v1.0
# 1) Creates needed folders
New-Item -ItemType Directory -Force -Path "NEUROVA_PROMPT" | Out-Null
New-Item -ItemType Directory -Force -Path "NEUROVA_PROMPT\assets" | Out-Null
New-Item -ItemType Directory -Force -Path "NEUROVA_PROMPT\packs" | Out-Null

# 2) Moves / renames
Move-Item -LiteralPath "NEUROVA_PROMPT\packs" -Destination "NEUROVA_PROMPT\assets\packs" -Force
Move-Item -LiteralPath "health-check.js" -Destination "NEUROVA_PROMPT\health-check.js" -Force
Move-Item -LiteralPath "packs\manifest.json" -Destination "NEUROVA_PROMPT\assets\manifest.json" -Force
Move-Item -LiteralPath "packs\pack.ayurveda.js" -Destination "NEUROVA_PROMPT\packs\pack.ayurveda.js" -Force
Move-Item -LiteralPath "packs\pack.flow.v1.js" -Destination "NEUROVA_PROMPT\packs\pack.flow.v1.js" -Force
Move-Item -LiteralPath "packs\pack.hamam.js" -Destination "NEUROVA_PROMPT\packs\pack.hamam.js" -Force
Move-Item -LiteralPath "packs\pack.kids.js" -Destination "NEUROVA_PROMPT\packs\pack.kids.js" -Force
Move-Item -LiteralPath "packs\pack.kids.premium.js" -Destination "NEUROVA_PROMPT\packs\pack.kids.premium.js" -Force
Move-Item -LiteralPath "packs\pack.recovery.js" -Destination "NEUROVA_PROMPT\packs\pack.recovery.js" -Force
Move-Item -LiteralPath "packs\pack.signature-family-teen.js" -Destination "NEUROVA_PROMPT\packs\pack.signature-family-teen.js" -Force
Move-Item -LiteralPath "packs\pack.teen.js" -Destination "NEUROVA_PROMPT\packs\pack.teen.js" -Force
Move-Item -LiteralPath "prompt-export.js" -Destination "NEUROVA_PROMPT\prompt-export.js" -Force
Move-Item -LiteralPath "prompt-library.html" -Destination "NEUROVA_PROMPT\prompt-library.html" -Force
Move-Item -LiteralPath "prompts-data.js" -Destination "NEUROVA_PROMPT\prompts-data.js" -Force
Move-Item -LiteralPath "prompts-loader.js" -Destination "NEUROVA_PROMPT\prompts-loader.js" -Force

Write-Host "NV MOVE PLAN complete."
