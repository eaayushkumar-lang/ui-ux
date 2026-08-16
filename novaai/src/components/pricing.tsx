import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    index: "01",
    title: "Discovery Call",
    body: "We learn about your business, workflows, and goals. Free, no obligation. 30 minutes.",
    cta: "Book Free Call",
  },
  {
    index: "02",
    title: "Custom Proposal",
    body: "We design a tailored AI solution with transparent pricing based on your exact requirements.",
    cta: "Get Your Proposal",
  },
  {
    index: "03",
    title: "Build & Launch",
    body: "We build, test, and deploy your AI system. Ongoing support included.",
    cta: "Let's Start",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          Pricing
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Every AI System Is Unique. So Is Our Pricing.
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.index}
              delay={200 + i * 120}
              className="flex flex-col rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8"
            >
              <span className="font-mono text-[11px] tracking-[0.15em] text-white/45">{s.index}</span>
              <h3 className="mt-3 text-lg font-medium text-white sm:text-xl">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{s.body}</p>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 self-start rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm"
              >
                {s.cta}
                <ChevronRight size={14} />
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240} className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">
          Starting from $997/month. Final pricing depends on complexity, integrations, and scale.
        </Reveal>
      </div>
    </section>
  );
}
