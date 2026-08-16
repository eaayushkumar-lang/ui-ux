import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Network, PhoneCall, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { AIAgentDemo } from "@/components/service-demos/ai-agent-demo";
import { WorkflowDemo } from "@/components/service-demos/workflow-demo";
import { VoiceAgentDemo } from "@/components/service-demos/voice-agent-demo";
import { FullSystemDemo } from "@/components/service-demos/full-system-demo";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(193,80,46,0.4), 0 28px 56px -20px rgba(0,0,0,0.65), 0 0 44px -8px rgba(193,80,46,0.35)";
const CARD_BASE_SHADOW =
  "0 0 0 1px rgba(193,80,46,0), 0 28px 56px -20px rgba(0,0,0,0), 0 0 44px -8px rgba(193,80,46,0)";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  demo: ReactNode;
  path: string;
  featured?: boolean;
  tone?: "glow" | "grid" | "plain";
}

const services: Service[] = [
  {
    icon: Bot,
    title: "Building AI Agents",
    description:
      "Custom agents that read documents, take actions across your tools, and escalate to a person only when a decision actually needs one.",
    demo: <AIAgentDemo />,
    path: "/try/ai-agents",
    featured: true,
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "We rebuild the workflows eating your team's week, so software does the repeating and your people do the deciding.",
    demo: <WorkflowDemo />,
    path: "/try/automation",
    tone: "glow",
  },
  {
    icon: PhoneCall,
    title: "Voice Agents",
    description:
      "Phone agents that book, qualify, and follow up around the clock, sounding like your best rep on their best day.",
    demo: <VoiceAgentDemo />,
    path: "/try/voice-agent",
    tone: "grid",
  },
  {
    icon: Network,
    title: "Full AI Systems",
    description:
      "End-to-end systems that connect your agents, data, and tools into one operation built to run without you in the room.",
    demo: <FullSystemDemo />,
    path: "/try/ai-system",
    tone: "plain",
  },
];

export function Services() {
  return (
    <section id="services" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Four ways we put AI to work inside your business.</LiquidHeadingReveal>
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
      whileHover={{
        scale: 1.03,
        y: -6,
        boxShadow: CARD_HOVER_SHADOW,
        transition: SPRING_HOVER,
      }}
      className={cn(
        "gpu glass-card group relative cursor-pointer overflow-hidden rounded-[var(--radius-card)] p-8",
        service.featured ? "md:col-span-3 md:p-10" : "md:col-span-1",
      )}
      style={{ boxShadow: CARD_BASE_SHADOW }}
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

      <div className="relative mt-6 border-t border-line/50 pt-6">
        {service.demo}
        <div className="mt-5 flex justify-end">
          <Button asChild size="sm">
            <Link to={service.path} onClick={(e) => e.stopPropagation()}>
              Try It Live
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
