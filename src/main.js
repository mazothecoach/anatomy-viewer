import './style.css';
import { params, validLang } from './params.js';
import { createViewer } from './viewer.js';
import {
  renderInfo, clearInfo, buildList, setActiveListItem, applySearchFilter,
  buildRegionTabs, renderHighlightSummary, renderMorphology, renderExercise, renderJoint, wireControls,
  setStatus, showEmpty, showProgress, applyStaticStrings, openInfoPanel
} from './ui.js';
import { setLang, t, tf } from './i18n.js';

import muscles from './data/muscles.json';
import bones from './data/bones.json';
import painZones from './data/painZones.json';
import physiqueGoals from './data/physiqueGoals.json';
import morphology from './data/morphology.json';
import exercises from './data/exercises.json';
import joints from './data/joints.json';
import muscleGroups from './data/muscleGroups.json';
import exerciseGroups from './data/exerciseGroups.json';

// ── Datos ──────────────────────────────────────────────────────────────────
const structures = [...muscles, ...bones];
const structById = new Map(structures.map(s => [s.id, s]));

const REGION_ORDER = ['shoulder', 'arm', 'core', 'hip', 'thigh', 'leg'];
const presentRegions = REGION_ORDER.filter(r => structures.some(s => s.region === r));

function normalize(s) {
  return (s || '').toLowerCase().replace(/[_\-./]/g, ' ')
    .replace(/^(musculus|os|m\.?\s|the\s)/g, '')
    .replace(/\s+(dexter|sinister|left|right|l|r|sin|dex)$/g, '')
    .replace(/\s+/g, ' ').trim();
}
const meshIndex = new Map();
structures.forEach(s => (s.meshNames || []).forEach(mn => meshIndex.set(normalize(mn), s)));
function resolveMesh(meshName) { return meshIndex.get(normalize(meshName)) || null; }

// ── Búsqueda coloquial: "bíceps", "espalda", "gemelo" → grupo de músculos ─────
const stripAccents = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const normTerm = s => stripAccents((s || '').toLowerCase()).trim();
const COLLOQUIAL = muscleGroups.map(g => ({
  ids: g.muscleIds,
  keys: [normTerm(g.term), ...(g.aliases || []).map(normTerm)]
}));
// Devuelve los ids del mejor grupo que matchea el término coloquial, o null.
function resolveColloquial(query) {
  const q = normTerm(query);
  if (q.length < 2) return null;
  let g = COLLOQUIAL.find(x => x.keys.includes(q));                       // exacto
  if (!g && q.length >= 3) g = COLLOQUIAL.find(x => x.keys.some(k => k.startsWith(q))); // prefijo
  return g ? g.ids : null;
}
// Búsqueda del sidebar: SOLO filtra la lista de nombres seleccionables (por grupo
// coloquial o por texto). NO toca la figura 3D: el cuerpo se queda completo.
function handleSearch(query) {
  const ids = resolveColloquial(query);
  applySearchFilter(query, ids ? new Set(ids) : undefined);
}

// ── Estado de UI ─────────────────────────────────────────────────────────────
let activeRegion = presentRegions.includes(params.region) ? params.region : null;
let linkedIds = new Set();
let modelLoaded = false;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const mqNarrow = window.matchMedia('(max-width: 760px)');

// ── Idioma + clases de embebido (antes de crear el visor) ────────────────────
setLang(validLang(params.lang) || 'es');
if (params.compact) document.body.classList.add('compact');
if (params.minimal) document.body.classList.add('minimal');
if (params.bg) document.body.style.background = '#' + params.bg.replace(/^#/, '');
applyStaticStrings();
applyHudTouch();

// ── Visor ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const viewer = createViewer(canvas, {
  isMobile: isTouch,
  onSelect(sel) {
    if (!sel) { clearInfo(); setActiveListItem(null); return; }
    renderInfo(sel.struct, sel.meshName);
    setActiveListItem(sel.struct ? sel.struct.id : null);
    openInfoPanel();
  }
});
if (params.debug) window.__viewer = viewer; // inspector temporal de verificación

