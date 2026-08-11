import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { SPRING_DRIFT } from "@/lib/motion";

const SECTION_ORDER = ["hero", "services", "how-it-works", "testimonials", "faq", "cta"] as const;
type SectionId = (typeof SECTION_ORDER)[number];

// Side multiplier: +1 drifts right, -1 drifts left, 0 rests centered.
const SIDE: Record<SectionId, number> = {
  hero: 1,
  services: -1,
  "how-it-works": 1,
  testimonials: -1,
  faq: 1,
  cta: 0,
};
const SCALE: Record<SectionId, number> = {
  hero: 1.4,
  services: 0.9,
  "how-it-works": 1.2,
  testimonials: 0.8,
  faq: 1.0,
  cta: 1.8,
};
const OPACITY: Record<SectionId, number> = {
  hero: 0.85,
  services: 0.5,
  "how-it-works": 0.7,
  testimonials: 0.4,
  faq: 0.5,
  cta: 0.3,
};

// Fallback breakpoints (even spread) used only until the real section
// offsets have been measured from the DOM on first paint. A 7th point
// (past 1.0, clamped by interpolateAt) stands in for the CTA section's
// bottom edge, where the globe fades to 0 opacity so it never lingers
// over the Footer.
const FALLBACK_POINTS = [0, 0.15, 0.35, 0.62, 0.82, 0.95, 1.1];

function interpolateAt(progress: number, points: number[], values: number[]): number {
  const last = points.length - 1;
  if (progress <= points[0]) return values[0];
  if (progress >= points[last]) return values[last];
  for (let i = 0; i < last; i++) {
    if (progress >= points[i] && progress <= points[i + 1]) {
      const span = points[i + 1] - points[i] || 1;
      const t = (progress - points[i]) / span;
      return values[i] + (values[i + 1] - values[i]) * t;
    }
  }
  return values[last];
}

/**
 * Fixed, page-wide floating Globe that drifts left/right, rescales, and
 * fades as the user scrolls past each section. Breakpoints are measured
 * from the real DOM (the same section ids useActiveSection/ParticleField
 * already track) rather than assumed to be evenly spaced across scroll
 * progress - the pinned How It Works section alone is 220vh, so an even
 * 1/6th-per-section split would drift out of sync with what's actually
 * on screen at that point.
 *
 * mix-blend-screen (same technique as NoiseOverlay/ParticleField) is what
 * lets this render above every section's own opaque background without
 * hiding text: screen blending only ever brightens what's beneath it, so
 * the globe's dark pixels contribute nothing and the sphere reads as an
 * ambient glow behind the copy rather than an opaque image sitting on
 * top of it.
 */
export function FloatingGlobe() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const pointsRef = useRef<number[]>(FALLBACK_POINTS);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function measure() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const raw = SECTION_ORDER.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return Math.min(1, Math.max(0, top / docHeight));
      });
      const ctaEl = document.getElementById("cta");
      const ctaBottom = ctaEl
        ? Math.min(1, Math.max(0, (ctaEl.getBoundingClientRect().bottom + window.scrollY) / docHeight))
        : 1;
      raw.push(ctaBottom);
      // useTransform's interpolator needs strictly increasing input points.
      for (let i = 1; i < raw.length; i++) {
        if (raw[i] <= raw[i - 1]) raw[i] = raw[i - 1] + 0.001;
      }
      pointsRef.current = raw;
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    // Late image/font loads can still shift section heights after first
    // paint - one re-measure once things have settled covers that.
    const settleTimer = setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(settleTimer);
    };
  }, []);

  const { scrollYProgress } = useScroll();

  const xOffsetVw = isMobile ? 15 : 26;
  const scaleMultiplier = isMobile ? 0.75 : 1;

  // 7 values to match the 7 breakpoints (6 sections + the CTA-bottom fade
  // point): x/scale hold their CTA value through the fade so only opacity
  // moves in that final stretch.
  const xValues = [...SECTION_ORDER.map((id) => SIDE[id] * xOffsetVw), SIDE.cta * xOffsetVw];
  const scaleValues = [...SECTION_ORDER.map((id) => SCALE[id] * scaleMultiplier), SCALE.cta * scaleMultiplier];
  const opacityValues = [...SECTION_ORDER.map((id) => OPACITY[id]), 0];

  const rawX = useTransform(
    scrollYProgress,
    (v) => `${interpolateAt(v, pointsRef.current, xValues)}vw`,
  );
  const rawScale = useTransform(scrollYProgress, (v) => interpolateAt(v, pointsRef.current, scaleValues));
  const rawOpacity = useTransform(scrollYProgress, (v) => interpolateAt(v, pointsRef.current, opacityValues));

  const x = useSpring(rawX, SPRING_DRIFT);
  const scale = useSpring(rawScale, SPRING_DRIFT);
  const opacity = useSpring(rawOpacity, { ...SPRING_DRIFT, stiffness: 60, damping: 20, mass: 0.6 });

  // Reduced motion: no scroll-driven repositioning at all. Hero renders its
  // own static Globe in this case instead (see sections/hero.tsx).
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[14] flex items-center justify-center mix-blend-screen"
    >
      <motion.div className="gpu" style={{ x, scale, opacity }}>
        <Globe />
      </motion.div>
    </div>
  );
}
