import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

// Replace with the real production Spline scene URL if it ever changes.
const SPLINE_SRC = "https://my.spline.design/untitled-rv0hx3zVdoM6t2ydngxuS7zi/";

const GLOW_STYLE = {
  boxShadow: "0 0 80px rgba(245,158,11,0.15)",
  border: "1px solid rgba(245,158,11,0.1)",
} as const;

interface RobotFlybyProps {
  className?: string;
}

/**
 * Interactive 3D robot hero visual (a Spline scene embed), replacing the
 * old rotating-Earth Globe. Self-contained: any consumer gets reduced-motion
 * safety and lazy loading for free, matching how the rest of the site's
 * canvas/SVG effects each own their own useReducedMotion() check rather
 * than relying on a caller to gate them.
 *
 * - Reduced motion: never mounts the iframe at all (not just visually
 *   hidden) - shows a static amber Bot glyph instead, same "prevent the
 *   embed from ever loading" intent as ParticleField returning null.
 * - Otherwise: the iframe only mounts once this component's own box is
 *   near the viewport (IntersectionObserver, 200px rootMargin so it's
 *   ready slightly before it's visible), and a shimmering skeleton covers
 *   it until the Spline scene's onLoad fires.
 */
export const RobotFlyby = ({ className }: RobotFlybyProps) => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-xl bg-transparent",
          className,
        )}
        style={GLOW_STYLE}
      >
        <Bot className="h-16 w-16 text-accent" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      <div
        className="relative h-full w-full overflow-hidden rounded-xl bg-transparent"
        style={GLOW_STYLE}
      >
        {!loaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 motion-safe:animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(100deg, transparent 30%, rgba(255,184,0,0.16) 50%, transparent 70%)",
              backgroundSize: "220% 100%",
              backgroundColor: "rgba(255,184,0,0.04)",
            }}
          />
        )}
        {shouldLoad && (
          <iframe
            src={SPLINE_SRC}
            title="Interactive 3D robot"
            className="h-full w-full"
            style={{ border: "none", background: "transparent" }}
            frameBorder={0}
            allowFullScreen
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
    </div>
  );
};
