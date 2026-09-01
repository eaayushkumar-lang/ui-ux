# Physics-Play — cannon-es drag-and-throw execution engine

## What this actually is (read first)
Three.js for rendering, **cannon-es** for simulation: a handful of rigid-body objects
rest on an invisible floor plane, and the user can grab one with the mouse/finger, drag
it around, and let go to throw it — gravity, collisions, and friction all come from a
real physics step, not scripted animation. This is the most interactive of the
techniques and the most expensive to run — one per site is enough.

Stack: **HTML + CSS + JS + Three.js + cannon-es** (both CDN-loaded) + `choreography.js`.

## When this section is executing
This file covers building ONE section from the site plan produced by the planning
workflow in `SKILL.md`. It does not decide overall site structure or content depth. If
asked to build a physics-play section directly, without a plan, ask for a
`content_brief` and `palette` for that section instead of inventing a full
multi-section site yourself.

## Asset needs
No image/video generation needed — objects are simple procedural shapes (boxes/spheres)
styled from the site's palette.

## Prerequisites
No external API/credits needed — Three.js and cannon-es are both CDN-loaded.

## THE CANNON-ES LOADING GOTCHA (read before writing any HTML)
cannon-es ships ES-module-only — it can't be loaded with a plain `<script src="...">`
the way Three.js and Lenis are. Load it as a module script that republishes it onto
`window`:
```html
<script type="module">
  import * as CANNON from "https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js";
  window.CANNON = CANNON;
  window.dispatchEvent(new Event("cannon-ready"));
</script>
```
Module scripts execute *after* classic scripts and don't block `DOMContentLoaded` the
same way — `physics-play.js` must NOT assume `window.CANNON` exists the instant
`DOMContentLoaded` fires. Guard init: if `window.CANNON` is already set, proceed
immediately; otherwise wait for the one-time `cannon-ready` event before initializing
any `PHYSICS_SECTIONS` entry. Getting this ordering wrong is the single most likely bug
in this technique — a silently-undefined `CANNON` reference throws and the whole section
never renders.

## THE PIPELINE — executes one plan section

### 1. Read the section spec
Take the section's `content_brief` and the site's `palette` from the plan. Default
`objectCount` to 6 if the plan doesn't specify one.

### 2. Build the scene: floor + draggable bodies
- Static floor: a cannon-es `Body` with a `Plane` shape (mass `0`, so it never moves)
  plus a matching large Three.js plane mesh (for a subtle shadow/ground read — doesn't
  need to be visible itself, a soft gradient or grid material works).
- `objectCount` draggable bodies: mix of cannon-es `Box`/`Sphere` shapes with a real
  mass (so they respond to gravity), each paired with a matching Three.js mesh styled
  from `palette.accent`. Spawn them scattered above the floor so they drop and settle
  into a resting pile once physics starts stepping.

### 3. Wire drag-to-throw
- `pointerdown` on the canvas → `THREE.Raycaster` from the pointer through the camera
  → find the nearest intersected object's mesh → mark its body as "held": zero its
  velocity and directly set its position from the pointer ray intersected against an
  invisible plane facing the camera at the object's depth, every frame while held.
- Track recent pointer movement (position deltas over the last few frames) while
  dragging.
- `pointerup` → release the body: set its velocity from the tracked recent movement
  (scaled to read as a believable throw) instead of leaving it at zero, then let the
  physics step take over normally (gravity, collision with the floor and other
  objects).

### 4. Only simulate while visible
Step the cannon-es `world` and render only while the section is in viewport
(`window.Choreography.isInViewport`) — skip both when scrolled far off-screen, to avoid
burning CPU on a section nobody's looking at.

### 5. Reduced motion
Freeze all objects at their initial resting arrangement (spawn them already settled on
the floor rather than dropping them in) and never call `world.step()` — dragging is
disabled in this mode, matching the static-fallback principle every other engine uses.
Render one frame and stop.

### 6. Build this section from templates/
- **Project scaffold (once per site, whichever technique builds FIRST):** copy
  `templates/index.html`, `templates/base.css` (as the project's `styles.css`), and
  `templates/choreography.js` into the project.
- **This technique's own files (every time a physics-play section is built):** copy
  `templates/physics-play.js` into the project, and APPEND
  `templates/physics-play.styles.css` (a fragment, not a full stylesheet) to the
  project's `styles.css`.
- If the project already has the scaffold, do not overwrite it — subsequent
  sections append into what is already there.
- The shared shell already carries the cannon-es module script from the loading
  gotcha above, positioned after the Three.js CDN script — confirm it survived
  rather than re-adding it.
- Register this section in a `PHYSICS_SECTIONS` entry:
  `{ section:"#<section-id>", palette:{...}, objectCount:6 }`.
- **Class contract** the engine depends on (rename these and it silently does nothing):
  - each section: a `<canvas>` inside `.sticky`, wrapped by a `.physics` section with
    the config's id
  - `.physics-hint` — optional, a small "drag the objects" affordance
- Write this section's overlay copy (if any) from its `content_brief`.
- If this is the first section being built for this project (nav bar doesn't exist yet
  in index.html), generate the `.hud-nav` links from the full site plan's `id`/
  `nav_label` pairs before proceeding to this section's own content.

### 7. Deploy
Once every section in the plan is built, see `SKILL.md`'s "Build & Deploy" section.

## Engine rules
- Cap pixel ratio via `window.Choreography.capDPR()`, same as the other engines.
- Keep `objectCount` modest (6-10) — more bodies means more collision pairs to resolve
  each step, and this is already the heaviest technique.
- Step the physics world with a fixed timestep (`world.step(1/60, deltaTime, 3)`
  pattern) rather than a variable one, so behavior stays consistent across frame rates.
- Dispose of geometries/materials on section teardown if the page has many sections.

## Known gotchas
- The cannon-es loading-order issue above is the main one — test that a physics-play
  section actually renders on a hard page reload (not just a hot-reload where CANNON
  was already cached in memory from a previous load).
- Recommend at most one physics-play section per site — combining it with multiple
  other WebGL-heavy sections (3d-scene-effect, pointer-follow-effect, click-navigate) on the
  same page risks a sluggish scroll experience on mid-range devices.
- Same headless-screenshot limitation as the other engines: verify live in a real
  browser with actual mouse drag-and-release, not just via automated screenshot tools.
- If dragged objects can be thrown off-screen permanently, consider invisible walls
  (additional static cannon-es `Plane` bodies) bounding the play area so a stray throw
  doesn't lose an object off the edge of the scene forever.

## Files
- `templates/physics-play.js` — Three.js + cannon-es scene, drag-to-throw driver.
- `templates/physics-play.styles.css` — `.physics` CSS fragment, appended to the project's `styles.css`.
- Project shell (`index.html`, `base.css`, `choreography.js`) is shared across techniques.
