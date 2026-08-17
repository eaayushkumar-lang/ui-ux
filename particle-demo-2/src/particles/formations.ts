// CPU-side generation of FIVE particle formations. Every array is length
// `count * 3` (positions/colors) or `count` (size/seed). Particle index i
// occupies the same slot in all five, so the GPU can morph particle i smoothly
// F0 -> F1 -> F2 -> F3 -> F4 as scroll advances.
//
//   F0 RING       thin glowing ring outline, blue (BL) -> red/orange (TR)
//   F1 GALAXY     two tilted intersecting orbit rings + hot core + starfield
//   F2 DNA        vertical double helix (glowing blue), slow rotation
//   F3 WAVE       low-angle wavy terrain, blue -> red left to right
//   F4 BLACKHOLE  empty dark disc + violet-pink corona + dense starfield

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
  let y1 = y * cy - z * sy;
  let z1 = y * sy + z * cy;
  let x1 = x;
  cy = Math.cos(ry); sy = Math.sin(ry);
  const x2 = x1 * cy + z1 * sy;
  const z2 = -x1 * sy + z1 * cy;
  const y2 = y1;
  cy = Math.cos(rz); sy = Math.sin(rz);
  const x3 = x2 * cy - y2 * sy;
  const y3 = x2 * sy + y2 * cy;
  return [x3, y3, z2];
}

const BLUE = [0.2, 0.45, 1.0];
const ORANGE = [1.0, 0.4, 0.12];

// ---- F0 RING ---------------------------------------------------------------
function fillRing(p: Float32Array, c: Float32Array, n: number) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const r = 1.18 + gauss() * 0.02; // thin outline
    set(p, i, Math.cos(a) * r, Math.sin(a) * r, gauss() * 0.025);
    // Diagonal gradient: blue at bottom-left (a=225deg), red/orange at top-right (a=45deg).
    const t = (Math.cos(a - Math.PI / 4) + 1) / 2;
    const b = 1.25 + 0.25 * Math.random();
    set(c, i, mix(BLUE[0], ORANGE[0], t) * b, mix(BLUE[1], ORANGE[1], t) * b, mix(BLUE[2], ORANGE[2], t) * b);
  }
}

// ---- F1 GALAXY / ORBIT -----------------------------------------------------
function fillGalaxy(p: Float32Array, c: Float32Array, n: number) {
  for (let i = 0; i < n; i++) {
    const roll = Math.random();
    if (roll < 0.1) {
      // Hot core: white -> red/orange.
      const r = Math.abs(gauss()) * 0.11;
      const a = Math.random() * TAU;
      set(p, i, Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.06);
      const w = Math.max(0, 1 - r / 0.16);
      set(c, i, mix(1.0, 1.0, w) * 1.8, mix(0.45, 0.95, w) * 1.8, mix(0.2, 0.75, w) * 1.8);
    } else if (roll < 0.65) {
      // Two intersecting tilted orbit rings (thin ellipses).
      const ring = Math.random() < 0.5;
      const ang = Math.random() * TAU;
      const A = 1.35, B = 0.6;
      const ex = Math.cos(ang) * A + gauss() * 0.02;
      const ey = Math.sin(ang) * B + gauss() * 0.02;
      const [x, y, z] = ring
        ? rot(ex, ey, 0, 0.55, 0.0, 0.35)
        : rot(ex, ey, 0, -0.4, 1.05, -0.2);
      set(p, i, x, y, z);
      const warm = 0.25 + 0.25 * Math.random();
      set(c, i, (0.45 + warm) * 1.1, 0.62 * 1.1, (1.0 - warm * 0.4) * 1.1);
    } else {
      // Sparse starfield.
      const rad = 0.4 + Math.random() * 1.8;
      const a = Math.random() * TAU;
      set(
        p, i,
        Math.cos(a) * rad + (Math.random() - 0.5) * 0.5,
        Math.sin(a) * rad + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 1.0,
      );
      const s = 0.35 + Math.random() * 0.35;
      set(c, i, 0.7 * s, 0.72 * s, 0.9 * s);
    }
  }
}

