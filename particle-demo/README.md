# particle-demo

A standalone technical-verification build for a scroll/toggle-driven,
particle-morphing WebGL hero effect. **Isolated** from `novaai/` and
`auxai-site/` — nothing here is wired into those projects; this exists purely to
confirm the effect works before deciding whether to integrate it.

## Run

```bash
cd particle-demo
npm install
npm run dev        # Vite dev server (default http://localhost:5173/)
```

Other scripts: `npm run typecheck`, `npm run build`, `npm run preview`.

## The effect

A full-viewport point cloud (~90k points, 36k on low-end) that morphs between
three formations:

1. **Torus** — noisy teal→violet donut with a hollow center.
2. **Spiral galaxy** — violet/white core, three teal spiral arms, a star field.
3. **Brain** — side-profile silhouette with a bright violet-white brainstem point.

All three formations are generated once on the CPU (`src/particles/formations.ts`)
with the **same particle count**, so particle `i` occupies a matching slot in
each. The morph itself runs entirely on the GPU: `src/particles/scene.ts` uploads
the three target positions/colors as per-particle attributes and interpolates
them in the vertex shader by a single `uMorph` uniform (0=torus, 1=galaxy,
2=brain), with per-particle stagger and an eased curve for a smooth,
non-instant transition.

## Interactivity

- **Scroll** drives the formation: page progress 0→1 maps to `uMorph` 0→2 (the
  page has a 300vh runway). The value lerps toward its target for smoothness.
- **Pointer** pushes nearby particles away from the cursor (shader-side
  falloff) and adds a subtle parallax rotation to the whole cloud.
- **Formation toggle** (bottom-right) scrolls to the matching third.

## Adaptive quality

`src/particles/capability.ts` picks the particle budget + pixel ratio from
`navigator.hardwareConcurrency` / `deviceMemory`. The goal is to hold 60fps by
scaling visual **density** down, never the frame rate.

- High tier: 90,000 points, pixelRatio ≤ 2.
- Low tier: 36,000 points, pixelRatio 1.

Override for deterministic testing (same pattern as the earlier scroll-video
low-end check):

```js
window.__forceLowEnd = true;  // set before load
```

## Live stats

The readout at the bottom shows **real** values from the render loop — particle
count, frame budget (ms, EMA), cold-start time (s), current FPS, and the active
tier. Not placeholders.

## Test hooks

- `window.__setMorph(t, immediate?)` — force a formation (0..2); `immediate`
  snaps without the lerp (used for stable screenshots).
- `window.__scene` — the live `ParticleScene`; `window.__scene.getStats()`
  returns the current stats object.
