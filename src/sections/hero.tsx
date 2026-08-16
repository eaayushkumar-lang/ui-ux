import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookACallButton } from "@/components/book-a-call-button";
import { LiquidHeroTitle, ShimmerText } from "@/components/liquid-text";
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
      {/* Robot removed - the scroll video is now the only hero visual, so the
          copy sits over it as a centered single column. */}
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
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
      </div>
    </section>
  );
}
