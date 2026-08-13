# Video-Scroll-Effect — frame-scrub execution engine

## What this actually is (read first)
The viral "3D scroll" effect is **not** Three.js. It's a **canvas image-sequence scrub**:
a short cinematic clip is exported to ~180 numbered JPGs, all preloaded, and the frame
drawn to a `<canvas>` is chosen by scroll progress. Scrolling forward/backward plays the
clip. Add Lenis smooth scroll + scroll-synced overlay copy and it reads as premium 3D.
The "3D" comes entirely from the source video — which we generate with Higgsfield.

Stack: plain **HTML + CSS + JS + Lenis** (zero build, runs from any static server).

## When this section is executing (read this file when a plan section's `technique` is `video-scroll-effect`)
This file covers building ONE section from the site plan produced by the planning
workflow in `SKILL.md`. It does not decide how many sections a site needs, what type
those are, or what content depth is appropriate — that's already settled by the time
you're reading this file. If asked to build a video-scroll-effect section directly,
without a plan, ask for a `content_brief`, `motion`, and `palette` for that section
instead of inventing a full multi-section site yourself.

## Prerequisites
- **Higgsfield MCP** connected + credits (~$1–2 / clip) — OR the user can supply their own
  video clip instead (see Step 1b). At least one of these two paths is required.
- **ffmpeg** — expected to already be present in the environment. Step 0 below confirms this.

### Step 0 — Confirm ffmpeg (run first, always)
Run `ffmpeg -version`. If this fails, tell the user ffmpeg isn't available in this environment
and stop — do not attempt to download or install it.

## THE PIPELINE — executes one plan section

### 1. Read the section spec
Take the section's `motion`, `content_brief`, and the site's `palette` from the plan.
Use `content_brief` to write this section's actual copy — don't invent unrelated content.

### 1b. Check for a user-supplied clip (skip Higgsfield if present)
Before generating anything, check whether the user's prompt included a video file path,
attachment, or URL to use as the source clip instead of generating one.
- If a usable clip is supplied: skip Steps 2–4 entirely (no Higgsfield calls, no credits spent).
  Use the supplied clip directly as input to Step 5 (frame extraction).
- If the supplied file isn't a video, or ffprobe/ffmpeg can't read it, tell the user plainly
  and ask them to either supply a valid clip or allow Higgsfield generation instead.
- If no clip is supplied at all: proceed to Step 2 as normal (Higgsfield generation).

### 2. Generate the hero keyframe (Higgsfield `generate_image`)
- Model: **`nano_banana_pro`** (top quality / crisp). Prompt from the section's
  `content_brief` and subject, strong lighting, intentional background, "ultra sharp,
  photorealistic, 8k, editorial/advertising". 16:9.
- Poll `job_display` until `status:"completed"`; keep the job **id** (used as the video start frame).

### 3. Generate the cinematic clip (Higgsfield `generate_video`)
- Model: **`seedance_2_0`**, `resolution:"1080p"`, `aspect_ratio:"16:9"`, `duration:6`,
  `medias:[{role:"start_image", value:<keyframe id>}]`. Always pass
  `declined_preset_id:"24bae836-2c4a-48e0-89b6-49fcc0b21612"` if it suggests a preset; if it
  suggests a different preset, retry with that preset's id in `declined_preset_id`.
- Use the section's `motion` value to pick the prompt pattern:
  - **orbit/turntable** — "smooth seamless full 360-degree rotation, one complete revolution, stays centered".
  - **fly-through** — "slow continuous forward camera flight through/around the scene, smooth dolly, deep parallax".
  - **reveal/explode** — "the components burst or assemble outward and float in slow motion" (keep it object/scene context — moderation-friendly).
  - **abstract** — "elegant slow-morphing liquid-metal / glass / particle form drifting and rotating".
  - **molten-birth** — "the subject forms out of a molten/liquid state, pouring and coiling, cooling and solidifying into its final form, slow and continuous" (creation instead of destruction — good for jewelry/craft/material-forward products).
  - **frozen-time** — "the subject and its surrounding motion (splash, spray, debris) hang perfectly frozen while the camera orbits around the suspended instant, nothing moves except the viewpoint" (pairs naturally with a `loopBack` beat that briefly releases the freeze — see "Multi-beat sections" below).
  - **bloom** — "the subject unfurls/opens/grows petal by petal or layer by layer, timelapse-smooth, ending fully open and holding" (growth instead of destruction — good for organic/beauty/botanical products).
  - **descent** — "the subject sinks/descends through its environment, light and color fading from bright to near-total darkness as depth increases, ending in near-black with only the subject's own glow/markers visible" (pairs naturally with `bgFrom`/`bgTo` background interpolation — see "Live scroll-synced meter" below).
  - **light-reveal** — "everything starts in true darkness; a single light beam sweeps across the subject, revealing it section by section as it passes, most of the frame always in shadow" (good when the product itself should feel discovered rather than presented).
  - If `motion` doesn't match any of these, write a new prompt in the same style rather
    than forcing it into one of the above.
