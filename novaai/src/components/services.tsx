import { Bot, Workflow, Phone, Layers } from "lucide-react";
import { Reveal } from "@/components/reveal";

const SERVICES = [
  {
    icon: Bot,
    title: "Building AI Agents",
    body: "Custom agents that read documents, take actions across your tools, and escalate to a person only when a decision actually needs one.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    body: "We rebuild the workflows eating your team's week, so software does the repeating and your people do the deciding.",
  },
  {
    icon: Phone,
    title: "Voice Agents",
    body: "Phone agents that book, qualify, and follow up around the clock, sounding like your best rep on their best day.",
  },
  {
    icon: Layers,
    title: "Full AI Systems",
    body: "End-to-end systems that connect your agents, data, and tools into one operation built to run without you in the room.",
  },
];

export function Services() {
  return (
    <section id="services" className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          Services
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Four ways we put AI to work inside your business.
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.title}
                delay={200 + i * 110}
                className="group rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/10 sm:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                  <Icon size={20} strokeWidth={1.5} className="text-white" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-white sm:text-xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