// ── Lista + región ────────────────────────────────────────────────────────────
function refreshList() {
  const filtered = structures.filter(s => !activeRegion || s.region === activeRegion);
  buildList(filtered, linkedIds, onListPick);
  applySearchFilter(document.getElementById('search').value);
}
function onListPick(s) {
  if (viewer.highlightById(s.id)) {
    renderInfo(s, (s.meshNames || [])[0] || '');
  } else {
    renderInfo(s, tf({ es: '(no está en el modelo)', en: '(not in model)' }));
  }
  setActiveListItem(s.id);
  openInfoPanel();
  if (mqNarrow.matches) ui.closeDrawer();
}
function onRegion(region) {
  activeRegion = region;
  if (region) viewer.isolateRegion(s => s.region === region);
  else viewer.clearIsolation();
  refreshList();
}

// ── Dolor / Físico ────────────────────────────────────────────────────────────
function applyHighlightSet(item, field) {
  const ids = item[field] || [];
  if (modelLoaded) viewer.highlightMany(ids);
  const missing = ids.filter(id => !linkedIds.has(id));
  renderHighlightSummary(item, structById, missing);
  openInfoPanel();
}
function onPickPain(zone) { applyHighlightSet(zone, 'strengthen'); }
function onPickPhysique(goal) { applyHighlightSet(goal, 'targetMuscles'); }
function onPickMorphology(item) { renderMorphology(item); openInfoPanel(); }
function onPickExercise(ex) {
  // resalta el primario + los secundarios juntos
  if (modelLoaded && ex.primaryMuscle) {
    viewer.highlightMany([ex.primaryMuscle, ...(ex.secondaryMuscles || [])]);
  }
  renderExercise(ex, structById);
  openInfoPanel();
}
function setLayerUI(layer) {
  document.getElementById('layer-muscle').classList.toggle('active', layer === 'muscle');
  document.getElementById('layer-bone').classList.toggle('active', layer === 'bone');
  viewer.setLayer(layer);
}
// Excluir tren inferior + core/axial al articular el brazo (por si el patrón roza otra zona).
const LOWER_BODY_RE = /femur|tibia|fibula|patella|gluteus|adductor(?!_pollicis)|gracilis|sartorius|tensor_fasc|vastus|rectus_femoris|biceps_femoris|semitendinosus|semimembranosus|iliopsoas|piriformis|deep_external|hip_bone|sacrum|coccyx|pubis|ischium|ilium|acetabul|psoas|rectus_abdom|abdominal_oblique|transverse_abdom|quadratus_lumborum|erector|multifidus|longissimus|iliocostalis|spinalis|diaphragm|\brib|sternum|costal|lumbar_vertebra|thoracic_vertebra|hallucis|digitorum_longus|digitorum_brevis|peroneus|tibialis|gastrocnem|soleus|_of_foot/i;

// ── Regex por segmento (validados contra los NOMBRES REALES de los GLB) ──────
// Regla de saneo de THREE: espacios→_, se eliminan puntos; paréntesis y guiones
// se conservan ("Radius.r"→"Radiusr", "Cervical vertebra (C3)"→"Cervical_vertebra_(C3)").
// OJO PIE vs MANO: las falanges del PIE también se llaman "finger"
// ("Distal_phalanx_of_fifth_finger_of_footr") → siempre finger(?!_of_foot).
// "lumbrical/interossei/opponens" sueltas matchean músculos del PIE — nunca sueltas.

