import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { cn } from "@/lib/utils";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(255,184,0,0.4), 0 30px 60px -20px rgba(0,0,0,0.65), 0 0 46px -8px rgba(255,184,0,0.4)";
const CARD_BASE_SHADOW =
  "0 0 0 1px rgba(255,184,0,0), 0 30px 60px -20px rgba(0,0,0,0), 0 0 46px -8px rgba(255,184,0,0)";
const POPULAR_BASE_SHADOW =
  "0 0 0 1px rgba(255,184,0,0.35), 0 34px 68px -20px rgba(0,0,0,0.7), 0 0 60px -10px rgba(255,184,0,0.5)";

interface Tier {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$997",
    period: "/mo",
    features: ["1 AI Agent", "Basic Automation", "Email Support", "Monthly Review"],
  },
  {
    name: "Growth",
    price: "$2,497",
    period: "/mo",
    features: [
      "3 AI Agents",
      "Advanced Automation",
      "Voice Agent",
      "Priority Support",
      "Weekly Reviews",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$4,997+",
    period: "/mo",
    features: [
      "Unlimited AI Agents",
      "Full AI System",
      "Custom Voice Agents",
      "Dedicated Support",
      "Daily Reviews",
      "Custom Integrations",
    ],
  },
];

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Pricing() {
  return (
    <section id="pricing" className="relative z-10 bg-surface py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Simple, Transparent Pricing</LiquidHeadingReveal>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-5">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier, index }: { tier: Tier; index: number }) {
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
        scale: tier.popular ? 1.04 : 1.03,
        y: -8,
        boxShadow: CARD_HOVER_SHADOW,
        transition: SPRING_HOVER,
      }}
      style={{ boxShadow: tier.popular ? POPULAR_BASE_SHADOW : CARD_BASE_SHADOW }}
      className={cn(
        "gpu liquid-metal-card glass-card relative flex cursor-pointer flex-col overflow-hidden rounded-[var(--radius-card)] p-8",
        tier.popular && "border-accent/40 lg:-translate-y-4",
      )}
    >
      {tier.popular && (
        <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-accent to-accent-2 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.04em] text-accent-ink shadow-[0_0_20px_-4px_rgba(255,184,0,0.8)]">
          Most Popular
        </span>
      )}

      <h3 className="text-lg font-medium text-ink">{tier.name}</h3>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-medium tracking-tight text-ink">{tier.price}</span>
        <span className="text-sm text-ink-faint">{tier.period}</span>
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[14px] text-ink-dim">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={tier.popular ? "primary" : "secondary"}
        className="mt-8 w-full"
        onClick={scrollToContact}
      >
        Get Started
      </Button>
    </motion.div>
  );
}
