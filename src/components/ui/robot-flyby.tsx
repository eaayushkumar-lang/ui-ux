import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_ROBOT_TILT } from "@/lib/motion";
import { LOADING_SCREEN_MS } from "@/components/loading-screen";

// The hero mounts (and this entrance animation starts) immediately, at the
// same time as the full-screen LoadingScreen overlay - without this delay
// the whole exploded-assembly plays out hidden behind that splash and the
// visitor never actually sees it happen. Starting exactly when the splash
// begins its own fade-out means the assembly is revealed mid-flight through
// the dissolving overlay, which reads as a deliberate reveal rather than a
// coincidence of two unrelated timers.
const LOADING_SCREEN_DELAY = LOADING_SCREEN_MS / 1000;

const MAX_TILT_DEG = 6;
const DESKTOP_DURATION = 1.8;
const MOBILE_DURATION = 1;
const ENTRANCE_BOUNCE = 0.22;

// Warm-shift the generated render slightly toward the site's amber/gold
// theme, per spec - applied to the <img> itself (not the animated wrapper)
// so it's a static, one-time color adjustment independent of the entrance
// transforms.
const WARM_FILTER = "hue-rotate(10deg) saturate(1.1) brightness(1.05)";

interface RobotFlybyProps {
  className?: string;
}

type Piece = {
  id: string;
  // Percentage-based CSS inset() clip - the three pieces tile the full
  // 0-100% square with no gap or overlap, so at rest (translate 0,0) they
  // reconstruct the source image exactly. Because all three pieces render
  // the SAME <img>, "seam alignment" isn't something to get right - it's
  // guaranteed by construction, since it's fundamentally one continuous
  // image viewed through three differently-shaped windows.
  clipPath: string;
  // Where each piece starts, as CSS transform percentages (relative to the
  // piece's own box) - "off in that direction" rather than literal
  // off-viewport coordinates, matching how the previous SVG version treated
  // its own local coordinate space.
  hiddenX: string;
  hiddenY: string;
  hiddenRotate: number;
  // Fraction of the total assembly duration this piece waits before it
  // starts flying - scales automatically with desktop vs mobile duration
  // instead of needing separate delay constants for each.
  delayFraction: number;
};

const PIECES: Piece[] = [
  {
    id: "top",
    clipPath: "inset(0% 0% 42% 0%)",
    hiddenX: "0%",
    hiddenY: "-70%",
    hiddenRotate: -6,
    delayFraction: 0,
  },
  {
    id: "left",
    clipPath: "inset(58% 50% 0% 0%)",
    hiddenX: "-85%",
    hiddenY: "14%",
    hiddenRotate: -26,
    delayFraction: 0.08,
  },
  {
    id: "right",
    clipPath: "inset(58% 0% 0% 50%)",
    hiddenX: "85%",
    hiddenY: "14%",
    hiddenRotate: 26,
    delayFraction: 0.12,
  },
];

// Amber glow trail: a strong drop-shadow at launch that burns off to
// nothing as each piece reaches its resting position, applied via `filter`
// (which follows a shape's actual silhouette, unlike box-shadow) so the
// trail wraps each piece's clipped silhouette rather than its bounding box.
const GLOW_TRAIL = {
  hidden: { filter: "drop-shadow(0 0 0px rgba(255,184,0,0))" },
  visible: {
    filter: [
      "drop-shadow(0 0 28px rgba(255,184,0,0.95))",
      "drop-shadow(0 0 6px rgba(255,184,0,0.35))",
      "drop-shadow(0 0 0px rgba(255,184,0,0))",
    ],
  },
};

/**
 * Original photorealistic android bust (AI-generated, not a stock asset) -
 * a single image split into three pieces purely via clip-path, so the
 * exploded-assembly entrance is "each piece's clipped window starts
 * offset and animates to (0,0)" rather than three separately-exported
 * crops that could subtly misalign at their cut edges.
 *
 * Once assembled the robot stays fixed in place - no scroll-linked
 * movement. Mouse-tracking tilts the whole assembled container a few
 * degrees toward the cursor; entrance, glow trail, and tracking are all
 * skipped under reduced motion, leaving a single static image with no
 * window listener attached at all.
 */
