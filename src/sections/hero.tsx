import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookACallButton } from "@/components/book-a-call-button";
import { LiquidHeroTitle } from "@/components/liquid-text";
import { EASE_OUT as EASE } from "@/lib/motion";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[100dvh] items-center overflow-hidden pt-8 [contain:layout_style_paint]"
    >
      {/* The scroll video is the only hero visual, so the copy sits over it as
          a centered single column. The video/animation itself is a locked
          asset — only the surrounding copy and CTAs are tuned here. */}
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 font-mono text-xs tracking-[0.04em] text-ink-dim backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI agents &amp; automation systems for modern businesses
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            <LiquidHeroTitle>
              Stop paying people to do work <span className="text-accent">AI can handle.</span>
            </LiquidHeroTitle>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-dim sm:text-xl"
          >
            We build AI agents and automated systems that handle repetitive customer, sales, and
            operational workflows — so your team focuses on the work that actually needs humans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <BookACallButton size="lg">Book a Free Automation Audit</BookACallButton>
            <Button variant="secondary" size="lg" onClick={() => scrollToId("how-it-works")}>
              <Compass
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:rotate-45"
                strokeWidth={1.75}
              />
              See How It Works
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="mt-5 font-mono text-[12px] tracking-[0.03em] text-ink-faint"
          >
            No sales pitch — a working map of what you can automate first.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
