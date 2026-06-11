import { defineConfig } from 'vite';

// El sitio se sirve desde https://mazothecoach.github.io/anatomy-viewer/
// por lo que `base` debe coincidir con el nombre del repo para que las
// rutas a assets y modelos resuelvan en GitHub Pages.
export default defineConfig({
  base: '/anatomy-viewer/',
  build: {
    outDir: 'dist',
    target: 'es2020',
    assetsInlineLimit: 0
  },
  server: {
    open: true
  }
});
