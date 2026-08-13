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
  const VESSEL_RE = /artery|arteries|arterial|vein|veins|venous|\bvena\b|vascular|vessel|nerve|nervus|plexus|lymph|ganglion|c\d ?root|thyrocervical|costocervical|(palmar|plantar|venous|dorsal venous).{0,6}(arch|network)|carpal (arch|network|branches)|dorsalis (pollicis|indicis)|radialis indicis|princeps pollicis/i;
  // Fascia (envoltorio que estorba la selección). NO el músculo tensor fasciae latae.
  const FASCIA_RE = /(brachial|antebrachial|crural|thoracolumbar)_fascia|fascia_lata|deep_fascia|fascia_of|aponeuros|retinacul/i;
  // Tejido conectivo/blando que NO se mueve limpio al articular (vuela en pedazos):
  // tendones, ligamentos, fascia, cartílagos, cápsulas, bursas, nervios, vasos.
  const CONNECTIVE_RE = /tendon|tendinous|ligament|\bfascia|aponeuros|retinacul|bursa|synovial|art_cart|articular_cartilage|cartilage|capsule|capsular|membrane|labrum|meniscus|intervertebral_disc|\braphe|\bseptum|fat_pad|sheath|nerve|nervus|plexus|ganglion|artery|arteries|\bvein\b|veins|venous/i;

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

  let loopId = null;
  function animate() {
    loopId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  // Pausar el loop deja la página inactiva (permite capturar screenshots);
  // al reanudar vuelve a animar. Renderiza un frame al pausar.
  function setLoop(on) {
    if (on && loopId == null) animate();
    else if (!on && loopId != null) { cancelAnimationFrame(loopId); loopId = null; renderer.render(scene, camera); }
  }

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
    src.updateMatrixWorld(true);
    const m = src.clone(true);
    // Purga del clon las mallas AXIALES (centro ≈ plano sagital x=0): su espejo
    // se superpondría exactamente a la original (columna, esternón, sacro) y
    // produce parpadeo (z-fighting). Umbral = 1% de la altura de la escena.
    const size = new THREE.Box3().setFromObject(src).getSize(new THREE.Vector3());
    const eps = (size.y || 1) * 0.01;
    const kill = [];
    m.traverse(o => {
      if (o.isMesh) {
        const cx = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).x;
        if (Math.abs(cx) < eps) kill.push(o);
      }
    });
    kill.forEach(o => o.parent && o.parent.remove(o));
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
  // Enfoca (zoom) en una estructura concreta: mantiene la dirección de la cámara,
  // recentra la órbita en esa estructura y la encuadra. `pt` opcional = punto exacto.
  function focusOn(target, pt) {
    if (!target) return;
    const box = new THREE.Box3().setFromObject(target);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = pt || box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 0.1;
    const dist = (maxDim / 2) / Math.tan((camera.fov * Math.PI / 180) / 2) * 2.4;
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(dir, dist);
    controls.update();
  }

  // ── Articulación sin rig: por REGIÓN + LADO, no por plano Y ──────────────────
  // El modelo es cuerpo completo con ambos lados (mallas espejo con el MISMO
  // nombre), así que filtrar "todo lo que está debajo de un Y" agarraría las dos
  // extremidades (efecto "Picasso"). En su lugar: elegimos las mallas que se
  // mueven por patrón de nombre Y por lado (signo de X en el mundo), y colocamos
  // el pivote en el borde del hueso de referencia de ESE lado.
  let flexPivot = null;
  let flexPivot2 = null; // pivote secundario anidado (ritmo escápulo-humeral)
  let posePivot = null;  // pivote de POSE estático (articulación acoplada pre-posicionada)
  const centerOf = (m, cache) => {
    if (cache.has(m)) return cache.get(m);
    const c = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());
    cache.set(m, c); return c;
  };

  // opts = { pivotRe, edge:'min'|'max', side:'L'|'R', movingRe?, below?, above?,
  //          alsoRe?, excludeRe?, secondary? }
  // below=true → mueve TODO el segmento distal del lado (por debajo del pivote en
  // Y), como bloque rígido (huesos + músculos + ligamentos), sin que se separen.
  // above=true → COLUMNA/TRONCO: mueve todo lo que está POR ENCIMA del pivote,
  // de AMBOS lados + axial (tronco, brazos y cabeza viajan juntos). movingRe
  // opcional actúa de whitelist (cervical). Sin above/below: por nombre.
  // alsoRe = force-include por nombre que SALTA el filtro de conectivo (los
  // ligamentos de la mano deben viajar con la mano, no quedarse flotando).
  // secondary = { pivotRe, movingRe, edge? }: pivote ANIDADO para el ritmo
  // escápulo-humeral (la escápula gira una fracción y el brazo la hereda).
  function setupArticulation(opts = {}) {
    teardownFlex();
    const { movingRe, pivotRe, edge = 'max', side = 'R', below = false, above = false, alsoRe, excludeRe, secondary, pose, alsoRange } = opts;
    if (!model || !meshes.length || !pivotRe) return false;
    const wantSign = side === 'L' ? -1 : 1;
    const ctr = new Map();
    const EPS = 0.02; // umbral de línea media: estructuras axiales (sacro, columna) NO se articulan
    // above anula el filtro de lado: los pivotes vertebrales SON axiales y el
    // bloque superior (tronco + ambos brazos + cabeza) se mueve completo.
    const onSide = m => {
      if (above) return true;
      const x = centerOf(m, ctr).x;
      return Math.abs(x) > EPS && Math.sign(x) === wantSign;
    };
    const excl = m => excludeRe && excludeRe.test(m.name); // estructuras que se quedan fijas
    // Force-include acotado en Y al entorno del pivote: mano y pie comparten
    // nombres de ligamentos ("interphalangeal…" idénticos), así que sin este
    // guard un ligamento del PIE volaría colgado de la muñeca (o del tronco).
    // El rango es por-articulación: hombro/escápula necesitan alcanzar la punta
    // de los dedos (~1.0), la muñeca debe quedarse corta del pie (~0.9).
    const ALSO_RANGE = alsoRange || 0.75; // el modelo mide ~2 unidades de alto
    const also = m => alsoRe && alsoRe.test(m.name) && Math.abs(centerOf(m, ctr).y - pivotY) < ALSO_RANGE;
    // Hueso de referencia (del lado elegido, o axial en modo above) → pivote.
    const ref = meshes.filter(m => pivotRe.test(m.name) && onSide(m));
    if (!ref.length) return false;
    const pbox = new THREE.Box3();
    ref.forEach(m => pbox.expandByObject(m));
    const pivotY = edge === 'min' ? pbox.min.y : pbox.max.y;
    const c = pbox.getCenter(new THREE.Vector3());
    flexPivot = new THREE.Group();
    model.add(flexPivot);
    flexPivot.position.copy(model.worldToLocal(new THREE.Vector3(c.x, pivotY, c.z)));
    const onClean = m => onSide(m) && !excl(m);
    let moving;
    if (above) {
      // BLOQUE SUPERIOR (columna): todo lo de ENCIMA del pivote, ambos lados,
      // sin filtro de conectivo (discos y cartílagos viajan con el bloque).
      // also() fuerza casos frontera: el disco del pivote y los BRAZOS — en
      // posición anatómica las manos cuelgan por debajo del tope del sacro y
      // sin esto se quedarían atrás (desmembradas).
      moving = meshes.filter(m => !excl(m) &&
        ((centerOf(m, ctr).y > pivotY && (!movingRe || movingRe.test(m.name))) || also(m)));
    } else if (below) {
      // BLOQUE DISTAL: todo lo de abajo del lado se mueve junto (huesos +
      // cartílagos + músculos). NO se excluye conectivo: si no, los cartílagos
      // del pie se quedan y se ve roto. Es un bloque rígido, no se desarma.
      moving = meshes.filter(m => onClean(m) && (centerOf(m, ctr).y < pivotY || also(m)));
    } else {
      // POR NOMBRE (hombro/codo/muñeca): huesos/músculos curados SIN conectivo
      // (los tendones anclados al tronco se estirarían en lámina)… salvo lo que
      // alsoRe fuerza explícitamente (ligamentos carpianos van con la mano).
      moving = meshes.filter(m => onClean(m) && ((!CONNECTIVE_RE.test(m.name) && movingRe && movingRe.test(m.name)) || also(m)));
    }
    moving.forEach(m => flexPivot.attach(m));
    // Pivote SECUNDARIO anidado (ritmo escápulo-humeral): la escápula/clavícula
    // giran una fracción y el pivote del brazo cuelga de ellas — así la cabeza
    // humeral nunca se separa de la glenoides.
    if (secondary && moving.length) {
      const ref2 = meshes.filter(m => secondary.pivotRe.test(m.name) && onSide(m));
      if (ref2.length) {
        const pbox2 = new THREE.Box3();
        ref2.forEach(m => pbox2.expandByObject(m));
        const y2 = secondary.edge === 'min' ? pbox2.min.y : pbox2.max.y;
        const c2 = pbox2.getCenter(new THREE.Vector3());
        flexPivot2 = new THREE.Group();
        model.add(flexPivot2);
        flexPivot2.position.copy(model.worldToLocal(new THREE.Vector3(c2.x, y2, c2.z)));
        const claimed = new Set(moving); // no robar mallas ya adjuntadas al primario
        meshes.filter(m => !claimed.has(m) && onSide(m) && !excl(m) &&
            !CONNECTIVE_RE.test(m.name) && secondary.movingRe.test(m.name))
          .forEach(m => flexPivot2.attach(m));
        flexPivot2.attach(flexPivot); // ANIDA: el brazo hereda el giro escapular
      }
    }
    // Pivote de POSE estático: coloca la articulación ACOPLADA en la posición
    // que dice la opción del acoplamiento (ej. "rodilla flexionada" → la rodilla
    // ARRANCA doblada mientras se anima la cadera). inner=true si la articulación
    // posada es DISTAL (rodilla bajo cadera, codo bajo hombro): el sub-bloque
    // distal cuelga del pivote primario. inner=false si es PROXIMAL (cadera
    // sobre rodilla): el pivote de pose envuelve al primario y carga además el
    // segmento intermedio (el muslo) — así "rodilla flexionada con cadera a 90°"
    // se ve como flexión sentada.
    if (pose && pose.deg && moving.length) {
      const ref3 = meshes.filter(m => pose.pivotRe.test(m.name) && onSide(m));
      if (ref3.length) {
        const pbox3 = new THREE.Box3();
        ref3.forEach(m => pbox3.expandByObject(m));
        const y3 = pose.edge === 'min' ? pbox3.min.y : pbox3.max.y;
        const c3 = pbox3.getCenter(new THREE.Vector3());
        posePivot = new THREE.Group();
        model.add(posePivot);
        posePivot.position.copy(model.worldToLocal(new THREE.Vector3(c3.x, y3, c3.z)));
        const poseAlso = m => pose.alsoRe && pose.alsoRe.test(m.name);
        if (pose.inner) {
          [...flexPivot.children]
            .filter(ch => ch.isMesh && (centerOf(ch, ctr).y < y3 || poseAlso(ch)))
            .forEach(m => posePivot.attach(m));
          flexPivot.attach(posePivot);
        } else {
          const claimed = new Set([...flexPivot.children]);
          meshes.filter(m => !claimed.has(m) && onSide(m) && !excl(m) &&
              (centerOf(m, ctr).y < y3 || poseAlso(m)))
            .forEach(m => posePivot.attach(m));
          posePivot.attach(flexPivot);
        }
        const axp = pose.axis === 'z' ? 'z' : pose.axis === 'y' ? 'y' : 'x';
        posePivot.rotation[axp] = pose.deg * (pose.sign || 1) * Math.PI / 180;
      }
    }
    return moving.length > 0;
  }
  // secDeg = fracción del giro que aporta el pivote secundario (ritmo 2:1).
  // El primario recibe deg−secDeg y, anidado, hereda secDeg → total = deg.
  function setFlex(deg, axis, secDeg = 0) {
    if (!flexPivot) return false;
    const ax = axis === 'z' ? 'z' : axis === 'y' ? 'y' : 'x';
    flexPivot.rotation.set(0, 0, 0);
    flexPivot.rotation[ax] = (deg - secDeg) * Math.PI / 180;
    if (flexPivot2) {
      flexPivot2.rotation.set(0, 0, 0);
      flexPivot2.rotation[ax] = secDeg * Math.PI / 180;
    }
    return true;
  }
  function teardownFlex() {
    if (flexPivot && model) {
      // Vuelve a neutral ANTES de desenparentar: attach() conserva el transform
      // del mundo, así que si algún pivote sigue rotado, las mallas se quedarían
      // trabadas en la posición girada al cambiar de articulación.
      flexPivot.rotation.set(0, 0, 0);
      if (flexPivot2) flexPivot2.rotation.set(0, 0, 0);
      if (posePivot) posePivot.rotation.set(0, 0, 0);
      model.updateMatrixWorld(true);
      // Reancla las MALLAS de cada pivote al modelo; los grupos anidados
      // (posePivot⊂flexPivot⊂flexPivot2, en cualquier combinación) se quitan al final.
      [posePivot, flexPivot, flexPivot2].forEach(p => {
        if (!p) return;
        [...p.children].forEach(ch => { if (ch.isMesh) model.attach(ch); });
      });
      [posePivot, flexPivot, flexPivot2].forEach(p => { if (p && p.parent) p.parent.remove(p); });
    }
    flexPivot = null;
    flexPivot2 = null;
    posePivot = null;
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

  // Doble clic = zoom/enfoque a la estructura donde se hace clic (no al centro de todo).
  canvas.addEventListener('dblclick', e => {
    if (!model) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(meshes.filter(m => m.visible), false);
    if (hits.length) focusOn(hits[0].object, hits[0].point);
  });

  return {
    loadModel, loadModels, applyResolver, setLayer, isolateRegion, clearIsolation,
    setHideVessels, setHideFascia, setupArticulation, setFlex, teardownFlex, setLoop,
    reset, fit, frameModel, focusOn,
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
