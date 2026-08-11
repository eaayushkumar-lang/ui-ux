# Design System: AUXAI.AI

Generated per the `stitch-design-taste` semantic design system format. This is
the single source of truth for AUXAI.AI's visual language - cross-referenced
against `ui-ux-pro-max`, `emil-design-eng`, `impeccable-lite`,
`design-taste-frontend`, and `design-taste-frontend-v1`.

## 1. Visual Theme & Atmosphere

A dark, cinematic, confident interface for an AI automation agency selling to
operators who are tired of vendor theater. The mood is warm-premium and
kinetic: a single amber-to-coral signal gradient against near-black, one
cinematic centerpiece (the hero's scroll-driven image fly-through), and
restraint everywhere else. Dense enough to feel substantive, airy enough to
feel expensive.

- **Density:** Daily App Balanced (4/10) - standard `py-24` to `py-32` section
  rhythm, no cockpit-density data.
- **Variance:** Offset Asymmetric (9/10) overall, with one deliberate
  exception: the hero is a centered manifesto composition (brand mark + one
  sentence + one visual event), which is the documented override for
  centered heroes where the message itself is the design. Services keeps a
  1+3 bento grid, never 3 equal cards.
- **Motion:** Cinematic Choreography (8/10) - the hero pins for a full extra
  viewport of scroll while a large image flies through it edge to edge;
  every animation is scoped to `transform`/`opacity`, motivated, and
  `prefers-reduced-motion`-safe.

## 2. Color Palette & Roles

| Token | Hex | Role |
| --- | --- | --- |
| Void Black (`--color-bg`) | `#0A0A0A` | Primary background |
| Warm Surface (`--color-surface`) | `#120D09` | Section-level tint (trust strip, services, testimonials) |
| Raised Surface (`--color-surface-2`) | `#1C140D` | Card fill |
| Elevated Surface (`--color-surface-3`) | `#241A10` | Featured card gradient stop |
| Hairline (`--color-line`) | `#3A2A1880` | 1px borders, dividers (warm-tinted, not neutral gray) |
| Ink (`--color-ink`) | `#F7F3EE` | Primary text (warm off-white, never pure white) |
| Ink Dim (`--color-ink-dim`) | `#AB9D8C` | Secondary text, body copy |
| Ink Faint (`--color-ink-faint`) | `#6F6255` | Tertiary text, mono labels |
| Amber (`--color-accent`) | `#F59E0B` | The primary accent - CTAs, links, active states, focus rings |
| Ember Orange (`--color-accent-2`) | `#EA580C` | Gradient mid-stop (buttons, glows) |
| Coral (`--color-coral`) | `#FF6B4A` | Gradient end-stop, used sparingly for glow highlights |
| Deep Amber (`--color-accent-dim`) | `#92400E` | Reserved for disabled/dim accent states |
| Accent Ink (`--color-accent-ink`) | `#180F03` | Text on accent-filled surfaces (contrast-checked, 8.5:1) |

No pure black, no pure white. One accent family (amber → ember → coral, all
part of the same warm hue range, never treated as separate accents), used
identically in every section (hero glow, nav dots, service icons, FAQ hover,
CTA button, progress bar). No purple, no cool-toned neon - the "AI Purple"
default is explicitly rejected in favor of a warm, branded signal color.
Gradients are reserved for buttons and glow/blur decoration; body and
headline text stay solid-color (see Section 3) per the anti-gradient-text
rule for large headers.

## 3. Typography Rules

- **Sans (display + body):** Outfit Variable - geometric, non-Inter, reads as
  premium-technical without tipping into serif-editorial territory that
  doesn't fit an automation vendor's voice.
- **Mono:** JetBrains Mono - reserved for the wordmark, nav-dot labels, and
  client-logo monograms. Not used for body copy.
- **Scale:** Headlines `text-3xl sm:text-4xl` with `text-balance` and
  `tracking-tight`; hierarchy driven by weight and color (accent-colored
  emphasis span), never by oversized scale alone.
- **Body:** `text-[15px]` to `text-[17px]`, `leading-relaxed`, capped `max-w-md`
  (well under 65ch).
- **Banned:** Inter, generic system serif, Fraunces, Instrument Serif.

## 4. Component Stylings

- **Buttons:** Pill radius, one accent fill (primary) / bordered ghost
  (secondary). `active:scale-[0.97]` at 100ms, hover/press transitions target
  `transform,background-color,border-color,color` explicitly - never
  `transition: all`. Icon children nudge on hover (`translate-x-0.5` /
  `rotate-45`) as directional feedback.
- **Cards:** Used only where elevation communicates real hierarchy (services,
  testimonials). The How It Works timeline deliberately skips cards in favor
  of a connecting hairline - proof cards aren't the default.
- **Accordion (FAQ):** Single frame border (`border-t` on the list, `border-b`
  on the last item only) - never a divider on every row. Height animation via
  Radix's `--radix-accordion-content-height` custom property, eased with the
  entering-element curve.
- **Avatars:** Real photo first, graceful initials-in-a-circle fallback on
  load error - never a broken-image glyph or a generic person icon.

## 5. Layout Principles

- Hero is the one deliberate centered composition on the page (brand mark,
  one-sentence mission, one primary + one secondary CTA), justified because
  the scroll-driven image event and the wordmark itself are the design - not
  a default centered-hero fallback. Every section below it stays off-center
  or grid-driven.
- Services is a 1+3 bento (never 3 equal cards) with at least two cells
  carrying real visual variation (ambient glow, grid texture) beyond flat
  white-on-white text.
- Max-width containment via `max-w-7xl`, full-height sections via
  `min-h-[100dvh]` (never `h-screen`).
- No layout family repeats more than once per page: bento (services), then
  connected timeline (how it works), then scroll-snap carousel (testimonials),
  then accordion (FAQ), then full-bleed photo section (CTA).

## 6. Motion & Interaction

Three easing curves, chosen by what the element is doing (not decoration):

| Curve | Value | Used for |
| --- | --- | --- |
| `EASE_OUT` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entering/exiting elements: reveals, buttons, icon crossfades, accordion |
| `EASE_IN_OUT` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen morphing while staying visible |
| `EASE_DRAWER` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawer-style panels: the mobile nav sheet |

- **Hero centerpiece:** `ScrollFlyIn` (`components/ui/hero-section-3.tsx`)
  pins the hero for a 200vh scroll range and flies a large image across the
  full width, fading in/out via `useScroll`/`useTransform` scroll progress.
  The flying image gets a warm treatment applied non-invasively via
  descendant selectors on the wrapper (`saturate-[0.85]`, an amber glow
  shadow, rounded corners, and a `max-h-[62vh]` viewport-height safety cap)
  rather than modifying the vendored component's markup.
- All entrance animations start from `opacity: 0, y: 20-28` (never `scale(0)`).
- Stagger delays are 60-70ms between siblings (emil's 30-80ms band).
- Scroll-linked values use Motion's `useScroll`/`useTransform`, never
  `window.addEventListener('scroll')`.
- One perpetual micro-loop exists on the hero: a slow 4.5s breathing amber
  glow behind the wordmark, and one on the Workflow Automation card's
  ambient glow - both gated by `motion-safe:` - deliberately not applied to
  every element, per "not every card needs an infinite loop."
- Every non-trivial animation is wrapped for `prefers-reduced-motion`
  (`useReducedMotion()` in Hero and Navbar; `motion-reduce:` /
  `motion-safe:` utilities elsewhere). The Hero's reduced-motion fallback
  skips `ScrollFlyIn` entirely and renders a static centered section.

## 7. Anti-Patterns (Banned, and verified absent)

No emojis · no Inter · no pure black · no neon/outer glow · no oversaturated
accents · no 3-column equal-card grid · no generic names ("John Doe",
"Acme") · no fake round numbers · no AI copywriting clichés ("Elevate",
"Seamless", "Unleash") · no scroll-cue text ("Scroll to explore") · no
version-label eyebrows · no em-dashes anywhere on the page · no border on
every row of a list · no `transition: all` · no `ease-in` on UI elements ·
no animating `top`/`left`/`width`/`height`.
