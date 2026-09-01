import { motion } from "framer-motion";
import {
  CalendarClock,
  Database,
  FileText,
  Headset,
  Phone,
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
  description: string;
}

const services: Service[] = [
  {
    n: "01",
    icon: Headset,
    title: "AI Customer Support",
    description: "Instant replies to inquiries, any time of day.",
  },
  {
    n: "02",
    icon: UserCheck,
    title: "AI Lead Qualification",
    description: "Asks the right questions, captures what your team needs.",
  },
  {
    n: "03",
    icon: CalendarClock,
    title: "AI Appointment Booking",
    description: "Books directly onto your calendar, no back and forth.",
  },
  {
    n: "04",
    icon: Repeat,
    title: "Automated Follow-Up",
    description: "Nudges leads who went quiet, so nothing falls through.",
  },
  {
    n: "05",
    icon: Database,
    title: "Lead → CRM Automation",
    description: "Every inquiry logged, organized, and ready to act on.",
  },
  {
    n: "06",
    icon: Phone,
    title: "AI Receptionist",
    description: "Handles chat, WhatsApp, and voice inquiries automatically.",
  },
  {
    n: "07",
    icon: FileText,
    title: "Document & Data Processing",
    description: "Extracts and organizes information without manual entry.",
  },
  {
    n: "08",
    icon: Settings2,
    title: "Custom Business Workflows",
    description: "Anything repetitive, automated around your existing tools.",
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
            <LiquidHeadingReveal>Systems we build</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Eight categories of repetitive work businesses hand off to Aurevyn — each one built
            around how you already operate.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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

      <h3 className="mt-6 text-lg font-medium text-ink">{service.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{service.description}</p>
    </motion.article>
  );
}
