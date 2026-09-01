import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { Button } from "@/components/ui/button";
import { FullSystemDemo } from "@/components/service-demos/full-system-demo";

export function Demo() {
  return (
    <section id="demo" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            Live demo
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>See it, don't just read about it.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            A live simulation of an AI receptionist — the same architecture we build for real
            deployments. Type a message like a real customer would and watch it respond, qualify,
            and book instantly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="glass-card mt-10 rounded-[var(--radius-card)] p-6 sm:p-8"
        >
          <FullSystemDemo />
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <Button asChild size="lg">
            <Link to="/try/ai-agents">Try the Live Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
