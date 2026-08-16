import { Reveal } from "@/components/reveal";
import { glassCard, sectionDivider } from "@/lib/section-style";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    index: "01",
    title: "Discovery",
    body: "We map every workflow, tool, and decision point in your operation to find where an agent creates real leverage.",
  },
  {
    index: "02",
    title: "Design",
    body: "We architect the exact agent, integrations, and guardrails your workflow needs, then design a rollout your team can adopt.",
  },
  {
    index: "03",
    title: "Deploy",
    body: "We ship into your live stack, connect your existing tools, and run it alongside your team until it's carrying real work.",
  },
  {
    index: "04",
    title: "Outperform",
    body: "Your system keeps improving on its own data, compounding the advantage while competitors are still writing their first prompt.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className={cn("px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32", sectionDivider)}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          How It Works
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          From first call to a system that runs itself.
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.index}
              delay={200 + i * 110}
              className={cn("flex flex-col p-6 sm:p-8", glassCard)}
            >
              <span className="font-mono text-[11px] tracking-[0.15em] text-white/45">{s.index}</span>
              <h3 className="mt-3 text-lg font-medium text-white sm:text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
