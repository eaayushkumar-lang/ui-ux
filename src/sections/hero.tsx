import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { NeuralVisual } from "@/components/neural-visual";
import { Button } from "@/components/ui/button";
import { EASE_OUT as EASE } from "@/lib/motion";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg pt-8"
    >
      {/* Visual comes first in source order so it stacks on top on mobile;
          the lg: grid puts it in the left column on desktop. */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-10 lg:py-0">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-none"
        >
          <NeuralVisual className="h-full w-full" />
        </motion.div>

        <div className="mx-auto max-w-lg text-center lg:mx-0 lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-5xl font-medium tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            AUXAI<span className="text-accent">.AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-6 text-balance text-lg leading-relaxed text-ink-dim sm:text-xl"
          >
            We don't automate tasks. We build systems that outperform everyone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Button onClick={() => scrollToId("cta")}>
              Book a Call
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Button>
            <Button variant="secondary" onClick={() => scrollToId("services")}>
              <Compass
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:rotate-45"
                strokeWidth={1.75}
              />
              Explore Services
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