// Mano completa: huesos del carpo/metacarpo/falanges + músculos intrínsecos.
const HAND_RE = /scaphoid|lunate_bone|triquetrum|pisiform|trapeziumr|trapezoidr|capitater|hamater|metacarp|finger(?!_of_foot)|_of_hand|opponens_pollicis|palmaris_brevis|adductor_pollicis|abductor_pollicis_brevis|flexor_pollicis_brevis|abductor_digiti_minimir|sesamoid_bones_of_hand/i;
// Conectivo de mano/muñeca que DEBE viajar con la mano (force-include vía alsoRe):
// la "manopla" de ligamentos carpianos y sus cartílagos, que si no queda flotando.
const HAND_SOFT_RE = /finger(?!_of_foot)|radiocarpal|intercarpal|carpometacarpal|ulnocarpal|scapholunate|lunotriquetral|capitohamate|trapezio|trapezoideocapitate|triquetrocapitate|triquetrohamate|scaphocapitate|radioscaphocapitate|radiate_carpal|pisohamate|pisometacarpal|pisotriquetral|ulnopisiform|ulnotriquetral|metacarpal_lig|metacarpophalangeal|art_cart_of_(scaphoid|lunate|triquetrum|pisiform|trapezium|trapezoid|capitate|hamate)|art_carts_of_(distal|middle|proximal)_phalanges|art_carts_of_metacarpal|(carpi|digitorum|indicis|pollicis)[\w-]*_tendon_sheath|interphalangeal|phalangeal_joint|scaphotriquetral|collateral_ligament_of_wrist|intertendinous_connections_of_extensor_digitorum|common_flexor_tendon_sheath/i;
// Antebrazo + mano (para el codo). extensor_digitorumr (sufijo pegado) distingue
// el del antebrazo del Extensor_digitorum_longusr del pie.
const FOREARM_HAND_RE = new RegExp('radiusr|ulnar|brachioradialis|pronator|supinator|anconeus|flexor_carpi|extensor_carpi|palmaris|flexor_digitorum_superficialis|flexor_digitorum_profundus|extensor_digitorumr|extensor_digiti_minimi|extensor_indicis|flexor_pollicis|extensor_pollicis|abductor_pollicis|' + HAND_RE.source, 'i');
// Conectivo del antebrazo que viaja con él al flexionar el codo (incluye los
// cartílagos distales de radio/cúbito y el disco TFCC, que en la muñeca se
// quedan con el antebrazo pero en codo/hombro/tronco viajan con el brazo).
const ELBOW_SOFT_RE = new RegExp('interosseous_membrane_of_forearm|radio-ulnar|art_cart_of_radius|art_cart_of_ulna|triangular_fibro|' + HAND_SOFT_RE.source, 'i');
// Radioulnar (prono-supinación): el RADIO rueda + la mano. SIN pronator quadratus
// (ancla también al cúbito) y sin el resto del antebrazo.
const RADIOULNAR_RE = new RegExp('radiusr|' + HAND_RE.source, 'i');
// Cervical (whitelist del modo above): el modelo NO tiene cráneo ni músculos del
// cuello — solo vértebras C1–C7 + discos + cartílagos.
const HEAD_NECK_RE = /atlas_\(c1\)|axis_\(c2\)|cervical_vertebra|annulus_fibrosus_c|art_cart_of_(atlas|axis)|vertebra_c\d_art_cart|nucleus_pulposus_c2/i;

// Brazo COMPLETO (hombro/escápula y exclude de cadera): huesos + músculos del
// brazo/antebrazo/mano + deltoides. NO pec/dorsal/manguito (anclan al tronco).
const ARM_RE = new RegExp('humerusr|deltoid|biceps_brachii|triceps_brachii|brachialis|coracobrachialis|' + FOREARM_HAND_RE.source, 'i');
// Brazo + su conectivo forzado (also del hombro/escápula).
const ARM_SOFT_RE = new RegExp(ARM_RE.source + '|' + ELBOW_SOFT_RE.source, 'i');

