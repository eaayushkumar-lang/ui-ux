import { motion } from "framer-motion";
import {
  Brain,
  GitBranch,
  Headset,
  LineChart,
  Plug,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Part {
  icon: LucideIcon;
  title: string;
  description: string;
}

const parts: Part[] = [
  {
    icon: Brain,
    title: "AI Agent",
    description:
      "A trained model that reads incoming messages, understands intent, and responds or takes action based on your rules.",
  },
  {
    icon: GitBranch,
    title: "Decision Logic",
    description:
      "Conditional routing that sends every request down the right path — qualify, schedule, escalate, or respond.",
  },
  {
    icon: Plug,
    title: "Tool Integrations",
    description:
      "Connections to your CRM, calendar, inbox, phone, and internal tools — so data moves automatically, not manually.",
  },
  {
    icon: Headset,
    title: "Human Handoff",
    description:
      "Clear escalation points where anything outside the system's confidence goes to the right person, with full context.",
  },
  {
    icon: Shield,
    title: "Guardrails & Logging",
    description:
      "Every action logged, every edge case caught. The system never guesses on something it shouldn't — it asks.",
  },
  {
    icon: LineChart,
    title: "Monitoring & Tuning",
    description:
      "Ongoing performance tracking so the system improves on real usage — not just at launch, but continuously.",
  },
];

export function WhatYouGet() {
  return (
    <section id="what-you-get" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
          >
            What you actually get
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>Not a chatbot. A complete system.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Every Aurevyn deployment ships with these six layers — the same architecture
            whether it handles customer support, lead qualification, or internal operations.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part, i) => (
            <PartCard key={part.title} part={part} index={i} />
          ))}
        </div>

        {/* Architecture flow — visual representation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="glass-card mt-12 rounded-[var(--radius-card)] border-accent/20 p-8"
        >
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            System architecture
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Trigger", "AI Agent", "Decision Logic", "Action", "Logging", "Human Handoff"].map(
              (node, i, arr) => (
                <span key={node} className="flex items-center gap-3">
                  <span className="rounded-lg border border-line/70 bg-bg/60 px-4 py-2 font-mono text-[13px] text-ink-dim">
                    {node}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-accent" aria-hidden>
                      &rarr;
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
          <p className="mt-6 text-center text-[14px] text-ink-faint">
            Every request follows the same path. Nothing is ad-hoc — the system knows what to do
            before the request arrives.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PartCard({ part, index }: { part: Part; index: number }) {
  const Icon = part.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      whileHover={{ scale: 1.02, y: -5, transition: SPRING_HOVER }}
      className="gpu glass-card group flex flex-col rounded-[var(--radius-card)] p-7"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent transition-[border-color,box-shadow] duration-300 group-hover:border-accent group-hover:shadow-[0_0_22px_-4px_rgba(193,80,46,0.5)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="text-lg font-medium text-ink">{part.title}</h3>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{part.description}</p>
    </motion.article>
  );
}
