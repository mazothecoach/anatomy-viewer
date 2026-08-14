// Genera el corpus de la Wiki (NotebookLM) a partir de los datos del visor.
// Salida: Markdown legible en OneDrive\Freelance\Mazothecoach\Knowledge\wiki\
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = 'C:/Users/fbast/OneDrive/Freelance/Mazothecoach/Knowledge/wiki';
mkdirSync(OUT, { recursive: true });

const J = f => JSON.parse(readFileSync(join(ROOT, 'src/data', f), 'utf8'));
const muscles = J('muscles.json');
const bones = J('bones.json');
const exercises = J('exercises.json');
const joints = J('joints.json');
const exGroups = J('exerciseGroups.json');
const painZones = J('painZones.json');
const morphology = J('morphology.json');

const es = x => (x && typeof x === 'object') ? (x.es || x.en || '') : (x || '');
const byId = new Map([...muscles, ...bones].map(s => [s.id, s]));
const name = id => { const s = byId.get(id); return s ? es(s.name) : id; };

// ── 1. Músculos ──────────────────────────────────────────────────────────────
let m1 = `# Wiki Mazothecoach — Músculos (visor anatómico)\n\nFicha por músculo: dónde está, qué hace, dónde sentirlo y su curva de fuerza (acortado / medio / alargado). Contenido educativo del visor 3D de Mazothecoach, sin fines de lucro.\n\n`;
for (const m of muscles) {
  m1 += `## ${es(m.name)}\n`;
  if (m.location) m1 += `- **Ubicación:** ${es(m.location)}\n`;
  if (m.origin) m1 += `- **Origen:** ${es(m.origin)}\n`;
  if (m.insertion) m1 += `- **Inserción:** ${es(m.insertion)}\n`;
  if (m.action) m1 += `- **Acción:** ${es(m.action)}\n`;
  if (m.function) m1 += `- **Función en el entrenamiento:** ${es(m.function)}\n`;
  const fc = m.forceCurve || {};
  if (fc.shortened || fc.mid || fc.lengthened) {
    m1 += `- **Curva de fuerza:** acortado → ${es(fc.shortened) || '—'}; medio → ${es(fc.mid) || '—'}; alargado → ${es(fc.lengthened) || '—'}\n`;
  }
  if (m.notes) m1 += `- **Notas:** ${es(m.notes)}\n`;
  if (m.pslNotes) m1 += `- **Nota de coaching:** ${es(m.pslNotes)}\n`;
  m1 += `\n`;
}
writeFileSync(join(OUT, 'wiki-musculos.md'), m1);

// ── 2. Ejercicios por grupo coloquial ────────────────────────────────────────
const groupOf = new Map();
exGroups.forEach(g => (g.muscleIds || []).forEach(id => groupOf.set(id, es(g.label))));
let m2 = `# Wiki Mazothecoach — Ejercicios: qué músculo trabaja y dónde sentirlo\n\nAgrupados como se dicen en el gym (Femoral, Glúteos, Pecho…). Por ejercicio: músculo objetivo, zona de la curva de fuerza que carga (acortado/medio/alargado) y dónde deberías sentirlo.\n\n`;
const buckets = new Map();
for (const ex of exercises) {
  const g = groupOf.get(ex.primaryMuscle) || 'Otros';
  if (!buckets.has(g)) buckets.set(g, []);
  buckets.get(g).push(ex);
}
for (const [g, exs] of buckets) {
  m2 += `## ${g}\n\n`;
  for (const ex of exs) {
    m2 += `### ${es(ex.name)}\n`;
    m2 += `- **Músculo objetivo:** ${name(ex.primaryMuscle)}\n`;
    if (ex.loadedZone) {
      const z = { shortened: 'acortado (músculo contraído)', mid: 'medio (tensión pico)', lengthened: 'alargado (músculo estirado)' }[ex.loadedZone] || ex.loadedZone;
      m2 += `- **Zona cargada:** ${z}\n`;
    }
    if (ex.secondaryMuscles && ex.secondaryMuscles.length) m2 += `- **Secundarios:** ${ex.secondaryMuscles.map(name).join(', ')}\n`;
    if (ex.whereToFeel) m2 += `- **Dónde sentirlo:** ${es(ex.whereToFeel)}\n`;
    m2 += `\n`;
  }
}
writeFileSync(join(OUT, 'wiki-ejercicios.md'), m2);

// ── 3. Articulaciones: rangos + acoplamientos ────────────────────────────────
let m3 = `# Wiki Mazothecoach — Articulaciones: rangos de movimiento y acoplamientos\n\nRangos normales por articulación (referencias AAOS/Kapandji) y cómo un rango DEPENDE de la posición de otra articulación (músculos biarticulares). Esto es lo que el visor anima.\n\n`;
for (const j of joints) {
  m3 += `## ${es(j.name)}\n`;
  if (j.type) m3 += `**Tipo:** ${es(j.type)}\n\n`;
  for (const mv of j.movements || []) {
    m3 += `- **${es(mv.name)}** — ${mv.romDeg}° (plano ${mv.plane})`;
    if (mv.coupling) {
      const opts = mv.coupling.options.map(o => `${es(mv.coupling.label).toLowerCase()} ${es(o.name)}: ${o.romDeg}°`).join(' / ');
      m3 += `. **Acoplado:** ${opts}. ${es(mv.coupling.note)}`;
    }
    m3 += `\n`;
  }
  if (j.coupledMotion) m3 += `\n**Movimiento acoplado:** ${es(j.coupledMotion)}\n`;
  if (j.notes) m3 += `\n**Nota de coaching:** ${es(j.notes)}\n`;
  m3 += `\n`;
}
writeFileSync(join(OUT, 'wiki-articulaciones.md'), m3);

// ── 4. Dolor + morfología ────────────────────────────────────────────────────
let m4 = `# Wiki Mazothecoach — Zonas de molestia y morfología individual\n\n`;
m4 += `## Zonas de molestia: qué reforzar y por qué\n\n`;
for (const z of painZones) {
  m4 += `### ${es(z.name)}\n- **Reforzar:** ${(z.strengthen || []).map(name).join(', ')}\n- **Por qué:** ${es(z.rationale)}\n\n`;
}
m4 += `## Morfología: cómo cambia el entrenamiento según tu estructura\n\n`;
for (const t of morphology) {
  m4 += `### ${es(t.name)}\n${es(t.summary)}\n- **${es(t.long.label)}:** ${es(t.long.note)}\n- **${es(t.short.label)}:** ${es(t.short.note)}\n\n`;
}
writeFileSync(join(OUT, 'wiki-dolor-morfologia.md'), m4);

console.log('Wiki generada en', OUT);
