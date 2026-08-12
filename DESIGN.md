# Design System: AUXAI.AI

Generated per the `stitch-design-taste` semantic design system format. This is
the single source of truth for AUXAI.AI's visual language - cross-referenced
against `ui-ux-pro-max`, `emil-design-eng`, `impeccable-lite`,
`design-taste-frontend`, and `design-taste-frontend-v1`.

## 1. Visual Theme & Atmosphere

A dark, cinematic, luxury-branded interface for an AI automation agency
selling to operators who are tired of vendor theater. The mood is warm,
glassy, and tactile: a single gold-to-orange signal gradient against a rich
near-black, glassmorphic surfaces with a warm-tinted edge, a continuously
"alive" hero visual, and a hover system where every card, button, and link
responds with a spring-driven pop. Dense enough to feel substantive, airy
enough to feel expensive.

- **Density:** Daily App Balanced (4/10) - standard `py-24` to `py-32` section
  rhythm, no cockpit-density data.
- **Variance:** Offset Asymmetric (9/10). The hero is an explicit 50/50 split
  (visual left, copy right on desktop; visual stacks on top of copy on
  mobile via natural grid source order), which is the anti-center-bias
  default this skill set prefers over a centered hero. Services keeps a 1+3
  bento (never 3 equal cards).
- **Motion:** Cinematic Choreography (8/10) - a continuously breathing hero
  visual, spring-physics hover pop-outs on every interactive surface, and a
  spring-smoothed scroll progress bar. Every animation is scoped to
  `transform`/`opacity`/`box-shadow`, motivated, and
  `prefers-reduced-motion`-safe.

## 2. Color Palette & Roles

| Token | Hex | Role |
| --- | --- | --- |
| Void Black (`--color-bg`) | `#050505` | Primary background |
| Warm Surface (`--color-surface`) | `#0F0A06` | Section-level tint (trust strip, services, testimonials) |
| Raised Surface (`--color-surface-2`) | `#180F08` | Non-glass fallback fill |
| Elevated Surface (`--color-surface-3`) | `#21140A` | Deepest tint, decorative layers |
| Hairline (`--color-line`) | `#3A260F80` | 1px borders, dividers (warm-tinted, not neutral gray) |
| Ink (`--color-ink`) | `#FAFAFA` | Primary text (crisp white, never pure `#FFFFFF`) |
| Ink Dim (`--color-ink-dim`) | `#A0A0A0` | Secondary text, body copy |
| Ink Faint (`--color-ink-faint`) | `#6B6259` | Tertiary text, mono labels |
| Gold (`--color-accent`) | `#FFB800` | The primary accent - CTAs, links, active states, focus rings |
| Ember Orange (`--color-accent-2`) | `#FF6B00` | Gradient end-stop (buttons, glows) |
| Warm Highlight (`--color-coral`) | `#FFD770` | Light tint reserved for glass-shine highlights, never a base fill |
| Deep Gold (`--color-accent-dim`) | `#995400` | Reserved for disabled/dim accent states |
| Accent Ink (`--color-accent-ink`) | `#160E02` | Text on accent-filled surfaces (contrast-checked, ~10.8:1) |

No pure black, no pure white. One accent family (gold → ember, plus a light
warm-highlight tint for glass shine - never a second hue), used identically
in every section (hero glow, nav dots, service icons, FAQ hover, CTA button,
progress bar, card borders). No purple, no cool-toned neon.

**Glassmorphism:** cards (services, testimonials) use the `glass-card`
utility - `rgba(255,255,255,0.035)` fill, `backdrop-filter: blur(20px)
saturate(140%)`, and a `rgba(255,184,0,0.1)` warm-tinted 1px border - instead
of a flat surface color, so the warm background glow reads through every
card.

**Noise:** a fixed, `pointer-events-none`, `mix-blend-overlay` SVG
`feTurbulence` grain sits at 5% opacity across the whole viewport
(`components/noise-overlay.tsx`), never on a scrolling container, so it
never triggers repaints during scroll.

