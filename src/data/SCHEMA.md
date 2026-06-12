# Esquema de datos (PLAN.md §5)

Todos los archivos son arrays de registros. Toda estructura anatómica se mapea a su
malla 3D por `meshNames` — esto es lo que conecta el JSON con el modelo. Todo campo de
contenido es bilingüe `{ "es": "...", "en": "..." }`.

> Estado Fase 0: los archivos están **vacíos** (`[]`). No se llenan hasta verificar el
> spike de mallas de Z-Anatomy (PLAN.md §8, Fase 0). No avanzar a contenido antes.

**`region`** (enum canónico, dirige las pestañas de región): `shoulder | arm | core | hip | thigh | leg`.
**`strengthen[]`** (painZones) y **`targetMuscles[]`** (physiqueGoals) son arrays de **ids de músculo**
para el resaltado múltiple en 3D.

## muscles.json

```json
{
  "id": "biceps_brachii",
  "meshNames": ["Biceps_brachii_l", "Biceps_brachii_r"],
  "layer": "muscle",
  "region": "upper_limb",
  "name": { "es": "Bíceps braquial", "en": "Biceps brachii" },
  "location": { "es": "Cara anterior del brazo", "en": "Anterior arm" },
  "origin": { "es": "...", "en": "..." },
  "insertion": { "es": "...", "en": "..." },
  "action": { "es": "...", "en": "..." },
  "function": { "es": "...", "en": "..." },
  "innervation": { "es": "Nervio musculocutáneo", "en": "Musculocutaneous nerve" },
  "forceCurve": {
    "shortened": { "es": "...", "en": "..." },
    "mid": { "es": "...", "en": "..." },
    "lengthened": { "es": "...", "en": "..." }
  },
  "pslNotes": { "es": "...", "en": "..." },
  "exercises": ["high_cable_curl", "standing_db_curl", "incline_db_curl"],
  "painZones": ["elbow"],
  "physiqueGoals": ["arm_development"]
}
```

## bones.json

Misma forma, `layer: "bone"`, sin `origin/insertion`, con `articulations` (con qué huesos articula).

```json
{
  "id": "humerus",
  "meshNames": ["Humerus_l", "Humerus_r"],
  "layer": "bone",
  "region": "arm",
  "name": { "es": "Húmero", "en": "Humerus" },
  "location": { "es": "Hueso del brazo", "en": "Arm bone" },
  "articulations": ["scapula", "radius", "ulna"]
}
```

## painZones.json

Zonas: rodilla, hombro, espalda baja, cadera, codo.

```json
{
  "id": "knee",
  "name": { "es": "Rodilla", "en": "Knee" },
  "strengthen": ["vastus_medialis", "gluteus_medius"],
  "rationale": { "es": "...", "en": "..." }
}
```

## physiqueGoals.json

```json
{
  "id": "small_waist_female",
  "name": { "es": "Cintura más pequeña", "en": "Smaller waist" },
  "targetMuscles": ["latissimus_dorsi", "deltoid_lateral"],
  "rationale": { "es": "...", "en": "..." }
}
```

## exercises.json

```json
{
  "id": "incline_db_curl",
  "name": { "es": "Curl inclinado", "en": "Incline DB curl" },
  "primaryMuscle": "biceps_brachii",
  "loadedRange": "lengthened",
  "poseRef": "elbow_lengthened",
  "notes": { "es": "...", "en": "..." }
}
```
