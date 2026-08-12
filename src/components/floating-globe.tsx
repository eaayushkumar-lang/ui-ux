import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { SPRING_SMOOTH } from "@/lib/motion";

const DESKTOP_DRIFT_VW = 28;
const MOBILE_DRIFT_VH = 18;
const MOBILE_SCALE_MULTIPLIER = 0.75;

/**
 * Fixed, page-wide floating Globe. Slides right -> center -> left (desktop)
 * or below -> center -> above (mobile, vertical instead of horizontal) as
 * the user scrolls through the whole page, shrinking from 1.0x to 0.7x and
 * fading from 0.85 to 0.3 opacity along the way.
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

  const rawX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isMobile ? ["0vw", "0vw", "0vw"] : [`${DESKTOP_DRIFT_VW}vw`, "0vw", `${-DESKTOP_DRIFT_VW}vw`],
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
