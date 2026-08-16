import { Reveal } from "@/components/reveal";

const STATS = [
  { value: "50+", label: "Clients" },
  { value: "200+", label: "Automations" },
  { value: "10M+", label: "Tasks Automated" },
  { value: "99.9%", label: "Uptime" },
];

export function StatsBar() {
  return (
    <section className="border-y border-white/10 px-5 py-16 sm:px-8 sm:py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-white/55">
          Trusted by innovative teams worldwide
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={120 + i * 100} className="text-center">
              <div className="text-4xl font-normal tracking-tight text-white sm:text-5xl">{s.value}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/55">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
