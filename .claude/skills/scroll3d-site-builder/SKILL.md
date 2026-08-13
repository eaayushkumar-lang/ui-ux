---
name: scroll3d-site-builder
description: Plans AND builds a full scroll-driven 3D website from a one-line brief, or a reference site to clone the structure of — deciding section structure and content depth, then executing every section (frame-scrub video, real-time Three.js, pointer/click-driven, physics, editorial hybrid, or cursor-trail) and deploying to a live URL. Use this whenever the user asks for a "3D website," "scroll-driven site," "immersive/cinematic landing page," a site that "feels like [some flashy product site]," or wants any single one of these effects by name: frame-scrub/video-scroll, real-time WebGL/Three.js scroll scene, cursor/pointer-driven parallax, click-to-navigate hotspots/camera waypoints, drag-and-throw physics objects, an inline rotating 3D object in an editorial layout, or a cursor particle trail. Also trigger for "clone the structure of this site but for my product" style requests. This is the single entry point — do not look for a separate planning skill or a separate skill per effect, they're all covered here.
---

# Scroll3D Site Builder — plan, build, and deploy a scroll-driven 3D website

## What this does, end to end
Two phases, always in this order: **plan** the site (this file), then **execute**
each section (the `references/<technique>.md` file matching that section's chosen
technique), then **deploy** once (back in this file, "Build & Deploy" below). Nothing
here requires a separate skill — the seven rendering techniques, the shared project
scaffold, asset generation, and the scroll3d-specific style decisions all live in
`references/` as detail you consult while executing a plan this file produced, not as
things you invoke separately.

## What this does — planning
Two very different jobs live here, chosen by whether the user supplied a reference site:

**No reference given → reason from the product.** Don't default to a fixed template.
Figure out what THIS specific product actually needs to sell itself, and let that
determine section count, content depth, and 3D treatment — not a lookup table.

**Reference given → clone structure, not content.** Fetch the reference site, extract
its section structure, positioning, and visual/motion language. Reuse all of that.
Generate fresh content and copy for the new product — never reuse the reference's
actual text or pixel-perfect specifics.

## Step 0 — Intake (one batched turn, before anything else)
Before planning, ask for whatever the user's original brief didn't already answer —
batched into ONE turn, not asked one at a time:
1. **Site type/purpose**: informational | marketing/commercial | ecommerce/product-sales
   | portfolio | event/launch | other (free text).
2. **Product/theme**, if not already clear from the brief.
3. **Any must-have pages/sections** (optional — you still reason about what's
   needed beyond whatever the user lists here; this is a floor, not a ceiling).
4. **Reference URL**, if any — this absorbs what used to be a separate check
   into the same batch, since we're already asking multiple things up front.
Skip any question the brief already answered plainly — don't re-ask what's already
known. If the `AskUserQuestion` tool is available, use it to present these as
structured choices; otherwise ask as a short numbered list in one chat message. This
is the only intake stop — once answered, move straight to planning (Step 2a/2b)
without further back-and-forth until the Step 2c review.

## Step 1 — Route by reference URL
- If Step 0 surfaced a URL to reference/clone: go to "Reference-site mode."
- If not: go to "Creative mode."

## Step 2a — Creative mode (no reference)
Reason about the specific product, not its category alone — informed by Step 0's
answers (site type, product/theme, any must-have pages):
- What does someone actually need to know before buying/using THIS thing?
  A car needs specs, trims, maybe safety ratings. A single-origin coffee needs
  origin story, roast profile, maybe brewing guidance. A dev tool needs feature
  breakdown, maybe a pricing tier comparison. Let the answer drive section count —
  don't force every site into the same number of sections.
- Let the site TYPE from Step 0 shape structure, not just content: an ecommerce site
  needs product/pricing sections and a clear path to purchase; a portfolio needs a
  work-index and contact; an informational site can lean more editorial
  (`hybrid-2d3d`-heavy) and less spectacle-heavy; a marketing/launch site earns the
  most full-bleed cinematic/world real estate.
- Fold in any must-have pages from Step 0 as required sections, then add whatever else
  the product itself needs beyond that floor.
