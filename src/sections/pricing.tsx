import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookACallButton } from "@/components/book-a-call-button";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { cn } from "@/lib/utils";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(193,80,46,0.4), 0 30px 60px -20px rgba(0,0,0,0.65), 0 0 46px -8px rgba(193,80,46,0.4)";
const CARD_BASE_SHADOW =
  "0 0 0 1px rgba(193,80,46,0), 0 30px 60px -20px rgba(0,0,0,0), 0 0 46px -8px rgba(193,80,46,0)";
const FEATURED_BASE_SHADOW =
  "0 0 0 1px rgba(193,80,46,0.35), 0 34px 68px -20px rgba(0,0,0,0.7), 0 0 60px -10px rgba(193,80,46,0.5)";

interface Step {
  name: string;
  description: string;
  cta: string;
  /** The middle step is a real conversion point (submitting the contact
   * form), not just a step along the way, so it keeps the same visually
   * emphasized treatment the old "Most Popular" tier used - minus the
   * pricing-specific badge, which doesn't make sense for a process step. */
  featured?: boolean;
}

const steps: Step[] = [
  {
    name: "Discovery Call",
    description:
      "We learn about your business, workflows, and goals. Free, no obligation. 30 minutes.",
    cta: "Book Free Call",
  },
  {
    name: "Custom Proposal",
    description:
      "We design a tailored AI solution with transparent pricing based on your exact requirements.",
    cta: "Get Your Proposal",
    featured: true,
  },
  {
    name: "Build & Launch",
    description: "We build, test, and deploy your AI system. Ongoing support included.",
    cta: "Let's Start",
  },
];

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Pricing() {
  return (
    <section id="pricing" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-2xl text-center text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Every AI System Is Unique. So Is Our Pricing.</LiquidHeadingReveal>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-ink-dim"
        >
          We build custom solutions based on your specific needs. No cookie-cutter packages.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-5">
          {steps.map((step, i) => (
            <StepCard key={step.name} step={step} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10 text-center text-[14px] text-ink-faint"
        >
          Starting from <span className="text-ink-dim">$997/month</span>. Final pricing depends on
          complexity, integrations, and scale.
        </motion.p>
      </div>
    </section>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const { ref, onMouseMove } = useCursorGlow<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover={{
        scale: step.featured ? 1.04 : 1.03,
        y: -8,
        boxShadow: CARD_HOVER_SHADOW,
        transition: SPRING_HOVER,
      }}
      style={{ boxShadow: step.featured ? FEATURED_BASE_SHADOW : CARD_BASE_SHADOW }}
      className={cn(
        "gpu liquid-metal-card glass-card relative flex cursor-pointer flex-col overflow-hidden rounded-[var(--radius-card)] p-8",
        step.featured && "border-accent/40 lg:-translate-y-4",
      )}
    >
      <span className="font-mono text-sm text-ink-faint">0{index + 1}</span>
      <h3 className="mt-4 text-lg font-medium text-ink">{step.name}</h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-dim">{step.description}</p>

      {step.featured ? (
        <Button variant="primary" className="mt-8 w-full" onClick={scrollToContact}>
          {step.cta}
        </Button>
      ) : (
        <BookACallButton variant="secondary" className="mt-8 w-full">
          {step.cta}
        </BookACallButton>
      )}
    </motion.div>
  );
}
