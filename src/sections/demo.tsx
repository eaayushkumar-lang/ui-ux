import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { BookACallButton } from "@/components/book-a-call-button";
import { FullSystemDemo } from "@/components/service-demos/full-system-demo";

// The chain a request travels — used above the live demo so a non-technical
// visitor can read the architecture at a glance.
const chain = ["Customer", "AI Agent", "Decision", "CRM", "Calendar", "Follow-up", "Human"];

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
            <LiquidHeadingReveal>See the system in action.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            A simulation of one request flowing through a full system — the same architecture we build
            for real deployments.
          </motion.p>
        </div>

        {/* Request chain */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2"
        >
          {chain.map((node, i) => (
            <span key={node} className="flex items-center gap-2">
              <span className="rounded-full border border-line/70 bg-bg/50 px-3 py-1 font-mono text-[12px] text-ink-dim">
                {node}
              </span>
              {i < chain.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-ink-faint" strokeWidth={2} />}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="glass-card mt-8 rounded-[var(--radius-card)] p-6 sm:p-8"
        >
          <FullSystemDemo />
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-medium text-ink">Want this for your business?</p>
          <BookACallButton size="lg">Book a Free Automation Audit</BookACallButton>
        </div>
      </div>
    </section>
  );
}
