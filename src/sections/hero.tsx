import { useRef } from "react";
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Globe } from "@/components/globe";
import { Button } from "@/components/ui/button";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

const EASE = EASE_OUT;
const scrollEase = cubicBezier(...EASE_IN_OUT);

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function HeroCopy() {
  return (
    <div className="max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-balance text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl"
      >
        We don't automate tasks.{" "}
        <span className="text-accent">We build systems that outperform everyone.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-dim"
      >
        AUXAI.AI designs, builds, and deploys AI agents and automation systems for
        teams who refuse to compete on effort.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
        className="mt-10 flex flex-wrap items-center gap-4"
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
  );
}

export function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9], { ease: scrollEase });
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.35], {
    ease: [scrollEase, scrollEase],
  });
  const radius = useTransform(scrollYProgress, [0, 1], [0, 40], { ease: scrollEase });
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -60], { ease: scrollEase });

  if (reduceMotion) {
    return (
      <section id="hero" className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg">
        <HeroBackground />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-[72px]">
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <div id="hero" ref={pinRef} className="relative h-[170dvh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div
          style={{ scale, opacity, borderRadius: radius, y: panelY }}
          className="relative flex h-full w-full items-center overflow-hidden bg-bg"
        >
          <HeroBackground />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-[72px]">
            <HeroCopy />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HeroBackground() {
  return (
    <>
      <div className="absolute inset-y-0 right-[-10%] w-full opacity-80 lg:w-[64%]">
        <Globe />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </>
  );
}
