import { useCallback, useRef, useState } from "react";
import { ParticleCanvas } from "./components/particle-canvas";
import { Nav } from "./components/nav";
import { Sections } from "./components/sections";
import { SectionDots } from "./components/section-dots";
import type { SceneStats } from "./particles/scene";

export function App() {
  const [active, setActive] = useState(0);
  const layers = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null]);
  const lastActive = useRef(0);

  const register = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      layers.current[i] = el;
    },
    [],
  );

  const onReady = useCallback(() => {}, []);

  const onStats = useCallback((s: SceneStats) => {
    // Crossfade each section by proximity of the morph value to its index.
    for (let i = 0; i < 5; i++) {
      const el = layers.current[i];
      if (!el) continue;
      const op = Math.max(0, 1 - Math.abs(s.morph - i));
      el.style.opacity = String(op);
      el.style.pointerEvents = op > 0.5 ? "auto" : "none";
    }
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
      <Sections register={register} />
      <SectionDots active={active} />

      {/* Five full-height sections worth of scroll runway. */}
      <div style={{ height: "500vh" }} aria-hidden />
    </div>
  );
}
