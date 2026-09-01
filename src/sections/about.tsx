import { motion } from "framer-motion";
import { Plug, Settings2, UserRoundCog, Zap, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: Zap,
    title: "Practical automation",
    description: "We focus on tasks that genuinely consume time.",
  },
  {
    icon: Settings2,
    title: "Custom systems",
    description: "No one-size-fits-all automation packages.",
  },
  {
    icon: UserRoundCog,
    title: "Human handoff",
    description: "AI handles what it can. People take over when needed.",
  },
  {
    icon: Plug,
    title: "Built around your existing tools",
    description: "We connect the systems your team already uses.",
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
            <LiquidHeadingReveal>Not another chatbot.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            We design complete workflows around the way your business actually operates.
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
