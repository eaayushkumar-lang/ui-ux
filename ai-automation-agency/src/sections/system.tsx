import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { NodesDiagram } from "@/components/nodes-diagram";
import { ParticleField } from "@/components/particle-field";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * System section carries the "spiral" galaxy effect: a scattered particle
 * cloud that condenses into a spiral disc as the section scrolls into view.
 * Text/diagram sit on z-10 above the effect.
 */
export function System() {
  const textRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useScrollReveal(textRef);
  useScrollReveal(diagramRef, { delay: 0.15 });

  return (
    <section id="system" className="relative overflow-hidden px-6 py-28 sm:px-10 sm:py-36">
      <ParticleField formation="spiral" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div ref={textRef}>
          <h2 className="text-3xl font-medium leading-tight text-ink sm:text-4xl">
            [Placeholder headline — how the automation system works, in one line]
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
            [Placeholder copy — a short paragraph describing the underlying system: how
            work moves between agents, tools, and human review, and why that matters for
            the client.]
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" onClick={() => scrollToId("services")}>
              See how it works
            </Button>
            <Button variant="secondary" onClick={() => scrollToId("services")}>
              Our process
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-card/60 p-8 backdrop-blur-sm">
          <NodesDiagram className="w-full" />
        </div>
      </div>
    </section>
  );
}
