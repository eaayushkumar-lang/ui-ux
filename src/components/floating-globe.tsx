import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { SPRING_SMOOTH } from "@/lib/motion";

const DESKTOP_DRIFT_VW = 28;
const MOBILE_DRIFT_VH = 18;
const MOBILE_SCALE_MULTIPLIER = 0.75;

/**
 * Fixed, page-wide floating Globe. On desktop, x tracks scroll progress
 * through the hero section only - it slides right -> center within the
 * first 10% of the hero, then holds center for the rest of the page. On
 * mobile it drifts below -> center -> above vertically instead, tracking
 * whole-page scroll. Scale (1.0x -> 0.7x) and opacity (0.85 -> 0.3) also
 * track whole-page scroll on both.
 *
 * mix-blend-screen (same technique as NoiseOverlay/ParticleField) is what
 * lets this render above every section's own opaque background without
 * hiding text: screen blending only ever brightens what's beneath it, so
 * the globe's dark pixels contribute nothing and it reads as ambient glow
 * behind the copy rather than an image sitting on top of it.
 */
export function FloatingGlobe() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll();

  // x is driven by scroll progress *through the hero section specifically*
  // (not the whole page) so the right->center slide fires on the first
  // small scroll, before the user has scrolled anywhere near Services.
  // heroRef is hydrated by the effect below - useScroll explicitly
  // supports a ref that resolves after the hook call (it defers to a
  // microtask and waits), so the ordering here is safe.
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    heroRef.current = document.getElementById("hero");
  }, []);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Desktop: right -> center by 10% of the way through the hero, then
  // holds center (scrollYProgress clamps at 1 past the hero, so this stays
  // centered for the rest of the page for free). Mobile has no horizontal
  // drift (see rawY below).
  const rawX = useTransform(
    heroProgress,
    [0, 0.1, 1],
    isMobile ? ["0vw", "0vw", "0vw"] : [`${DESKTOP_DRIFT_VW}vw`, "0vw", "0vw"],
  );
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isMobile ? [`${MOBILE_DRIFT_VH}vh`, "0vh", `${-MOBILE_DRIFT_VH}vh`] : ["0vh", "0vh", "0vh"],
  );
  const rawScale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [1 * MOBILE_SCALE_MULTIPLIER, 0.7 * MOBILE_SCALE_MULTIPLIER] : [1, 0.7],
  );
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 0.3]);

  const x = useSpring(rawX, SPRING_SMOOTH);
  const y = useSpring(rawY, SPRING_SMOOTH);
  const scale = useSpring(rawScale, SPRING_SMOOTH);
  const opacity = useSpring(rawOpacity, SPRING_SMOOTH);

  // Reduced motion: no scroll-driven repositioning at all. Hero renders its
  // own static Globe in this case instead (see sections/hero.tsx).
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[14] flex items-center justify-center mix-blend-screen"
    >
      <motion.div className="gpu" style={{ x, y, scale, opacity }}>
        <Globe />
      </motion.div>
    </div>
  );
}
