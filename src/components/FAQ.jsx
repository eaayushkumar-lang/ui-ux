import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const FAQS = [
  {
    question: 'What exactly does AUXAI.AI build?',
    answer:
      'We build custom AI agents, workflow automations, voice agents, and full connected AI systems tailored to how your business actually operates — not templated bots.',
  },
  {
    question: 'How long does a typical build take?',
    answer:
      'Most engagements go from audit to live system in 2–4 weeks, depending on scope. Full AI system builds with multiple integrations can take 6–8 weeks.',
  },
  {
    question: 'Do you integrate with our existing tools?',
    answer:
      'Yes. We build directly into your CRM, calendar, phone system, and internal tools rather than asking you to migrate to a new platform.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'We monitor performance, tune the system based on real usage, and continue optimizing as your business scales — automation is never “set and forget.”',
  },
  {
    question: 'How do we get started?',
    answer:
      'Book a call. We’ll audit your current operations, identify the highest-leverage systems to build first, and scope the engagement together.',
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="text-[16px] font-medium text-foreground sm:text-[17px]">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-6 py-28 sm:px-8 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-center"
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">FAQ</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Questions, answered.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        className="mt-14"
      >
        {FAQS.map((item, i) => (
          <FAQItem
            key={item.question}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </motion.div>
    </section>
  );
}
