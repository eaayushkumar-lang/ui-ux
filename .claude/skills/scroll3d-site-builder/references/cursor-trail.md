# Cursor-Trail — canvas-2D particle-trail execution engine

## What this actually is (read first)
A lightweight canvas-2D particle system (no WebGL/Three.js needed — this is decorative
motion, not geometry) where particles spawn at the cursor position and drift/fade,
leaving a trail as the visitor moves their mouse. Scroll still pins the section and
drives the `.reveal-line` overlay copy exactly like video-scroll-effect/3d-scene-effect;
cursor position only drives the particle layer. Best for atmospheric/mood sections
(brand moments, section transitions) rather than sections that need to communicate
product specifics.

Stack: **HTML + CSS + JS (canvas 2D)** + `choreography.js`. No Three.js needed.

## When this section is executing
This file covers building ONE section from the site plan produced by the planning
workflow in `SKILL.md`. It does not decide overall site structure or content depth. If
asked to build a cursor-trail section directly, without a plan, ask for a
`content_brief` and `palette` for that section instead of inventing a full
multi-section site yourself.

## Asset needs
None — this is a pure particle effect, no image/video generation involved.

## Prerequisites
No external API/credits needed, no external CDN dependency beyond `choreography.js`.

## THE PIPELINE — executes one plan section

### 1. Read the section spec
Take the `content_brief` and the site's `palette` from the plan. Write this section's
overlay copy from `content_brief` — don't reuse generic placeholder text.

### 2. Build a fixed-size particle pool
Pre-allocate `particleCount` (default 150) particle objects up front in a plain array —
`{ x, y, vx, vy, life, maxLife }` — and never grow that array at runtime. This is the
one hard rule of this engine: don't `push`/`splice` particle objects inside the render
loop, or per-frame garbage collection stutters the whole page. Cycle through the pool
round-robin (or respawn the oldest-dead one) each time a new particle needs to spawn.

### 3. Wire cursor-driven spawning + ambient fallback
- On `pointermove` within the section (gated behind
  `matchMedia("(hover: hover) and (pointer: fine)")`, same as pointer-follow-effect):
  respawn 1-3 pool particles per event at the cursor position with a small randomized
  velocity, reusing `window.Choreography.normalizedPointer` to get the position.
- No fine pointer, or `prefers-reduced-motion` set: don't wire the listener at all —
  instead spawn/drift particles ambiently (gentle randomized motion, no cursor
  dependency) so touch-device and reduced-motion visitors still see a populated,
  alive-looking canvas rather than an empty one.
- Every frame: advance each live particle's position/opacity by its age, draw it, and
  let it "die" (become eligible for respawn) once its `life` exceeds `maxLife`.

### 4. Build this section from templates/
- **Project scaffold (once per site, whichever technique builds FIRST):** copy
  `templates/index.html`, `templates/base.css` (as the project's `styles.css`), and
  `templates/choreography.js` into the project.
- **This technique's own files (every time a cursor-trail section is built):** copy
  `templates/cursor-trail.js` into the project, and APPEND
  `templates/cursor-trail.styles.css` (a fragment, not a full stylesheet) to the
  project's `styles.css`.
- If the project already has the scaffold, do not overwrite it — subsequent
  sections append into what is already there.
- Register this section in a `TRAIL_SECTIONS` entry:
  `{ section:"#<section-id>", palette:{...}, particleCount:150 }`.
- **Class contract** the engine depends on (rename these and it silently does nothing):
  - each section: a `<canvas>` inside `.sticky`, wrapped by a `.trail` section with the
    config's id
  - `.reveal-line` + `data-in`/`data-out` — same scroll-driven overlay-copy contract as
    video-scroll-effect/3d-scene-effect
- If this is the first section being built for this project (nav bar doesn't exist yet
  in index.html), generate the `.hud-nav` links from the full site plan's `id`/
  `nav_label` pairs before proceeding to this section's own content.

### 5. Deploy
Once every section in the plan is built, see `SKILL.md`'s "Build & Deploy" section.

## Engine rules
- Cap pixel ratio via `window.Choreography.capDPR()`, same as the other engines.
- Scroll-driven overlay update (`.reveal-line` opacity) hooks into an existing
  `window.__lenis` instance if present, else falls back to its own rAF loop against
  native scroll — same coexistence pattern as 3d-scene-effect/pointer-follow-effect.
- Particle rendering runs on its own rAF loop independent of scroll, gated only by
  `Choreography.isInViewport` so it doesn't burn CPU off-screen.

## Known gotchas
- The fixed-size pool is the main trap — if particle objects are created inside the
  per-frame draw function instead of pre-allocated once, this looks fine at first and
  then stutters increasingly as the browser's GC struggles to keep up.
- Keep `particleCount` modest (100-200) — a canvas-2D particle system with thousands of
  live particles is still real per-frame draw-call cost.
- Same headless-screenshot limitation as the other engines: verify live in a real
  browser with actual cursor movement, not just via automated screenshot tools.

## Files
- `templates/cursor-trail.js` — canvas-2D particle pool + scroll-driven overlay.
- `templates/cursor-trail.styles.css` — `.trail` CSS fragment, appended to the project's `styles.css`.
- Project shell (`index.html`, `base.css`, `choreography.js`) is shared across techniques.
