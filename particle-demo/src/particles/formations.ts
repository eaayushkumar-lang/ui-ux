// CPU-side generation of the three particle formations. Every array is
// length `count * 3` (positions/colors) or `count` (size/seed), and particle
// index i occupies the same slot in all three, so the GPU can morph particle i
// smoothly from its torus slot -> galaxy slot -> brain slot.

export interface FormationData {
  count: number;
  torus: Float32Array;
  galaxy: Float32Array;
  brain: Float32Array;
  cTorus: Float32Array;
  cGalaxy: Float32Array;
  cBrain: Float32Array;
  size: Float32Array;
  seed: Float32Array;
}

const TAU = Math.PI * 2;

// Cheap, deterministic-ish value noise from trig hashing. Good enough for
// organic surface roughness; we are not after physically-correct noise.
function noise3(x: number, y: number, z: number): number {
  const a = Math.sin(x * 1.7 + y * 2.3 + z * 1.1) * 0.5;
  const b = Math.cos(x * 2.9 - y * 1.3 + z * 2.1) * 0.3;
  const c = Math.sin(x * 0.7 + y * 3.1 - z * 1.9) * 0.2;
  return a + b + c; // roughly [-1, 1]
}

// Sum of three uniforms ~ triangular/normal-ish, centered at 0.
function gauss(): number {
  return Math.random() + Math.random() + Math.random() - 1.5;
}

function setVec(arr: Float32Array, i: number, x: number, y: number, z: number) {
  arr[i * 3] = x;
  arr[i * 3 + 1] = y;
  arr[i * 3 + 2] = z;
}

// ---- Torus / donut blob ----------------------------------------------------
// Ring in the XY plane (hole faces the camera along Z). Tube volume is filled
// and pushed around by noise for rough, cloud-like edges. Colour is a vertical
// gradient: teal-green at the top, blue-violet at the bottom.
function fillTorus(d: FormationData) {
  const R = 1.0;
  const topCol = [0.16, 0.95, 0.7];
  const botCol = [0.45, 0.28, 1.0];
  for (let i = 0; i < d.count; i++) {
    const u = Math.random() * TAU;
    const v = Math.random() * TAU;
    const tube = 0.42 * (0.3 + 0.85 * Math.random());
    let x = (R + tube * Math.cos(v)) * Math.cos(u);
    let y = (R + tube * Math.cos(v)) * Math.sin(u);
    let z = tube * Math.sin(v);
    const amp = 0.2;
    x += amp * noise3(x * 1.6, y * 1.6, z * 1.6);
    y += amp * noise3(x * 1.6 + 11, y * 1.6 + 11, z * 1.6 + 11);
    z += amp * 0.7 * noise3(x * 1.6 + 23, y * 1.6 + 23, z * 1.6 + 23);
    setVec(d.torus, i, x, y, z);

    const t = Math.min(1, Math.max(0, (y + 1.4) / 2.8));
    const edge = 0.85 + 0.35 * Math.random();
    setVec(
      d.cTorus,
      i,
      (botCol[0] + (topCol[0] - botCol[0]) * t) * edge,
      (botCol[1] + (topCol[1] - botCol[1]) * t) * edge,
      (botCol[2] + (topCol[2] - botCol[2]) * t) * edge,
    );
  }
}

