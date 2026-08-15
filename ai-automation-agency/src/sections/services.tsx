import { useRef, type ComponentType } from "react";
import { motion } from "framer-motion";
import { ParticleField } from "@/components/particle-field";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { WorkflowIcon, AgentIcon, DataIcon } from "@/components/service-card-icons";

const CARDS: { title: string; description: string; Icon: ComponentType<{ className?: string }> }[] = [
  {
    title: "Workflow Automation",
    description: "[Placeholder — describe how repetitive processes get automated end to end.]",
    Icon: WorkflowIcon,
  },
  {
    title: "AI Agents",
    description: "[Placeholder — describe the agents that handle work autonomously, with review.]",
    Icon: AgentIcon,
  },
  {
    title: "Data Integration",
    description: "[Placeholder — describe how systems and data sources connect into one pipeline.]",
    Icon: DataIcon,
  },
];

/**
 * Services section carries the "vortex" convergence effect: particles
 * spiral inward to a dark centre and recycle to the edge - "every workflow
 * converging into one system". It plays in once on scroll, then self-loops.
 */
export function Services() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  useScrollReveal(headlineRef);

  return (
    <section id="services" className="relative overflow-hidden px-6 py-28 sm:px-10 sm:py-36">
      <ParticleField formation="vortex" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 ref={headlineRef} className="max-w-xl text-3xl font-medium leading-tight text-ink sm:text-4xl">
          [Placeholder headline — what the agency delivers, as three capabilities]
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <ServiceCard key={card.title} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  title,
  description,
  Icon,
  index,
}: {
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollReveal(cardRef, { delay: index * 0.1 });

  return (
    <motion.div
      ref={cardRef}
      whileHover={{
        borderColor: "color-mix(in srgb, var(--accent-primary) 60%, transparent)",
        boxShadow: "0 0 32px -8px color-mix(in srgb, var(--accent-primary) 55%, transparent)",
      }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-card/80 p-7 backdrop-blur-sm"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-6 text-lg font-medium text-ink">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{description}</p>
    </motion.div>
  );
}