## 3. Typography Rules

- **Sans (display + body):** Outfit Variable - geometric, non-Inter, reads as
  premium-technical without tipping into serif-editorial territory that
  doesn't fit an automation vendor's voice.
- **Mono:** JetBrains Mono - reserved for the wordmark, nav-dot labels, and
  client-logo monograms. Not used for body copy.
- **Scale:** Hero wordmark `text-5xl` to `text-7xl` (short, 1-word "brand as
  headline"); section headlines `text-3xl sm:text-4xl` with `text-balance`
  and `tracking-tight`; hierarchy driven by weight and color (accent-colored
  emphasis span), never by oversized scale alone or gradient-filled text.
- **Body:** `text-[15px]` to `text-xl`, `leading-relaxed`, capped max-width
  (well under 65ch).
- **Banned:** Inter, generic system serif, Fraunces, Instrument Serif.

## 4. Component Stylings

- **Navigation (Dynamic Island):** `components/navbar.tsx` is a floating,
  centered, pill-shaped nav (`glass-card`, gold border glow), not a
  full-width bar. It has two content states - expanded (icon + label per
  item) and compact (icon only) - toggled by scroll position
  (`useScroll`/`useMotionValueEvent`, threshold 32px), hover on desktop, or
  tap on mobile (with a click-outside listener to close). The outer pill
  carries Motion's `layout` prop so the width/shape morph between states is
  a real FLIP-based layout animation, not a manual width tween. The
  currently-active section (shared with the right-side nav dots via the
  same `useActiveSection` hook) is rendered as a `layoutId="nav-active-pill"`
  glow behind whichever item is current - because it's one shared element
  across both compact and expanded renders, Motion morphs its position and
  size automatically when the nav's mode changes, not just when the active
  section changes. All of it runs on one spring (`SPRING_ISLAND`:
  `stiffness 300, damping 25`), so the pill reads as one physical object.
- **Buttons:** Pill radius, gold-to-ember gradient fill (primary) with a
  baked-in diagonal glass-shine layer, or bordered ghost (secondary/ghost).
  Built as `motion.button` / `motion.create(Slot)` so hover and press are
  real spring physics, not CSS transitions: `whileHover={{ scale: 1.03,
  boxShadow: <intensified glow> }}`, `whileTap={{ scale: 0.97 }}`,
  `transition: { type: "spring", stiffness: 300, damping: 20 }`. Base and
  hover box-shadows share the same layer structure at 0 alpha so Motion can
  interpolate smoothly instead of snapping from `none`. Icon children nudge
  on hover (`translate-x-0.5` / `rotate-45`) as directional feedback.
- **Cards (Services, Testimonials):** `glass-card` background, `whileHover`
  spring pop (`scale` 1.04-1.05, `y: -6`, intensified warm shadow), `cursor-
  pointer` even though most aren't links - a deliberate "this surface is
  alive" signal for a luxury-agency feel, not an accidental affordance leak.
- **How It Works steps:** intentionally card-less (a connecting hairline,
  not boxes) - proof cards aren't the default - but still pop on hover
  (`scale: 1.03`) with the icon ring gaining a gold glow, so the "alive"
  language stays consistent without contradicting the anti-card-overuse
  rule.
- **Accordion (FAQ):** Single frame border (`border-t` on the list, `border-
  b` on the last item only) - never a divider on every row. Trigger is a
  `motion.create(AccordionPrimitive.Trigger)` with a spring `whileHover`
  (`scale: 1.02`, subtle lift + amber shadow). Content height animates via
  Radix's `--radix-accordion-content-height` custom property.
- **Avatars:** Real photo first, graceful initials-in-a-circle fallback on
  load error - never a broken-image glyph or a generic person icon.
- **Service demos:** each services card ends with a small "live product"
  panel under a hairline divider (`components/service-demos/`) - a chat
  transcript that types itself out, a 4-node pipeline that lights up in
  sequence, an audio waveform + typed voice response, and a dashboard with
  count-up metrics, a mini bar chart, and animated progress bars. Every demo
  is gated by `onViewportEnter`/`useInView` (play once, on scroll into
  view), and every looping or interval-driven animation collapses to a
  static end-state under `prefers-reduced-motion` rather than just
  continuing to flash. Two shared primitives back all four:
  `TypingText` (character-by-character reveal + blinking cursor) and
  `CountUp` (a Motion `animate()` call driving a number from 0 to target).

## 5. Layout Principles

- **Hero:** explicit 50/50 split on `lg:` (`grid-cols-2`) - a continuously
  breathing canvas-drawn neural-network sphere on the left, wordmark +
  tagline + CTAs on the right. Below `lg:`, the grid collapses to a single
  column; because the visual is first in source order, it naturally stacks
  on top with no reordering utilities needed. This is the default
  anti-center-bias split this skill set prefers.
- Services is a 1+3 bento (never 3 equal cards) with at least two cells
  carrying real visual variation (ambient glow, grid texture) beyond flat
  white-on-white text.
- Max-width containment via `max-w-7xl`, full-height sections via
  `min-h-[100dvh]` (never `h-screen`).
- No layout family repeats more than once per page: split hero, then bento
  (services), then connected timeline (how it works), then scroll-snap
  carousel (testimonials), then accordion (FAQ), then full-bleed photo
  section (CTA).

## 6. Motion & Interaction

Three easing curves, chosen by what the element is doing (not decoration),
plus two spring presets for physics-driven interactions:

| Curve/Spring | Value | Used for |
| --- | --- | --- |
| `EASE_OUT` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entering/exiting elements: reveals, icon crossfades, accordion, drawer height |
| `EASE_IN_OUT` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen morphing while staying visible: the hero visual's breathing float |
| `EASE_DRAWER` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawer-style panels: the mobile nav sheet |
| `SPRING_HOVER` | `stiffness: 300, damping: 20` | Every pointer-driven pop-out: cards, buttons, nav links, FAQ trigger, how-it-works steps |
| `SPRING_SMOOTH` | `stiffness: 100, damping: 30, mass: 0.5` | Continuous scroll-linked values: the top progress bar |

- **Hero visual:** `components/ui/globe.tsx` - a CSS-animated rotating
  earth (background-position sweep on a JPEG texture, `twinkling` star
  dots) inside the Hero's existing `motion.div` visual column, which still
  owns the parallax drift (`useScroll`/`useTransform`) as scroll progresses
  through the section. Replaced the earlier canvas-drawn Fibonacci-sphere
  `NeuralVisual` (still described in git history / older revisions of this
  doc) - the swap only touched the visual inside that column, not the
  column's own motion, sizing, or the rest of the Hero.
- All entrance animations start from `opacity: 0, y: 20-28` (never `scale(0)`).
- Stagger delays are 60-70ms between siblings (emil's 30-80ms band).
- Scroll-linked values use Motion's `useScroll`/`useTransform`/`useSpring`,
  never `window.addEventListener('scroll')`.
- One perpetual micro-loop exists on the hero (a slow 4.5s breathing gold
  glow behind the visual) and one on the Workflow Automation card's ambient
  glow - both gated by `motion-safe:` - deliberately not applied to every
  element, per "not every card needs an infinite loop."
- **GPU discipline:** the `gpu` utility (`will-change: transform; transform:
  translateZ(0)`) is applied to elements that are either continuously
  animating (hero canvas) or frequently hover-triggered (cards, buttons, FAQ
  trigger, how-it-works steps) - not blanket-applied to every element site-
  wide, since indiscriminate `will-change` hurts more than it helps. It is
  deliberately *not* applied to the hero's own breathing wrapper, since that
  element's `transform` is already driven by Motion's inline style every
  frame and a static CSS `translateZ(0)` on the same property would just be
  overridden, not additive.
- `* { -webkit-font-smoothing: antialiased; backface-visibility: hidden; }`
  is applied globally (cheap, safe at the `*` level, unlike `will-change`).
- Every non-trivial animation is wrapped for `prefers-reduced-motion`
  (`useReducedMotion()` in Hero and the neural visual; `motion-reduce:` /
  `motion-safe:` utilities elsewhere).

## 7. Anti-Patterns (Banned, and verified absent)

No emojis · no Inter · no pure black · no neon/outer glow used as decoration
without a glass/card surface to justify it · no oversaturated accents beyond
the branded gold/orange family · no 3-column equal-card grid · no generic
names ("John Doe", "Acme") · no fake round numbers · no AI copywriting
clichés ("Elevate", "Seamless", "Unleash") · no scroll-cue text ("Scroll to
explore") · no version-label eyebrows · no em-dashes anywhere on the page ·
no border on every row of a list · no `transition: all` · no `ease-in` on UI
elements · no animating `top`/`left`/`width`/`height`/`margin`/`padding`.

## 8. Routing & Trial Pages

React Router (`App.tsx`) wraps `<Routes>` in `<AnimatePresence mode="wait">`
keyed on `location.pathname`, so every navigation - including from a service
card's "Try It Live" button - gets a real exit/enter transition
(`components/page-transition.tsx`) instead of a hard cut. A `ScrollToTop`
effect resets scroll on every route change.

Four trial routes (`/try/ai-agents`, `/try/automation`, `/try/voice-agent`,
`/try/ai-system`) each render a full interactive product demo through the
shared `TrialShell` (back-to-home link, wordmark, page title, and a bottom
"Ready to build yours? Book a Call" section reusing the same primary
`Button`). They intentionally do **not** carry the home page's `Navbar` /
`NavDots` / `ProgressBar` - those are built around the home page's own
section ids and would either no-op or mis-track on a different route.

**On not calling a real LLM API:** the AI Agents trial page simulates
replies client-side (`lib/simulated-ai.ts`) rather than calling the
Anthropic API directly from the browser. Shipping a real API key in a
public bundle is a credential leak, not a demo shortcut, and this is a
static site with no backend to proxy the call through - so the honest,
secure choice is a scripted-but-fully-interactive chat, with the same
typing-indicator and bubble UX a live integration would have.

A fifth route, `/experiments/scroll-morph-hero`, hosts a one-off imported
component (`components/ui/scroll-morph-hero.tsx`) rather than being reached
from the main nav - see section 10 for why it's isolated this way.

## 10. Third-Party Component Integration: `scroll-morph-hero`

`components/ui/scroll-morph-hero.tsx` was supplied as a ready-made React
component (default export `IntroAnimation`) to drop into the project's
`components/ui` folder, shadcn-registry style. It needed no new
dependencies - `framer-motion` was already a project dependency - and no
Tailwind/TypeScript setup work, since the project already has Tailwind v4,
strict TypeScript, path-aliased `@/*` imports, and a `components/ui` folder
matching shadcn convention (see "shadcn structure" note below). Only two
adaptations were made to the pasted source, both mechanical:
- Dropped `"use client"` (a Next.js-only directive; irrelevant under Vite).
- Dropped the unused `React` default import and the two props (`total`,
  `phase`) that `FlipCard` received but never read, since this project's
  `tsconfig.app.json` has `noUnusedLocals`/`noUnusedParameters` on and the
  build fails otherwise. `total`/`phase` stay in `FlipCardProps` for
  caller-side typing; they're just not destructured into unused locals.

**Why it's not part of the site's real Hero.** The component captures
wheel and touch input on its own
container and calls `preventDefault()` on every event to drive a "virtual
scroll" morph - by design, the page can never scroll past it via mouse
wheel while the cursor is over it. That's fine, even desirable, for a
focused, single-purpose showcase (the component's own supplied `demo.tsx`
wraps it in a fixed-height bordered box for exactly this reason) but it
actively conflicts with how the rest of this site scrolls: the pinned
horizontal-pan How It Works section, the particle field's scroll-position
blending, and ordinary section-to-section scrolling all assume the mouse
wheel keeps moving the page. Swapping it in as the real Hero - or splicing
it into the homepage's scroll flow anywhere - would trap visitors the
moment their cursor crossed it.

So it's mounted at its own route, `/experiments/scroll-morph-hero`
(`pages/scroll-morph-showcase.tsx`), inside the same fixed-height bordered
box pattern the component's own demo used, wrapped in the existing
`TrialShell` for a consistent header/back-link/footer-CTA rather than a
bare unstyled page. It's linked from the site `Footer`'s bottom bar
("Experiments") so it's reachable without being presented as part of the
core product experience.

**Component path note:** the project's default `components/ui` already
existed and already held shadcn-style, Radix-backed primitives
(`button.tsx`, `accordion.tsx`) before this integration, so the pasted
component's own convention (drop it straight into `components/ui`) matched
what was already there with no path changes needed. Keeping generated/
installed UI primitives in one dedicated folder - rather than scattered
next to whichever page first used them - is what makes future shadcn-style
additions (`npx shadcn add ...` or copy-paste like this one) predictable to
find, diff, and update without hunting through page and section files.

Note: the project has no `components.json`, so it was never bootstrapped
via the shadcn CLI proper - `components/ui` and the `cn()` helper in
`lib/utils.ts` were hand-built to match the convention. Nothing here
required running `npx shadcn init`; if a future component is pulled from
the shadcn CLI/registry, adding `components.json` (pointing `aliases.ui` at
`@/components/ui` and `aliases.utils` at `@/lib/utils`) would let `npx
shadcn add <name>` install straight into the existing structure without
reorganizing anything.

## 9. Liquid Text, Liquid Metal, Scroll Systems & Particle Field

A fourth round added four cinematic systems on top of the existing theme.
Each was scoped deliberately rather than applied at maximum literal
intensity everywhere it was requested - the scoping calls are documented
inline below.

**Liquid text** (`components/liquid-text.tsx`): an SVG `feTurbulence` +
`feDisplacementMap` filter drives a subtle wobble on text.
- `LiquidHeroTitle` gets a *continuous* wobble, animated for free by an SMIL
  `<animate>` element on `feTurbulence`'s `baseFrequency` (the browser's own
  timeline, zero JS/React cost per frame) plus a hover "melt and reform"
  driven by an imperative Motion `animate()` call that writes straight to
  the `feDisplacementMap`'s `scale` attribute via a ref, bypassing React
  state entirely.
- `LiquidHeadingReveal` (used on Services/How It Works/FAQ/CTA headings)
  intentionally does **not** wobble continuously - it plays the distortion
  once, from `scale: 30` down to `0`, the first time the heading enters the
  viewport, then removes the SVG filter from the DOM entirely. Continuous
  turbulence on every section heading site-wide reads as gimmicky and costs
  a live filter recompute on every heading at all times; a one-shot reveal
  keeps the "liquid" language without the ongoing cost.
- `ShimmerText` (the hero tagline) is a `background-clip: text` sweep
  (`--animate-shimmer` in `index.css`), a deliberate, acknowledged exception
  to the transform/opacity/filter-only rule - it's one small text run, and a
  background-position sweep is the standard, cheap way to do text shimmer.

**Liquid metal buttons** (`components/ui/button.tsx`): every `Button`
variant (including `asChild` usage wrapping `<Link>`/`<a>` via
`motion.create(Slot)`) now carries a cursor-tracked radial-gradient sheen
and a click ripple. Cursor position is written straight to `--mx`/`--my`
CSS custom properties via `element.style.setProperty()` in the mousemove
handler - not React state - so the sheen tracks the pointer without a
re-render per pixel. Click ripple reuses the same pattern: `--cx`/`--cy` are
set, then a `data-rippling` attribute is toggled off/on (forcing a reflow in
between) to restart the CSS `liquid-ripple-pulse` keyframe on the button's
`::after` pseudo-element on every click. Effects live entirely in CSS custom
properties and pseudo-elements rather than extra child `<span>`s, because
Radix `Slot` (used for `asChild`) can only clone props onto a single child -
adding sibling DOM nodes there would break the `<Link>` case.

**Scroll systems:**
- `SplitText` (`components/split-text.tsx`) does word-by-word stagger
  reveal on scroll-into-view. Used on exactly one heading (Testimonials) -
  the same trick on every section's heading would read as templated rather
  than as a signature moment.
- Hero's visual column has a parallax `y` offset driven by
  `useScroll`/`useTransform` against the section's own scroll progress.
- CTA's background image has scroll-linked opacity (faintest at the
  section's edges, fullest mid-section) and a slight parallax scale-down,
  also via `useScroll`/`useTransform`.
- How It Works (`sections/how-it-works.tsx`) is the one horizontal-pan
  section: a `height: 220vh` wrapper with a `position: sticky` inner panel
  pins the section while `useScroll` (`target: wrapRef`) drives a
  `motion.div`'s `x` transform to pan the four step cards horizontally as
  the page scrolls vertically. `useReducedMotion()` renders the same cards
  as a plain static grid instead, with no pin and no `x` transform.

**Particle field** (`components/particle-field.tsx`): a fixed,
`pointer-events-none`, `mix-blend-mode: screen` canvas overlay (same
layering pattern as `NoiseOverlay`) rendered once at the page root in
`pages/home.tsx`, sitting behind the Dynamic Island nav/progress bar/noise
chrome but above every section's background. 260 particles on desktop / 100
on mobile lerp between five shapes keyed to the page's existing section ids
(brain at Hero, grid at Services, arrow at How It Works, star cluster at
Testimonials, funnel at CTA), blended by how far scroll has progressed
between the current pair of adjacent sections, and fade out over 400px once
scrolled past the CTA section so the field never renders over the Footer.
Mouse position repels nearby particles. Kept **additive** rather than
replacing the Hero's own visual (originally `NeuralVisual`, since swapped
for `components/ui/globe.tsx` - see section 11) - the ambient field is a
separate, subtler, page-wide layer, independent of whatever sits in the
Hero's own visual column.

Two deliberate performance guards: the O(n²) pairwise distance check that
builds connecting edges only runs every 4th frame (edges only need to look
"roughly right", not be recomputed at 60fps), and the scroll/mousemove
listeners are passive and only write to refs - all the per-frame math
happens inside the already-scheduled `requestAnimationFrame` loop, not
inside the event handlers themselves. `useReducedMotion()` renders one
static frame with no rAF loop and no scroll/mouse listeners attached at
all.

## 11. Hero Visual Swap: `NeuralVisual` → `components/ui/globe.tsx`

The Hero's visual column (`sections/hero.tsx`) now renders a rotating-earth
`Globe` instead of the canvas Fibonacci-sphere `NeuralVisual`. Everything
*around* the visual was left untouched: the same `motion.div` wrapper still
owns the entrance animation and the scroll-linked parallax `y` drift, the
title/tagline/buttons/liquid-text/particle-field are unchanged, and every
other section, the trial pages, and the amber/gold theme are unmodified.

**Source and one required fix:** `Globe` was supplied as a complete,
self-contained component (inline `<style>` keyframes, a 250px sphere with a
JPEG texture pulled from a user-provided R2 URL, seven twinkling star
dots). The only change from the supplied source was swapping its outer
wrapper from `h-screen` to `h-full`: the original was written to fill an
entire viewport as a standalone demo, and `h-screen` inside the Hero's
existing (much smaller) aspect-square visual column would have forced that
column to 100vh, breaking the Hero's layout. Everything else - sphere size,
star positions, animation timings, the inline `<style>` block - is
unchanged.

**What was intentionally not built:** the request also included a second
component (`ScrollGlobe` in a `landing-page.tsx`) meant to reposition the
globe across the page as a fixed overlay while also rendering its own
Hero/Services/How It Works/CTA section content. That code was supplied
incomplete (no JSX return - just a comment placeholder) and, even
completed, its own section content would have duplicated what
`sections/services.tsx`, `sections/how-it-works.tsx`, and `sections/cta.tsx`
already render, and its full-page scroll-repositioning would have
competed for the same screen space as the particle field. Given the
instruction to keep everything else exactly the same, the chosen scope was
the visual only, confirmed with the user before implementing: swap what's
inside the Hero's existing visual column, keep its existing parallax, add
nothing page-wide.

**Cleanup:** `components/neural-visual.tsx` is now unreferenced anywhere in
the codebase and was deleted rather than left as dead code, consistent
with how the same swap was handled earlier in this project's history (see
the changelog for the original `globe.tsx` → `NeuralVisual` swap this one
reverses).

