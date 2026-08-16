import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { glassCard, sectionDivider } from "@/lib/section-style";
import { cn } from "@/lib/utils";

// Only the first answer was provided in the brief; answers 2-6 are written to
// match the same tone as reasonable placeholders (flagged in the delivery note).
const FAQS = [
  {
    q: "How fast can you get an agent live?",
    a: "Most first agents go live within a few weeks of kickoff, not months, because we build on top of your existing tools instead of replacing your stack.",
  },
  {
    q: "Do we need an in-house AI or data team?",
    a: "No. We handle the architecture, integrations, and deployment end to end, and hand your team a system they can run and understand — not a science project that needs a specialist to babysit.",
  },
  {
    q: "What happens to our existing tools and software?",
    a: "They stay. We build agents that connect into the tools you already use — your CRM, help desk, phone system, and databases — so nothing gets ripped out and your team keeps working the way they know.",
  },
  {
    q: "How do you handle security and data access?",
    a: "Agents get least-privilege access scoped to exactly what a workflow needs, with credentials you control and full audit logs. Your data stays in your systems, and access can be revoked at any time.",
  },
  {
    q: "What if the agent gets something wrong?",
    a: "Every agent ships with guardrails and clear escalation paths — when it isn't confident, it hands off to a person instead of guessing. We monitor in production and tune continuously so mistakes get rarer, not repeated.",
  },
  {
    q: "What does working with novaai cost?",
    a: "Engagements start from $997/month, with final pricing based on the complexity, integrations, and scale of your system. The Discovery Call is free, and you'll get transparent pricing in your custom proposal before anything is built.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0); // first item open by default

  return (
    <section id="faq" className={cn("px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32", sectionDivider)}>
      <div className="mx-auto max-w-3xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          FAQ
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Questions worth asking before you commit.
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal
                key={item.q}
                delay={180 + i * 80}
                className={cn("overflow-hidden", glassCard)}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-medium text-white transition-colors duration-300 hover:bg-white/[0.04] sm:px-6"
                >
                  {item.q}
                  <span className="shrink-0 text-white/60">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-white/70 sm:px-6">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
