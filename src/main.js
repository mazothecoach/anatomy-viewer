import './style.css';
import { createViewer } from './viewer.js';
import {
  renderInfo, clearInfo, buildList, setActiveListItem, wireControls,
  setStatus, showEmpty, showProgress, applyStaticStrings
} from './ui.js';
import { setLang, tf } from './i18n.js';

import muscles from './data/muscles.json';
import bones from './data/bones.json';

// ── Datos ──────────────────────────────────────────────────────────────────
// En Fase 0 los JSON están vacíos; el resolver devuelve null y al hacer clic
// se resalta la malla y se muestra su nombre crudo. El contenido se llena
// tras verificar el spike de mallas de Z-Anatomy (no antes — ver PLAN.md §8).
const structures = [...muscles, ...bones];

function normalize(s) {
  return (s || '').toLowerCase().replace(/[_\-./]/g, ' ')
    .replace(/^(musculus|os|m\.?\s|the\s)/g, '')
    .replace(/\s+(dexter|sinister|left|right|l|r|sin|dex)$/g, '')
    .replace(/\s+/g, ' ').trim();
}

// Índice nombre-de-malla(normalizado) → estructura, a partir de meshNames.
const meshIndex = new Map();
structures.forEach(s => (s.meshNames || []).forEach(mn => meshIndex.set(normalize(mn), s)));
function resolveMesh(meshName) {
  return meshIndex.get(normalize(meshName)) || null;
}

// ── Idioma ──────────────────────────────────────────────────────────────────
setLang('es');
applyStaticStrings();

// ── Visor ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const viewer = createViewer(canvas, {
  onSelect(sel) {
    if (!sel) { clearInfo(); setActiveListItem(null); return; }
    renderInfo(sel.struct, sel.meshName);
    setActiveListItem(sel.struct ? sel.struct.id : null);
  }
});

let linkedIds = new Set();

function refreshList() {
  buildList(structures, linkedIds, (s) => {
    if (viewer.highlightById(s.id)) {
      renderInfo(s, (s.meshNames || [])[0] || '');
    } else {
      renderInfo(s, tf({ es: '(no está en el modelo actual)', en: '(not in current model)' }));
    }
    setActiveListItem(s.id);
  });
}

function relabelUI() {
  applyStaticStrings();
  refreshList();
  clearInfo();
}

const ui = wireControls({
  viewer,
  getStructures: () => structures,
  onLayer: () => {},
  onLang: () => { relabelUI(); ui.repaintViewBtn(); setStatusForModel(); }
});

clearInfo();
refreshList();

// ── Carga del modelo ──────────────────────────────────────────────────────────
// Sample para el spike: cualquier .glb en /public/models. Reemplazar por el
// modelo Z-Anatomy comprimido cuando el spike de mallas esté verificado.
const MODEL_URL = `${import.meta.env.BASE_URL}models/sample.glb`;
let modelLoaded = false;

function setStatusForModel() {
  if (modelLoaded) {
    const linked = linkedIds.size;
    setStatus('status_loaded', 'ok');
    document.getElementById('status').textContent += ` · ${viewer.getMeshNames().length} meshes · ${linked} linked`;
  } else {
    setStatus('status_no_model');
  }
}

setStatus('status_loading');
showProgress(true, 0);
viewer.loadModel(MODEL_URL, { onProgress: p => showProgress(true, p) })
  .then(meshNames => {
    viewer.applyResolver(resolveMesh);
    linkedIds = new Set(meshNames.map(resolveMesh).filter(Boolean).map(s => s.id));
    viewer.setLayer('muscle');
    modelLoaded = true;
    showProgress(false);
    showEmpty(false);
    refreshList();
    setStatusForModel();
    console.info(`[spike] ${meshNames.length} mallas cargadas. Ejemplos:`, meshNames.slice(0, 20));
  })
  .catch(err => {
    console.warn('No se pudo cargar el modelo de muestra:', err);
    showProgress(false);
    showEmpty(true);
    setStatus('status_no_model');
  });
