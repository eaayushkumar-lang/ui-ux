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
      {/* Transparent: the fixed ScrollVideo shows through, matching every other
          section (the old per-section background image + opaque `from-surface`
          gradient scrim that hid the video have been removed). */}
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl"
        >
          <LiquidHeadingReveal>Your competitors are still doing this by hand.</LiquidHeadingReveal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-ink-dim"
        >
          Book a call and we'll show you exactly what to automate first, and
          what it's worth to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10"
        >
          <BookACallButton size="lg" />
        </motion.div>
      </div>
    </section>
  );
}