- Pick 3D treatment(s) freely among the *implemented* techniques (see "Available
  techniques" below) — not from a rigid one-technique-per-site rule. Different
  sections of the same site can and should use different treatments (e.g.
  photorealistic frame-scrub hero + procedural 3d-scene-effect feature section +
  a pointer-follow-effect showcase section) so similar briefs don't all produce the
  same skeleton.
- Avoid repeating the same structure/treatment choice on every run for similar
  briefs — vary defensible details so two similar briefs don't produce identical
  skeletons.
- Output a site plan (see "Site plan format" below).

## Step 2b — Reference-site mode
- Fetch the reference URL with `web_fetch`.
- Extract from the returned content: section types and their order, layout/
  positioning patterns, color palette (from inline styles/CSS if visible), any
  detectable motion/scroll effects, and general content tone — but not the
  actual copy/text itself.
- If `web_fetch` fails or returns unusable content (e.g. JS-rendered site with
  no meaningful HTML): tell the user plainly, ask whether to retry with a
  different URL or proceed in creative mode instead. Never silently fall back.
- Map the reference's effects to available techniques (video-scroll-effect for
  frame-scrub video, 3d-scene-effect for scroll-driven procedural 3D, pointer-follow-effect
  for cursor-reactive hero/showcase moments, click-navigate for a hotspot/product-tour
  feel, physics-play for a playful draggable-objects moment, hybrid-2d3d for an
  editorial/content-dense section, cursor-trail for an atmospheric/brand moment) —
  approximate, don't require an exact technical match to whatever the reference
  actually uses.
- Output a site plan using the reference's structure/style, with content
  generated fresh for the new product.

## Available techniques
The `technique` field is a list, not a fixed set. Currently implemented — read the
matching `references/<name>.md` file only once a section actually needs building with
that technique, not upfront for every technique in the plan:

| technique | file | best for |
|---|---|---|
| `video-scroll-effect` | `references/video-scroll-effect.md` | Photorealistic/cinematic subjects where real generated footage sells it. Canvas frame-scrub, driven by scroll progress. Supports a single `motion` or a multi-`beats` chaptered scrub within one section. |
| `3d-scene-effect` | `references/3d-scene-effect.md` | Procedural/abstract subjects, or a zero-cost fallback when only a static image is available (`motion: "image-plane"`). Real-time Three.js, camera/geometry driven by scroll. |
| `pointer-follow-effect` | `references/pointer-follow-effect.md` | Hero/showcase sections where desktop delight is a bonus. Real-time Three.js driven by CURSOR position — touch devices get a static fallback pose, so don't route mobile-essential content here exclusively. |
| `click-navigate` | `references/click-navigate.md` | A "tour a few angles/features" moment (showroom feel). Clickable hotspots tween the camera to named waypoints; works identically on touch and desktop. |
| `physics-play` | `references/physics-play.md` | A single playful "try it" moment. Three.js + cannon-es rigid-body objects the visitor can drag and throw. The most interactive technique and the heaviest to render — use at most one per site. |
| `hybrid-2d3d` | `references/hybrid-2d3d.md` | Content-dense sections, or breaking up a site that would otherwise be wall-to-wall full-bleed sections. Flat editorial layout (real headline/paragraph/stats, NOT pinned) with a smaller inline auto-rotating 3D object. |
| `cursor-trail` | `references/cursor-trail.md` | Atmospheric/brand-mood sections, section transitions. Canvas-2D particle trail following the cursor; content shouldn't depend on the trail itself since it degrades to ambient drift on touch/reduced-motion. |

Supporting references, consulted while executing the above rather than chosen as a
section's `technique`:
- `references/asset-generator.md` — generates/ingests the source image or video a
  section needs, before video-scroll-effect/3d-scene-effect/pointer-follow-effect build with it.
- `references/shared-scroll-engine.md` — the shared project scaffold (`index.html`,
  `base.css`, `choreography.js` in `templates/`) every technique builds on top of.
- `references/scroll-style-helper.md` — four scroll3d-specific design decisions
  (accent-color sampling from generated footage, overlay text density, contrast
  against unpredictable frame content, reveal-line overlap) — only relevant if no
  general design-taste skill is also available to own these calls instead.

Only pick a section's `technique` from the table above — see "Known gotchas" below
for what to do if none fit.

## Site plan format
- `sections` length and `type` values are NOT fixed — decide per Step 2a/2b.
- Each section's `technique` decides which reference file to read when building it —
  one of the "Available techniques" above.

```
{
"brand": "...",
"palette": { "accent": "#...", "bg": "#...", ... },
"sections": [
{ "type": "hero", "id": "hero", "nav_label": "Home", "technique": "video-scroll-effect", "motion": "orbit", "content_brief": "..." },
{ "type": "specs", "id": "specs", "nav_label": "Specs", "technique": "3d-scene-effect", "motion": "procedural-morph", "content_brief": "..." },
{ "type": "showcase", "id": "showcase", "nav_label": "Explore", "technique": "pointer-follow-effect", "motion": "orbit", "content_brief": "..." },
{ "type": "story", "id": "story", "nav_label": "Story", "technique": "hybrid-2d3d", "motion": "abstract", "content_brief": "..." },
...
]
}
```

