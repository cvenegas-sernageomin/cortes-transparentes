# Cortes transparentes — notas para Claude

Editor petrográfico: HTML único offline + PWA. Repo `cvenegas-sernageomin/cortes-transparentes`
→ https://cvenegas-sernageomin.github.io/cortes-transparentes/
Ficha en memoria: `proyecto-cortes-transparentes` (y skill de petrografía en `_opencode/skill/petrografia`).

## Reglas
- **`src/app.jsx` es la única fuente**; `build.ps1` genera `dist/Cortes_Transparentes_v{N}.html` (N = contador en `VERSION`) y `pwa/index.html`.
- Al cambiar la PWA, subir `CACHE` en `pwa/sw.js`.
- Las anotaciones usan el esquema `{geom, pts:[...]}`; cualquier código que cree anotaciones debe usarlo (el esquema viejo `{x,y}` causó pantalla blanca en producción).
- Si dos subagentes tocan el mismo componente, van en secuencia, no en paralelo.
- Commit + push solo con confirmación del usuario.

## Verificar
`serve.ps1` sirve local. Verificar con casos reales (ej. eliminar+deshacer una muestra completa), no solo el caso fácil.
