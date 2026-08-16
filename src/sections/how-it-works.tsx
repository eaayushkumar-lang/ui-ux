import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PenTool, Rocket, Search, TrendingUp, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { cn } from "@/lib/utils";

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

const Heading = () => (
  <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl">
    <LiquidHeadingReveal>From first call to a system that runs itself.</LiquidHeadingReveal>
  </h2>
);

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    function measure() {
      if (trackRef.current) {
        setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 48));
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (reduceMotion) {
    return (
      <section id="how-it-works" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
        <div className="mx-auto max-w-7xl px-6">
          <Heading />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <StepCard key={step.title} step={step} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="how-it-works"
      ref={wrapRef}
      className="relative bg-bg [contain:layout_style]"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Heading />
          </motion.div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-14 flex w-max gap-6 px-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {steps.map((step) => (
            <StepCard key={step.title} step={step} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4, transition: SPRING_HOVER }}
      className={cn(
        "gpu glass-card group flex w-[280px] shrink-0 cursor-pointer flex-col gap-6 rounded-[var(--radius-card)] p-7 sm:w-[320px] sm:p-8",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg text-accent shadow-[0_0_0px_rgba(255,184,0,0)] transition-[box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-accent group-hover:shadow-[0_0_22px_2px_rgba(255,184,0,0.4)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-sm text-ink-faint">{step.index}</span>
      </div>
      <div>
        <h3 className="text-lg font-medium text-ink">{step.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{step.description}</p>
      </div>
    </motion.div>
  );
}
