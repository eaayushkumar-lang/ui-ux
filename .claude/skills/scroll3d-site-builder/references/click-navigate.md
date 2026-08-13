# Click-Navigate — hotspot camera-waypoint execution engine

## What this actually is (read first)
Same Three.js stack as the other real-time engines, but the driver is neither scroll
nor cursor position — it's discrete clicks. The section shows a 3D subject with 2-4
clickable hotspots; clicking one tweens the camera to that hotspot's waypoint (a named
position + look-at target) and swaps a caption. This suits "explore the product from a
few angles" moments — a showroom/product-tour feel — better than continuous scroll or
pointer motion does.

Stack: **HTML + CSS + JS + Three.js** (CDN, zero build step) + `choreography.js`.

## When this section is executing
This file covers building ONE section from the site plan produced by the planning
workflow in `SKILL.md`. It does not decide overall site structure or content depth. If
asked to build a click-navigate section directly, without a plan, ask for a
`content_brief`, `motion`, and `palette` for that section instead of inventing a full
multi-section site yourself.

## Deriving waypoints
Unlike `motion`, waypoints are NOT supplied by the plan — this technique derives 2-4 of
them itself from the section's `content_brief` when building. Each waypoint needs: a
short `label` (1-2 words, shown on its hotspot), a one-sentence caption (shown when
active), a camera position, and a look-at target. Pick waypoints that correspond to
genuinely distinct, defensible angles/features of the subject — don't invent generic
"Overview / Details / Features" labels that could apply to any product.

## Asset needs
No image/video generation needed — the subject is built procedurally, same approach as
3d-scene-effect's Step 2 (primitive geometries combined to suggest the product, favoring
simple iconic silhouettes over intricate detail).

## Prerequisites
No external API/credits needed — Three.js is CDN-loaded, geometry is built in code.

## THE PIPELINE — executes one plan section

### 1. Read the section spec
Take the section's `motion`, `content_brief`, and the site's `palette` from the plan.

### 2. Build the 3D subject and derive waypoints
- Model the subject procedurally (per "Deriving waypoints" above for how many/what).
- For each waypoint, define `camera: {x,y,z}` and `lookAt: {x,y,z}` values that
  frame a genuinely different, legible view of the subject — not near-identical angles.

### 3. Wire hotspots and the click-driven camera tween
- Render one `.hotspot` button per waypoint, positioned with fixed CSS coordinates
  (not true 3D screen-projection — simpler and stays correct across resizes).
- On click: tween `camera.position` and the look-at target from their current values
  to the clicked waypoint's values over ~500-700ms, using `window.Choreography.lerp`
  each `requestAnimationFrame` tick (don't snap instantly — the animated move is the
  point of this technique). Update the `.explore-caption` text to that waypoint's
  caption when the tween starts.
- Reduced motion: jump instantly to the clicked waypoint's camera/look-at values (no
  tween) — clicking still works and still updates the caption, just without animation.

### 4. Build this section from templates/
- **Project scaffold (once per site, whichever technique builds FIRST):** copy
  `templates/index.html`, `templates/base.css` (as the project's `styles.css`), and
  `templates/choreography.js` into the project.
- **This technique's own files (every time a click-navigate section is built):** copy
  `templates/click-navigate.js` into the project, and APPEND
  `templates/click-navigate.styles.css` (a fragment, not a full stylesheet) to the
  project's `styles.css`.
- If the project already has the scaffold, do not overwrite it — subsequent
  sections append into what is already there.
- Register this section in an `EXPLORE_SECTIONS` entry:
  `{ section:"#<section-id>", motion:"<motion>", palette:{...}, waypoints:[{id,label,caption,camera:{x,y,z},lookAt:{x,y,z}}, ...] }`.
- **Class contract** the engine depends on (rename these and it silently does nothing):
  - each section: a `<canvas>` inside `.sticky`, wrapped by an `.explore` section with
    the config's id
  - one `.hotspot` element per waypoint, each with `data-waypoint="<index>"`
  - `.explore-caption` — the text element the engine updates on click
- Write hotspot labels/captions from the derived waypoints — don't reuse generic
  placeholder text.
- If this is the first section being built for this project (nav bar doesn't exist yet
  in index.html), generate the `.hud-nav` links from the full site plan's `id`/
  `nav_label` pairs before proceeding to this section's own content.

### 5. Deploy
Once every section in the plan is built, see `SKILL.md`'s "Build & Deploy" section.

## Engine rules
- Cap pixel ratio via `window.Choreography.capDPR()`, same as the other engines.
- Section pins (`position:sticky`) for a shorter run (~150vh) than the scroll-driven
  engines — just enough that the sticky viewport holds still while the user clicks
  around, since scroll progress itself drives nothing here.
- Works identically on touch and desktop — click/tap is universal, so (unlike
  pointer-follow-effect) no pointer-capability gating is needed.
- Drive the camera tween from `requestAnimationFrame`, never recompute it directly
  inside the click handler — the handler just sets a new tween target/start-time.

## Known gotchas
- Don't position hotspots via true 3D-to-screen projection unless you actually need
  hotspots to track a moving subject — fixed CSS-positioned hotspots are simpler and
  don't drift or jump on resize, since the waypoints themselves are fixed framings.
- If a waypoint's `lookAt` is left at the scene origin for every waypoint, the camera
  moves but keeps framing the exact same point — vary `lookAt` per waypoint too, not
  just `camera` position, or the tour feels flat.
- Same headless-screenshot limitation as the other engines: verify live in a real
  browser — click each hotspot and confirm the camera actually moves and the caption
  updates, since headless tools often can't drive `click` + rAF-tweened state reliably.

## Files
- `templates/click-navigate.js` — Three.js scene + hotspot click-to-waypoint driver.
- `templates/click-navigate.styles.css` — `.explore` CSS fragment, appended to the project's `styles.css`.
- Project shell (`index.html`, `base.css`, `choreography.js`) is shared across techniques.
