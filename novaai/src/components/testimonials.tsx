import { Quote } from "lucide-react";
import { Reveal } from "@/components/reveal";

const QUOTES = [
  {
    quote:
      "novaai didn't hand us a chatbot. They rebuilt how dispatch decisions get made, and our team stopped drowning in the same three questions every day.",
    name: "Priya Nandakumar",
    role: "VP Operations, Halcyon Freight",
  },
  {
    quote:
      "We had four systems talking past each other. Now one agent handles intake end to end, and our staff finally have time for patients.",
    name: "Marcus Webb",
    role: "Director of Care Access, Meridian Health Group",
  },
  {
    quote:
      "Every vendor before them promised automation. novaai is the first one that shipped something our analysts actually trust with real client data.",
    name: "Elena Sokolova",
    role: "Head of Portfolio Ops, Clearwater Capital",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          Testimonials
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Operators who stopped competing on effort.
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal
              key={q.name}
              delay={200 + i * 120}
              className="flex flex-col rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8"
            >
              <Quote size={22} strokeWidth={1.5} className="text-white/30" />
              <p className="mt-5 flex-1 text-sm leading-relaxed text-white/85">{q.quote}</p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="text-sm font-medium text-white">{q.name}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/55">{q.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
