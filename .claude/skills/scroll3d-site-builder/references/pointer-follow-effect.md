# Pointer-Follow-Effect — cursor-driven WebGL execution engine

## What this actually is (read first)
Same rendering stack as 3d-scene-effect (real Three.js geometry/materials/lighting,
zero build step, CDN-loaded), but a different driver: instead of the CAMERA
responding to scroll position, it responds to CURSOR position. Move the mouse
over the pinned section and the 3D scene tilts/shifts toward it — classic
"hero card that leans toward your cursor," but with real 3D depth instead of a
CSS tilt hack. Scroll is still meaningful here: it pins the section
(`position:sticky`) for the duration a visitor dwells on it and drives the
existing `.reveal-line` overlay copy the same way every other technique does —
scroll just doesn't touch the 3D scene itself in this technique.

Stack: **HTML + CSS + JS + Three.js** (CDN, zero build step) + `choreography.js`.

## When this section is executing
This file covers building ONE section from the site plan produced by the planning
workflow in `SKILL.md`. It does not decide overall site structure or content depth.
If asked to build a pointer-follow-effect section directly, without a plan, ask for a
`content_brief`, `motion`, and `palette` for that section instead of inventing a full
multi-section site yourself.

## When to use this technique
Pointer-follow-effect suits hero/showcase sections where the interaction is a
delight-add for desktop visitors, not sections whose content must land
equally well on mobile — touch/no-hover devices get a frozen centered pose
(see below), so don't route a section here if its content depends on the
parallax motion actually happening. If a section needs to read the same on
mobile and desktop, prefer 3d-scene-effect or video-scroll-effect instead, or pair
this technique with a non-motion-dependent copy treatment.

## Asset needs
Same as 3d-scene-effect's `image-plane` mode: at most one still image, no video
generation needed. See `references/asset-generator.md` for an image only (skip its
video-generation step) — or build purely procedural geometry (per Step 2 below) if no
image is supplied and the subject suits an abstract/iconic treatment instead.

## Prerequisites
No external API/credits needed for procedural geometry — Three.js is CDN-loaded. If a
photo is used, asset generation supplies it (image only, no Higgsfield video credits spent).

## THE PIPELINE — executes one plan section

### 1. Read the section spec
Take the section's `motion`, `content_brief`, and the site's `palette` from the
plan.

### 2. Build the 3D subject
- If the section has a supplied/generated photo: texture-map it onto a
  `THREE.PlaneGeometry` (mirrors 3d-scene-effect's `image-plane` mode) — real
  camera movement around a textured plane still reads as genuinely 3D.
- Otherwise: model the subject procedurally from primitive geometries, same
  approach as 3d-scene-effect's Step 2 — favor simple, iconic silhouettes and a
  key + rim + fill lighting setup over intricate detail.

### 3. Drive the scene from POINTER position, not scroll
- On `pointermove` within the section, compute
  `window.Choreography.normalizedPointer(event, section)` → `{x, y}` in
  `[-1, 1]`.
- Each animation frame, lerp the camera's position/rotation toward a target
  derived from the latest pointer sample using `window.Choreography.lerp` —
  don't snap directly to the raw pointer value, or the motion reads jittery.
  A damping factor around 0.06–0.10 per frame reads as smooth without feeling
  laggy.
- Scroll progress (`window.Choreography.progress`) still drives the
  `.reveal-line` overlay opacity/translate exactly like the other techniques —
  compute it the same way, apply it to the overlay only, never to the camera.

### 4. Gate pointer interaction behind capability detection
- Before wiring up `pointermove`, check
  `window.matchMedia("(hover: hover) and (pointer: fine)").matches`. If false
  (touch device, or user has no fine pointer), freeze the scene at a default
  centered pose and skip the listener entirely — same principle as the
  reduced-motion freeze pattern video-scroll-effect/3d-scene-effect already use.
- Also freeze at a default pose if `window.Choreography.prefersReducedMotion()`
  is true, same as the other two engines.

### 5. Build this section from templates/
- **Project scaffold (once per site, whichever technique builds FIRST):** copy
  `templates/index.html`, `templates/base.css` (as the project's `styles.css`), and
  `templates/choreography.js` into the project.
- **This technique's own files (every time a pointer-follow-effect section is built):**
  copy `templates/pointer-follow-effect.js` into the project, and APPEND
  `templates/pointer-follow-effect.styles.css` (a fragment, not a full stylesheet) to
  the project's `styles.css`.
- If the project already has the scaffold, do not overwrite it — subsequent
  sections append into what is already there.
- Register this section in a `PARALLAX_SECTIONS` entry:
  `{ section:"#<section-id>", motion:"<motion>", palette:{...} }` — same shape
  as `WORLD_SECTIONS`.
- **Class contract** the engine depends on (rename these and it silently does
  nothing):
  - each parallax section: a `<canvas>` inside `.sticky`, wrapped by a
    `.parallax` section with the config's id
  - `.reveal-line` + `data-in`/`data-out` — same overlay-copy contract as the
    other two techniques, driven by scroll here (not pointer)
  - `.parallax-hint` — optional, a small "move your cursor" affordance shown
    only when `(hover: hover) and (pointer: fine)` matches
- Write this section's copy from its `content_brief`.
- If this is the first section being built for this project (nav bar doesn't
  exist yet in index.html), generate the `.hud-nav` links from the full site
  plan's `id`/`nav_label` pairs before proceeding to this section's own content.

### 6. Deploy
Once every section in the plan is built, see `SKILL.md`'s "Build & Deploy" section.

## Engine rules
- Cap pixel ratio via `window.Choreography.capDPR()`, same as the other engines.
- Dispose of geometries/materials/textures on section teardown if the page has
  many sections — don't leak WebGL contexts.
- Drive both the pointer-lerp and any per-frame render work from
  `requestAnimationFrame` — never recompute scene state directly inside a raw
  `pointermove` handler (sample the latest pointer position there, apply it in
  the rAF loop).
- If a Lenis instance already exists on the page (`window.__lenis`), hook the
  scroll-driven overlay update into it like 3d-scene-effect does; otherwise fall
  back to an independent rAF loop. The pointer-driven camera update runs on
  its own rAF loop regardless, since it isn't scroll-gated.

## Known gotchas
- Don't wire `pointermove` unconditionally — always gate behind
  `(hover: hover) and (pointer: fine)` first, or touch devices get a listener
  that never fires anything useful and a scene stuck at whatever pose it
  happened to render last.
- Lerping too aggressively (damping factor too high) makes the parallax feel
  laggy; too low makes it feel jittery/snappy. Start around 0.08 and adjust
  by feel.
- Same headless-screenshot limitation as video-scroll-effect/3d-scene-effect: verify
  live in a real browser with actual mouse movement, not just via automated
  screenshot tools — WebGL canvases and pointer events often don't behave
  correctly in headless contexts.
- The frozen fallback pose (no hover, or reduced motion) must still render
  something meaningful on canvas — never leave it blank. Apply a fixed
  `applyPointer({x: 0, y: 0})` call once and render, same as 3d-scene-effect's
  `applyProgress(0.15)` static-pose pattern.

## Files
- `templates/pointer-follow-effect.js` — Three.js scene + pointer driver + scroll-driven overlay.
- `templates/pointer-follow-effect.styles.css` — `.parallax` CSS fragment, appended to the project's `styles.css`.
- Project shell (`index.html`, `base.css`, `choreography.js`) is shared across techniques.
