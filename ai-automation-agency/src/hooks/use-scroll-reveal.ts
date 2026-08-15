import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE_OUT_CSS, REVEAL_DURATION, REVEAL_Y } from "@/lib/motion";

interface ScrollRevealOptions {
  /** Extra delay (seconds) before the reveal starts, for staggering
   * multiple elements within the same section. */
  delay?: number;
  /** 0-1, how far up the viewport the element needs to scroll before
   * triggering - matches ScrollTrigger's `start: "top {n}%"` shorthand. */
  startPercent?: number;
}

/**
 * Shared "fade in + slide up" scroll reveal (CLAUDE.md's default reveal
 * pattern), built on GSAP ScrollTrigger - the scroll-linked half of the
 * "Framer Motion for discrete, GSAP for scroll-position" split. Fires once
 * per element (once: true) so scrolling back up and down again never
 * re-triggers it. Under prefers-reduced-motion the element is just set to
 * its final visible state immediately, with no ScrollTrigger instance
 * created at all.
 */
export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { delay = 0, startPercent = 80 }: ScrollRevealOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y: REVEAL_Y });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top ${startPercent}%`,
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          delay,
          ease: EASE_OUT_CSS,
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(el);
    };
  }, [ref, delay, startPercent]);
}
