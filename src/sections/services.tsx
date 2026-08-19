import { motion } from "framer-motion";
import {
  Bot,
  CalendarClock,
  Headset,
  Repeat,
  Settings2,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { LiquidHeadingReveal } from "@/components/liquid-text";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(193,80,46,0.4), 0 28px 56px -20px rgba(0,0,0,0.55), 0 0 44px -8px rgba(193,80,46,0.32)";
const CARD_BASE_SHADOW =
  "0 0 0 1px rgba(193,80,46,0), 0 28px 56px -20px rgba(0,0,0,0), 0 0 44px -8px rgba(193,80,46,0)";

interface Service {
  n: string;
  icon: LucideIcon;
  title: string;
  problem: string;
  system: string;
  outcome: string;
}

const services: Service[] = [
  {
    n: "01",
    icon: Headset,
    title: "AI Customer Support",
    problem: "Your team answers the same questions all day.",
    system: "An agent handles repetitive questions and routes anything complex to the right person.",
    outcome: "Instant answers, around the clock — humans only touch what needs judgment.",
  },
  {
    n: "02",
    icon: UserCheck,
    title: "AI Lead Qualification",
    problem: "Good leads go cold before anyone follows up.",
    system: "Captures, understands, qualifies, and routes every incoming lead automatically.",
    outcome: "Every lead is engaged in seconds and sent to the right place.",
  },
  {
    n: "03",
    icon: CalendarClock,
    title: "Appointment Automation",
    problem: "Booking means back-and-forth and dropped inquiries.",
    system: "Runs the inquiry → qualification → scheduling flow end to end.",
    outcome: "A full calendar without the manual coordination.",
  },
  {
    n: "04",
    icon: Repeat,
    title: "AI Follow-Up Systems",
    problem: "Follow-ups depend on someone remembering.",
    system: "Follows up automatically based on your business rules and timing.",
    outcome: "Nothing falls through the cracks, ever.",
  },
  {
    n: "05",
    icon: Settings2,
    title: "Internal Operations",
    problem: "Skilled people stuck on repetitive admin.",
    system: "Automates repetitive internal workflows and moves data between your tools.",
    outcome: "Your team back on the work that actually needs them.",
  },
  {
    n: "06",
    icon: Bot,
    title: "Custom AI Agents",
    problem: "Off-the-shelf tools don't fit how you work.",
    system: "Agents designed around your exact processes, tools, and rules.",
    outcome: "A system built for your business, not a generic template.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>We build systems, not just automations.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Each one starts with a real problem, becomes a working system, and ends in a measurable
            outcome for your business.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Explore your automation opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      whileHover={{ scale: 1.02, y: -6, boxShadow: CARD_HOVER_SHADOW, transition: SPRING_HOVER }}
      className="gpu glass-card group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-7"
      style={{ boxShadow: CARD_BASE_SHADOW }}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent transition-[border-color,box-shadow] duration-300 group-hover:border-accent group-hover:shadow-[0_0_22px_-4px_rgba(193,80,46,0.5)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <span className="font-mono text-sm text-ink-faint">{service.n}</span>
      </div>

      <h3 className="mt-6 text-xl font-medium text-ink">{service.title}</h3>

      <dl className="mt-4 space-y-3 border-t border-line/50 pt-4 text-[14px] leading-relaxed">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Problem</dt>
          <dd className="mt-1 text-ink-dim">{service.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">System</dt>
          <dd className="mt-1 text-ink-dim">{service.system}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Outcome</dt>
          <dd className="mt-1 font-medium text-ink">{service.outcome}</dd>
        </div>
      </dl>
    </motion.article>
  );
}
