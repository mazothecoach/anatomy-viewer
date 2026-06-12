import './style.css';
import { params, validLang } from './params.js';
import { createViewer } from './viewer.js';
import {
  renderInfo, clearInfo, buildList, setActiveListItem, applySearchFilter,
  buildRegionTabs, renderHighlightSummary, renderMorphology, renderExercise, wireControls,
  setStatus, showEmpty, showProgress, applyStaticStrings, openInfoPanel
} from './ui.js';
import { setLang, t, tf } from './i18n.js';

import muscles from './data/muscles.json';
import bones from './data/bones.json';
import painZones from './data/painZones.json';
import physiqueGoals from './data/physiqueGoals.json';
import morphology from './data/morphology.json';
import exercises from './data/exercises.json';

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
  if (modelLoaded && ex.primaryMuscle) viewer.highlightById(ex.primaryMuscle);
  renderExercise(ex, structById);
  openInfoPanel();
}

function onMode(mode) {
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
  onPickPain,
  onPickPhysique,
  onPickMorphology,
  onPickExercise,
  onListPick
});

buildRegionTabs(presentRegions, activeRegion, onRegion);
clearInfo();
refreshList();

mqNarrow.addEventListener('change', () => viewer.fit());

// ── Carga del modelo ──────────────────────────────────────────────────────────
const FULL_BODY = ['models/sample.glb', 'models/lower-limb.glb']; // superior + inferior
const modelSelect = document.getElementById('model-select');
const bothSides = document.getElementById('both-sides');

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
  const kf = document.getElementById('knee-flex'); if (kf) kf.value = '0';
  return viewer.loadModels(urls || selectedUrls(), { mirror: bothSides.checked, onProgress: p => showProgress(true, p) })
    .then(meshNames => {
      viewer.applyResolver(resolveMesh);
      linkedIds = new Set(meshNames.map(resolveMesh).filter(Boolean).map(s => s.id));
      viewer.setLayer(currentLayer());
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

// La flexión de rodilla sin rig solo se ve bien en una pierna sola:
// se oculta en cuerpo completo / ambos lados (donde se desbarata).
function updateFlexVisibility() {
  const ok = modelSelect.value === 'models/lower-limb.glb' && !bothSides.checked;
  document.getElementById('flex-control').style.display = ok ? '' : 'none';
}
modelSelect.addEventListener('change', () => { updateFlexVisibility(); loadCurrent(); });
bothSides.addEventListener('change', () => { updateFlexVisibility(); loadCurrent(); });

// Ocultar vasos/nervios
document.getElementById('hide-vessels').addEventListener('change', e => viewer.setHideVessels(e.target.checked));

// Flexión de rodilla (articulación básica del tren inferior, una pierna)
const kneeFlex = document.getElementById('knee-flex');
kneeFlex.addEventListener('input', e => viewer.setFlex(Number(e.target.value)));

updateFlexVisibility();
if (params.model) loadCurrent([params.model]);
else loadCurrent();
