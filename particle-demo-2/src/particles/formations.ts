// CPU-side generation of FIVE particle formations, in the corrected loop order.
// Every array is length `count*3` (pos/col) or `count` (size/seed); particle i
// occupies the same slot in all five so the GPU can morph it F0->F1->...->F4.
//
//   F0 RING       thick turbulent plasma ring, warm (top) -> cool (bottom)
//   F1 DNA        dense sparkling blue/purple dust braid forming a helix
//   F2 WAVE       low horizon terrain at the bottom, blue (L) -> red (R)
//   F3 BLACKHOLE  empty dark disc + swirling corona blue (L) -> red (R) + stars
//   F4 GALAXY     tilted flat elliptical disc, hot white/pink/red core + rings

export interface FormationData {
  count: number;
  pos: Float32Array[]; // 5 x (count*3)
  col: Float32Array[]; // 5 x (count*3)
  size: Float32Array;
  seed: Float32Array;
}

const TAU = Math.PI * 2;

function noise3(x: number, y: number, z: number): number {
  const a = Math.sin(x * 1.7 + y * 2.3 + z * 1.1) * 0.5;
  const b = Math.cos(x * 2.9 - y * 1.3 + z * 2.1) * 0.3;
  const c = Math.sin(x * 0.7 + y * 3.1 - z * 1.9) * 0.2;
  return a + b + c;
}
function gauss(): number {
  return Math.random() + Math.random() + Math.random() - 1.5;
}
function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function set(a: Float32Array, i: number, x: number, y: number, z: number) {
  a[i * 3] = x;
  a[i * 3 + 1] = y;
  a[i * 3 + 2] = z;
}
function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
// Rotate (x,y,z) by rx, ry, rz (radians), applied X then Y then Z.
function rot(x: number, y: number, z: number, rx: number, ry: number, rz: number): [number, number, number] {
  let cy = Math.cos(rx), sy = Math.sin(rx);
  const y1 = y * cy - z * sy;
  const z1 = y * sy + z * cy;
  const x1 = x;
  cy = Math.cos(ry); sy = Math.sin(ry);
  const x2 = x1 * cy + z1 * sy;
  const z2 = -x1 * sy + z1 * cy;
  const y2 = y1;
  cy = Math.cos(rz); sy = Math.sin(rz);
  const x3 = x2 * cy - y2 * sy;
  const y3 = x2 * sy + y2 * cy;
  return [x3, y3, z2];
}

// Shared blue -> red/orange gradient family used across every formation.
const BLUE = [0.2, 0.45, 1.0];
const ORANGE = [1.0, 0.42, 0.14];

// ---- F0 RING ---------------------------------------------------------------
// A large, thick, turbulent plasma ring (not a thin outline): warm red/orange
// at the top / top-right fading to blue at the bottom / bottom-left, with a
// dark hollow center and wispy edges.
function fillRing(p: Float32Array, c: Float32Array, n: number) {
  const R = 1.42;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    let rr = R + gauss() * 0.1; // thick band
    rr += 0.15 * noise3(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0); // turbulence
    let x = Math.cos(a) * rr + gauss() * 0.035;
    let y = Math.sin(a) * rr + gauss() * 0.035;
    const z = gauss() * 0.08;
    if (Math.random() < 0.12) {
      const f = 1 + Math.random() * 0.22; // occasional outward wisp/flare
      x *= f;
      y *= f;
    }
    set(p, i, x, y, z);
    // Warm at top (sin high) / right, cool at bottom / left.
    const t = clamp01((Math.sin(a) * 0.72 + Math.cos(a) * 0.28 + 1) / 2);
    const b = 1.15 + 0.4 * Math.random();
    set(c, i, mix(BLUE[0], ORANGE[0], t) * b, mix(BLUE[1], ORANGE[1], t) * b, mix(BLUE[2], ORANGE[2], t) * b);
  }
}

