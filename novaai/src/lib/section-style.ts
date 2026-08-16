// Shared visual tokens for the content sections BELOW the hero. Scoped to the
// new sections only — the hero (scroll-video / section-one / section-two /
// navbar / reveal) is untouched and keeps its own styling.

/**
 * Frosted-glass panel for a dark (non-video) background. backdrop-blur alone
 * reads as nothing over solid black, so the "glass" comes from a raised white
 * fill, a hairline border, and a 1px inner top highlight that mimics light
 * catching a frosted edge — so the card looks like a glass panel, not a flat
 * dark rectangle.
 */
export const glassCard =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]";

/** Interactive variant: lifts a little brighter on hover, transitions cleanly. */
export const glassCardHover =
  glassCard + " transition-colors duration-300 hover:bg-white/[0.10] hover:border-white/20";

/**
 * Raised near-black band — a touch lighter (and a hair cooler) than the
 * #0a0a0a base — used on alternating sections so they read as distinct bands
 * instead of one undifferentiated black block. Subtle by design.
 */
export const sectionRaised = "bg-[#0e0e12]";

/** Hairline divider drawn at the top edge of a section. */
export const sectionDivider = "border-t border-white/[0.06]";
