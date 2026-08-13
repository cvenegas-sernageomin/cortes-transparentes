# serve.ps1 — sirve la PWA en http://localhost:8080 para probarla/instalarla
$ErrorActionPreference = "Stop"
$pwa = Join-Path $PSScriptRoot "pwa"
Write-Host "Sirviendo PWA en http://localhost:8080  (Ctrl+C para detener)" -ForegroundColor Cyan
Write-Host "Abre esa URL en Chrome/Edge y usa 'Instalar app'." -ForegroundColor Cyan
Set-Location $pwa
python -m http.server 8080
