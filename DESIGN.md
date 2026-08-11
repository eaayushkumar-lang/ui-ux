# Design System: AUXAI.AI

Generated per the `stitch-design-taste` semantic design system format. This is
the single source of truth for AUXAI.AI's visual language - cross-referenced
against `ui-ux-pro-max`, `emil-design-eng`, `impeccable-lite`,
`design-taste-frontend`, and `design-taste-frontend-v1`.

## 1. Visual Theme & Atmosphere

A dark, cinematic, confident interface for an AI automation agency selling to
operators who are tired of vendor theater. The mood is clinical-premium, not
flashy: a single teal signal color against near-black, one animated centerpiece
(the hero network globe), and restraint everywhere else. Dense enough to feel
substantive, airy enough to feel expensive.

- **Density:** Daily App Balanced (4/10) - standard `py-24` to `py-32` section
  rhythm, no cockpit-density data.
- **Variance:** Offset Asymmetric (9/10) - asymmetric hero split, 1+3 bento
  services grid, no centered hero, no 3-equal-card rows.
- **Motion:** Cinematic Choreography (8/10) - scroll-pinned hero stack, but
  every animation is scoped to `transform`/`opacity`, motivated, and
  `prefers-reduced-motion`-safe.

## 2. Color Palette & Roles

| Token | Hex | Role |
| --- | --- | --- |
| Void Black (`--color-bg`) | `#08090C` | Primary background |
| Slate Surface (`--color-surface`) | `#0E1116` | Section-level tint (trust strip, services, testimonials) |
| Raised Surface (`--color-surface-2`) | `#151922` | Card fill |
| Elevated Surface (`--color-surface-3`) | `#1B202B` | Featured card gradient stop |
| Hairline (`--color-line`) | `#23293380` | 1px borders, dividers |
| Ink (`--color-ink`) | `#F3F4F6` | Primary text |
| Ink Dim (`--color-ink-dim`) | `#9AA1AD` | Secondary text, body copy |
| Ink Faint (`--color-ink-faint`) | `#656C78` | Tertiary text, mono labels |
| Signal Teal (`--color-accent`) | `#3FD9BE` | The one accent - CTAs, links, active states, glow |
| Signal Teal Dim (`--color-accent-dim`) | `#2A8F7D` | Reserved for future disabled/dim accent states |
| Accent Ink (`--color-accent-ink`) | `#04120E` | Text on accent-filled surfaces (contrast-checked) |

No pure black, no pure white. One accent, used identically in every section
(hero CTA, nav dots, service icons, FAQ hover, CTA button). No purple, no
neon glow - the "AI Purple" default is explicitly rejected.

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

- Hero is an asymmetric split (copy left, globe right), never centered.
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
| `EASE_IN_OUT` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen morphing while staying visible: the hero's scroll-linked pin/scale/recede |
| `EASE_DRAWER` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawer-style panels: the mobile nav sheet |

- All entrance animations start from `opacity: 0, y: 20-28` (never `scale(0)`).
- Stagger delays are 60-70ms between siblings (emil's 30-80ms band).
- Scroll-linked values use Motion's `useScroll`/`useTransform`, never
  `window.addEventListener('scroll')`.
- One perpetual micro-loop exists on the whole page: a slow 4.5s breathing
  pulse on the Workflow Automation card's ambient glow, gated by
  `motion-safe:` - deliberately not applied to every card, per "not every
  card needs an infinite loop."
- Every non-trivial animation is wrapped for `prefers-reduced-motion`
  (`useReducedMotion()` in Hero, Navbar, Globe; `motion-reduce:` /
  `motion-safe:` utilities elsewhere).

## 7. Anti-Patterns (Banned, and verified absent)

No emojis · no Inter · no pure black · no neon/outer glow · no oversaturated
accents · no 3-column equal-card grid · no generic names ("John Doe",
"Acme") · no fake round numbers · no AI copywriting clichés ("Elevate",
"Seamless", "Unleash") · no scroll-cue text ("Scroll to explore") · no
version-label eyebrows · no em-dashes anywhere on the page · no border on
every row of a list · no `transition: all` · no `ease-in` on UI elements ·
no animating `top`/`left`/`width`/`height`.