// ---- F2 DNA HELIX ----------------------------------------------------------
// A clear double helix: TWO ribbon strands offset by PI around a central
// vertical axis, plus evenly-spaced base-pair rungs bridging them. Strands are
// given real ribbon thickness (small tube jitter) so they read as two distinct
// spirals, not hairlines, and the two strands use slightly different blues.
function fillDNA(p: Float32Array, c: Float32Array, n: number) {
  const turns = 2.6; // full twists over the height (fewer = clearer)
  const r = 0.46; // helix radius
  const H = 2.7; // total height
  const NRUNGS = 17; // discrete, evenly-spaced base pairs
  const STRAND0 = [0.25, 0.75, 1.0]; // cyan-blue
  const STRAND1 = [0.42, 0.5, 1.0]; // indigo-blue
  const RUNG = [0.62, 0.72, 0.98]; // pale blue-white
  for (let i = 0; i < n; i++) {
    const roll = Math.random();
    if (roll < 0.7) {
      // Backbone ribbon of one of the two strands.
      const strand = Math.random() < 0.5 ? 0 : 1;
      const t = Math.random();
      const y = (t - 0.5) * H;
      const ang = t * turns * TAU + strand * Math.PI;
      const x = Math.cos(ang) * r + gauss() * 0.045;
      const z = Math.sin(ang) * r + gauss() * 0.045;
      set(p, i, x, y + gauss() * 0.02, z);
      const b = 1.15 + 0.3 * Math.random();
      const col = strand === 0 ? STRAND0 : STRAND1;
      set(c, i, col[0] * b, col[1] * b, col[2] * b);
    } else {
      // Base-pair rung at one of NRUNGS evenly-spaced heights, spanning the
      // two strands (which sit PI apart at that height).
      const rk = (Math.random() * NRUNGS) | 0;
      const t = (rk + 0.5) / NRUNGS;
      const y = (t - 0.5) * H;
      const ang = t * turns * TAU;
      const x0 = Math.cos(ang) * r, z0 = Math.sin(ang) * r;
      const x1 = Math.cos(ang + Math.PI) * r, z1 = Math.sin(ang + Math.PI) * r;
      const s = Math.random();
      set(p, i, mix(x0, x1, s) + gauss() * 0.015, y + gauss() * 0.012, mix(z0, z1, s) + gauss() * 0.015);
      const b = 0.85 + 0.2 * Math.random();
      set(c, i, RUNG[0] * b, RUNG[1] * b, RUNG[2] * b);
    }
  }
}

// ---- F3 WAVE / TERRAIN -----------------------------------------------------
function fillWave(p: Float32Array, c: Float32Array, n: number) {
  for (let i = 0; i < n; i++) {
    const gx = -1.8 + Math.random() * 3.6;
    const gz = -0.7 + Math.random() * 2.6; // recedes away from camera
    const h =
      0.2 * Math.sin(gx * 2.1 + gz * 1.5) +
      0.11 * Math.sin(gx * 4.2 - gz * 1.1) +
      0.05 * noise3(gx, gz, 0);
    // Tilt the sheet back around X so it reads as a horizon seen from a low angle.
    const [x, y, z] = rot(gx, h, gz, -0.95, 0, 0);
    set(p, i, x, y - 0.15, z);
    const t = (gx + 1.8) / 3.6; // blue (left) -> red (right)
    const b = 1.05 + 0.2 * Math.random();
    set(c, i, mix(BLUE[0], ORANGE[0], t) * b, mix(BLUE[1], ORANGE[1], t) * b, mix(BLUE[2], ORANGE[2], t) * b);
  }
}

// ---- F4 BLACK HOLE / ECLIPSE ----------------------------------------------
const STAR_TINTS = [
  [0.9, 0.92, 1.0], // white-blue
  [0.55, 0.7, 1.0], // blue
  [1.0, 0.6, 0.85], // pink
  [1.0, 0.75, 0.5], // warm
  [0.6, 1.0, 0.85], // teal
];
function fillBlackHole(p: Float32Array, c: Float32Array, n: number) {
  const Rb = 0.78; // dark disc radius (kept empty)
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.42) {
      // Corona: violet-pink ring radiating outward from the disc edge.
      const a = Math.random() * TAU;
      const rr = Rb + Math.pow(Math.random(), 1.8) * 0.6;
      set(p, i, Math.cos(a) * rr, Math.sin(a) * rr, gauss() * 0.03);
      const fall = Math.max(0, 1 - (rr - Rb) / 0.6);
      const bright = 0.5 + 1.4 * fall;
      const t = Math.random();
      set(c, i, mix(1.0, 0.72, t) * bright, mix(0.42, 0.18, t) * bright, mix(0.85, 0.98, t) * bright);
    } else {
      // Dense multi-coloured starfield across the whole viewport, never inside disc.
      let sx = 0, sy = 0;
      for (let g = 0; g < 8; g++) {
        sx = (Math.random() * 2 - 1) * 2.7;
        sy = (Math.random() * 2 - 1) * 2.0;
        if (sx * sx + sy * sy > Rb * Rb * 1.08) break;
      }
      set(p, i, sx, sy, (Math.random() - 0.5) * 1.3);
      const tint = STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0];
      const s = 0.32 + Math.random() * 0.5;
      set(c, i, tint[0] * s, tint[1] * s, tint[2] * s);
    }
  }
}

export function buildFormations(count: number): FormationData {
  const pos = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  const col = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  fillRing(pos[0], col[0], count);
  fillGalaxy(pos[1], col[1], count);
  fillDNA(pos[2], col[2], count);
  fillWave(pos[3], col[3], count);
  fillBlackHole(pos[4], col[4], count);

  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    size[i] = Math.random() < 0.06 ? 1.5 + Math.random() * 1.1 : 0.7 + Math.random() * 0.8;
    seed[i] = Math.random();
  }
  return { count, pos, col, size, seed };
}
