import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

export function FinalCta() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-white/5 px-6 py-16 text-center backdrop-blur-md sm:px-12 sm:py-20">
        <Reveal
          as="h2"
          className="mx-auto max-w-2xl text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl"
        >
          Your competitors are still doing this by hand.
        </Reveal>

        <Reveal delay={140} className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
          Book a call and we'll show you exactly what to automate first, and what it's worth to you.
        </Reveal>

        <Reveal delay={280} className="mt-8 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85"
          >
            Book a Call
            <ChevronRight size={16} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
