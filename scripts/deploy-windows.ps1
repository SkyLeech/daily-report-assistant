$root = Split-Path -Parent $PSScriptRoot
$env:TEMP = Join-Path $root '.wrangler-tmp\temp'
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Path $env:TEMP -Force | Out-Null
Set-Location $root
npm run deploy
exit $LASTEXITCODE
