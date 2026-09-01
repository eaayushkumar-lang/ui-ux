import { motion } from "framer-motion";
import { Compass, Rocket, Search, Wrench, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Step {
  n: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    n: "01",
    icon: Search,
    title: "Discover",
    description: "We identify repetitive processes costing your team time.",
  },
  {
    n: "02",
    icon: Compass,
    title: "Design",
    description: "We map the workflow and decide where AI and automation make sense.",
  },
  {
    n: "03",
    icon: Wrench,
    title: "Build",
    description: "We connect your existing tools into one automated system.",
  },
  {
    n: "04",
    icon: Rocket,
    title: "Deploy",
    description: "We test, launch, and monitor the system.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>How Aurevyn works.</LiquidHeadingReveal>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim"
        >
          A straightforward path from your current workflow to a system that runs itself.
        </motion.p>

        <ol className="relative mt-14 space-y-4">
          <span
            aria-hidden
            className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-accent/40 via-line to-accent/40"
          />
          {steps.map((step, i) => (
            <StepRow key={step.title} step={step} index={i} />
          ))}
        </ol>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="glass-card mt-12 rounded-[var(--radius-card)] border-accent/25 p-8 text-center"
        >
          <p className="text-balance text-xl font-medium leading-snug text-ink md:text-2xl">
            Your team doesn't operate the automation.{" "}
            <span className="text-accent">The automation operates the workflow.</span>
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}

function StepRow({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
      className="relative flex gap-5"
    >
      <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-bg text-accent shadow-[0_0_0_6px_var(--color-bg)]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="glass-card flex-1 rounded-[var(--radius-card)] p-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-ink-faint">{step.n}</span>
          <h3 className="text-lg font-medium text-ink">{step.title}</h3>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{step.description}</p>
      </div>
    </motion.li>
  );
}
