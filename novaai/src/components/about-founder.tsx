import { Reveal } from "@/components/reveal";
import { glassCard, sectionRaised, sectionDivider } from "@/lib/section-style";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "50+", label: "AI Systems Built" },
  { value: "200+", label: "Workflows Automated" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "AI Uptime" },
];

export function AboutFounder() {
  return (
    <section id="about" className={cn("px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32", sectionRaised, sectionDivider)}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          {/* Left — copy */}
          <div>
            <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
              About
            </Reveal>

            <Reveal
              as="h2"
              delay={120}
              className="mt-6 text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
            >
              The Mind Behind novaai
            </Reveal>

            <Reveal delay={240} className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Founded by Aarav Mehta, novaai was built with one mission — to give businesses the unfair advantage of
              AI without the complexity. We don't just automate tasks. We engineer intelligent systems that think,
              adapt, and outperform.
            </Reveal>
          </div>

          {/* Right — founder stats */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <Reveal
                key={s.label}
                delay={200 + i * 110}
                className={cn("p-6", glassCard)}
              >
                <div className="text-3xl font-normal tracking-tight text-white sm:text-4xl">{s.value}</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/55">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
