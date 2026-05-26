# 3D Anatomy Viewer

Interactive 3D musculoskeletal viewer with a built-in muscle database (origin, insertion, action, function, innervation, strength curve zones, PRE-SCRIPT notes).

**Live:** [https://mazothecoach.github.io/anatomy-viewer/Anatomy_Viewer.html](https://mazothecoach.github.io/anatomy-viewer/Anatomy_Viewer.html)

## Use

Drop a `.glb` anatomy model into `models/myology.glb` or pass `?model=URL` in the query string.

### URL parameters

| Param | Effect |
|---|---|
| `?model=URL` | Auto-load a GLB from URL |
| `?compact=1` | Hide left sidebar (good for narrow iframes) |
| `?minimal=1` | Hide all UI except 3D + floating info card |
| `?bg=hex` | Override background color (without `#`) |

Combine with `&`: `?model=models/myology.glb&compact=1`

### Recommended model

[Z-Anatomy Myology on Sketchfab](https://sketchfab.com/3d-models/myology-31b40fd809b14665b93773936d67c52c) — CC BY-SA 4.0, full-body muscle model with separated meshes.

## Credits

- Three.js + GLTFLoader + Draco/Meshopt for 3D rendering
- [Z-Anatomy](https://www.z-anatomy.com/) by Lluís Vinent — CC BY-SA 4.0
- Muscle data informed by PRE-SCRIPT Level 1 (Dr. Jordan Shallow + Dr. Jordan Jiunta)
