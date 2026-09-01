import { motion } from "framer-motion";
import { Briefcase, HeartPulse, Home, Store, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { BookACallButton } from "@/components/book-a-call-button";

interface Industry {
  icon: LucideIcon;
  name: string;
  description: string;
}

const industries: Industry[] = [
  {
    icon: HeartPulse,
    name: "Healthcare",
    description: "Patient inquiries, scheduling, follow-ups.",
  },
  {
    icon: Home,
    name: "Real Estate",
    description: "Lead qualification, property inquiries, CRM updates.",
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    description: "Lead intake, proposals, follow-ups.",
  },
  {
    icon: Store,
    name: "Local Businesses",
    description: "Bookings, customer support, missed calls.",
  },
];

export function Industries() {
  return (
    <section id="built-for" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>
              Built for businesses that rely on repetitive work.
            </LiquidHeadingReveal>
          </motion.h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <IndustryCard key={industry.name} industry={industry} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-12 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-[15px] text-ink-dim">
            Don't see your industry? We'll map your workflow and identify what can be automated.
          </p>
          <BookACallButton variant="secondary">Book a Free Automation Audit</BookACallButton>
        </motion.div>
      </div>
    </section>
  );
}

function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const Icon = industry.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      whileHover={{ scale: 1.02, y: -5, transition: SPRING_HOVER }}
      className="gpu glass-card group flex flex-col rounded-[var(--radius-card)] p-7"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent transition-[border-color] duration-300 group-hover:border-accent">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-medium text-ink">{industry.name}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{industry.description}</p>
    </motion.article>
  );
}