// Articulaciones animables sobre el cuerpo completo + ambos lados.
// moving/pivot = patrones de nombre de malla; el visor filtra además por LADO
// (signo de X) para mover solo una extremidad. edge = borde Y del hueso de
// referencia donde se coloca el pivote. signs[i] = sentido de giro por movimiento
// (mismo orden que joints.json). axis se deriva del plano de cada movimiento.
const ARTICULABLE = {
  ankle: {
    // Pivote en el TOPE del astrágalo (= articulación del tobillo). Con tibia/peroné
    // 'min' los maléolos bajan tanto que el corte dejaba medio pie fuera.
    pivot: /talusr/i, edge: 'max', below: true, // mueve TODO el pie como bloque
    signs: [-1, 1, 1, -1]
  },
  knee: {
    pivot: /femurr/i, edge: 'min', below: true, also: /patell/i, // pierna baja + pie + rótula (bloque)
    signs: [1, 1, -1, 1] // flexión verificada; rotaciones: interna = dedos a medial (verificado)
  },
  hip: {
    pivot: /femurr/i, edge: 'max', below: true, // toda la pierna (hueso+músculo+bandas) como bloque
    // Pelvis/axial fijos + brazo/mano excluidos: la mano en reposo cuelga casi a la
    // altura de la cabeza femoral (pivote), así que "todo lo de abajo" la atrapaba
    // sin querer (se movía junto con la pierna). ARM_RE cubre húmero/antebrazo/mano.
    exclude: new RegExp(`hip_bone|sacrum|coccyx|pubic_sympys|^Ilium|Ischium|Pubis|${ARM_RE.source}`, 'i'),
    signs: [-1, 1, 1, -1, -1, 1] // flexión verificada; rot interna = dedos a medial (verificado)
  },
  glenohumeral: {
    // Solo el brazo (huesos + músculos del brazo). NO pec/dorsal (láminas que se
    // anclan al tronco). El manguito viaja en el pivote SECUNDARIO (escápula),
    // que gira ⅓ del ángulo en flexión/abducción = ritmo escápulo-humeral 2:1.
    pivot: /humerusr/i, edge: 'max', moving: ARM_RE, also: ELBOW_SOFT_RE, exclude: LOWER_BODY_RE,
    secondary: {
      pivotRe: /scapular(?!is)/i,
      movingRe: /scapular(?!is)|clavicler|supraspinatus|infraspinatus|teres_minor|teres_major|subscapularis/i
    },
    rhythm: [1 / 3, 0, 1 / 3, 0, 0, 0], // flexión y abducción; el resto solo glenohumeral
    signs: [-1, 1, 1, -1, -1, 1] // flexión verificada; rot interna = palma hacia atrás (verificado)
  },
  scapulothoracic: {
    // Complejo del hombro (escápula + manguito + deltoides + brazo) se mueve junto.
    pivot: /scapular(?!is)/i, edge: 'max',
    moving: /scapular|supraspinatus|infraspinatus|teres_minor|teres_major|subscapularis|serratus|clavicler|deltoid/i,
    also: ARM_SOFT_RE, exclude: LOWER_BODY_RE,
    signs: [1, -1, 1, -1, 1, -1]
  },
  elbow: {
    // Pivote = borde inferior del húmero (línea del codo). Por NOMBRE, no below:
    // la pierna derecha también está "debajo del codo" del mismo lado. Bíceps,
    // tríceps y braquial se quedan con el húmero (cruzan la articulación).
    pivot: /humerusr/i, edge: 'min',
    moving: FOREARM_HAND_RE, also: ELBOW_SOFT_RE, exclude: LOWER_BODY_RE,
    signs: [-1, -1] // flexión; extensión (rom 0) anima el retorno de la flexión
  },
  radioulnar: {
    // Aproximación: el radio + la mano rotan sobre el eje vertical del radio.
    // El cúbito y el resto del antebrazo quedan fijos (como en la realidad).
    pivot: /radiusr/i, edge: 'min',
    moving: RADIOULNAR_RE, also: HAND_SOFT_RE, exclude: LOWER_BODY_RE,
    signs: [-1, 1] // pronación / supinación
  },
  wrist: {
    // Pivote = borde inferior del radio (estiloides). Mueve SOLO la mano.
    pivot: /radiusr/i, edge: 'min',
    moving: HAND_RE, also: HAND_SOFT_RE, exclude: LOWER_BODY_RE,
    signs: [-1, 1, 1, -1] // flexión / extensión / desviación radial / cubital
  },
  lumbar_spine: {
    // COLUMNA (modo above): todo lo de encima del sacro se mueve como tronco —
    // incluye brazos (forzados por nombre: las manos cuelgan bajo el pivote).
    pivot: /^Sacrum$/i, edge: 'max', above: true,
    also: new RegExp('annulus_fibrosus_l5_s1|lumbar_vertebra_\\(l5\\)|' + ARM_SOFT_RE.source, 'i'),
    exclude: /hip_boner|coccyx|femurr|gluteus/i,
    signs: [1, -1, -1, 1] // invertidos vs extremidades: lo móvil está ENCIMA del pivote
  },
  thoracic_spine: {
    pivot: /^Lumbar_vertebra_\(L1\)$/i, edge: 'max', above: true,
    also: new RegExp('annulus_fibrosus_t12_l1|' + ARM_SOFT_RE.source, 'i'),
    exclude: /hip_boner|coccyx|femurr|gluteus/i,
    signs: [1, -1, -1, 1]
  },
  cervical_spine: {
    // Whitelist: solo vértebras C + discos (el modelo no tiene cráneo ni músculos
    // del cuello; sin whitelist el trapecio giraría con el cuello).
    pivot: /^Thoracic_vertebra_\(T1\)$/i, edge: 'max', above: true,
    moving: HEAD_NECK_RE, also: HEAD_NECK_RE,
    signs: [1, -1, -1, 1]
  }
};
const planeAxis = p => (p === 'frontal' ? 'z' : (p === 'transverse' ? 'y' : 'x'));

