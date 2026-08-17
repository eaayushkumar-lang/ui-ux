# particle-demo-2

A second standalone technical-verification build for a particle-morphing WebGL
effect — **isolated** from `particle-demo/`, `novaai/`, and `auxai-site/`. This
one has **five formations** and full-height **scroll-triggered sections** (not
just a hero).

## Run

```bash
cd particle-demo-2
npm install
npm run dev        # Vite dev server (default http://localhost:5173/)
```

Other scripts: `npm run typecheck`, `npm run build`, `npm run preview`.

## Formations (scroll order)

1. **Ring** — thin glowing ring outline, blue (bottom-left) → red/orange (top-right).
2. **Galaxy / orbit** — two tilted intersecting orbit rings around a hot white→orange core + starfield.
3. **DNA helix** — vertical double helix (glowing blue), slowly rotating, with a frosted-glass "68% average efficiency gain" stat card overlaid.
4. **Wave / terrain** — low-angle wavy horizon, blue→red sweeping left to right.
5. **Black hole / eclipse** — an empty dark disc ringed by a violet-pink corona, over a dense multi-colour starfield (finale).

All five are generated once on the CPU (`src/particles/formations.ts`) with the
**same particle count**, and morph entirely on the GPU: `src/particles/scene.ts`
uploads five per-particle target positions/colors and interpolates the current
segment (`floor(uMorph)` → next) by a single `uMorph` uniform (0..4), eased and
staggered per particle.

## Scroll sections & pacing

The page is a long **1200vh** runway. Scroll progress maps to `morph` through
`src/particles/scroll-map.ts`, which gives every formation a wide **hold
plateau** (morph pinned at an integer — the formation sits perfectly still and
readable) followed by a shorter **transition** band that morphs to the next.
Each formation therefore holds steady for roughly 1.5 viewports of scrolling
before it begins to change, so nothing races past at a small scroll. Section
content (pill tag, headline, subtext, buttons, and the DNA glass card)
crossfades in sync via imperative opacity writes, and a right-edge dot nav jumps
to the center of any formation's hold band.

## Interactivity & quality

- **Pointer** pushes nearby particles away from the cursor and adds a subtle
  parallax rotation. The DNA formation adds a slow self-rotation.
- **Adaptive quality** (`src/particles/capability.ts`): 95k points on high-tier,
  42k on low-tier, chosen from `hardwareConcurrency` / `deviceMemory`. Override
  with `window.__forceLowEnd = true`.

## Test hooks

- `window.__setMorph(t, immediate?)` — force a formation (0..4); `immediate`
  snaps without the lerp (for stable screenshots).
- `window.__scene` — the live `ParticleScene`; `.getStats()` returns count /
  frame ms / cold start / fps / morph.
