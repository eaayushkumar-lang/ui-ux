import { useEffect, useRef } from "react";
import { ParticleScene, type SceneStats } from "../particles/scene";
import { detectCaps } from "../particles/capability";

interface Props {
  onReady: (caps: { count: number; tier: "high" | "low" }) => void;
  onStats: (s: SceneStats) => void;
}

/**
 * Owns the WebGL ParticleScene for its whole lifetime. Everything hot (stats,
 * pointer, scroll -> morph) is wired imperatively so React never re-renders on
 * a per-frame basis. Formation changes come from BOTH scroll position and the
 * test/toggle hook `window.__setMorph`.
 */
export function ParticleCanvas({ onReady, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const caps = detectCaps();
    const scene = new ParticleScene(canvas, {
      count: caps.count,
      pixelRatio: caps.pixelRatio,
      tier: caps.tier,
      onStats,
    });
    onReady({ count: caps.count, tier: caps.tier });

    // Scroll drives the morph: page progress 0..1 -> morph 0..2.
    let usingScroll = true;
    function readScroll() {
      if (!usingScroll) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scene.setMorphTarget(p * 2);
    }
    window.addEventListener("scroll", readScroll, { passive: true });
    readScroll();

    function onPointer(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      scene.setPointer(nx, ny);
    }
    window.addEventListener("pointermove", onPointer);

    // Test / toggle hook: force a formation regardless of scroll.
    const w = window as unknown as {
      __setMorph?: (t: number, immediate?: boolean) => void;
      __scene?: ParticleScene;
    };
    w.__setMorph = (t: number, immediate = false) => {
      usingScroll = false;
      scene.setMorphTarget(t, immediate);
    };
    w.__scene = scene;

    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("pointermove", onPointer);
      delete w.__setMorph;
      delete w.__scene;
      scene.dispose();
    };
    // Mount once; callbacks are stable enough for a demo host.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" />;
}