- Every section MUST have a stable `id` (kebab-case, used as the `<section id="...">`
  attribute) and a short `nav_label` (1-2 words, what a visitor would click to jump
  there — e.g. "Movement", "Durability", not the internal `type` value verbatim).
  The nav bar is built directly from this list — don't add a section without a
  nav_label, and don't invent nav items that don't correspond to a real section.
- Each section MAY carry a `user_asset` field (a path/reference the user supplied
  during the Step 2c review below) — when present, the asset step
  (`references/asset-generator.md`) prefers it explicitly over generating anything
  new for that section.

## Known gotchas
- A "creative" plan still needs to be buildable — don't invent a 3D technique that
  isn't in "Available techniques" above.
- web_fetch may return raw HTML for server-rendered sites but little/nothing useful
  for heavily JS-rendered ones — treat sparse results as a signal to ask the user
  rather than inventing structure from a near-empty fetch.

## Step 2c — Plan review (one combined checkpoint, before any building)
Once Step 2a/2b produce a candidate plan, present it for review BEFORE any
generation/build work starts — this is the only interactive stop between intake and a
finished, deployed site. Show, in one message:
- **Palette** — swatches as hex + a short note on where each is used (accent,
  background, etc.).
- **Page/section list** — nav label, technique, one-line description of what each
  section contains, in order.
- **Per-section asset plan** — which sections will get Higgsfield-generated visuals
  vs. which the user could supply their own image/video for instead. Ask once, here —
  never per-section during the build itself. Anything the user offers becomes that
  section's `user_asset`.
- **Total estimated Higgsfield credit cost** across every section that will need
  generation (this is the same confirmation that credit-spending would otherwise
  require — surfaced here instead of as a separate later stop; see
  `references/video-scroll-effect.md`'s "Before invoking video-scroll-effect
  specifically" note, which this step supersedes as the actual confirmation point).
- Ask plainly: "anything to change — palette, page count/order, nav labels, or swap in
  an asset for any section — before I start building?"
Revise and re-show only if the requested changes are substantial (e.g. a different
section altogether); small edits (a color swap, a supplied asset) can just be applied
and confirmed in the same reply. Proceed to Step 3 once the user confirms or has no
further changes.

## Step 3 — Build (execute the confirmed plan directly)
Once the plan is confirmed at Step 2c, build every section it contains in the same
conversation turn sequence — no separate command needed, and no further user
confirmation between here and a finished deploy: Step 2c already covered plan approval
and credit cost, so building proceeds straight through once confirmed there.

### Working through sections in plan order
Go through `plan.sections` in order. For each section, read the
`references/<technique>.md` file matching that section's `technique` field (only
that one file — don't read every technique's reference file up front) and follow its
pipeline. A single project routinely uses several different techniques across its
sections — that's expected, not an error case.

### Routing when only static images are available
If a section has no video source (no Higgsfield access, no user-supplied clip)
and only a static photo is available: route that section to 3d-scene-effect with
`motion: "image-plane"`, NOT to video-scroll-effect. A flat photo has no real
motion for video-scroll-effect's frame-scrub to extract — 3d-scene-effect's
texture-mapped-plane approach produces genuine camera-driven parallax instead,
at zero cost. Only route to video-scroll-effect when real video (generated or
user-supplied) exists. Tell the user this rerouting is happening and why,
rather than silently switching techniques.

### Disclosing plan deviations (mandatory)
Any section whose ACTUALLY-BUILT technique differs from what Step 2c approved — for
any reason: video generation failed after its one retry, Higgsfield video access
wasn't available, or anything else — MUST appear, by name, under a dedicated
`⚠️ Plan deviations` heading in the final delivery message. This is not optional and
not satisfied by mentioning it in passing inside a longer description sentence — it
needs its own clearly-labeled section so it can't be missed. Each entry states:
- The section name/id.
- Planned technique → actual technique.
- Why (the reason `references/asset-generator.md` or `references/video-scroll-effect.md`
  reported for the failure).
- Whether credits were spent on the failed/skipped attempt, so the user knows whether
  the credit estimate shown at Step 2c was charged for something that didn't ship.
If zero deviations occurred, omit this section entirely — it only appears when
something actually changed from what was approved.

### Routing to pointer-follow-effect
Only route a section to `pointer-follow-effect` if its content still lands
acceptably for visitors on touch devices — that section's 3D motion goes
static on any device without a fine pointer, but its overlay copy still
renders on scroll like normal. Good fits: hero/showcase moments where the
parallax is a bonus, not the only way the section communicates anything.
Avoid it for sections carrying content a mobile-majority audience needs to
actually receive (e.g. core spec/pricing sections) — use 3d-scene-effect or
video-scroll-effect there instead, since those techniques work identically
regardless of pointer capability.

