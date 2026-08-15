import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { EASE_OUT, REVEAL_Y } from "@/lib/motion";
import { INTRO_TOTAL_MS } from "@/components/intro-sequence";

// Three.js is the heaviest dependency in the bundle; lazy-load the effect
// even though the hero's is above the fold, so the hero text/CTAs paint
// from the small main chunk while Three.js streams in behind them.
const ParticleField = lazy(() =>
  import("@/components/particle-field").then((m) => ({ default: m.ParticleField })),
);

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Hero carries the "rings" particle effect: a glowing core with orbiting
 * violet/amber rings behind the headline. Headline + subtext fade/slide in
 * after the intro resolves - reduced motion never shows the intro overlay,
 * so its content appears immediately rather than waiting out a delay tuned
 * for an animation that never played.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const introDelay = reduceMotion ? 0 : INTRO_TOTAL_MS / 1000;

  return (
    <section id="hero" className="relative flex min-h-dvh items-center overflow-hidden">
      <Suspense fallback={null}>
        <ParticleField formation="rings" />
      </Suspense>
      <Nav />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-32 sm:px-10">
        <motion.h1
          initial={reduceMotion ? undefined : { opacity: 0, y: REVEAL_Y }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: introDelay, ease: EASE_OUT }}
          className="text-balance font-medium leading-[1.08] text-ink"
          style={{ fontSize: "clamp(2.25rem, 2.5vw + 1.75rem, 4rem)" }}
        >
          [Placeholder headline — what this agency does, in one confident line]
        </motion.h1>

        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: REVEAL_Y }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: introDelay + 0.12, ease: EASE_OUT }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
        >
          [Placeholder subtext — a sentence or two on how the agency automates work for
          clients, what makes the approach different, and who it's for.]
        </motion.p>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: REVEAL_Y }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: introDelay + 0.24, ease: EASE_OUT }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button variant="primary" onClick={() => scrollToId("services")}>
            [Placeholder primary CTA]
          </Button>
          <Button variant="secondary" onClick={() => scrollToId("system")}>
            [Placeholder secondary CTA]
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
