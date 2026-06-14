import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const HIGHLIGHT_COLOR = new THREE.Color(0xc6ff3d);
const DIM_OPACITY = 0.18;

// createViewer: monta la escena Three.js sobre un <canvas> y expone una API
// para cargar modelos, taggear mallas con datos, filtrar por capa/región y
// resaltar una o varias estructuras a la vez.
export function createViewer(canvas, { onSelect, isMobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  camera.position.set(0, 1.2, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 1, 0);
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  canvas.style.touchAction = 'none';

  scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(2, 4, 3); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc6ff3d, 0.3); fill.position.set(-3, 2, -2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0x6ad1ff, 0.4); rim.position.set(0, 3, -5); scene.add(rim);

  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  // Decoder autohospedado en /public/draco para no depender de un CDN.
  draco.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  loader.setDRACOLoader(draco);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let model = null;
  let meshes = [];
  // Mapa malla→material original para soportar resaltado de múltiples mallas.
  const highlightedMap = new Map();
  let currentLayer = null;          // 'muscle' | 'bone' | null
  let currentRegionFilter = null;   // predicate(struct) → bool, o null
  let hideVessels = false;
  let hideFascia = true; // la fascia envuelve y tapa los músculos: oculta por defecto
  // Vasos y nervios (distraen): arterias, venas, plexos, raíces, redes/arcos vasculares.
  const VESSEL_RE = /artery|arteries|arterial|vein|veins|venous|\bvena\b|vascular|vessel|nerve|nervus|plexus|lymph|ganglion|c\d ?root|thyrocervical|costocervical|(palmar|plantar|venous|dorsal venous).{0,6}(arch|network)/i;
  // Fascia (envoltorio que estorba la selección). NO el músculo tensor fasciae latae.
  const FASCIA_RE = /(brachial|antebrachial|crural|thoracolumbar)_fascia|fascia_lata|deep_fascia|fascia_of|aponeuros|retinacul/i;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h || 1;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  window.addEventListener('orientationchange', () => { setTimeout(() => { resize(); fit(); }, 250); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resize);
  resize();

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();

  function clearModel() {
    teardownFlex();
    if (model) {
      scene.remove(model);
      model.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    }
    model = null; meshes = []; highlightedMap.clear();
  }

  function loadOne(url, onProgress) {
    return new Promise((resolve, reject) => {
      loader.load(url, g => resolve(g.scene),
        xhr => { if (onProgress && xhr.lengthComputable) onProgress(xhr.loaded / xhr.total); },
        reject);
    });
  }

  // Refleja una escena al lado contrario (plano sagital). Clona materiales a
  // DoubleSide para que la geometría con winding invertido no se descarte.
  function mirrorScene(src) {
    const m = src.clone(true);
    m.scale.x *= -1;
    m.traverse(o => {
      if (o.isMesh) {
        if (Array.isArray(o.material)) o.material = o.material.map(mt => { const c = mt.clone(); c.side = THREE.DoubleSide; return c; });
        else { o.material = o.material.clone(); o.material.side = THREE.DoubleSide; }
      }
    });
    return m;
  }

  // Carga uno o varios .glb en un grupo común. mirror=true añade el lado opuesto.
  function loadModels(urls, { onProgress, mirror = false } = {}) {
    clearModel();
    const root = new THREE.Group();
    model = root;
    scene.add(root);
    return Promise.all(urls.map(u => loadOne(u, onProgress))).then(scenes => {
      scenes.forEach(s => {
        root.add(s);
        if (mirror) root.add(mirrorScene(s));
      });
      meshes = [];
      root.traverse(o => {
        if (o.isMesh) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(mt => { mt.transparent = true; });
          meshes.push(o);
        }
      });
      frameModel();
      return meshes.map(m => m.name);
    });
  }
  function loadModel(url, opts) { return loadModels([url], opts); }

  // resolver(meshName) -> { id, layer, ... } | null
  function applyResolver(resolver) {
    meshes.forEach(m => { m.userData.struct = resolver ? resolver(m.name) : null; });
  }

  // ── Visibilidad: capa (músculo/hueso) ∩ región ───────────────────────────
  function layerOK(m) {
    const s = m.userData.struct;
    return !currentLayer || !s || s.layer == null || s.layer === currentLayer;
  }
  function regionOK(m) {
    if (!currentRegionFilter) return true;
    const s = m.userData.struct;
    return s ? !!currentRegionFilter(s) : false;
  }
  function vesselOK(m) {
    return !hideVessels || !VESSEL_RE.test((m.name || '').replace(/_/g, ' '));
  }
  function fasciaOK(m) {
    return !hideFascia || !FASCIA_RE.test(m.name || '');
  }
  function applyVisibility() {
    meshes.forEach(m => { m.visible = layerOK(m) && regionOK(m) && vesselOK(m) && fasciaOK(m); });
  }
  function setLayer(layer) { currentLayer = layer; applyVisibility(); }
  function isolateRegion(pred) { currentRegionFilter = pred; applyVisibility(); }
  function clearIsolation() { currentRegionFilter = null; applyVisibility(); }
  function setHideVessels(b) { hideVessels = b; applyVisibility(); }
  function setHideFascia(b) { hideFascia = b; applyVisibility(); }

  // ── Encuadre ──────────────────────────────────────────────────────────────
  function frameModel() {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    model.position.y += (size.y * scale) / 2;
    fit();
  }
  function fit() {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const dist = (maxDim / 2) / Math.tan((camera.fov * Math.PI / 180) / 2) * 1.8;
    camera.position.set(center.x, center.y, center.z + dist);
    controls.target.copy(center);
    controls.update();
  }
  function reset() {
    camera.position.set(0, 1.2, 3);
    controls.target.set(0, 1, 0);
    controls.update();
  }

  // ── Articulación sin rig: por REGIÓN + LADO, no por plano Y ──────────────────
  // El modelo es cuerpo completo con ambos lados (mallas espejo con el MISMO
  // nombre), así que filtrar "todo lo que está debajo de un Y" agarraría las dos
  // extremidades (efecto "Picasso"). En su lugar: elegimos las mallas que se
  // mueven por patrón de nombre Y por lado (signo de X en el mundo), y colocamos
  // el pivote en el borde del hueso de referencia de ESE lado.
  let flexPivot = null;
  const centerOf = (m, cache) => {
    if (cache.has(m)) return cache.get(m);
    const c = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());
    cache.set(m, c); return c;
  };

  // opts = { pivotRe, edge:'min'|'max', side:'L'|'R', movingRe?, below? }
  // below=true → mueve TODO el segmento distal del lado (por debajo del pivote en
  // Y), como bloque rígido (huesos + músculos + ligamentos), sin que se separen.
  // si no, mueve solo las mallas que matchean movingRe (para hombro/escápula).
  function setupArticulation(opts = {}) {
    teardownFlex();
    const { movingRe, pivotRe, edge = 'max', side = 'R', below = false, box = false, alsoRe, excludeRe } = opts;
    if (!model || !meshes.length || !pivotRe) return false;
    const wantSign = side === 'L' ? -1 : 1;
    const ctr = new Map();
    const EPS = 0.02; // umbral de línea media: estructuras axiales (sacro, columna) NO se articulan
    const onSide = m => { const x = centerOf(m, ctr).x; return Math.abs(x) > EPS && Math.sign(x) === wantSign; };
    const excl = m => excludeRe && excludeRe.test(m.name); // estructuras que se quedan fijas
    const also = m => alsoRe && alsoRe.test(m.name);
    // Hueso de referencia del lado elegido → define el centro del pivote.
    const ref = meshes.filter(m => pivotRe.test(m.name) && onSide(m));
    if (!ref.length) return false;
    const pbox = new THREE.Box3();
    ref.forEach(m => pbox.expandByObject(m));
    const pivotY = edge === 'min' ? pbox.min.y : pbox.max.y;
    const c = pbox.getCenter(new THREE.Vector3());
    flexPivot = new THREE.Group();
    model.add(flexPivot);
    flexPivot.position.copy(model.worldToLocal(new THREE.Vector3(c.x, pivotY, c.z)));
    let moving;
    if (box) {
      // Caja del segmento = bbox de las mallas nombradas; mueve TODO lo que cae
      // dentro (incluidas piezas sin nombre) para que nada quede volando.
      const named = meshes.filter(m => movingRe && movingRe.test(m.name) && onSide(m) && !excl(m));
      if (!named.length) return false;
      const seg = new THREE.Box3();
      named.forEach(m => seg.expandByObject(m));
      const sz = seg.getSize(new THREE.Vector3());
      seg.expandByScalar((Math.min(sz.x, sz.y, sz.z) || 0.1) * 0.2);
      moving = meshes.filter(m => onSide(m) && !excl(m) && (seg.containsPoint(centerOf(m, ctr)) || also(m)));
    } else if (below) {
      // Todo el bloque distal del lado (por debajo del pivote en Y) + extras.
      moving = meshes.filter(m => onSide(m) && !excl(m) && (centerOf(m, ctr).y < pivotY || also(m)));
    } else {
      moving = meshes.filter(m => movingRe && movingRe.test(m.name) && onSide(m) && !excl(m));
    }
    moving.forEach(m => flexPivot.attach(m));
    return moving.length > 0;
  }
  function setFlex(deg, axis) {
    if (!flexPivot) return false;
    flexPivot.rotation.set(0, 0, 0);
    flexPivot.rotation[axis === 'z' ? 'z' : axis === 'y' ? 'y' : 'x'] = deg * Math.PI / 180;
    return true;
  }
  function teardownFlex() {
    if (flexPivot && model) {
      // Vuelve a neutral ANTES de desenparentar: attach() conserva el transform
      // del mundo, así que si el pivote sigue rotado, las mallas se quedarían
      // trabadas en la posición girada al cambiar de articulación.
      flexPivot.rotation.set(0, 0, 0);
      flexPivot.updateMatrixWorld(true);
      [...flexPivot.children].forEach(ch => model.attach(ch));
      model.remove(flexPivot);
    }
    flexPivot = null;
  }

  // ── Resaltado (uno o varios) ────────────────────────────────────────────────
  function makeHighlightMat() {
    return new THREE.MeshStandardMaterial({
      color: HIGHLIGHT_COLOR, emissive: new THREE.Color(0x556a18),
      metalness: 0.1, roughness: 0.4, transparent: true, opacity: 1
    });
  }
  function dimAll() {
    meshes.forEach(m => (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => { mt.opacity = DIM_OPACITY; }));
  }
  function restoreAll() {
    meshes.forEach(m => (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => { mt.opacity = 1; }));
  }
  function clearHighlight() {
    highlightedMap.forEach((origMat, mesh) => {
      const cur = mesh.material;
      mesh.material = origMat;
      if (cur && cur !== origMat) cur.dispose(); // no fugar los materiales temporales
    });
    highlightedMap.clear();
    restoreAll();
  }
  function tint(mesh) {
    if (highlightedMap.has(mesh)) return;
    highlightedMap.set(mesh, mesh.material);
    mesh.material = makeHighlightMat();
  }
  function highlightMesh(mesh) {
    clearHighlight();
    if (!mesh) return;
    tint(mesh);
    dimAll();
    mesh.material.opacity = 1;
  }
  function highlightById(id) {
    const list = meshes.filter(m => m.userData.struct && m.userData.struct.id === id);
    if (!list.length) return false;
    clearHighlight();
    list.forEach(tint);
    dimAll();
    list.forEach(m => { m.material.opacity = 1; });
    return true;
  }
  // Resalta un conjunto de estructuras (por id) a la vez. Devuelve cuántas se tiñeron.
  function highlightMany(ids) {
    clearHighlight();
    const set = new Set(ids || []);
    const list = meshes.filter(m => m.userData.struct && set.has(m.userData.struct.id));
    if (!list.length) return 0;
    list.forEach(tint);
    dimAll();
    list.forEach(m => { m.material.opacity = 1; });
    return list.length;
  }

  // ── Selección por puntero (con soporte táctil) ──────────────────────────────
  const activePointers = new Set();
  let downX = 0, downY = 0, downT = 0, downId = null, wasMulti = false;
  canvas.addEventListener('pointerdown', e => {
    activePointers.add(e.pointerId);
    if (activePointers.size > 1) { wasMulti = true; return; }
    wasMulti = false;
    downX = e.clientX; downY = e.clientY; downT = performance.now(); downId = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch {}
  });
  canvas.addEventListener('pointerup', e => {
    const multi = wasMulti || activePointers.size > 1;
    activePointers.delete(e.pointerId);
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
    if (!model || e.pointerId !== downId || multi) return;
    const thresh = e.pointerType === 'touch' ? 12 : 4;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > thresh) return; // arrastre
    if (performance.now() - downT > 500) return;                          // pulsación larga
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(meshes.filter(m => m.visible), false);
    if (!hits.length) { clearHighlight(); onSelect && onSelect(null); return; }
    const mesh = hits[0].object;
    highlightMesh(mesh);
    onSelect && onSelect({ meshName: mesh.name, struct: mesh.userData.struct || null });
  });
  canvas.addEventListener('pointercancel', e => { activePointers.delete(e.pointerId); });

  return {
    loadModel, loadModels, applyResolver, setLayer, isolateRegion, clearIsolation,
    setHideVessels, setHideFascia, setupArticulation, setFlex, teardownFlex,
    reset, fit, frameModel,
    highlightMesh, highlightById, highlightMany, clearHighlight,
    getMeshNames: () => meshes.map(m => m.name),
    hasModel: () => !!model,
    // Inspector read-only: centros en el mundo de las mallas que matchean `re`.
    meshWorld: re => meshes.filter(m => re.test(m.name)).map(m => {
      m.updateWorldMatrix(true, false); // matrices al día (incluye el pivote padre)
      const c = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());
      return { name: m.name, x: +c.x.toFixed(3), y: +c.y.toFixed(3), z: +c.z.toFixed(3), vis: m.visible };
    })
  };
}
