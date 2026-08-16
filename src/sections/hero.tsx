import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";
import { RobotFlyby } from "@/components/ui/robot-flyby";
import { Button } from "@/components/ui/button";
import { BookACallButton } from "@/components/book-a-call-button";
import { LiquidHeroTitle, ShimmerText } from "@/components/liquid-text";
import { EASE_OUT as EASE } from "@/lib/motion";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[100dvh] items-center overflow-hidden pt-8 [contain:layout_style_paint]"
    >
      {/* Text comes first in source order so it stacks on top on mobile;
          flex-row puts it in the left column on desktop, globe on the right. */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:gap-10 lg:py-0">
        <div className="mx-auto max-w-lg text-center lg:mx-0 lg:basis-1/2 lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-5xl font-medium tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            <LiquidHeroTitle>
              AUXAI<span className="text-accent">.AI</span>
            </LiquidHeroTitle>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-6 text-balance text-lg leading-relaxed sm:text-xl"
          >
            <ShimmerText>
              We don't automate tasks. We build systems that outperform everyone.
            </ShimmerText>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <BookACallButton />
            <Button variant="secondary" onClick={() => scrollToId("services")}>
              <Compass
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:rotate-45"
                strokeWidth={1.75}
              />
              Explore Services
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-none lg:basis-1/2"
        >
          {/* Renders in-flow here (not a page-root scroll-linked overlay
              like the old FloatingGlobe) - once assembled, the robot stays
              fixed in the hero and scrolls away with the rest of its
              content, rather than persisting/sliding across the page. */}
          <RobotFlyby />
        </motion.div>
      </div>
    </section>
  );
}
