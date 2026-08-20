import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { BookACallButton } from "@/components/book-a-call-button";

const faqs = [
  {
    question: "What exactly does Aurevyn build?",
    answer:
      "AI agents and automation systems that run real business workflows — customer support, lead qualification, scheduling, follow-ups, and internal operations. Each system connects to the tools you already use and runs on real triggers (a message, a call, a form submission) without anyone watching it.",
  },
  {
    question: "Will AI replace my employees?",
    answer:
      "No. It removes the repetitive work that eats their day — answering the same questions, copying data between tools, following up manually. Your people stay focused on decisions, relationships, and judgment. AI handles the routine; people handle what needs people.",
  },
  {
    question: "How is this different from a chatbot?",
    answer:
      "A chatbot answers questions. An Aurevyn system runs a workflow. It qualifies leads, updates your CRM, books appointments, sends follow-ups, and routes complex requests to the right person — all from a single trigger, with no one managing it. The AI is one layer in a complete system, not the whole product.",
  },
  {
    question: "Does someone on my team need to manage this?",
    answer:
      "No. The system runs on triggers — a new message, a form submission, a phone call, a scheduled time. It doesn't need someone to start it, watch it, or tell it what to do. Your team interacts with the system only when a human decision is genuinely required.",
  },
  {
    question: "Can you integrate with our existing tools?",
    answer:
      "In almost every case, yes. Systems connect into your CRM, inbox, phone lines, calendar, and internal tools. We build around your stack — nothing gets ripped out and replaced.",
  },
  {
    question: "What happens when the AI doesn't know the answer?",
    answer:
      "Every system has defined handoff points. When a request falls outside the system's confidence — unusual question, complex situation, high-stakes decision — it routes to the right person with full context. It never guesses on something it shouldn't.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most first systems go live in 2-4 weeks, not months. We build on top of your existing stack instead of rebuilding it. The audit call identifies the highest-impact workflow, and we start there.",
  },
  {
    question: "What if it doesn't work for my business?",
    answer:
      "The audit call exists specifically to find out before any money changes hands. We map your workflows, identify what's actually worth automating, and tell you honestly if the return doesn't justify the investment. If it doesn't fit, we'll tell you.",
  },
  {
    question: "What does the audit call cover?",
    answer:
      "We walk through your current workflows — where time goes, what's repetitive, where things fall through. You get a clear picture of what's worth automating and a realistic estimate of what that looks like. 30 minutes, free, no obligation.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Every system is scoped to your specific requirements — integrations, complexity, and scale. We don't do cookie-cutter packages. After the audit call, you get a custom proposal with transparent pricing. Starting from $997/month.",
  },
  {
    question: "What happens after deployment?",
    answer:
      "We monitor how the system performs, tune it against real usage, and handle edge cases as they appear. Systems are expanded as new workflows become worth automating. You own your accounts and data throughout.",
  },
  {
    question: "Do we need to replace our current software?",
    answer:
      "No. The whole approach is to work with the tools you already run, not around them. If it's in your stack and has an API or integration path, we can connect to it.",
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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mt-5 text-lg leading-relaxed text-ink-dim"
        >
          Honest answers to the questions business owners actually ask.
        </motion.p>

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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-[15px] text-ink-dim">Still have questions?</p>
          <BookACallButton variant="secondary">Talk to us — no obligation</BookACallButton>
        </motion.div>
      </div>
    </section>
  );
}
