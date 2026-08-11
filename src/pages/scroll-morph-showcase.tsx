import { TrialShell } from "@/components/trial-shell";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";

/**
 * Standalone showcase for the scroll-morph hero experiment. The component
 * hijacks wheel/touch scroll inside its own container to drive its
 * circle-to-arc morph, so it is deliberately isolated in a fixed-height box
 * here rather than embedded inline in a normally-scrolling page - dropping
 * it into the homepage flow would trap the mouse wheel the moment a visitor
 * scrolled over it.
 */
export function ScrollMorphShowcasePage() {
  return (
    <TrialShell title="Scroll-Morph Hero" eyebrow="Experiments">
      <div className="relative h-[640px] w-full overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-[800px]">
        <ScrollMorphHero />
      </div>
      <p className="mt-6 text-center text-sm text-ink-faint">
        Scroll (or swipe) inside the box above - the wheel is captured there, not on the page.
      </p>
    </TrialShell>
  );
}
