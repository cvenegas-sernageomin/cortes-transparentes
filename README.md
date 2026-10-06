# Cortes Transparentes · Petrografía (PWA)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23196784.svg)](https://doi.org/10.5281/zenodo.23196784)

Editor petrográfico de cortes transparentes (secciones delgadas): imágenes PPL/XPL,
minerales con propiedades ópticas, alteración, metadatos con coordenadas UTM,
descripción asistida por IA, reporte de texto y exportación a **KMZ** y **Shapefile**.

App web progresiva (PWA): **instalable** en móvil y escritorio y con **uso offline**.

## Uso

Visítala en GitHub Pages y, en Chrome/Edge, pulsa **Instalar app**
(en Android/iOS: *Agregar a pantalla de inicio*).

- La función **Descripción con IA** requiere pegar tu propia API key de Anthropic
  (pestaña *IA*); se guarda solo en tu navegador.
- La exportación KMZ/SHP y los íconos requieren conexión la primera vez; luego
  quedan disponibles offline.

## Estructura

- `index.html` — la app completa (React + Babel embebidos).
- `manifest.webmanifest` — manifiesto de la PWA.
- `sw.js` — service worker (precache del shell + cache de dependencias CDN).
- `icons/` — íconos 192 / 512 / maskable.

> El código fuente (componente React + scripts de build PowerShell) se mantiene
> aparte; este repositorio contiene la app ya empaquetada para servir por HTTPS.

## Licencia y cómo citar

© 2026 SERNAGEOMIN / Carlos Venegas Benavides. El trabajo original de este repositorio se distribuye bajo
**[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.es)**: se puede compartir y adaptar
**citando la fuente** y **sin fines comerciales**. Ver [`LICENSE`](LICENSE).

Las librerías de terceros incluidas (por ejemplo en `vendor/`) conservan sus propias licencias.

Cita sugerida:

> SERNAGEOMIN / Venegas Benavides, C. (2026). Cortes Transparentes: editor petrográfico [aplicación web]. https://cvenegas-sernageomin.github.io/cortes-transparentes/ · DOI: https://doi.org/10.5281/zenodo.23196784
