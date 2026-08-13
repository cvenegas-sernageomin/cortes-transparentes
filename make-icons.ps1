# make-icons.ps1 — genera los íconos PNG de la PWA con tema petrográfico (GDI+)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$iconDir = Join-Path $root "pwa\icons"
if (-not (Test-Path $iconDir)) { New-Item -ItemType Directory -Path $iconDir | Out-Null }

function New-Icon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  # Fondo a sangre (marrón) — válido para "any" y dentro de safe zone "maskable"
  $g.Clear([System.Drawing.Color]::FromArgb(122, 92, 46))

  $cx = $size / 2.0; $cy = $size / 2.0
  $r = [single]($size * 0.36)
  $rect = New-Object System.Drawing.RectangleF(($cx - $r), ($cy - $r), ($r * 2), ($r * 2))

  # Campo del microscopio (crema)
  $cream = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(248, 244, 236))
  $g.FillEllipse($cream, $rect)

  # Granos minerales con colores de interferencia, recortados al círculo
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddEllipse($rect)
  $g.SetClip($clip)

  $cols = @(
    [System.Drawing.Color]::FromArgb(235, 70, 120, 190),
    [System.Drawing.Color]::FromArgb(235, 200, 90, 150),
    [System.Drawing.Color]::FromArgb(235, 110, 165, 95),
    [System.Drawing.Color]::FromArgb(235, 225, 180, 70),
    [System.Drawing.Color]::FromArgb(235, 150, 110, 185),
    [System.Drawing.Color]::FromArgb(235, 90, 175, 175)
  )
  $rnd = New-Object System.Random 7
  for ($i = 0; $i -lt 16; $i++) {
    $gx = $cx + ($rnd.NextDouble() * 2 - 1) * $r
    $gy = $cy + ($rnd.NextDouble() * 2 - 1) * $r
    $gr = $r * (0.18 + $rnd.NextDouble() * 0.28)
    $nv = 5 + $rnd.Next(0, 3)
    $pts = New-Object 'System.Drawing.PointF[]' $nv
    $a0 = $rnd.NextDouble() * 6.283
    for ($k = 0; $k -lt $nv; $k++) {
      $ang = $a0 + ($k / [double]$nv) * 6.283
      $rad = $gr * (0.6 + $rnd.NextDouble() * 0.5)
      $pts[$k] = New-Object System.Drawing.PointF (
        [single]($gx + [math]::Cos($ang) * $rad),
        [single]($gy + [math]::Sin($ang) * $rad)
      )
    }
    $br = New-Object System.Drawing.SolidBrush $cols[$rnd.Next(0, $cols.Length)]
    $g.FillPolygon($br, $pts)
    $bpen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 45, 34, 24)), ([single]($size * 0.006))
    $g.DrawPolygon($bpen, $pts)
    $br.Dispose(); $bpen.Dispose()
  }
  $g.ResetClip()

  # Retícula de nícoles cruzados (cruz fina)
  $cross = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(150, 45, 34, 24)), ([single]($size * 0.012))
  $g.DrawLine($cross, [single]($cx - $r), [single]$cy, [single]($cx + $r), [single]$cy)
  $g.DrawLine($cross, [single]$cx, [single]($cy - $r), [single]$cx, [single]($cy + $r))

  # Anillo del ocular
  $ring = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(45, 34, 24)), ([single]($size * 0.026))
  $g.DrawEllipse($ring, $rect)

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $cream.Dispose(); $cross.Dispose(); $ring.Dispose(); $g.Dispose(); $bmp.Dispose()
}

New-Icon 192 (Join-Path $iconDir "icon-192.png")
New-Icon 512 (Join-Path $iconDir "icon-512.png")
New-Icon 512 (Join-Path $iconDir "icon-maskable-512.png")
Write-Host "Iconos generados en $iconDir" -ForegroundColor Green