## 12. Hero Split Layout & Floating Globe Scroll Drift

**Hero layout** (`sections/hero.tsx`): a flexbox split, not a grid -
`flex flex-col lg:flex-row`. Text is first in source order (title,
tagline, buttons), the Globe's layout slot second, so mobile naturally
stacks text-on-top/globe-below via source order alone, and desktop's
`lg:flex-row` puts text left / globe right with `lg:basis-1/2` on both
children for an explicit 50/50 split. The Globe slot itself renders empty
on non-reduced-motion - see below for why.

**Floating Globe** (`components/floating-globe.tsx`): a page-root,
`position: fixed`, `mix-blend-screen` overlay (mounted once in
`pages/home.tsx` next to `NoiseOverlay`/`ParticleField`, same layering
technique both already use so it can render above every section's opaque
background without painting over text - screen blending only ever
brightens what's beneath it). It slides in one continuous motion across
the *whole* page scroll, not per-section: on desktop, `x` goes right
(`28vw`) at 0% scroll → center (`0vw`) by 30% scroll, then **holds
center** for the remaining 70% of the page - it does not continue on to
the left. On mobile, `y` still drifts below → center → above (`±18vh`,
`x` held at 0) across `0 → 0.5 → 1`, unchanged. Scale eases `1.0 → 0.7`
and opacity `0.85 → 0.3` across the full-page range on both, each wrapped
in `useSpring` on the project's existing `SPRING_SMOOTH` preset
(`stiffness 100, damping 30, mass 0.5`) so the drift glides under scroll
of any speed instead of tracking the scrollbar frame-for-frame.

This replaced an earlier version (built one round prior, kept here for
context since it's what "Supersedes..." referred to before this
rewrite) that measured each section's real DOM position and gave the
globe a distinct side/scale/opacity *per named section*, alternating
sides on every section boundary. The current spec asks for one simple,
continuous slide across total scroll progress instead, so the per-section
DOM-measurement machinery (and the `SPRING_DRIFT` preset it used) was
removed rather than left as unused dead code alongside the simpler
replacement - two competing position systems living in the same file
would only invite drift between them.

One consequence worth naming: opacity now bottoms out at 0.3 (never 0),
by explicit spec, so the globe is faintly visible over the Footer at the
very bottom of the page rather than fading out completely the way the
prior version's CTA-boundary fade did.

**Reduced motion:** `FloatingGlobe` renders nothing at all when
`prefers-reduced-motion` is set - `sections/hero.tsx` falls back to
rendering a single static Globe in its own layout slot in that case, so
reduced-motion visitors still see the sphere, just without any scroll
choreography.

**Mobile:** beyond switching the drift axis from `x` to `y`, scale also
gets an extra 0.75x multiplier on top of the 1.0→0.7 scroll-driven range,
keeping the sphere sized sensibly on a narrow viewport rather than
introducing a second, different position system for mobile.