- **Cost:** preflight with `get_cost:true` once; ~54 credits per 1080p clip. Confirm if the user is low.

### 3b. Multi-beat sections (`beats` instead of a single `motion`)
A section may declare `beats: ["orbit", "transform", "macro"]` (or similar) instead of
one `motion` value — a chaptered scroll-scrub within a single pinned section, all
generated from ONE shared anchor image so the subject's identity stays locked across
beats (same lighting, same materials, same product) rather than drifting between
independently-generated clips.
- `references/asset-generator.md` covers the actual generation/identity-lock — it
  returns one clip per beat, already extracted into `frames/<section>/<beat>/`.
- Each beat gets its own sub-range of the section's overall scroll progress (see Step
  6's `beats` config format below) — earlier beats occupy earlier progress, in the
  order listed.
- A beat can set `loopBack: true` to play its own frames forward through the first half
  of its progress sub-range, then the SAME frames in reverse through the second half —
  one generated clip becomes two narrative beats (explode → reassemble, bloom → close)
  at zero extra Higgsfield cost. Good fit for `frozen-time`/`reveal-explode`/`bloom`
  motions specifically — a section can freeze/hold, briefly release forward, then fold
  back to its resting state without a fourth clip.
- Sections without `beats` are unaffected — this is purely additive; the single-`motion`
  pipeline above still works exactly as documented.

### 4. Handle render results
- `completed` → download `results.rawUrl` with `curl`.
- `nsfw` or `failed` → **refunded, retry once**. Moderation false-flags abstract "floating
  pills/dissolving figures"; reword to product-context, or switch that clip to
  **`grok_video_v15`** (`resolution:"720p"`, more lenient).
- Tell the user about any retry; never claim a clip rendered if it didn't.