// ---- F1 DNA HELIX ----------------------------------------------------------
// A DENSE, sparkling, granular twisted rope: two thick dust tubes (offset by
// PI) spiralling around the axis, plus base-pair rungs and a faint dust
// envelope, in blue/purple with white sparkles.
function fillDNA(p: Float32Array, c: Float32Array, n: number) {
  const turns = 2.7;
  const r = 0.42;
  const H = 2.75;
  const NRUNGS = 18;
  for (let i = 0; i < n; i++) {
    const roll = Math.random();
    if (roll < 0.78) {
      // Dense granular strand tube (one of the two backbones).
      const strand = Math.random() < 0.5 ? 0 : 1;
      const t = Math.random();
      const y = (t - 0.5) * H;
      const ang = t * turns * TAU + strand * Math.PI;
      const tubeR = Math.abs(gauss()) * 0.12;
      const tubeA = Math.random() * TAU;
      const x = Math.cos(ang) * r + Math.cos(tubeA) * tubeR;
      const z = Math.sin(ang) * r + Math.sin(tubeA) * tubeR;
      set(p, i, x, y + gauss() * 0.035, z);
      if (Math.random() < 0.14) {
        set(c, i, 1.5, 1.55, 1.75); // white-blue sparkle
      } else {
        const m = Math.random(); // blue <-> purple
        set(c, i, mix(0.3, 0.55, m) * 1.25, mix(0.5, 0.4, m) * 1.25, 1.0 * 1.25);
      }
    } else if (roll < 0.9) {
      // Base-pair rung bridging the two strands at a regular height.
      const rk = (Math.random() * NRUNGS) | 0;
      const t = (rk + 0.5) / NRUNGS;
      const y = (t - 0.5) * H;
      const ang = t * turns * TAU;
      const x0 = Math.cos(ang) * r, z0 = Math.sin(ang) * r;
      const x1 = Math.cos(ang + Math.PI) * r, z1 = Math.sin(ang + Math.PI) * r;
      const s = Math.random();
      set(p, i, mix(x0, x1, s) + gauss() * 0.02, y + gauss() * 0.015, mix(z0, z1, s) + gauss() * 0.02);
      set(c, i, 0.62 * 1.1, 0.62 * 1.1, 0.98 * 1.1);
    } else {
      // Faint dust envelope for the "twisted galaxy of dust" haze.
      const t = Math.random();
      const y = (t - 0.5) * H * 1.05;
      const rr = 0.12 + Math.abs(gauss()) * 0.4;
      const aa = Math.random() * TAU;
      set(p, i, Math.cos(aa) * rr, y + gauss() * 0.05, Math.sin(aa) * rr);
      const dim = 0.35 + Math.random() * 0.25;
      set(c, i, 0.4 * dim, 0.4 * dim, 0.85 * dim);
    }
  }
}

// ---- F2 WAVE / TERRAIN -----------------------------------------------------
// Low wavy horizon anchored to the BOTTOM of the frame, viewed at a low angle,
// blue (left) -> red/orange (right), brighter along the crests.
function fillWave(p: Float32Array, c: Float32Array, n: number) {
  for (let i = 0; i < n; i++) {
    const gx = -2.0 + Math.random() * 4.0;
    const gz = -0.2 + Math.random() * 2.4; // recedes away
    const h =
      0.16 * Math.sin(gx * 2.0 + gz * 1.4) +
      0.09 * Math.sin(gx * 3.5 - gz * 1.1) +
      0.05 * noise3(gx, gz, 0);
    const [x, y, z] = rot(gx, h, gz, -1.02, 0, 0);
    set(p, i, x, y - 0.72, z); // pushed down to the lower third
    const t = (gx + 2.0) / 4.0; // blue (left) -> red (right)
    const crest = 0.9 + Math.max(0, h) * 2.4; // crests glow
    const b = (0.9 + 0.25 * Math.random()) * crest;
    set(c, i, mix(BLUE[0], ORANGE[0], t) * b, mix(BLUE[1], ORANGE[1], t) * b, mix(BLUE[2], ORANGE[2], t) * b);
  }
}

