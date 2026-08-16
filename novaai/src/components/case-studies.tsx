import { Reveal } from "@/components/reveal";

const CASES = [
  {
    client: "E-commerce Brand",
    body: "Automated 1,200+ customer inquiries/month with AI agents.",
    results: ["340% faster response time", "$47K saved annually"],
  },
  {
    client: "SaaS Startup",
    body: "Built end-to-end lead qualification pipeline.",
    results: ["5x more qualified leads", "60% less manual work"],
  },
  {
    client: "Real Estate Agency",
    body: "Deployed voice agents for appointment booking.",
    results: ["89% call answer rate", "200+ appointments/month booked automatically"],
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          Case Studies
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Real Results. Real Impact.
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal
              key={c.client}
              delay={200 + i * 120}
              className="flex flex-col rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8"
            >
              <h3 className="text-lg font-medium text-white sm:text-xl">{c.client}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{c.body}</p>
              <ul className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6">
                {c.results.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-white/85">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white" />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
