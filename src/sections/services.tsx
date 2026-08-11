import { motion } from "framer-motion";
import { Bot, Network, PhoneCall, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT as EASE } from "@/lib/motion";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  featured?: boolean;
  tone?: "glow" | "grid" | "plain";
}

const services: Service[] = [
  {
    icon: Bot,
    title: "Building AI Agents",
    description:
      "Custom agents that read documents, take actions across your tools, and escalate to a person only when a decision actually needs one.",
    featured: true,
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "We rebuild the workflows eating your team's week, so software does the repeating and your people do the deciding.",
    tone: "glow",
  },
  {
    icon: PhoneCall,
    title: "Voice Agents",
    description:
      "Phone agents that book, qualify, and follow up around the clock, sounding like your best rep on their best day.",
    tone: "grid",
  },
  {
    icon: Network,
    title: "Full AI Systems",
    description:
      "End-to-end systems that connect your agents, data, and tools into one operation built to run without you in the room.",
    tone: "plain",
  },
];

export function Services() {
  return (
    <section id="services" className="relative z-10 bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          Four ways we put AI to work inside your business.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
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
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-card)] border border-line/70 p-8",
        service.featured ? "md:col-span-3 md:p-10" : "md:col-span-1",
        service.tone === "glow" && "bg-surface-2",
        service.tone === "grid" && "bg-surface-2",
        service.tone === "plain" && "bg-surface-2",
        service.featured && "bg-gradient-to-br from-surface-3 via-surface-2 to-surface-2",
      )}
    >
      {service.tone === "glow" && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl transition-opacity duration-500 motion-safe:animate-breathe group-hover:opacity-80" />
      )}
      {service.tone === "grid" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      )}

      <div
        className={cn(
          "relative flex items-start gap-6",
          service.featured ? "flex-col md:flex-row md:items-center" : "flex-col",
        )}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line/70 bg-bg/60 text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <div className={service.featured ? "max-w-xl" : ""}>
          <h3 className="text-xl font-medium text-ink">{service.title}</h3>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-dim">
            {service.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