### Routing to physics-play
This is the heaviest technique (WebGL + a physics step every frame) — route at
most one section per site to it, and avoid pairing it on the same page with
several other WebGL-heavy sections (3d-scene-effect, pointer-follow-effect,
click-navigate) unless the target audience is known to be on capable devices.
Good fit: a single playful "try it" moment, not a load-bearing content section.

### Routing to cursor-trail
Same touch/no-pointer caveat as pointer-follow-effect — the trail itself degrades to
ambient drift on devices without a fine pointer or under reduced motion, so
don't make a section's only content dependent on the cursor trail actually
appearing. Good fit: atmospheric/brand-mood sections, section transitions —
not sections carrying product specifics.

### Routing to click-navigate and hybrid-2d3d
Both work identically regardless of device or pointer capability — safe
defaults with no special mobile caveat. `click-navigate` suits a "tour a few
angles/features" moment; `hybrid-2d3d` suits content-dense sections, or
breaking up a site that would otherwise be wall-to-wall full-bleed sections.

### Building the nav bar
The nav bar is built ONCE, from the full `plan.sections` list, while building the
FIRST section — not duplicated per section, and not deferred to whichever section
happens to be built last. Every later section's build finds the nav bar already
present and just leaves it alone.

### If a section's technique doesn't match any implemented skill
This shouldn't happen if Step 2a/2b constrained treatment choices correctly, but if it
does: don't guess or invent an unimplemented technique. Tell the user which section is
unclear and ask whether it should be reassigned to one of the "Available techniques"
listed above.

## Build & Deploy (runs once, after every section is built)
Every technique's own reference file ends its pipeline by pointing back here — this
step is shared and only runs once per site, after the last section in `plan.sections`
is built, regardless of which technique(s) built which sections.

1. **Deploy to Cloudflare Pages.**
   - Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set as environment
     variables (never ask the user to paste these into chat; read them from the
     environment only).
   - Load credentials first: `set -a && source .env && set +a` (run this from the repo
     root, before the wrangler command, so both variables are in scope).
   - Deploy with Wrangler (installs on first use, no separate setup step):
     `npx wrangler pages deploy <project-dir> --project-name=<slug> --branch=main`
     - `<project-dir>` is the folder containing `index.html`, `styles.css`,
       `choreography.js`, every engine `.js` file the plan uses, and the `frames/`
       folder.
     - `<slug>` is a kebab-case name derived from the brief/brand (e.g.
       `acme-launch`). If the project doesn't exist yet, Wrangler creates it
       automatically on first deploy.
     - Wrangler prints the live URL on success, in the form
       `https://<slug>.pages.dev` (and a unique preview URL per deployment).
   - If the deploy command fails (auth error, network error, or the Cloudflare API
     being unreachable from this sandbox): tell the user plainly that deploy failed
     and why, and fall back to step 2 below regardless — do not claim a URL exists
     if it doesn't.
   - Confirm the live URL actually loads
     (`curl -sS -o /dev/null -w '%{http_code}' <url>` should return 200) before
     telling the user it's ready.

2. **Write out to the connected folder (always, regardless of deploy success).**
   - Copy the entire project folder (site files + `frames/`) into the user's
     connected folder, under a subfolder named after the project slug, together
     with a `DESIGN.md`.
   - `DESIGN.md` is REQUIRED, not optional, and must contain at minimum:
     - A summary of the design choices made (palette, section list, techniques used).
     - A **"Plan vs. build" table**: one row per section, its planned `technique`,
       its actual built technique, and a note if they differ (blank/"—" if they
       match). This is the durable, offline record of any deviation — don't skip it
       even under time pressure.
   - This step runs every time — even if deploy failed — since it's the only
     guarantee the user's work survives after this session ends (the sandbox is
     disposable).
   - Tell the user both: the live URL (if deploy succeeded) and the local folder
     path where the source now lives, plus the `⚠️ Plan deviations` section from
     Step 3 above if it applies.

## Verifying a build (applies across every technique)
- The headless screenshot tool blanks sticky-canvas sections when scrolled, and
  `requestAnimationFrame`/`IntersectionObserver` are suspended in a backgrounded/
  headless pane — this is the harness, not the site. Verify live in a real browser
  wherever possible; when you must verify headlessly, drive the engine yourself
  (e.g. `window.__scrubs.forEach(s => s.update())` after a `scrollTo`) and sample
  canvas pixels rather than trusting a raw screenshot.
- Interaction-driven techniques (pointer-follow-effect, click-navigate, physics-play,
  cursor-trail) specifically need live mouse/click/drag verification — headless
  automation often can't reliably drive pointer events + rAF-tweened state.
