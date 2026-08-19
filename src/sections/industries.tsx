import { motion } from "framer-motion";
import { Building2, Home, Briefcase, TrendingUp, Store, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Industry {
  icon: LucideIcon;
  name: string;
  uses: string[];
}

const industries: Industry[] = [
  { icon: Building2, name: "Dental & Healthcare", uses: ["Patient inquiries", "Appointments", "Follow-ups"] },
  { icon: Home, name: "Real Estate", uses: ["Lead qualification", "Property inquiries", "Follow-up"] },
  { icon: Briefcase, name: "Professional Services", uses: ["Lead intake", "Client onboarding", "Support"] },
  { icon: TrendingUp, name: "Sales Teams", uses: ["Lead qualification", "Routing", "Follow-up"] },
  { icon: Store, name: "Local Businesses", uses: ["Customer support", "Booking", "Operations"] },
];

export function Industries() {
  return (
    <section id="industries" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Built for businesses where manual work slows growth.</LiquidHeadingReveal>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim"
        >
          The same architecture adapts to any business where repetitive inquiries, follow-ups, and
          scheduling eat the day.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <IndustryCard key={industry.name} industry={industry} index={i} />
          ))}
        </div>
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
      className="gpu glass-card group rounded-[var(--radius-card)] p-7"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent transition-[border-color] duration-300 group-hover:border-accent">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-medium text-ink">{industry.name}</h3>
      <ul className="mt-4 space-y-2">
        {industry.uses.map((u) => (
          <li key={u} className="flex items-center gap-2 text-[14px] text-ink-dim">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {u}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