// ---- Spiral galaxy ---------------------------------------------------------
// Flat disc in the XY plane: a bright violet/white core, 3 teal/green log-
// spiral arms, and a sparse field of dim background stars.
function fillGalaxy(d: FormationData) {
  const arms = 3;
  for (let i = 0; i < d.count; i++) {
    const roll = Math.random();
    if (roll < 0.15) {
      // Core: dense bright violet-white cluster.
      const r = Math.abs(gauss()) * 0.13;
      const a = Math.random() * TAU;
      setVec(d.galaxy, i, Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.06);
      const w = Math.max(0, 1 - r / 0.18);
      setVec(d.cGalaxy, i, (0.75 + 0.25 * w) * 1.7, (0.62 + 0.15 * w) * 1.7, 1.0 * 1.7);
    } else if (roll < 0.85) {
      // Arms: log spiral, angular scatter widening outward.
      const arm = Math.floor(Math.random() * arms);
      const t = Math.pow(Math.random(), 0.6);
      const rad = 0.16 + t * 1.15;
      const spin = rad * 2.4;
      const scatter = gauss() * 0.1 * (0.4 + rad);
      const a = arm * (TAU / arms) + spin + scatter;
      setVec(
        d.galaxy,
        i,
        Math.cos(a) * rad + (Math.random() - 0.5) * 0.03,
        Math.sin(a) * rad + (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.05 * (1 - t * 0.5),
      );
      const bright = 1.5 - t * 0.8;
      // Slight violet tint near the core, teal-green further out.
      setVec(
        d.cGalaxy,
        i,
        (0.2 + 0.35 * (1 - t)) * bright,
        (0.9 - 0.2 * (1 - t)) * bright,
        (0.6 + 0.3 * (1 - t)) * bright,
      );
    } else {
      // Background stars: sparse, dim, spread wide in a thicker volume.
      const rad = 0.3 + Math.random() * 1.5;
      const a = Math.random() * TAU;
      setVec(
        d.galaxy,
        i,
        Math.cos(a) * rad + (Math.random() - 0.5) * 0.5,
        Math.sin(a) * rad + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.9,
      );
      const s = 0.4 + Math.random() * 0.3;
      setVec(d.cGalaxy, i, 0.6 * s, 0.66 * s, 0.85 * s);
    }
  }
}

// ---- Brain silhouette ------------------------------------------------------
// A side-profile brain in the XY plane with a little Z thickness. Built from a
// clipped cerebrum ellipse (flat-ish bottom, rough gyri top) unioned with a
// cerebellum lobe and a brainstem stub at the lower-left. Fold banding is baked
// into per-particle brightness. A small bright violet-white cluster marks the
// brainstem base.
function brainInside(x: number, y: number): boolean {
  const roughTop = 1.0 + 0.07 * noise3(x * 4, y * 4, 0);
  const ex = (x - 0.05) / 0.95;
  const ey = (y - 0.15) / 0.62;
  if (ex * ex + ey * ey <= roughTop && y > -0.18) return true;
  // Cerebellum lobe, lower-left.
  const cx = (x + 0.62) / 0.34;
  const cy = (y + 0.34) / 0.3;
  if (cx * cx + cy * cy <= 1.0 + 0.06 * noise3(x * 5, y * 5, 1)) return true;
  // Brainstem stub.
  const sx = (x + 0.5) / 0.11;
  const sy = (y + 0.72) / 0.24;
  if (sx * sx + sy * sy <= 1.0) return true;
  return false;
}

function fillBrain(d: FormationData) {
  const nStem = Math.max(80, Math.floor(d.count * 0.004));
  let i = nStem; // reserve the first nStem slots for the bright brainstem point
  let guard = 0;
  const maxGuard = d.count * 60;
  while (i < d.count && guard < maxGuard) {
    guard++;
    const x = -1.15 + Math.random() * 2.3;
    const y = -1.0 + Math.random() * 2.05;
    if (!brainInside(x, y)) continue;
    const z = (Math.random() - 0.5) * 0.32 + 0.12 * noise3(x * 3, y * 3, 2);
    // Fold banding -> brightness variation reads as gyri/sulci.
    const fold = 0.5 + 0.5 * Math.abs(Math.sin(x * 7 + y * 6 + 3 * noise3(x * 3, y * 3, 0.5)));
    const inten = 0.55 + 0.75 * fold;
    setVec(d.brain, i, x, y, z);
    setVec(d.cBrain, i, 0.2 * inten, 0.92 * inten, 0.62 * inten);
    i++;
  }
  // If rejection sampling fell short (shouldn't), clone earlier points.
  for (; i < d.count; i++) {
    const src = nStem + (i % Math.max(1, d.count - nStem - 1));
    setVec(d.brain, i, d.brain[src * 3], d.brain[src * 3 + 1], d.brain[src * 3 + 2]);
    setVec(d.cBrain, i, d.cBrain[src * 3], d.cBrain[src * 3 + 1], d.cBrain[src * 3 + 2]);
  }
  // Bright brainstem cluster (violet-white) near the base.
  for (let s = 0; s < nStem; s++) {
    const a = Math.random() * TAU;
    const r = Math.abs(gauss()) * 0.05;
    setVec(d.brain, s, -0.5 + Math.cos(a) * r, -0.86 + Math.sin(a) * r * 0.8, (Math.random() - 0.5) * 0.1);
    setVec(d.cBrain, s, 0.85 * 2.4, 0.78 * 2.4, 1.0 * 2.4);
  }
}

export function buildFormations(count: number): FormationData {
  const d: FormationData = {
    count,
    torus: new Float32Array(count * 3),
    galaxy: new Float32Array(count * 3),
    brain: new Float32Array(count * 3),
    cTorus: new Float32Array(count * 3),
    cGalaxy: new Float32Array(count * 3),
    cBrain: new Float32Array(count * 3),
    size: new Float32Array(count),
    seed: new Float32Array(count),
  };
  fillTorus(d);
  fillGalaxy(d);
  fillBrain(d);
  for (let i = 0; i < count; i++) {
    // Occasional larger accent points, most small.
    d.size[i] = Math.random() < 0.06 ? 1.6 + Math.random() * 1.2 : 0.7 + Math.random() * 0.8;
    d.seed[i] = Math.random();
  }
  return d;
}
