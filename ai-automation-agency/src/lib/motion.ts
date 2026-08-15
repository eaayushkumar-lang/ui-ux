// Motion rules (CLAUDE.md): ease-out, 0.6-0.9s for scroll reveals, no
// bounce/elastic easing, default reveal = fade + slide up 30-40px.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// Same curve as a CSS/GSAP-consumable string (GSAP ScrollTrigger reveals
// don't take an array easing the way Framer Motion does).
export const EASE_OUT_CSS = "power3.out";

export const REVEAL_DURATION = 0.75;
export const REVEAL_Y = 36;

// Framer Motion variants for the default "fade in + slide up" reveal
// pattern - used by discrete, component-scoped motion (intro sequence,
// hover/tap states). Scroll-position-driven reveals use GSAP ScrollTrigger
// instead (see lib/gsap.ts) - the two libraries are never mixed on the same
// element, per CLAUDE.md's working-style rule.
export const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: REVEAL_Y },
  visible: { opacity: 1, y: 0 },
} as const;

export const SPRING_HOVER = { type: "spring", stiffness: 260, damping: 20 } as const;
