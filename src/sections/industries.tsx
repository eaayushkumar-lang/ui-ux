import { motion } from "framer-motion";
import { Building2, Home, Briefcase, TrendingUp, Store, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { BookACallButton } from "@/components/book-a-call-button";

interface Industry {
  icon: LucideIcon;
  name: string;
  pain: string;
  systems: string[];
}

const industries: Industry[] = [
  {
    icon: Building2,
    name: "Dental & Healthcare",
    pain: "Front desk buried in calls, no-shows, and insurance questions.",
    systems: [
      "AI receptionist answers patient inquiries 24/7",
      "Automated appointment booking + reminders",
      "Post-visit follow-up and recall sequences",
    ],
  },
  {
    icon: Home,
    name: "Real Estate",
    pain: "Hot leads go cold while agents are on showings.",
    systems: [
      "Instant lead qualification from any source",
      "Automated property-match responses",
      "Follow-up sequences until the lead converts or opts out",
    ],
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    pain: "Client intake and follow-up consume billable hours.",
    systems: [
      "AI-powered intake and client onboarding",
      "Proposal follow-up on schedule, every time",
      "Support routing and response automation",
    ],
  },
  {
    icon: TrendingUp,
    name: "Sales Teams",
    pain: "Reps spend more time on admin than selling.",
    systems: [
      "Lead scoring and instant qualification",
      "CRM updates happen automatically after every interaction",
      "Personalized follow-ups on timing rules — not memory",
    ],
  },
  {
    icon: Store,
    name: "Local Businesses",
    pain: "Missed calls and slow responses lose customers to competitors.",
    systems: [
      "Every inquiry answered within seconds, any hour",
      "Online booking without back-and-forth",
      "Review request and reputation management automation",
    ],
  },
];

export function Industries() {
  return (
    <section id="industries" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
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
              Built for businesses where manual work slows growth.
            </LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            The same architecture adapts to any business where repetitive inquiries, follow-ups,
            and scheduling eat the day. Here's how it applies to yours.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="text-[15px] text-ink-dim">Don't see your industry?</p>
          <BookACallButton variant="secondary">
            Tell us what you do — we'll map it
          </BookACallButton>
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
      <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{industry.pain}</p>
      <ul className="mt-4 space-y-2 border-t border-line/50 pt-4">
        {industry.systems.map((s) => (
          <li key={s} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-dim">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {s}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
