import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

const faqs = [
  {
    question: "What exactly does Aurevyn build?",
    answer:
      "AI agents and automation systems that run real business workflows — customer support, lead qualification, scheduling, follow-ups, and internal operations — connected to the tools you already use.",
  },
  {
    question: "Will AI replace my employees?",
    answer:
      "No. It removes the repetitive work that eats their day so they can focus on decisions, relationships, and judgment. AI handles the routine; people handle what needs people.",
  },
  {
    question: "Can the system run without someone constantly triggering it?",
    answer:
      "Yes. Systems respond to real events — a new message, a form, a call, a scheduled time — and run on their own. Your team doesn't operate the automation; the automation operates the workflow.",
  },
  {
    question: "Can you integrate with our existing tools?",
    answer:
      "In almost every case, yes. Systems connect into your CRM, inbox, phone lines, calendar, and internal tools. Nothing gets ripped out and replaced.",
  },
  {
    question: "Can a human take over when needed?",
    answer:
      "Always. Every system has defined handoff points — anything outside its confidence or scope is routed to the right person with full context.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most first systems go live in a few weeks, not months, because we build on top of your existing stack instead of rebuilding it.",
  },
  {
    question: "What happens after deployment?",
    answer:
      "We monitor how the system performs, tune it against real usage, and expand it as new workflows become worth automating.",
  },
  {
    question: "Do we need to replace our current software?",
    answer:
      "No. The whole approach is to work with the tools you already run, not around them.",
  },
  {
    question: "How do you handle complex or unusual requests?",
    answer:
      "The system recognizes when something falls outside its rules and hands it to a person — it never guesses on something it shouldn't.",
  },
  {
    question: "What does ongoing maintenance include?",
    answer:
      "Monitoring, tuning, handling edge cases as they appear, and extending the system as your business changes. You own your accounts and data throughout.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Questions worth asking before you commit.</LiquidHeadingReveal>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-12"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue={faqs[0].question}
            className="border-t border-line"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className={i === faqs.length - 1 ? "border-b border-line" : undefined}
              >
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
