# Deploy (latente hasta el cutover)

`deploy.yml` es el workflow de GitHub Actions que construye la app Vite y la publica en
GitHub Pages. **No está activo todavía** — vive aquí (fuera de `.github/workflows/`) a
propósito, porque el token actual de `gh` no tiene el scope `workflow` para subirlo.

## Para activarlo (cuando el contenido esté listo y queramos hacer cutover):

1. Re-autenticar gh con scope workflow (paso único):
   ```
   gh auth refresh -h github.com -s workflow
   ```
2. Mover el archivo a su lugar:
   ```
   mkdir -p .github/workflows && git mv deploy/deploy.yml .github/workflows/deploy.yml
   git commit -m "Activate Pages deploy workflow" && git push
   ```
3. Mergear `vite-rebuild` → `main`.
4. En GitHub: **Settings → Pages → Source → "GitHub Actions"**.
   - Hasta este paso, el sitio legacy (visor de un solo archivo) sigue vivo.
   - Rollback = volver Source a "Deploy from a branch".

## Preservar el visor legacy (antes del merge a main)

Vite solo publica `dist/`. Los archivos en la raíz (`Anatomy_Viewer.html`, `models/`)
desaparecerían tras el cutover. Para conservarlos accesibles en `…/anatomy-viewer/legacy/`:

```
git mv Anatomy_Viewer.html public/legacy/index.html
git mv models public/legacy/models
```
(y ajustar en el legacy las rutas `models/X.glb` → `./models/X.glb`)
