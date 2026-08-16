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
    question: "How fast can you get an agent live?",
    answer:
      "Most first agents go live within a few weeks of kickoff, not months, because we build on top of your existing tools instead of replacing your stack.",
  },
  {
    question: "Do we need an in-house AI or data team?",
    answer:
      "No. We handle the engineering, integration, and monitoring. Your team gives us access and context, and we handle everything technical from there.",
  },
  {
    question: "What happens to our existing tools and software?",
    answer:
      "Nothing gets ripped out. Agents connect into the systems you already run, whether that's your CRM, your phone lines, or internal tools.",
  },
  {
    question: "How do you handle security and data access?",
    answer:
      "Every integration runs on scoped, revocable access with a full activity log, so you always know exactly what an agent touched and why.",
  },
  {
    question: "What if the agent gets something wrong?",
    answer:
      "Every system ships with guardrails and escalation paths, so anything outside its confidence threshold gets routed to a person before it becomes a problem.",
  },
  {
    question: "What does working with AUXAI.AI cost?",
    answer:
      "Every engagement is scoped to the systems you actually need, not a flat package. You'll get a clear number on the call, before any work starts.",
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
