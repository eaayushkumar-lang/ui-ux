import { motion } from "framer-motion";
import { PenTool, Rocket, Search, TrendingUp, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";

interface Step {
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    index: "01",
    icon: Search,
    title: "Discovery",
    description:
      "We map every workflow, tool, and decision point in your operation to find where an agent creates real leverage.",
  },
  {
    index: "02",
    icon: PenTool,
    title: "Design",
    description:
      "We architect the exact agent, integrations, and guardrails your workflow needs, then design a rollout your team can adopt.",
  },
  {
    index: "03",
    icon: Rocket,
    title: "Deploy",
    description:
      "We ship into your live stack, connect your existing tools, and run it alongside your team until it's carrying real work.",
  },
  {
    index: "04",
    icon: TrendingUp,
    title: "Outperform",
    description:
      "Your system keeps improving on its own data, compounding the advantage while competitors are still writing their first prompt.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 bg-bg py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          From first call to a system that runs itself.
        </motion.h2>

        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-line md:block"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
              whileHover={{ scale: 1.03, transition: SPRING_HOVER }}
              className="gpu group relative cursor-pointer border-l border-line pl-6 md:border-l-0 md:pl-0"
            >
              <div className="relative z-10 flex items-center gap-3 md:mb-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg text-accent shadow-[0_0_0px_rgba(255,184,0,0)] transition-[box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-accent group-hover:shadow-[0_0_22px_2px_rgba(255,184,0,0.4)]">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="font-mono text-sm text-ink-faint md:hidden">
                  {step.index}
                </span>
              </div>
              <span className="hidden font-mono text-sm text-ink-faint md:block">
                {step.index}
              </span>
              <h3 className="mt-2 text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-dim">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
