import { useEffect, useRef } from "react";
import { ParticleScene, type SceneStats } from "../particles/scene";
import { detectCaps } from "../particles/capability";

interface Props {
  onReady: (caps: { count: number; tier: "high" | "low" }) => void;
  onStats: (s: SceneStats) => void;
}

/**
 * Owns the WebGL scene. Scroll drives the 5-formation morph: page progress
 * 0..1 maps to morph clamp(progress*5 - 0.5, 0, 4) so each of the five full-
 * height sections holds a pure formation at its center and morphs between them.
 */
export function ParticleCanvas({ onReady, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const caps = detectCaps();
    const scene = new ParticleScene(canvas, { count: caps.count, pixelRatio: caps.pixelRatio, tier: caps.tier, onStats });
    onReady({ count: caps.count, tier: caps.tier });

    let usingScroll = true;
    function readScroll() {
      if (!usingScroll) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scene.setMorphTarget(Math.min(4, Math.max(0, p * 5 - 0.5)));
    }
    window.addEventListener("scroll", readScroll, { passive: true });
    readScroll();

    function onPointer(e: PointerEvent) {
      scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    }
    window.addEventListener("pointermove", onPointer);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" />;
}
