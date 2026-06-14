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
const LOWER_BODY_RE = /femur|tibia|fibula|patella|gluteus|adductor|gracilis|sartorius|tensor_fasc|vastus|rectus_femoris|biceps_femoris|semitendinosus|semimembranosus|iliopsoas|piriformis|deep_external|hip_bone|sacrum|coccyx|pubis|ischium|ilium|psoas|rectus_abdom|abdominal_oblique|transverse_abdom|quadratus|erector|multifidus|longissimus|iliocostalis|spinalis|diaphragm|\brib|sternum|costal|lumbar_vertebra|thoracic_vertebra|hallucis|digitorum_longus|digitorum_brevis|peroneus|tibialis|gastrocnem|soleus/i;
// Brazo: huesos (húmero, radio, cúbito, mano) + músculos del brazo/antebrazo + deltoides.
// NO incluye pec/dorsal/manguito (se anclan al tronco/escápula y se estirarían en lámina).
const ARM_RE = /humerusr|radiusr|ulnar|deltoid|biceps_brachii|triceps_brachii|brachialis|coracobrachialis|brachioradialis|pronator|supinator|flexor_carpi|extensor_carpi|flexor_digitorum_superficialis|flexor_digitorum_profundus|extensor_digitorum_muscle|extensor_digiti_minimi|extensor_indicis|flexor_pollicis|extensor_pollicis|abductor_pollicis|palmaris|anconeus|carpal|capitate|hamate|lunate|pisiform|scaphoid|triquetrum|trapezium|trapezoid|metacarp|lumbrical|interossei|opponens|adductor_pollicis|_of_hand/i;

// Articulaciones animables sobre el cuerpo completo + ambos lados.
// moving/pivot = patrones de nombre de malla; el visor filtra además por LADO
// (signo de X) para mover solo una extremidad. edge = borde Y del hueso de
// referencia donde se coloca el pivote. signs[i] = sentido de giro por movimiento
// (mismo orden que joints.json). axis se deriva del plano de cada movimiento.
const ARTICULABLE = {
  ankle: {
    pivot: /tibiar|fibular/i, edge: 'min', below: true, // mueve todo el pie (bloque)
    signs: [-1, 1, 1, -1]
  },
  knee: {
    pivot: /femurr/i, edge: 'min', below: true, also: /patell/i, // pierna baja + pie + rótula (bloque)
    signs: [1, 1, 1, -1] // flexión: talón hacia atrás/arriba (verificado)
  },
  hip: {
    pivot: /femurr/i, edge: 'max', below: true, // toda la pierna (hueso+músculo+bandas) como bloque
    exclude: /hip_bone|sacrum|coccyx|pubic_sympys|^Ilium|Ischium|Pubis/i, // pelvis y axial se quedan fijos
    signs: [-1, 1, 1, -1, 1, -1] // flexión: pierna adelante (verificado)
  },
  glenohumeral: {
    // Solo el brazo (huesos + músculos del brazo). NO pec/dorsal/manguito (láminas
    // que se anclan al tronco y se estirarían). El conectivo se excluye global.
    pivot: /humerusr/i, edge: 'max', moving: ARM_RE, exclude: LOWER_BODY_RE,
    signs: [-1, 1, 1, -1, 1, -1] // flexión: brazo adelante (verificado)
  },
  scapulothoracic: {
    // Complejo del hombro (escápula + manguito + deltoides + brazo) se mueve junto.
    pivot: /scapular(?!is)/i, edge: 'max',
    moving: /scapular|supraspinatus|infraspinatus|teres_minor|teres_major|subscapularis|serratus|clavicler|deltoid/i,
    also: ARM_RE, exclude: LOWER_BODY_RE,
    signs: [1, -1, 1, -1, 1, -1]
  }
};
const planeAxis = p => (p === 'frontal' ? 'z' : (p === 'transverse' ? 'y' : 'x'));

function onPickJoint(joint) {
  const art = ARTICULABLE[joint.id];
  renderJoint(joint, structById, !!art);
  openInfoPanel();
  setLayerUI(null); // huesos + músculos juntos (se mueven en conjunto)
  if (!modelLoaded) return;
  // Articula sobre UN lado (el visor filtra por signo de X) del cuerpo completo.
  const ok = art && viewer.setupArticulation({ movingRe: art.moving, pivotRe: art.pivot, edge: art.edge, side: 'R', below: art.below, box: art.box, alsoRe: art.also, excludeRe: art.exclude });
  if (!ok) { viewer.highlightMany(joint.bones || []); return; }
  const sl = document.getElementById('joint-animate');
  const movEls = document.querySelectorAll('#info .mov-sel');
  let active = { axis: 'x', sign: 1, rom: 20 };
  // Fija el tope del rango (cambia con el acoplamiento) y vuelve a neutral.
  function applyRom(rom) {
    active.rom = rom;
    if (sl) { sl.max = rom; sl.value = 0; }
    const mn = document.getElementById('anim-min'), mx = document.getElementById('anim-max');
    if (mn) mn.textContent = '0°';
    if (mx) mx.textContent = rom + '°';
    viewer.setFlex(0, active.axis);
  }
  function selectMov(i) {
    const m = joint.movements[i];
    active = { axis: planeAxis(m.plane), sign: (art.signs && art.signs[i]) || 1, rom: m.romDeg || 1 };
    movEls.forEach((el, j) => el.classList.toggle('active', j === i));
    applyRom(m.romDeg || 1);
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
  // slider: 0 (izquierda) → límite del rango del movimiento (derecha)
  if (sl) sl.oninput = e => viewer.setFlex(Number(e.target.value) * active.sign, active.axis);
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
