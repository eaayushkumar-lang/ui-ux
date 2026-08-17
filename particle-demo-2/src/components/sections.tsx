import type { ReactNode } from "react";

// The five scroll sections. Each is a full-viewport fixed layer whose opacity
// is driven imperatively (by morph proximity) through the `register` callback,
// so content crossfades in sync with the particle formation behind it.

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/75 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a3c]" />
      {children}
    </span>
  );
}

function Primary({ children }: { children: ReactNode }) {
  return (
    <button className="pointer-events-auto rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5">
      {children}
    </button>
  );
}

function Secondary({ children }: { children: ReactNode }) {
  return (
    <button className="pointer-events-auto rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:bg-white/10">
      {children}
    </button>
  );
}

const H1 = "text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl";
const SUB = "text-base leading-relaxed text-white/65 sm:text-lg";

type Reg = (el: HTMLDivElement | null) => void;

function Layer({ reg, className, children }: { reg: Reg; className: string; children: ReactNode }) {
  return (
    <div ref={reg} className={`pointer-events-none fixed inset-0 z-20 px-8 ${className}`} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function Sections({ register }: { register: (i: number) => Reg }) {
  return (
    <>
      {/* 0 — RING */}
      <Layer reg={register(0)} className="flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <Pill>Welcome to a new era</Pill>
          <h1 className={`mt-6 ${H1}`}>Technology that redefines the nature of interaction</h1>
          <p className={`mx-auto mt-5 max-w-xl ${SUB}`}>
            We build systems at the intersection of data, energy, and intelligence — where something
            fundamentally new comes to life.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Primary>Get started</Primary>
            <Secondary>See how it works</Secondary>
          </div>
        </div>
      </Layer>

      {/* 1 — GALAXY / ORBIT */}
      <Layer reg={register(1)} className="flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <Pill>Our product ecosystem</Pill>
          <h1 className={`mt-6 ${H1}`}>A universe of possibilities — already in motion</h1>
          <p className={`mx-auto mt-5 max-w-xl ${SUB}`}>
            Our platform is not a single tool. It's a living ecosystem with your business at its core,
            surrounded by services, partners, and data orbiting around you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Primary>Explore the ecosystem</Primary>
            <Secondary>View integrations</Secondary>
          </div>
        </div>
      </Layer>

      {/* 2 — DNA HELIX + frosted stat card */}
      <Layer reg={register(2)} className="flex items-center justify-center lg:justify-end">
        <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-white/15 bg-white/[0.07] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:mr-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Average efficiency gain</p>
          <p className="mt-3 text-7xl font-semibold tracking-tight text-[#ff6a45]">68%</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Measured across clients. Real numbers from real deployments.
          </p>
        </div>
      </Layer>

      {/* 3 — WAVE / TERRAIN */}
      <Layer reg={register(3)} className="flex flex-col items-center justify-center lg:items-start">
        <div className="max-w-xl text-left">
          <Pill>The pull of results</Pill>
          <h1 className={`mt-6 ${H1}`}>
            Everything revolves around one thing, your <span className="text-[#ff6a45]">results</span>
          </h1>
          <p className={`mt-5 ${SUB}`}>
            Thousands of data points. One centre of gravity. We turn the noise of information into a
            focused point of energy for your business.
          </p>
        </div>
      </Layer>

      {/* 4 — BLACK HOLE / ECLIPSE (finale) */}
      <Layer reg={register(4)} className="flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <Pill>The event horizon</Pill>
          <h1 className={`mt-6 ${H1}`}>Where everything converges into something new</h1>
          <p className={`mx-auto mt-5 max-w-xl ${SUB}`}>
            At the center of it all, complexity collapses into clarity. This is where your data, your
            people, and your ambition become a single force.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Primary>Start building</Primary>
            <Secondary>Talk to us</Secondary>
          </div>
        </div>
      </Layer>
    </>
  );
}