function onPickJoint(joint) {
  const art = ARTICULABLE[joint.id];
  renderJoint(joint, structById, !!art);
  openInfoPanel();
  setLayerUI(null); // huesos + músculos juntos (se mueven en conjunto)
  if (!modelLoaded) return;
  if (!art) {
    // Sin animación: resetea cualquier rotación previa (si no, la última
    // articulación quedaba "trabada" en su posición girada) y solo resalta.
    viewer.teardownFlex();
    viewer.highlightMany(joint.bones || []);
    return;
  }
  const ok = viewer.setupArticulation({
    movingRe: art.moving, pivotRe: art.pivot, edge: art.edge, side: 'R',
    below: art.below, above: art.above, alsoRe: art.also, excludeRe: art.exclude,
    secondary: art.secondary
  });
  if (!ok) { viewer.highlightMany(joint.bones || []); return; }
  const sl = document.getElementById('joint-animate');
  const movEls = document.querySelectorAll('#info .mov-sel');
  let active = { axis: 'x', sign: 1, rom: 20, inverted: false, rhythm: 0 };
  // Aplica un ángulo del slider: signo + reparto del ritmo escápulo-humeral.
  function setDeg(v) {
    const deg = v * active.sign;
    viewer.setFlex(deg, active.axis, deg * (active.rhythm || 0));
  }
  // Fija el tope del rango (cambia con el acoplamiento) y vuelve a la pose inicial.
  // En movimientos invertidos (extensión 0°) el slider corre de ROM° → 0°:
  // arranca en la pose flexionada y el máximo endereza la extremidad.
  function applyRom(rom) {
    active.rom = rom;
    if (sl) { sl.max = rom; sl.value = 0; }
    const mn = document.getElementById('anim-min'), mx = document.getElementById('anim-max');
    if (mn) mn.textContent = (active.inverted ? rom : 0) + '°';
    if (mx) mx.textContent = (active.inverted ? 0 : rom) + '°';
    setDeg(active.inverted ? rom : 0);
  }
  function selectMov(i) {
    const m = joint.movements[i];
    let rom = m.romDeg, sign = (art.signs && art.signs[i]) || 1, inverted = false;
    if (!rom) {
      // Extensión con ROM 0 (posición neutra): anima el RETORNO del movimiento
      // pareja del mismo plano (ej. rodilla: 140° flexionada → 0° recta).
      const p = joint.movements.findIndex(mm => mm.plane === m.plane && mm.romDeg > 0);
      if (p !== -1) {
        rom = joint.movements[p].romDeg;
        sign = (art.signs && art.signs[p]) || 1;
        inverted = true;
      } else rom = 1;
    }
    active = { axis: planeAxis(m.plane), sign, rom, inverted, rhythm: (art.rhythm && art.rhythm[i]) || 0 };
    movEls.forEach((el, j) => el.classList.toggle('active', j === i));
    applyRom(rom);
    // Acoplamiento: si el rango depende de otra articulación, muestra opciones.
    const cc = document.getElementById('coupling-ctrl');
    if (!cc) return;
    cc.innerHTML = '';
    if (!m.coupling) return;
    const lbl = document.createElement('span');
    lbl.className = 'coupling-label';
    lbl.textContent = tf(m.coupling.label) + ':';
    cc.appendChild(lbl);
    m.coupling.options.forEach((o, oi) => {
      const b = document.createElement('button');
      b.className = 'coupling-opt' + (oi === 0 ? ' active' : '');
      b.textContent = `${tf(o.name)} (${o.romDeg}°)`;
      b.onclick = () => {
        cc.querySelectorAll('.coupling-opt').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        applyRom(o.romDeg);
      };
      cc.appendChild(b);
    });
    const note = document.createElement('div');
    note.className = 'coupling-note';
    note.textContent = tf(m.coupling.note);
    cc.appendChild(note);
    applyRom(m.coupling.options[0].romDeg); // por defecto la 1ª opción
  }
  movEls.forEach((el, i) => { el.onclick = () => selectMov(i); });
  // slider: izquierda → derecha recorre el rango; en invertidos va de ROM° a 0°.
  if (sl) sl.oninput = e => {
    const v = Number(e.target.value);
    setDeg(active.inverted ? active.rom - v : v);
  };
  if (movEls.length) selectMov(0);
}

function onMode(mode) {
  // Movimiento muestra huesos + músculos JUNTOS (se mueven en conjunto); los
  // botones Músculos/Huesos sirven para "pelar" la vista y ver el detalle adentro.
  setLayerUI(mode === 'movement' ? null : 'muscle');
  // al volver a Explorar, re-aplica el aislamiento de región si lo había
  if (mode === 'explore' && activeRegion) viewer.isolateRegion(s => s.region === activeRegion);
}