// ---- F3 BLACK HOLE / ECLIPSE ----------------------------------------------
// Empty dark disc, a swirling accretion corona coloured blue (left) -> red /
// orange (right) — same gradient family as the rest — over a dense white/blue
// starfield across the whole frame.
function fillBlackHole(p: Float32Array, c: Float32Array, n: number) {
  const Rb = 0.72;
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.4) {
      // Swirling corona.
      const a = Math.random() * TAU;
      const rr = Rb + Math.pow(Math.random(), 1.7) * 0.7;
      const swirl = a + (rr - Rb) * 1.3; // shear -> swirl
      const x = Math.cos(swirl) * rr;
      const y = Math.sin(swirl) * rr;
      set(p, i, x, y, gauss() * 0.04);
      const fall = Math.max(0, 1 - (rr - Rb) / 0.7);
      const b = 0.4 + 1.25 * fall;
      const t = clamp01((x / (Rb + 0.7) + 1) / 2); // left blue -> right red
      set(c, i, mix(BLUE[0], ORANGE[0], t) * b, mix(BLUE[1], ORANGE[1], t) * b, mix(BLUE[2], ORANGE[2], t) * b);
    } else {
      // Dense starfield, never inside the disc.
      let sx = 0, sy = 0;
      for (let g = 0; g < 8; g++) {
        sx = (Math.random() * 2 - 1) * 2.8;
        sy = (Math.random() * 2 - 1) * 2.0;
        if (sx * sx + sy * sy > Rb * Rb * 1.1) break;
      }
      set(p, i, sx, sy, (Math.random() - 0.5) * 1.4);
      const rr = Math.random();
      const col = rr < 0.7 ? [0.9, 0.93, 1.0] : rr < 0.9 ? [0.55, 0.7, 1.0] : [1.0, 0.72, 0.5];
      const s = 0.4 + Math.random() * 0.5;
      set(c, i, col[0] * s, col[1] * s, col[2] * s);
    }
  }
}

// ---- F4 GALAXY / ORBIT -----------------------------------------------------
// A tilted flat disc: a hot horizontally-elongated white/pink/red core with a
// few concentric elliptical orbit rings (warm inner -> blue/purple outer) and
// a sparse star scatter. The whole disc is tilted so the rings read as wide,
// flat ellipses seen from slightly above.
function fillGalaxy(p: Float32Array, c: Float32Array, n: number) {
  const tilt = 1.15;
  for (let i = 0; i < n; i++) {
    const roll = Math.random();
    if (roll < 0.14) {
      // Hot elongated core: white center -> pink -> red.
      const cr = Math.abs(gauss());
      const [x, y, z] = rot(gauss() * 0.17, gauss() * 0.06, 0, tilt, 0, 0);
      set(p, i, x, y, z);
      const w = Math.max(0, 1 - cr / 2.2);
      set(c, i, 1.0 * 2.0, mix(0.35, 0.9, w) * 2.0, mix(0.4, 0.85, w) * 2.0);
    } else if (roll < 0.72) {
      // Concentric elliptical rings.
      const ringIdx = (Math.random() * 3) | 0;
      const baseR = 0.5 + ringIdx * 0.42;
      const ang = Math.random() * TAU;
      const px = Math.cos(ang) * baseR + gauss() * 0.025;
      const py = Math.sin(ang) * baseR * 0.92 + gauss() * 0.025;
      const [x, y, z] = rot(px, py, 0, tilt, 0, 0);
      set(p, i, x, y, z);
      const f = ringIdx / 2; // 0 inner -> 1 outer
      const b = 1.15 - 0.25 * f;
      set(c, i, mix(1.0, 0.45, f) * b, mix(0.5, 0.4, f) * b, mix(0.6, 1.0, f) * b);
    } else {
      // Sparse dim stars.
      const rad = 0.5 + Math.random() * 1.6;
      const a = Math.random() * TAU;
      set(p, i, Math.cos(a) * rad + (Math.random() - 0.5) * 0.4, Math.sin(a) * rad + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.8);
      const s = 0.25 + Math.random() * 0.25;
      set(c, i, 0.62 * s, 0.64 * s, 0.85 * s);
    }
  }
}

export function buildFormations(count: number): FormationData {
  const pos = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  const col = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  fillRing(pos[0], col[0], count);
  fillDNA(pos[1], col[1], count);
  fillWave(pos[2], col[2], count);
  fillBlackHole(pos[3], col[3], count);
  fillGalaxy(pos[4], col[4], count);

  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    size[i] = Math.random() < 0.06 ? 1.5 + Math.random() * 1.1 : 0.7 + Math.random() * 0.8;
    seed[i] = Math.random();
  }
  return { count, pos, col, size, seed };
}
