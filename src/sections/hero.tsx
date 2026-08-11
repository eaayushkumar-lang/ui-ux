import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { ScrollFlyIn } from "@/components/ui/hero-section-3";
import { Button } from "@/components/ui/button";
import { EASE_OUT as EASE } from "@/lib/motion";

const AI_IMAGE_URL =
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&h=1000&q=80";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function HeroCopy() {
  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px] motion-safe:animate-breathe"
      />

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative text-6xl font-medium tracking-tight text-ink sm:text-7xl lg:text-8xl"
      >
        AUXAI<span className="text-accent">.AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        className="relative mt-6 max-w-lg text-balance text-lg leading-relaxed text-ink-dim sm:text-xl"
      >
        We don't automate tasks. We build systems that outperform everyone.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
        className="relative mt-10 flex flex-wrap items-center justify-center gap-4"
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
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section
        id="hero"
        className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-bg pt-[72px]"
      >
        <HeroCopy />
      </section>
    );
  }

  return (
    <ScrollFlyIn
      id="hero"
      imageUrl={AI_IMAGE_URL}
      imageAlt="A human hand and a robotic hand reaching toward each other, representing AI and human collaboration"
      className="overflow-hidden bg-bg [&>div]:pt-16 [&_img]:max-h-[62vh] [&_img]:w-auto [&_img]:rounded-[2rem] [&_img]:shadow-[0_30px_90px_-20px_rgba(245,158,11,0.4)] [&_img]:saturate-[0.85] [&_img]:contrast-[1.05]"
    >
      <HeroCopy />
    </ScrollFlyIn>
  );
}