export const RobotFlyby = ({ className }: RobotFlybyProps) => {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Every route in this app is wrapped in <AnimatePresence initial={false}>
  // (for page-transition purposes, in App.tsx) - Framer Motion applies that
  // suppression to every nested motion component's own `initial` prop on
  // the very first render of the whole app, not just AnimatePresence's own
  // direct children, which would otherwise silently skip this entrance
  // entirely on a real first page load. Working around it: paint the FIRST
  // frame directly in the "hidden" configuration via `animate` itself
  // (Motion's documented behavior when no `initial` prop is given at all is
  // to render immediately in whatever `animate` currently resolves to - no
  // suppression applies here, because it isn't the initial-vs-animate mount
  // resolution AnimatePresence's context intercepts), then flip `animate`
  // to "visible" one tick later via state. A plain prop change after mount
  // always triggers a normal transition, entirely outside that mechanism.
  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    setHasEntered(true);
  }, []);

  // Container "look at cursor" tilt - written imperatively via
  // useMotionValue (never React state) so tracking the mouse across the
  // whole window never triggers a re-render, then damped through a spring
  // for a soft glance rather than a jittery snap-to-pointer.
  const rawTiltY = useMotionValue(0);
  const rawTiltX = useMotionValue(0);
  const tiltY = useSpring(rawTiltY, SPRING_ROBOT_TILT);
  const tiltX = useSpring(rawTiltX, SPRING_ROBOT_TILT);

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMouseMove(event: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      const dx = clamp((event.clientX - originX) / (window.innerWidth / 2), -1, 1);
      const dy = clamp((event.clientY - originY) / (window.innerHeight / 2), -1, 1);
      rawTiltY.set(dx * MAX_TILT_DEG);
      rawTiltX.set(-dy * MAX_TILT_DEG);
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [reduceMotion, rawTiltX, rawTiltY]);

  // Reduced motion: skip the whole piece-split entirely and render one
  // plain, fully assembled image - no clip-path wrappers, no motion
  // variants, nothing to animate.
  if (reduceMotion) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <img
          src="/robot.png"
          alt="Android illustration"
          className="mx-auto h-full w-full object-contain"
          style={{ filter: WARM_FILTER }}
          width={1024}
          height={1024}
        />
      </div>
    );
  }

  const showAssembled = hasEntered;
  const duration = isMobile ? MOBILE_DURATION : DESKTOP_DURATION;
  const partTransition = (delayFraction: number) => ({
    type: "spring" as const,
    duration,
    bounce: ENTRANCE_BOUNCE,
    delay: LOADING_SCREEN_DELAY + duration * delayFraction,
  });
  // The glow trail lives on a nested motion.div (so it can wrap each
  // piece's real clipped silhouette rather than the flight wrapper's
  // translate/rotate), which means it does NOT automatically inherit its
  // parent's delay - variants propagate to children immediately, not gated
  // by the parent's own transition. Without its own matching delay here the
  // glow would flash by during the loading-screen splash while the piece
  // itself only starts moving once that's gone.
  const glowTransition = (delayFraction: number) => ({
    duration: duration * 0.5,
    ease: "easeOut" as const,
    delay: LOADING_SCREEN_DELAY + duration * delayFraction,
  });

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <motion.div
        className="relative mx-auto h-full w-full"
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
      >
        {PIECES.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute inset-0"
            style={{ clipPath: piece.clipPath }}
            animate={showAssembled ? "visible" : "hidden"}
            variants={{
              hidden: { x: piece.hiddenX, y: piece.hiddenY, rotate: piece.hiddenRotate, opacity: 0 },
              visible: { x: 0, y: 0, rotate: 0, opacity: 1 },
            }}
            transition={partTransition(piece.delayFraction)}
          >
            <motion.div
              className="absolute inset-0"
              variants={GLOW_TRAIL}
              transition={glowTransition(piece.delayFraction)}
            >
              <img
                src="/robot.png"
                alt={piece.id === "top" ? "Android illustration" : ""}
                aria-hidden={piece.id !== "top"}
                className="absolute inset-0 h-full w-full object-contain"
                style={{ filter: WARM_FILTER }}
                width={1024}
                height={1024}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
