import { motion } from "framer-motion";
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
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl"
        >
          <LiquidHeadingReveal>
            Every hour your team spends on repetitive work is an hour your competitors are automating.
          </LiquidHeadingReveal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-ink-dim"
        >
          The audit call is free. 30 minutes. We'll map your workflows, identify what's worth
          automating, and tell you honestly what it's worth to your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <BookACallButton size="lg">Book Your Free Automation Audit</BookACallButton>
          <Button variant="secondary" size="lg" onClick={() => scrollToId("contact")}>
            Send Us Your Workflows
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[12px] tracking-[0.02em] text-ink-faint"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            No sales pitch
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            No obligation
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Custom assessment
          </span>
        </motion.div>
      </div>
    </section>
  );
}
