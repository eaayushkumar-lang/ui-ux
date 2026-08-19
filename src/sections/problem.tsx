import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

const problems = [
  "The same customer questions, answered by hand all day",
  "Leads that slip through because no one replied in time",
  "Follow-ups that depend on someone remembering",
  "Data re-typed from one tool into another",
  "Information scattered across inboxes, sheets, and apps",
  "Skilled people stuck on repetitive admin work",
];

const before = [
  "Inquiries answered manually, one by one",
  "Follow-ups done from memory",
  "Information scattered across tools",
  "Responses wait for someone to be free",
  "Data re-entered by hand",
  "Your team busy with repetitive work",
];

const after = [
  "AI handles repetitive conversations instantly",
  "Follow-ups run automatically on your rules",
  "Information moves between systems on its own",
  "Customers get answers in seconds, any hour",
  "Records update themselves across your stack",
  "Your team spends time on decisions that matter",
];

export function Problem() {
  return (
    <section id="problem" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>Manual work doesn't scale.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Every growing business hits the same wall: the work multiplies faster than the people. The
            expensive part isn't the tasks — it's what your best people aren't doing while they're stuck on them.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              className="glass-card flex items-start gap-3 rounded-[var(--radius-card)] p-5"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line/70 bg-bg/60 text-accent">
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <p className="text-[15px] leading-relaxed text-ink-dim">{p}</p>
            </motion.div>
          ))}
        </div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center"
        >
          <div className="glass-card rounded-[var(--radius-card)] p-7">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Before</p>
            <ul className="mt-5 space-y-3">
              {before.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-dim">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={2} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto hidden h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent md:flex">
            <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
          </div>

          <div className="glass-card rounded-[var(--radius-card)] border-accent/25 p-7 shadow-[0_0_44px_-12px_rgba(193,80,46,0.35)]">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">After</p>
            <ul className="mt-5 space-y-3">
              {after.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
