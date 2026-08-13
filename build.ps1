# build.ps1 — genera dist/Cortes_Transparentes.html autocontenido (sin Node)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# Versión: contador que se incrementa automáticamente en cada build (queda en VERSION)
$versionFile = "$root\VERSION"
$version = 0
if (Test-Path $versionFile) { $version = [int](Get-Content $versionFile -Raw).Trim() }
$version++
Set-Content -Path $versionFile -Value $version -NoNewline -Encoding ascii
$versionStr = "v$version"

$react    = [IO.File]::ReadAllText("$root\vendor\react.production.min.js")
$reactDom = [IO.File]::ReadAllText("$root\vendor\react-dom.production.min.js")
$babel    = [IO.File]::ReadAllText("$root\vendor\babel.min.js")
$app      = [IO.File]::ReadAllText("$root\src\app.jsx")
$tpl      = [IO.File]::ReadAllText("$root\src\template.html")

# Defensa: evitar que un "</script" dentro del JS cierre el bloque antes de tiempo
$app = $app.Replace("</script", "<\/script")
$app = $app.Replace("__APP_VERSION__", $versionStr)

$out = $tpl.Replace("/*__REACT__*/",    $react)
$out = $out.Replace("/*__REACTDOM__*/", $reactDom)
$out = $out.Replace("/*__BABEL__*/",    $babel)
$out = $out.Replace("/*__APP__*/",      $app)

# UTF-8 CON BOM para que los acentos se rendericen bien
$enc = New-Object System.Text.UTF8Encoding($true)

# 1) HTML autocontenido de doble clic (file://) — el SW se omite solo en este modo
# Lleva el número de versión en el nombre porque se comparte a mano (correo, USB, etc.),
# sin URL fija que sirva siempre la última versión como sí tiene la PWA.
$distDir = "$root\dist"
if (-not (Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir | Out-Null }
$dest = "$distDir\Cortes_Transparentes_$versionStr.html"
[IO.File]::WriteAllText($dest, $out, $enc)
$kb = [Math]::Round((Get-Item $dest).Length / 1KB)
Write-Host "OK -> $dest ($kb KB) [$versionStr]" -ForegroundColor Green

# 2) index.html de la PWA (mismo contenido; se sirve por http(s) junto a sw.js/manifest/icons)
$pwaDir = "$root\pwa"
if (-not (Test-Path $pwaDir)) { New-Item -ItemType Directory -Path $pwaDir | Out-Null }
$pwaDest = "$pwaDir\index.html"
[IO.File]::WriteAllText($pwaDest, $out, $enc)
$kb2 = [Math]::Round((Get-Item $pwaDest).Length / 1KB)
Write-Host "OK -> $pwaDest ($kb2 KB)" -ForegroundColor Green
