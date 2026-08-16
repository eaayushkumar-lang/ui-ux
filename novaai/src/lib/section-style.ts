// Shared visual tokens for the content sections BELOW the hero. Scoped to the
// new sections only — the hero (scroll-video / section-one / section-two /
// navbar / reveal) is untouched and keeps its own styling.

/**
 * Frosted-glass panel for a dark (non-video) background. The visual (raised
 * fill, gradient sheen, border, inner highlight) is authored in index.css as
 * `.glass-panel` using plain rgba — NOT Tailwind arbitrary-value utilities —
 * so it can't be dropped by content-scanning and renders in any browser.
 * Layout (rounding/padding) stays as normal Tailwind utilities.
 */
export const glassCard = "glass-panel rounded-2xl";

/** Interactive variant: fill + border brighten on hover (see index.css). */
export const glassCardHover = "glass-panel glass-panel-interactive rounded-2xl";

/**
 * Raised near-black band — a touch lighter (and a hair cooler) than the
 * #0a0a0a base — used on alternating sections so they read as distinct bands
 * instead of one undifferentiated black block. Subtle by design.
 */
export const sectionRaised = "section-raised";

/** Hairline divider drawn at the top edge of a section. */
export const sectionDivider = "section-divider";
