import { lazy, Suspense } from "react";
import { IntroSequence } from "@/components/intro-sequence";
import { Hero } from "@/sections/hero";

// Each section owns its own particle effect (rings / spiral / vortex),
// rendered as a section-scoped absolute layer behind that section's
// content - so there's no page-wide background here. Below-fold sections
// (and their Three.js effects) are code-split, per CLAUDE.md's
// responsiveness/performance pass.
const System = lazy(() => import("@/sections/system").then((m) => ({ default: m.System })));
const Services = lazy(() => import("@/sections/services").then((m) => ({ default: m.Services })));

export default function App() {
  return (
    <div className="relative min-h-dvh bg-bg">
      <IntroSequence />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <System />
          <Services />
        </Suspense>
      </main>
    </div>
  );
}
