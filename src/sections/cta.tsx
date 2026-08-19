import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { BookACallButton } from "@/components/book-a-call-button";
import { Button } from "@/components/ui/button";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CTA() {
  return (
    <section
      id="cta"
      className="relative z-10 overflow-hidden py-28 lg:py-36 [contain:layout_style_paint]"
    >
      {/* Transparent: the fixed ScrollVideo shows through, matching every other section. */}
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl"
        >
          <LiquidHeadingReveal>
            Your business already runs on workflows. The question is whether they're still manual.
          </LiquidHeadingReveal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-ink-dim"
        >
          We'll identify exactly where AI and automation can remove repetitive work from your
          business — and what it's worth to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <BookACallButton size="lg">Book Your Free Automation Audit</BookACallButton>
          <Button variant="secondary" size="lg" onClick={() => scrollToId("services")}>
            <Compass className="h-4 w-4" strokeWidth={1.75} />
            See What We Can Automate
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
