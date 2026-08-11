import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CTA() {
  return (
    <section id="cta" className="relative z-10 overflow-hidden bg-surface py-28 lg:py-36">
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/auxai-systems-dark/1800/900"
          alt=""
          className="h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/70" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl"
        >
          Your competitors are still doing this by hand.
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
          <Button size="lg" asChild>
            <a href="mailto:hello@auxai.ai?subject=Book%20a%20call%20with%20AUXAI.AI">
              Book a Call
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
