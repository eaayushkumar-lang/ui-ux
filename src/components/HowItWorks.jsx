import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    number: '01',
    title: 'Audit your operations',
    description: 'We map every repetitive task, handoff, and bottleneck across your business.',
  },
  {
    number: '02',
    title: 'Design the system',
    description: 'We architect the agents, automations, and integrations that replace the manual work.',
  },
  {
    number: '03',
    title: 'Build & integrate',
    description: 'We ship into your existing stack — CRM, calendar, phone lines, and internal tools.',
  },
  {
    number: '04',
    title: 'Optimize & scale',
    description: 'We monitor performance and continuously tune the system as your business grows.',
  },
];

function Step({ step, index, total }) {
  return (
    <motion.div
      initial={{ opacity: 0.25, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative flex gap-6 pb-16 last:pb-0 sm:gap-10"
    >
      <div className="flex flex-col items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-card text-[13px] font-semibold text-foreground">
          {step.number}
        </span>
        {index !== total - 1 && <span className="mt-2 w-px flex-1 bg-gradient-to-b from-border-strong to-transparent" />}
      </div>
      <div className="pt-1.5">
        <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{step.title}</h3>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 sm:py-36">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,380px)_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">How It Works</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            From chaos to a system that runs itself.
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Four steps. No fluff. Just a system engineered to outperform how you operate today.
          </p>
        </motion.div>

        <div className="pt-2">
          {STEPS.map((step, i) => (
            <Step key={step.number} step={step} index={i} total={STEPS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