### If the retry also fails (STOP — do not self-reroute)
If the one retry above still produces no usable clip — or video generation isn't
available at all for this section — this section CANNOT be built as video-scroll-effect.
Do not quietly build it as `3d-scene-effect`'s `image-plane` fallback yourself and move
on as if nothing changed: that fallback decision belongs to the planning workflow's
routing rules (`SKILL.md`), and silently making it here is exactly the failure mode that
shipped a site with zero video sections despite an approved plan promising two (see
`SKILL.md`'s "Disclosing plan deviations"). Instead:
- Stop generating for this section. Note that this section needs the image-plane
  fallback instead — with the reason (nsfw after retry, API failure, no Higgsfield
  video access, etc.) and whether any credits were spent on the failed attempt(s).
- This becomes one entry in the final "⚠️ Plan deviations" section you're required to
  show the user at delivery — never only a code comment or a footnote buried in a
  longer summary.

### 5. Slice + compress frames (ffmpeg)
- Single-motion section: `scripts/extract-frames.sh <clip.mp4> frames/<section-name> 180`
  → ~179 numbered JPGs, then `scripts/compress-frames.sh frames/<section-name> 1600 88`
  → 1600px wide, q88 (crisp, <~15MB/section).
- Multi-beat section: run both scripts once per beat, into
  `frames/<section-name>/<beat-name>/` — each beat gets its own frame count and its own
  compress pass, same 1600px/q88 settings.

### 6. Build this section from templates/
- **Project scaffold (once per site, whichever technique builds FIRST):** copy
  `templates/index.html`, `templates/base.css` (as the project's `styles.css`), and
  `templates/choreography.js` into the project. The shell is shared across every
  technique so a project can never end up missing the Three.js / cannon-es /
  choreography tags just because of which technique happened to be built first.
- **This technique's own files (every time a video-scroll-effect section is built):**
  copy `templates/video-scroll-effect.js` into the project, and APPEND
  `templates/video-scroll-effect.styles.css` (a fragment, not a full stylesheet) to the
  project's `styles.css`.
- If the project already has the scaffold, do not overwrite it — subsequent
  sections append into what is already there.
- Add/edit a `SCRUB_SECTIONS` entry for this section. Single-motion sections keep the
  existing shape:
  `{ section:"#<section-id>", frameCount:179, bg:"<palette.bg>", framePath:(i)=>\`frames/<section-name>/frame_${String(i).padStart(4,"0")}.jpg\` }`.
  `frameCount` MUST match the number extract-frames.sh printed, and `section` must match a real id.
- Multi-beat sections use a `beats` array instead of top-level `frameCount`/`framePath`:
  `{ section:"#<section-id>", bg:"<palette.bg>", beats:[{ name:"orbit", frameCount:150, progressStart:0, progressEnd:0.33, loopBack:false, framePath:(i)=>\`frames/<section-name>/orbit/frame_${String(i).padStart(4,"0")}.jpg\` }, ...] }`.
  Each beat's `progressStart`/`progressEnd` carve up the section's 0-1 scroll range
  (beats in list order, ranges should be contiguous and non-overlapping); `loopBack:true`
  plays that beat's own frames there-and-back within its own sub-range, per "Multi-beat
  sections" above.
- Optional live scroll-synced meter/background fields, either shape: `bgFrom`/`bgTo`
  (hex colors — interpolated across the section's scroll progress and applied to its
  background, e.g. for a `descent` motion) — see "Class contract" below for the
  matching `[data-live-count]` markup these pair with.
- **Class contract** the engine depends on (rename these and it silently does nothing):
  - each scrub section: a `<canvas>` inside `.sticky`, wrapped by a `.cinematic` section with the config's id
  - `.reveal-line` + `data-in`/`data-out` — overlay copy fading over a progress window
  - `.progress-fill` and `[data-frame-readout]` — optional, auto-driven per section if present
  - `.reveal` (fades up on enter) and `.stat-num` + `data-count`/`data-suffix` (counts up once on reveal) — anywhere on the page
  - `[data-live-count]` + `data-target`/`data-suffix` — optional, CONTINUOUSLY reflects
    `progress * data-target` as the visitor scrolls (unlike `data-count`, which counts
    up once and then holds) — use for a live depth/altitude/percentage meter tied to
    this section's own scroll progress, only meaningful on sections with a `bgFrom`/`bgTo`
    or otherwise depth/progress-themed motion
- Opacity peaks at the **midpoint** of a line's `[in,out]` window and is 0 at both edges, so give the
  final line a `data-out` past 1.0 (e.g. `1.30`) or it fades to nothing exactly as the user lands.
- Write this section's copy from its `content_brief` — don't reuse generic placeholder copy.
- **Hue-shift trick** for product variants/colorways (no extra generation):
  `ffmpeg -i base.png -vf "hue=h=120:s=1.15" variant.png`.
- If this is the first section being built for this project (nav bar doesn't
  exist yet in index.html), generate the `.hud-nav` links from the full site
  plan's `id`/`nav_label` pairs before proceeding to this section's own content.

### 7. Deploy
Once every section in the plan is built (regardless of which technique(s) built them),
see `SKILL.md`'s "Build & Deploy" section — it's shared across every technique and only
runs once, at the very end.

## Engine rules (already in templates/video-scroll-effect.js)
- Preload every frame; paint frame 0 on first load; redraw only when the frame index changes.
- Sticky stage: outer section `height: 420–600vh`, inner `position:sticky; top:0; height:100vh`.
  Progress = `clamp(-rect.top / (rect.height - innerH), 0, 1)`. Throttle in the rAF loop.
- Cover-fit draw + HiDPI (`devicePixelRatio`, cap 2). Drive updates from the Lenis rAF loop
  (robust to any scroll source). Overlay copy fades over per-line `[in,out]` progress windows.
- Multi-section: `SCRUB_SECTIONS` array; engine **skips** sections whose element is missing.

## Known gotchas
- More/larger frames = slow load → keep 1600px / q88 / ~180 frames (per beat, for
  multi-beat sections).
- Continuous-motion clips only (no hard cuts — ugly when scrubbed backward). This
  matters even more for `loopBack` beats, since the reverse half depends on the clip
  reading correctly played backward.
- `beats`' `progressStart`/`progressEnd` ranges must be contiguous and cover the full
  0-1 range between them — a gap leaves a dead zone where nothing updates, an overlap
  makes two beats fight over the same scroll range.
- A `bgFrom`/`bgTo` pair with no actual color difference, or a `[data-live-count]` with
  no `data-target`, is a silent no-op — confirm both are set meaningfully when used.
- The headless screenshot tool blanks sticky-canvas sections when scrolled; verify with
  pixel sampling, and view live in a real browser.
- In a backgrounded/headless pane `requestAnimationFrame` and `IntersectionObserver` are
  suspended entirely, so the scrub never advances and `.reveal` never fires — this is the
  harness, not the site. Verify by driving the engine yourself:
  `window.__scrubs.forEach(s => s.update())` after a `scrollTo`, then sample canvas pixels.
- The image-0 onload handler must NOT be set separately from the loop's onload/onerror
  handler — combine both behaviors in one handler (increment loadedCount AND draw frame 0
  via an `if (i === 0)` check) or the preloader will hang at (N-1)/N forever.
- Deploy failures should never be silently swallowed — always tell the user if the deploy
  failed and confirm whether the write-out to their folder still succeeded.

## Files
- `templates/video-scroll-effect.js` — the scrub engine.
- `templates/video-scroll-effect.styles.css` — `.cinematic` + preloader CSS fragment,
  appended to the project's `styles.css` on top of `templates/base.css`.
- The project shell (`index.html`, `base.css`, `choreography.js`) is shared — see
  "Build this section from templates/" above.
- `templates/CinematicReveal.tsx` — LEGACY React/Next drop-in (optional). Single-motion
  only: it does NOT support `beats`, `loopBack`, `bgFrom`/`bgTo` or `[data-live-count]`.
  Don't reach for it when a section uses any of those — use the vanilla engine, which is
  the maintained one.
- `templates/Launch Demo.command` — double-click localhost launcher.
- `scripts/extract-frames.sh`, `scripts/compress-frames.sh` — the ffmpeg pipeline.
