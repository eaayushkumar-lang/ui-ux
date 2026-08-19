import { motion } from "framer-motion";
import { Brain, GitBranch, Radio, UserRoundCog, Zap, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Step {
  n: string;
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string[];
}

const steps: Step[] = [
  {
    n: "01",
    icon: Radio,
    title: "Trigger",
    description: "Something happens in your business.",
    detail: ["New message", "New email", "Form submission", "New lead", "Phone call", "Scheduled event"],
  },
  {
    n: "02",
    icon: Brain,
    title: "Understand",
    description: "AI reads and understands the incoming information — what's being asked, and by whom.",
    detail: [],
  },
  {
    n: "03",
    icon: GitBranch,
    title: "Decide",
    description: "Your business rules determine the correct next step — no guesswork, no improvising.",
    detail: [],
  },
  {
    n: "04",
    icon: Zap,
    title: "Act",
    description: "The system does the work.",
    detail: ["Respond", "Qualify", "Update your CRM", "Schedule", "Send information", "Create records", "Notify staff"],
  },
  {
    n: "05",
    icon: UserRoundCog,
    title: "Human Handoff",
    description: "When real judgment is required, the request is routed to the right person — with full context.",
    detail: [],
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
          <LiquidHeadingReveal>How your AI system actually works.</LiquidHeadingReveal>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim"
        >
          No jargon. Here is the exact path every request takes, from the moment it arrives to the
          moment it's handled.
        </motion.p>

        <ol className="relative mt-14 space-y-4">
          {/* connecting line */}
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
        {step.detail.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {step.detail.map((d) => (
              <span
                key={d}
                className="rounded-full border border-line/70 bg-bg/50 px-3 py-1 font-mono text-[12px] tracking-[0.02em] text-ink-dim"
              >
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}
