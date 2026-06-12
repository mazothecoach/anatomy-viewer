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
    psl_note: 'Nota de coaching',
    location: 'Ubicación',
    about_label: 'Acerca de',
    about_title: 'Acerca de / Créditos',
    about_content: 'Visor educativo SIN FINES DE LUCRO de Mazothecoach. Parte del contenido de entrenamiento está informado por el método Pre-Script (Dr. Jordan Shallow); el resto proviene de fuentes estándar de anatomía y ciencias del ejercicio y de interpretación propia. No reproduce ningún manual ni implica afiliación.',
    about_model: 'Modelo anatómico 3D: Z-Anatomy (CC BY-SA 4.0), derivado de BodyParts3D.',
    about_original: 'Contenido educativo © Mazothecoach. Uso educativo, sin fines de lucro.',
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
    hide_vessels: 'Ocultar vasos/nervios',
    knee_flex: 'Flexión rodilla',
    mode_morphology: 'Morfología',
    pick_morphology: 'Elige un tema de morfología para ver cómo cambia el entrenamiento.',
    mode_exercise: 'Ejercicio',
    pick_exercise: 'Elige un ejercicio para ver qué músculo trabaja y dónde sentirlo.',
    empty_exercises: 'Aún no hay ejercicios cargados.',
    where_to_feel: '¿Dónde lo deberías sentir?',
    target_muscle: 'Músculo objetivo',
    loaded_zone: 'Zona cargada',
    secondary_muscles: 'Músculos secundarios',
    notes_label: 'Notas',
    articulates: 'Articula con',
    mode_movement: 'Movimiento',
    pick_movement: 'Elige una articulación para ver sus rangos y qué huesos se mueven.',
    joint_type: 'Tipo',
    range_of_motion: 'Rango de movimiento',
    moves_label: 'mueve',
    coupled_motion: 'Movimiento acoplado',
    plane_sagittal: 'Sagital',
    plane_frontal: 'Frontal',
    plane_transverse: 'Transverso',
    animate_label: 'Animar movimiento',
    animate_hint: 'Mueve el pie: flexión plantar ↔ dorsiflexión',
    animate_loading: 'Cargando la pierna para animar…'
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
    psl_note: 'Coaching note',
    location: 'Location',
    about_label: 'About',
    about_title: 'About / Credits',
    about_content: 'NOT-FOR-PROFIT educational viewer by Mazothecoach. Some of the training content is informed by the Pre-Script method (Dr. Jordan Shallow); the rest comes from standard anatomy and exercise-science sources and original interpretation. It does not reproduce any manual and implies no affiliation.',
    about_model: '3D anatomical model: Z-Anatomy (CC BY-SA 4.0), derived from BodyParts3D.',
    about_original: 'Educational content © Mazothecoach. Educational, not-for-profit use.',
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
    hide_vessels: 'Hide vessels/nerves',
    knee_flex: 'Knee flex',
    mode_morphology: 'Morphology',
    pick_morphology: 'Pick a morphology topic to see how it changes training.',
    mode_exercise: 'Exercise',
    pick_exercise: 'Pick an exercise to see which muscle it works and where to feel it.',
    empty_exercises: 'No exercises loaded yet.',
    where_to_feel: 'Where should you feel it?',
    target_muscle: 'Target muscle',
    loaded_zone: 'Loaded zone',
    secondary_muscles: 'Secondary muscles',
    notes_label: 'Notes',
    articulates: 'Articulates with',
    mode_movement: 'Movement',
    pick_movement: 'Pick a joint to see its ranges and which bones move.',
    joint_type: 'Type',
    range_of_motion: 'Range of motion',
    moves_label: 'moves',
    coupled_motion: 'Coupled motion',
    plane_sagittal: 'Sagittal',
    plane_frontal: 'Frontal',
    plane_transverse: 'Transverse',
    animate_label: 'Animate movement',
    animate_hint: 'Move the foot: plantarflexion ↔ dorsiflexion',
    animate_loading: 'Loading the leg to animate…'
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
