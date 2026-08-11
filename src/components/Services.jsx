import { motion } from 'framer-motion';
import { Bot, Workflow, Phone, Layers, ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const SERVICES = [
  {
    icon: Bot,
    title: 'Building AI Agents',
    description:
      'Custom autonomous agents that handle research, outreach, support, and decisions inside your existing tools.',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'End-to-end automation that removes manual busywork across sales, ops, and fulfillment — built to scale.',
  },
  {
    icon: Phone,
    title: 'Voice Agents',
    description:
      'Human-quality AI voice agents that answer, qualify, and book calls 24/7 without dropping a lead.',
  },
  {
    icon: Layers,
    title: 'Full AI Systems',
    description:
      'A complete stack of agents, automations, and integrations engineered to run as one connected system.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-2xl"
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">What We Build</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          One partner. A full AI operations stack.
        </h2>
        <p className="mt-4 text-base text-muted sm:text-lg">
          We design and ship the exact systems your operation needs — nothing generic, nothing off
          the shelf.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover="hover"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors duration-300 ease-out hover:border-border-strong hover:bg-card-hover sm:p-8"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 ease-out group-hover:opacity-100" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-white/5">
                  <Icon className="h-5 w-5 text-foreground" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <h3 className="relative mt-6 text-xl font-semibold text-foreground">{service.title}</h3>
              <p className="relative mt-2.5 text-[15px] leading-relaxed text-muted">{service.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