// ── HUD táctil ────────────────────────────────────────────────────────────────
function applyHudTouch() {
  if (isTouch) document.getElementById('hud').textContent = t('hud_touch');
}

// ── Cableado ───────────────────────────────────────────────────────────────────
function relabelUI() {
  applyStaticStrings();
  applyHudTouch();
  buildRegionTabs(presentRegions, activeRegion, onRegion);
  refreshList();
  ui.repaintViewBtn();
  ui.setMode(ui.getMode());
  setStatusForModel();
}

const ui = wireControls({
  viewer,
  onLayer: () => {},
  onLang: relabelUI,
  initialMode: params.mode === 'client' ? 'client' : 'coach',
  onMode,
  onRegion,
  painZones,
  physiqueGoals,
  morphology,
  exercises,
  joints,
  onPickPain,
  onPickPhysique,
  onPickMorphology,
  onPickExercise,
  onPickJoint,
  onListPick,
  exGroups: exerciseGroups,
  onSearch: handleSearch
});

buildRegionTabs(presentRegions, activeRegion, onRegion);
clearInfo();
refreshList();

mqNarrow.addEventListener('change', () => viewer.fit());

// ── Carga del modelo ──────────────────────────────────────────────────────────
// Vista principal: SIEMPRE cuerpo completo + ambos lados (espejo), vasos ocultos.
const FULL_BODY = ['models/sample.glb', 'models/lower-limb.glb', 'models/abdomen.glb']; // superior + inferior + core
const modelSelect = document.getElementById('model-select');
// Los modelos de músculo vienen de un lado y se reflejan; el esqueleto ya es bilateral.
const shouldMirror = url => !/overview-skeleton/.test(url);

function setStatusForModel() {
  if (modelLoaded) {
    setStatus('status_loaded', 'ok');
    document.getElementById('status').textContent += ` · ${viewer.getMeshNames().length} meshes · ${linkedIds.size} linked`;
  } else {
    setStatus('status_no_model');
  }
}

function currentLayer() {
  return document.getElementById('layer-bone').classList.contains('active') ? 'bone' : 'muscle';
}

function selectedUrls() {
  const v = modelSelect.value;
  const rel = v === '__full__' ? FULL_BODY : [v];
  return rel.map(r => `${import.meta.env.BASE_URL}${r}`);
}

function loadCurrent(urls) {
  setStatus('status_loading');
  showProgress(true, 0);
  modelLoaded = false;
  const list = urls || selectedUrls();
  const mirror = list.some(shouldMirror); // ambos lados siempre (salvo esqueleto)
  return viewer.loadModels(list, { mirror, onProgress: p => showProgress(true, p) })
    .then(meshNames => {
      viewer.applyResolver(resolveMesh);
      linkedIds = new Set(meshNames.map(resolveMesh).filter(Boolean).map(s => s.id));
      viewer.setLayer(currentLayer());
      viewer.setHideVessels(true); // vasos/nervios siempre ocultos
      viewer.setHideFascia(!document.getElementById('show-fascia')?.checked); // fascia oculta salvo toggle
      if (activeRegion) viewer.isolateRegion(s => s.region === activeRegion);
      modelLoaded = true;
      showProgress(false);
      showEmpty(false);
      refreshList();
      setStatusForModel();
      console.info(`[model] ${meshNames.length} mallas, ${linkedIds.size} enlazadas.`);
    })
    .catch(err => {
      console.warn('No se pudo cargar el modelo:', err);
      showProgress(false);
      showEmpty(true);
      setStatus('status_no_model');
    });
}

// El esqueleto es solo huesos: hay que verlo en capa 'bone' (en 'muscle' se
// ocultan todos los huesos enlazados y "solo se ven unos huesos").
modelSelect.addEventListener('change', () => {
  if (modelSelect.value === 'models/overview-skeleton.glb') setLayerUI('bone');
  loadCurrent();
});

// Fascia: oculta por defecto (deja seleccionar músculos); el toggle la muestra.
document.getElementById('show-fascia').addEventListener('change', e => viewer.setHideFascia(!e.target.checked));

if (params.model) loadCurrent([params.model]);
else loadCurrent(); // por defecto: cuerpo completo + ambos lados
