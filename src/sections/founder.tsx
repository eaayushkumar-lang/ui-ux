import { motion } from "framer-motion";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { BookACallButton } from "@/components/book-a-call-button";

export function Founder() {
  return (
    <section id="founder" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Meet the Founder</LiquidHeadingReveal>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="glass-card mx-auto mt-10 flex max-w-md flex-col items-center rounded-[var(--radius-card)] p-9"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-xl text-accent">
            A
          </span>
          <h3 className="mt-5 text-lg font-medium text-ink">Ayush</h3>
          <p className="text-[13px] text-ink-faint">Founder, Aurevyn</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
            Building practical AI automation systems that help businesses reduce repetitive work
            and respond faster to customers.
          </p>
          <BookACallButton variant="secondary" className="mt-7">
            Talk to Ayush
          </BookACallButton>
        </motion.div>
      </div>
    </section>
  );
}
