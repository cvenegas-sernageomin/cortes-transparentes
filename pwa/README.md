# Cortes Transparentes · Petrografía (PWA)

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
