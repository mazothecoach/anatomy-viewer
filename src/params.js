// Parseo único de los parámetros de URL. Sin dependencias (se importa antes de three.js).
// Soporta embeber el visor en Notion / la página de Mazothecoach.
//
//   ?lang=es|en      idioma inicial
//   ?mode=client|coach   vista inicial
//   ?compact[=1]     oculta el sidebar izquierdo (iframe angosto)
//   ?minimal[=1]     solo 3D + ficha flotante
//   ?region=<id>     filtro de región inicial
//   ?model=<url>     reemplaza el modelo a cargar
//   ?bg=<hex>        color de fondo (sin #)

const sp = new URLSearchParams(window.location.search);

// Una bandera tipo ?compact o ?compact=1 → true; ausente o =0 → false.
function flag(name) {
  if (!sp.has(name)) return false;
  const v = sp.get(name);
  return v === '' || v === '1' || v === 'true';
}

export const params = Object.freeze({
  lang: sp.get('lang'),
  mode: sp.get('mode'),
  compact: flag('compact'),
  minimal: flag('minimal'),
  region: sp.get('region'),
  model: sp.get('model'),
  bg: sp.get('bg')
});

export function validLang(v) {
  return v === 'es' || v === 'en' ? v : null;
}
export function validMode(v) {
  return v === 'client' || v === 'coach' ? v : null;
}
