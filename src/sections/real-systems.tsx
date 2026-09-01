import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Home, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface DemoSystem {
  icon: LucideIcon;
  industry: string;
  flow: string[];
  description: string;
}

const systems: DemoSystem[] = [
  {
    icon: Building2,
    industry: "Dental Clinic",
    flow: ["Missed Call", "AI Receptionist", "Qualification", "Booking"],
    description:
      "A patient inquiry comes in any time, day or night. The AI answers instantly, asks what they need, and books the appointment — no one lifts a finger.",
  },
  {
    icon: Home,
    industry: "Real Estate",
    flow: ["Lead", "AI Qualification", "CRM", "Agent Notification", "Follow-Up"],
    description:
      "A buyer inquiry is qualified automatically, logged into your CRM, and the agent is notified — with automatic follow-up if the lead goes quiet.",
  },
  {
    icon: Briefcase,
    industry: "Agency / Professional Services",
    flow: ["New Lead", "Qualification", "Proposal", "CRM", "Follow-Up"],
    description:
      "Inbound leads are qualified and organized automatically, with follow-up sequences that keep the conversation moving without manual chasing.",
  },
];

export function RealSystems() {
  return (
    <section id="demo-systems" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
          >
            Demo systems
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>Systems we've actually built.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Labeled clearly as demo/concept builds — see exactly how each one works.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {systems.map((system, i) => (
            <SystemCard key={system.industry} system={system} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemCard({ system, index }: { system: DemoSystem; index: number }) {
  const Icon = system.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover={{ scale: 1.015, y: -5, transition: SPRING_HOVER }}
      className="gpu glass-card flex flex-col rounded-[var(--radius-card)] p-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <span className="rounded-full border border-line/70 bg-bg/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          Demo / Concept Build
        </span>
      </div>

      <h3 className="mt-6 text-lg font-medium text-ink">{system.industry}</h3>

      <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 border-t border-line/50 pt-4">
        {system.flow.map((node, i) => (
          <span key={node} className="flex items-center gap-1.5">
            <span className="rounded-full border border-line/70 bg-bg/50 px-2.5 py-1 font-mono text-[11px] text-ink-dim">
              {node}
            </span>
            {i < system.flow.length - 1 && (
              <ArrowRight className="h-3 w-3 shrink-0 text-ink-faint" strokeWidth={2} />
            )}
          </span>
        ))}
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{system.description}</p>
    </motion.article>
  );
}
