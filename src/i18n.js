// Capa i18n mínima. Las cadenas de UI viven aquí; el contenido anatómico
// vive en los JSON de /src/data con claves { es, en } por campo.

const STRINGS = {
  es: {
    tagline: 'Músculos, huesos y rangos por ejercicio',
    view_toggle: 'Cambiar vista coach / cliente',
    view_coach: 'Coach',
    view_client: 'Cliente',
    status_no_model: 'Sin modelo',
    status_loading: 'Cargando…',
    status_loaded: 'Modelo cargado',
    status_failed: 'Error al cargar',
    layers: 'Capas',
    muscles: 'Músculos',
    bones: 'Huesos',
    search: 'Buscar',
    search_ph: 'Buscar estructura…',
    hud: 'Arrastrar = rotar · Rueda = zoom · Clic = seleccionar',
    reset: 'Reiniciar vista',
    fit: 'Encuadrar',
    empty_title: 'Aún no hay modelo cargado',
    empty_body: 'Coloca un .glb en /public/models y recarga, o usa el spike de Fase 0.',
    credit: 'Modelo anatómico basado en',
    select_prompt: 'Selecciona una estructura para ver su información.',
    no_data: 'Sin ficha en la base de datos para esta malla.',
    origin: 'Origen',
    insertion: 'Inserción',
    action: 'Acción',
    function: 'Función',
    innervation: 'Inervación',
    example: 'Ejercicio',
    forcecurve: 'Curva de fuerza — longitud por posición',
    zone_short: 'Acortado',
    zone_mid: 'Medio',
    zone_long: 'Alargado',
    cap_short: 'músculo contraído',
    cap_mid: 'tensión pico',
    cap_long: 'músculo estirado',
    psl_note: 'Nota PSL',
    location: 'Ubicación',
    mode_explore: 'Explorar',
    mode_pain: 'Dolor',
    mode_physique: 'Físico',
    region: 'Región',
    region_all: 'Todo',
    region_shoulder: 'Hombro',
    region_arm: 'Brazo',
    region_core: 'Core',
    region_hip: 'Cadera',
    region_thigh: 'Muslo',
    region_leg: 'Pierna',
    pick_pain: 'Elige una zona de dolor para ver qué músculos fortalecer.',
    pick_physique: 'Elige un objetivo para ver qué músculos trabajar.',
    rationale: 'Por qué',
    muscles_highlighted: 'Músculos resaltados',
    not_in_model: 'no está en el modelo',
    empty_painzones: 'Aún no hay zonas de dolor cargadas.',
    empty_physique: 'Aún no hay objetivos cargados.',
    sidebar_toggle: 'Menú',
    close: 'Cerrar',
    info_panel: 'Información',
    hud_touch: 'Arrastrar = rotar · Pellizcar = zoom · Tocar = seleccionar',
    model_upper: 'Miembro superior',
    model_lower: 'Miembro inferior',
    model_skeleton: 'Esqueleto',
    model_full: 'Cuerpo completo',
    both_sides: 'Ambos lados',
    mode_morphology: 'Morfología',
    pick_morphology: 'Elige un tema de morfología para ver cómo cambia el entrenamiento.'
  },
  en: {
    tagline: 'Muscles, bones & ranges per exercise',
    view_toggle: 'Switch coach / client view',
    view_coach: 'Coach',
    view_client: 'Client',
    status_no_model: 'No model',
    status_loading: 'Loading…',
    status_loaded: 'Model loaded',
    status_failed: 'Load failed',
    layers: 'Layers',
    muscles: 'Muscles',
    bones: 'Bones',
    search: 'Search',
    search_ph: 'Find structure…',
    hud: 'Drag = rotate · Wheel = zoom · Click = select',
    reset: 'Reset view',
    fit: 'Fit',
    empty_title: 'No model loaded yet',
    empty_body: 'Drop a .glb into /public/models and reload, or use the Phase 0 spike.',
    credit: 'Anatomical model based on',
    select_prompt: 'Select a structure to see its information.',
    no_data: 'No database entry for this mesh.',
    origin: 'Origin',
    insertion: 'Insertion',
    action: 'Action',
    function: 'Function',
    innervation: 'Innervation',
    example: 'Exercise',
    forcecurve: 'Strength curve — length by position',
    zone_short: 'Shortened',
    zone_mid: 'Mid-range',
    zone_long: 'Lengthened',
    cap_short: 'muscle contracted',
    cap_mid: 'peak tension',
    cap_long: 'muscle stretched',
    psl_note: 'PSL note',
    location: 'Location',
    mode_explore: 'Explore',
    mode_pain: 'Pain',
    mode_physique: 'Physique',
    region: 'Region',
    region_all: 'All',
    region_shoulder: 'Shoulder',
    region_arm: 'Arm',
    region_core: 'Core',
    region_hip: 'Hip',
    region_thigh: 'Thigh',
    region_leg: 'Leg',
    pick_pain: 'Pick a pain zone to see which muscles to strengthen.',
    pick_physique: 'Pick a goal to see which muscles to train.',
    rationale: 'Why',
    muscles_highlighted: 'Highlighted muscles',
    not_in_model: 'not in model',
    empty_painzones: 'No pain zones loaded yet.',
    empty_physique: 'No goals loaded yet.',
    sidebar_toggle: 'Menu',
    close: 'Close',
    info_panel: 'Info',
    hud_touch: 'Drag = rotate · Pinch = zoom · Tap = select',
    model_upper: 'Upper limb',
    model_lower: 'Lower limb',
    model_skeleton: 'Skeleton',
    model_full: 'Full body',
    both_sides: 'Both sides',
    mode_morphology: 'Morphology',
    pick_morphology: 'Pick a morphology topic to see how it changes training.'
  }
};

let current = 'es';

export function getLang() { return current; }

export function setLang(lang) {
  current = STRINGS[lang] ? lang : 'es';
  document.documentElement.lang = current;
  applyStaticStrings();
  return current;
}

export function toggleLang() {
  return setLang(current === 'es' ? 'en' : 'es');
}

// t('key') → cadena de UI; tf(field) → resuelve un objeto { es, en } del contenido.
export function t(key) {
  return (STRINGS[current] && STRINGS[current][key]) || key;
}
export function tf(field) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[current] || field.es || field.en || '';
}

// Aplica las cadenas a todos los elementos con data-i18n / data-i18n-ph / data-i18n-title.
export function applyStaticStrings() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
}
