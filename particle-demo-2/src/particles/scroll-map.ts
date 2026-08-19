// Scroll -> morph mapping with HOLD plateaus.
//
// Instead of a straight linear progress*4, each formation gets a wide "hold"
// band where morph stays pinned at an integer (the formation sits perfectly
// still and readable) followed by a shorter "transition" band that morphs to
// the next formation. Combined with a long runway, this gives every formation
// a comfortable stretch of scrolling before it starts changing.

export const N = 5;
// Wide holds + a long runway so even large discrete mouse-wheel jumps
// (100-150px per event) land well inside a plateau rather than skipping past a
// whole formation. Each hold spans ~2.2 viewports of scroll; transitions ~1.
export const HOLD_W = 2.2; // relative width of each "hold steady" band
export const TRANS_W = 1.0; // relative width of each morph transition
export const RUNWAY_VH = 1700; // total scroll runway

type Seg = { w: number; hold?: number; from?: number };

const SEGS: Seg[] = (() => {
  const s: Seg[] = [];
  for (let k = 0; k < N; k++) {
    s.push({ w: HOLD_W, hold: k });
    if (k < N - 1) s.push({ w: TRANS_W, from: k });
  }
  return s;
})();

const TOTAL = SEGS.reduce((acc, s) => acc + s.w, 0);

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** progress p in [0,1] -> morph in [0, N-1], with plateaus at each integer. */
export function progressToMorph(p: number): number {
  let x = Math.min(1, Math.max(0, p)) * TOTAL;
  for (const s of SEGS) {
    if (x <= s.w) {
      if (s.hold !== undefined) return s.hold;
      const t = s.w > 0 ? x / s.w : 0;
      return (s.from as number) + smooth(t);
    }
    x -= s.w;
  }
  return N - 1;
}

/** Scroll progress at the CENTER of formation k's hold band (for dot nav). */
export function holdCenterProgress(k: number): number {
  let acc = 0;
  for (const s of SEGS) {
    if (s.hold === k) return (acc + s.w / 2) / TOTAL;
    acc += s.w;
  }
  return 0;
}
