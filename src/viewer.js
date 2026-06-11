import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const HIGHLIGHT_COLOR = new THREE.Color(0xc6ff3d);
const DIM_OPACITY = 0.18;

// createViewer: monta la escena Three.js sobre un <canvas> y expone una API
// para cargar modelos, taggear mallas con datos, filtrar por capa y resaltar.
export function createViewer(canvas, { onSelect } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  camera.position.set(0, 1.2, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 1, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(2, 4, 3); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc6ff3d, 0.3); fill.position.set(-3, 2, -2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0x6ad1ff, 0.4); rim.position.set(0, 3, -5); scene.add(rim);

  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/');
  loader.setDRACOLoader(draco);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let model = null;
  let meshes = [];
  let highlighted = null;
  let originalMat = null;
  let startX = 0, startY = 0;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h || 1;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();

  function clearModel() {
    if (model) {
      scene.remove(model);
      model.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    }
    model = null; meshes = []; highlighted = null; originalMat = null;
  }

  function loadModel(url, { onProgress } = {}) {
    return new Promise((resolve, reject) => {
      clearModel();
      loader.load(url, (gltf) => {
        model = gltf.scene;
        scene.add(model);
        meshes = [];
        model.traverse(o => {
          if (o.isMesh) {
            (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.transparent = true; });
            meshes.push(o);
          }
        });
        frameModel();
        resolve(meshes.map(m => m.name));
      }, (xhr) => {
        if (onProgress && xhr.lengthComputable) onProgress(xhr.loaded / xhr.total);
      }, reject);
    });
  }

  // Tag each mesh with the resolved structure data. resolver(meshName) -> { id, layer, ... } | null
  function applyResolver(resolver) {
    meshes.forEach(m => { m.userData.struct = resolver ? resolver(m.name) : null; });
  }

  function setLayer(layer) {
    meshes.forEach(m => {
      const s = m.userData.struct;
      m.visible = !layer || !s || s.layer === layer || s.layer == null;
    });
  }

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

  function dimAll() {
    meshes.forEach(m => (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => { mt.opacity = DIM_OPACITY; }));
  }
  function restoreAll() {
    meshes.forEach(m => (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => { mt.opacity = 1; }));
  }
  function clearHighlight() {
    if (highlighted && originalMat) highlighted.material = originalMat;
    restoreAll();
    highlighted = null; originalMat = null;
  }
  function highlightMesh(mesh) {
    clearHighlight();
    if (!mesh) return;
    highlighted = mesh;
    originalMat = mesh.material;
    mesh.material = new THREE.MeshStandardMaterial({
      color: HIGHLIGHT_COLOR, emissive: new THREE.Color(0x556a18),
      metalness: 0.1, roughness: 0.4, transparent: true, opacity: 1
    });
    dimAll();
    mesh.material.opacity = 1;
  }
  function highlightById(id) {
    const mesh = meshes.find(m => m.userData.struct && m.userData.struct.id === id);
    if (mesh) highlightMesh(mesh);
    return !!mesh;
  }

  canvas.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; });
  canvas.addEventListener('pointerup', e => {
    if (!model) return;
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 4) return; // arrastre, no clic
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

  return {
    loadModel, applyResolver, setLayer, reset, fit, frameModel,
    highlightById, clearHighlight,
    getMeshNames: () => meshes.map(m => m.name),
    hasModel: () => !!model
  };
}
