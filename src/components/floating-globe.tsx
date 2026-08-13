import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { RobotFlyby } from "@/components/ui/robot-flyby";
import { SPRING_SMOOTH } from "@/lib/motion";

const DESKTOP_DRIFT_VW = 28;
const MOBILE_DRIFT_VH = 18;
const MOBILE_SCALE_MULTIPLIER = 0.75;

/**
 * Fixed, page-wide floating 3D robot (formerly a rotating-Earth Globe - the
 * positioning logic below is untouched from that version, only the
 * rendered visual changed). On desktop, x tracks scroll progress through
 * the hero section only - it slides right -> center within the first 10%
 * of the hero, then holds center for the rest of the page. On mobile it
 * drifts below -> center -> above vertically instead, tracking whole-page
 * scroll. Scale (1.0x -> 0.7x) and opacity (0.85 -> 0.3) also track
 * whole-page scroll on both.
 *
 * mix-blend-screen (same technique as NoiseOverlay/ParticleField) is what
 * lets this render above every section's own opaque background without
 * hiding text: screen blending only ever brightens what's beneath it, so
 * the robot scene's dark background contributes nothing and it reads as
 * ambient glow behind the copy rather than an image sitting on top of it.
 *
 * The robot's iframe is genuinely interactive (unlike the old Globe), so
 * pointer-events is toggled on specifically for the robot's own bounding
 * box while it's still acting as the hero's visual centerpiece, and off
 * once the user scrolls past the hero - it settles dead-center of the
 * viewport for the rest of the page (see rawX/rawY below), and leaving it
 * clickable there permanently would silently block every other section's
 * center content for the entire scroll length of the page.
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
  // Interactive only while still the hero's centerpiece - see the function
  // doc comment for why this can't just be "auto" for the whole page.
  const rawPointerEvents = useTransform(heroProgress, (v) => (v < 0.98 ? "auto" : "none"));

  const x = useSpring(rawX, SPRING_SMOOTH);
  const y = useSpring(rawY, SPRING_SMOOTH);
  const scale = useSpring(rawScale, SPRING_SMOOTH);
  const opacity = useSpring(rawOpacity, SPRING_SMOOTH);

  // Reduced motion: no scroll-driven repositioning at all. Hero renders its
  // own static RobotFlyby fallback in this case instead (see
  // sections/hero.tsx) - RobotFlyby itself detects reduced motion and never
  // mounts the Spline iframe for that render.
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[14] flex items-center justify-center mix-blend-screen"
    >
      <motion.div
        className="gpu-active h-[350px] w-[350px] lg:h-[500px] lg:w-[500px]"
        style={{ x, y, scale, opacity, pointerEvents: rawPointerEvents }}
      >
        <RobotFlyby />
      </motion.div>
    </div>
  );
}
