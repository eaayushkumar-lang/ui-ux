import { useCallback, useRef, useState } from "react";
import { ParticleCanvas } from "./components/particle-canvas";
import { Nav } from "./components/nav";
import { Stats } from "./components/stats";
import { FormationToggle } from "./components/formation-toggle";
import { TorusHeadline, GalaxyHeadline, BrainHeadline } from "./components/headlines";
import type { SceneStats } from "./particles/scene";

export function App() {
  const [active, setActive] = useState(0);

  // Imperative targets, written from the render loop — no per-frame React state.
  const countRef = useRef<HTMLSpanElement | null>(null);
  const msRef = useRef<HTMLSpanElement | null>(null);
  const coldRef = useRef<HTMLSpanElement | null>(null);
  const fpsRef = useRef<HTMLSpanElement | null>(null);
  const tierRef = useRef<HTMLSpanElement | null>(null);

  const h0 = useRef<HTMLDivElement | null>(null); // torus
  const h1 = useRef<HTMLDivElement | null>(null); // galaxy
  const h2 = useRef<HTMLDivElement | null>(null); // brain
  const tierText = useRef("high");

  const onReady = useCallback((caps: { count: number; tier: "high" | "low" }) => {
    tierText.current = caps.tier;
    if (countRef.current) countRef.current.textContent = caps.count.toLocaleString();
    if (tierRef.current) tierRef.current.textContent = caps.tier;
  }, []);

  const lastActive = useRef(0);
  const onStats = useCallback((s: SceneStats) => {
    if (countRef.current) countRef.current.textContent = s.count.toLocaleString();
    if (msRef.current) msRef.current.textContent = s.frameMs.toFixed(1);
    if (coldRef.current) coldRef.current.textContent = s.coldStart.toFixed(2);
    if (fpsRef.current) fpsRef.current.textContent = Math.min(999, Math.round(s.fps)).toString();
    if (tierRef.current) tierRef.current.textContent = tierText.current;

    // Continuous crossfade of the three headline layers by morph proximity.
    const op = (k: number) => Math.max(0, 1 - Math.abs(s.morph - k));
    if (h0.current) h0.current.style.opacity = String(op(0));
    if (h1.current) h1.current.style.opacity = String(op(1));
    if (h2.current) h2.current.style.opacity = String(op(2));

    const nowActive = Math.round(s.morph);
    if (nowActive !== lastActive.current) {
      lastActive.current = nowActive;
      setActive(nowActive);
    }
  }, []);

  return (
    <div className="relative">
      <ParticleCanvas onReady={onReady} onStats={onStats} />

      <Nav />
      <TorusHeadline refCb={(el) => (h0.current = el)} />
      <GalaxyHeadline refCb={(el) => (h1.current = el)} />
      <BrainHeadline refCb={(el) => (h2.current = el)} />

      <Stats
        refs={{
          count: (el) => (countRef.current = el),
          ms: (el) => (msRef.current = el),
          cold: (el) => (coldRef.current = el),
          fps: (el) => (fpsRef.current = el),
          tier: (el) => (tierRef.current = el),
        }}
      />
      <FormationToggle active={active} />

      {/* Scroll runway: 300vh gives room to progress torus -> galaxy -> brain. */}
      <div style={{ height: "300vh" }} aria-hidden />
    </div>
  );
}
