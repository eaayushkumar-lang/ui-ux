import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Home, ShoppingBag, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { cn } from "@/lib/utils";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(255,184,0,0.4), 0 28px 56px -20px rgba(0,0,0,0.65), 0 0 44px -8px rgba(255,184,0,0.35)";
const CARD_BASE_SHADOW =
  "0 0 0 1px rgba(255,184,0,0), 0 28px 56px -20px rgba(0,0,0,0), 0 0 44px -8px rgba(255,184,0,0)";

interface CaseStudy {
  icon: LucideIcon;
  name: string;
  description: string;
  results: string;
  bar: { label: string; value: number; display: string };
}

const caseStudies: CaseStudy[] = [
  {
    icon: ShoppingBag,
    name: "E-commerce Brand",
    description: "Automated 1,200+ customer inquiries/month with AI agents.",
    results: "340% faster response time, $47K saved annually",
    bar: { label: "Response time improvement", value: 100, display: "340%" },
  },
  {
    icon: Building2,
    name: "SaaS Startup",
    description: "Built end-to-end lead qualification pipeline.",
    results: "5x more qualified leads, 60% less manual work",
    bar: { label: "Manual work reduced", value: 60, display: "60%" },
  },
  {
    icon: Home,
    name: "Real Estate Agency",
    description: "Deployed voice agents for appointment booking.",
    results: "89% call answer rate, 200+ appointments/month booked automatically",
    bar: { label: "Call answer rate", value: 89, display: "89%" },
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="relative z-10 bg-bg py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Real Results. Real Impact.</LiquidHeadingReveal>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.name} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const { ref, onMouseMove } = useCursorGlow<HTMLDivElement>();
  const [started, setStarted] = useState(false);
  const Icon = study.icon;

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      onViewportEnter={() => setStarted(true)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      whileHover={{ scale: 1.03, y: -6, boxShadow: CARD_HOVER_SHADOW, transition: SPRING_HOVER }}
      style={{ boxShadow: CARD_BASE_SHADOW }}
      className={cn("gpu cursor-glow glass-card cursor-pointer rounded-[var(--radius-card)] p-7")}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <h3 className="mt-5 text-lg font-medium text-ink">{study.name}</h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-ink-dim">{study.description}</p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-accent">Result: {study.results}</p>

      <div className="mt-6 border-t border-line/50 pt-5">
        <div className="flex items-center justify-between text-[11px] text-ink-faint">
          <span>{study.bar.label}</span>
          <span className="font-mono text-ink-dim">{study.bar.display}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={started ? { scaleX: study.bar.value / 100 } : undefined}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            style={{ transformOrigin: "left" }}
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
          />
        </div>
      </div>
    </motion.article>
  );
}
