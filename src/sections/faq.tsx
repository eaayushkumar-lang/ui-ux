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
    question: "How long does setup take?",
    answer: "Most systems are live within a few days once we've mapped your workflow.",
  },
  {
    question: "Do I need to change the tools my team already uses?",
    answer: "No — we connect and automate around your existing tools wherever possible.",
  },
  {
    question: "What if the AI can't handle something?",
    answer:
      "It hands off to your team seamlessly. AI handles the repetitive work; people handle the rest.",
  },
  {
    question: "How much does it cost?",
    answer:
      "It depends on scope — the Free Automation Audit gives you a clear picture before any commitment.",
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
          <LiquidHeadingReveal>Frequently asked questions.</LiquidHeadingReveal>
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
