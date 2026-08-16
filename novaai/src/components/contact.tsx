import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/reveal";
import { sectionDivider } from "@/lib/section-style";
import { cn } from "@/lib/utils";

const SERVICES = [
  "Building AI Agents",
  "Workflow Automation",
  "Voice Agents",
  "Full AI Systems",
  "Not sure yet",
];

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors duration-300 focus:border-white/40 focus:bg-white/[0.09]";

export function Contact() {
  const [sent, setSent] = useState(false);

  // UI-only for now: no network call, just acknowledge locally.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className={cn("px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32", sectionDivider)}>
      <div className="mx-auto max-w-2xl">
        <Reveal className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur-md">
          Contact
        </Reveal>

        <Reveal
          as="h2"
          delay={120}
          className="mt-6 text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Let's Build Your AI System
        </Reveal>

        <Reveal delay={240} className="mt-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={fieldClass} type="text" name="name" placeholder="Name" required />
              <input className={fieldClass} type="email" name="email" placeholder="Email" required />
            </div>
            <input className={fieldClass} type="text" name="company" placeholder="Company (optional)" />
            <select className={fieldClass} name="service" defaultValue="" required>
              <option value="" disabled className="bg-[#0a0a0a]">
                Service Needed
              </option>
              {SERVICES.map((s) => (
                <option key={s} value={s} className="bg-[#0a0a0a]">
                  {s}
                </option>
              ))}
            </select>
            <textarea className={fieldClass} name="message" placeholder="Message" rows={5} required />

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center self-start rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85"
            >
              {sent ? "Message Sent ✓" : "Send Message"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
