import { motion } from "framer-motion";
import { BookACallButton } from "@/components/book-a-call-button";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

export function CTA() {
  return (
    <section
      id="cta"
      className="relative z-10 overflow-hidden py-28 lg:py-36 [contain:layout_style_paint]"
    >
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl"
        >
          <LiquidHeadingReveal>Not sure what to automate?</LiquidHeadingReveal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-ink-dim"
        >
          We'll look at your current workflow, identify repetitive tasks, and show you where AI
          automation could save time or recover missed opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <BookACallButton size="lg">Book a Free Automation Audit</BookACallButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="mt-8 font-mono text-[12px] tracking-[0.02em] text-ink-faint"
        >
          No sales pitch. No obligation.
        </motion.p>
      </div>
    </section>
  );
}
