// Shared visual tokens for the content sections BELOW the hero. Scoped to the
// new sections only — the hero (scroll-video / section-one / section-two /
// navbar / reveal) is untouched and keeps its own styling.

/**
 * Frosted-glass panel for a dark (non-video) background. On solid black there
 * is nothing translucent behind the card, so backdrop-blur does nothing and a
 * 6%-white fill is invisible. The "glass" is therefore built from real
 * contrast: a clearly-raised fill (guaranteed background-color floor), a
 * top-lit gradient sheen over it, a defined border, and a bright 1px inner top
 * highlight — so the card reads as a lit glass panel, not a flat black box.
 */
export const glassCard =
  "rounded-2xl border border-white/15 bg-white/[0.09] bg-linear-to-b from-white/[0.08] to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]";

/** Interactive variant: fill + border brighten on hover (smooth via bg-color). */
export const glassCardHover =
  glassCard + " transition-colors duration-300 hover:bg-white/[0.13] hover:border-white/25";

/**
 * Raised near-black band — a touch lighter (and a hair cooler) than the
 * #0a0a0a base — used on alternating sections so they read as distinct bands
 * instead of one undifferentiated black block. Subtle by design.
 */
export const sectionRaised = "bg-[#0e0e12]";

/** Hairline divider drawn at the top edge of a section. */
export const sectionDivider = "border-t border-white/[0.06]";
