import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

interface Row {
  before: string;
  after: string;
}

const rows: Row[] = [
  {
    before: "Patient inquiries answered only during business hours",
    after: "Answered instantly, 24/7",
  },
  {
    before: "Leads followed up manually, if at all",
    after: "Automatic follow-up at day 1 and day 3",
  },
  {
    before: "Appointments booked over back-and-forth calls",
    after: "Booked automatically, confirmed instantly",
  },
  {
    before: "No-shows go unaddressed",
    after: "Automatic recovery outreach the same day",
  },
  {
    before: "Inactive patients/customers forgotten",
    after: "Automatically reactivated after 90 days",
  },
];

export function BeforeAfter() {
  return (
    <section id="before-after" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>What changes when you automate.</LiquidHeadingReveal>
          </motion.h2>
        </div>

        {/* Column labels */}
        <div className="mt-12 hidden grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Before</p>
          <span className="w-10" aria-hidden />
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">After</p>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:mt-2">
          {rows.map((row, i) => (
            <motion.div
              key={row.before}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4"
            >
              <div className="glass-card flex items-start gap-3 rounded-[var(--radius-card)] p-5">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={2} />
                <p className="text-[15px] leading-relaxed text-ink-dim">{row.before}</p>
              </div>

              <div className="mx-auto flex h-9 w-9 rotate-90 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent md:rotate-0">
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </div>

              <div className="glass-card flex items-start gap-3 rounded-[var(--radius-card)] border-accent/25 p-5 shadow-[0_0_36px_-14px_rgba(193,80,46,0.35)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                <p className="text-[15px] leading-relaxed text-ink">{row.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
