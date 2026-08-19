import { motion } from "framer-motion";
import { Target, Wrench, Users, LineChart, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: Target,
    title: "Business-First",
    description: "We start with the workflow and the outcome, not the technology. The AI is a means, never the point.",
  },
  {
    icon: Wrench,
    title: "Custom-Built",
    description: "Every system is designed around how your business actually runs — not forced into a generic template.",
  },
  {
    icon: Users,
    title: "Human + AI",
    description: "AI handles the repetitive work. Your people handle judgment. The handoff between them is deliberate.",
  },
  {
    icon: LineChart,
    title: "Continuously Improved",
    description: "Systems are monitored, tuned, and expanded over time — they get better as your business grows.",
  },
];

export function About() {
  return (
    <section id="why" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>We don't sell bots. We build business systems.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            A chatbot answers a question. A system runs a workflow. That difference is the whole
            business — and it's what we build.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              whileHover={{ scale: 1.02, y: -5, transition: SPRING_HOVER }}
              className="gpu glass-card group flex flex-col rounded-[var(--radius-card)] p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent transition-[border-color] duration-300 group-hover:border-accent">
                <pillar.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-medium text-ink">{pillar.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{pillar.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
