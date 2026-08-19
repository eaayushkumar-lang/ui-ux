import { motion } from "framer-motion";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Phase {
  n: string;
  title: string;
  description: string;
}

const phases: Phase[] = [
  { n: "01", title: "Audit", description: "We map your workflows and find the repetitive work worth automating first." },
  { n: "02", title: "Architect", description: "We design the system — the logic, the integrations, and the human handoffs." },
  { n: "03", title: "Build", description: "We connect AI, automation, and your existing business tools into one flow." },
  { n: "04", title: "Test", description: "We test normal cases, edge cases, and every point where a human takes over." },
  { n: "05", title: "Deploy", description: "We launch into your live workflow and run alongside your team." },
  { n: "06", title: "Optimize", description: "We monitor, tune, and expand the system as your business grows." },
];

export function Process() {
  return (
    <section id="process" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>From manual work to an automated system.</LiquidHeadingReveal>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase, i) => (
            <motion.article
              key={phase.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
              className="glass-card relative overflow-hidden rounded-[var(--radius-card)] p-7"
            >
              <span className="pointer-events-none absolute -right-2 -top-4 font-mono text-6xl font-semibold text-accent/10">
                {phase.n}
              </span>
              <p className="font-mono text-sm text-accent">{phase.n}</p>
              <h3 className="mt-2 text-lg font-medium text-ink">{phase.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{phase.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
