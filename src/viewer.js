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
  // Vasos y nervios (distraen): arterias, venas, plexos, raíces, redes/arcos vasculares.
  const VESSEL_RE = /artery|arteries|arterial|vein|veins|venous|\bvena\b|vascular|vessel|nerve|nervus|plexus|lymph|ganglion|c\d ?root|thyrocervical|costocervical|(palmar|plantar|venous|dorsal venous).{0,6}(arch|network)/i;

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
  function applyVisibility() {
    meshes.forEach(m => { m.visible = layerOK(m) && regionOK(m) && vesselOK(m); });
  }
  function setLayer(layer) { currentLayer = layer; applyVisibility(); }
  function isolateRegion(pred) { currentRegionFilter = pred; applyVisibility(); }
  function clearIsolation() { currentRegionFilter = null; applyVisibility(); }
  function setHideVessels(b) { hideVessels = b; applyVisibility(); }

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

  // ── Articulación básica (sin rig): flexión de rodilla del tren inferior ──────
  let flexPivot = null;
  // Articula reparentando todo lo que está por debajo de un eje (la articulación)
  // a un pivote, y rotándolo. refNames = mallas del hueso de referencia; edge = 'max'
  // (parte alta, p.ej. rodilla = tope de la tibia) o 'min' (parte baja, p.ej. tobillo
  // = base de tibia/peroné). Si refNames es null usa la rodilla (tibia/rótula).
  function setupArticulation(refNames, edge) {
    teardownFlex();
    if (!model || !meshes.length) return false;
    const set = refNames ? new Set(refNames) : null;
    const ref = set ? meshes.filter(m => set.has(m.name)) : meshes.filter(m => /tibia|patella/i.test(m.name));
    if (!ref.length) return false;
    const box = new THREE.Box3();
    ref.forEach(m => box.expandByObject(m));
    const pivotY = edge === 'min' ? box.min.y : box.max.y;
    const c = box.getCenter(new THREE.Vector3());
    flexPivot = new THREE.Group();
    model.add(flexPivot);
    flexPivot.position.copy(model.worldToLocal(new THREE.Vector3(c.x, pivotY, c.z)));
    const below = meshes.filter(m => new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3()).y < pivotY);
    below.forEach(m => flexPivot.attach(m));
    return below.length > 0;
  }
  function setupLowerFlex() { return setupArticulation(null, 'max'); } // rodilla (compat)
  function setFlex(deg, axis) {
    if (!flexPivot && !setupLowerFlex()) return false;
    flexPivot.rotation.set(0, 0, 0);
    flexPivot.rotation[axis === 'z' ? 'z' : 'x'] = deg * Math.PI / 180;
    return true;
  }
  function teardownFlex() {
    if (flexPivot && model) {
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
    setHideVessels, setupArticulation, setFlex, teardownFlex,
    reset, fit, frameModel,
    highlightMesh, highlightById, highlightMany, clearHighlight,
    getMeshNames: () => meshes.map(m => m.name),
    hasModel: () => !!model
  };
}
