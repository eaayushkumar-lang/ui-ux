# CLAUDE.md — AI Automation Agency Website

## Project Overview
Build a single-page, scroll-animated website for an AI automation agency. The site should feel cinematic and premium — dark background, glowing accents, smooth scroll-triggered reveals — similar to high-end WebGL agency sites, restyled with the palette below.

## Tech Stack
- React + Vite
- Three.js for the background flow/particle effects
- GSAP + ScrollTrigger for scroll-linked reveal animations
- Framer Motion for the intro sequence and discrete component-level transitions
- Tailwind CSS for layout/styling (CSS variables for the palette)
- Playwright for automated visual QA

## Design System

**Colors:**
- `--bg-base: #0B0F19`
- `--accent-primary: #6C5CE7`
- `--accent-secondary: #F5A623`
- `--text-primary: #EDEDF2`
- `--text-muted: #8A8A99`
- `--card-bg: #12141F`

**Typography:** Inter / Space Grotesk. Large, confident headline sizing (clamp()).

**Motion rules:**
- Ease-out, 0.6–0.9s for scroll reveals; default reveal = fade + slide up 30–40px
- No bounce/elastic easing
- Each section animates in once on first scroll into view
- Respect `prefers-reduced-motion`

## Sections
1. **Intro sequence** — plays once per session, full-screen overlay, highest z-index.
2. **Hero** — headline + subtext, primary/secondary CTAs, particle background.
3. **System** — headline + copy reveal, connected-nodes diagram, two buttons.
4. **Services** — three cards (Workflow Automation, AI Agents, Data Integration).

## Content Rules
- Do NOT invent final brand copy (agency name, tagline, section headlines). Use clearly marked `[PLACEHOLDER]` text until real copy is provided.

## Working Style
- Framer Motion for discrete/component-scoped motion (intro, hovers, taps); GSAP ScrollTrigger for scroll-position motion. Don't mix both on the same element.
- Keep Three.js effects isolated in their own component so they can be swapped/tuned without touching layout code.
- After each build step that adds an animation, add/update its Playwright test.

---

## Addendum — Three Original Particle Effects Across Sections

Three distinct Three.js particle effects, one per section, all using the palette
(`#6C5CE7` violet, `#F5A623` amber) and sharing a common `ParticleField` component
so code stays DRY. Each effect is triggered by GSAP ScrollTrigger as its section
enters the viewport (`scrub` where motion tracks scroll directly, or a one-time
play-in where noted).

### Effect 1 — Orbiting Rings (Hero)
- A glowing core cluster with 2–3 `THREE.Points` rings orbiting at different radii,
  tilts, and speeds (parametric ellipse: `x=r*cos(theta)`, `z=r*sin(theta)`, slight
  `y` jitter for thickness). Continuous idle rotation per ring.
- Inner ring amber, outer ring(s) violet, core blended between both (additive-blended
  overlapping points as a soft bloom, no postprocessing pass).
- Fades out (opacity) as the hero scrolls away — no hard cutoff.

### Effect 2 — Galaxy / Spiral Disc (System)
- A dense field (3,000–6,000 points) in a flattened logarithmic-spiral disc; denser
  and brighter toward center, falloff to the edges; slow continuous idle rotation.
- Scroll-driven **assembly**: particles lerp from a scattered random start into the
  spiral formation as the section enters (GSAP ScrollTrigger `scrub`).
- Colors: violet-to-amber gradient by radius (warm/bright center, violet rim); no
  literal white/blue-white "real galaxy" coloring — stay inside the palette.

### Effect 3 — Vortex / Convergence (Services)
- Particles in a ring/torus around a dark center, drifting inward along a spiral and
  recycling to the outer edge on arrival (continuous particle-recycling loop);
  abstract/brand-appropriate ("all your workflows converge into one system").
- Additive-blended glow ring, violet-to-amber gradient around the circumference.
- One-time GSAP ScrollTrigger `once` play-in, then self-loops (not tied to further
  scroll).

### Shared technical approach
- One reusable `<ParticleField formation="rings" | "spiral" | "vortex">` — no three
  copy-pasted Three.js setups.
- `BufferGeometry` + `Float32Array` position buffers; manual per-frame render loop.
- `PointsMaterial` with `transparent: true`, `depthWrite: false`, `AdditiveBlending`.
- Opacity 0.4–0.7 so foreground text/CTAs stay fully readable — background role only.

### Performance & fallback rules
- Halve particle counts on mobile.
- `prefers-reduced-motion`: render each effect in its final static formation, no motion.
- WebGL init failure: hide canvas gracefully, console warning, don't break layout.

### QA (Playwright)
- Per-section render test scrolling it into view and confirming the formation renders
  (a per-formation geometry-sampler hook on `window` confirms it even when the
  sandbox's software WebGL composites nothing to a screenshot).
- Per-section `prefers-reduced-motion` test confirming the static fallback renders.

### Content/attribution note
Original implementations inspired by general, widely-used particle/orbit/spiral
techniques in creative coding — not reproductions of any specific third-party paid
template, prompt, or proprietary asset.

## Persistence note
This project lives as a subdirectory of the `eaayushkumar-lang/ui-ux` repository
(branch `claude/install-ui-ux-pro-max-skill-79jiwn`) rather than its own repo,
because that was the only git remote available to push to — the working container is
ephemeral and wiped local-only copies three times. Committing here (and to that
remote) is what makes the source durable. Move it to a standalone repo whenever one
exists; nothing here depends on ui-ux.
