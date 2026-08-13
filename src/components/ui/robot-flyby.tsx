import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
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
const LOADING_SCREEN_DELAY_MS = LOADING_SCREEN_MS;

const MAX_TILT_DEG = 12;
const DESKTOP_DURATION = 1.8;
const MOBILE_DURATION = 1;
const ENTRANCE_BOUNCE = 0.22;
// Scroll maps to assembly progress across this fraction of one viewport
// height of scrolling from the page top (Hero starts at the top and is
// exactly one viewport tall, so this is "the first quarter of scrolling
// through the hero") - past this point scrolling no longer affects the
// robot at all.
const SCROLL_TRIGGER_RANGE = 0.25;

// Warm-shift the generated render slightly toward the site's amber/gold
// theme, per spec - applied to the <img> itself (static, independent of
// the dynamic per-piece transform/filter values below).
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
  // Where each piece starts (as CSS transform percentages, relative to the
  // piece's own box) - "off in that direction, and behind" for the
  // running-toward-camera effect.
  fromX: string;
  fromY: string;
  fromRotate: number;
  // Fraction of the shared assembly progress this piece waits for before
  // it starts moving - gives the pieces a staggered arrival without
  // needing a separate timeline per piece.
  stagger: number;
};

const PIECES: Piece[] = [
  { id: "top", clipPath: "inset(0% 0% 42% 0%)", fromX: "0%", fromY: "-95%", fromRotate: -8, stagger: 0 },
  { id: "left", clipPath: "inset(58% 50% 0% 0%)", fromX: "-115%", fromY: "22%", fromRotate: -32, stagger: 0.12 },
  { id: "right", clipPath: "inset(58% 0% 0% 50%)", fromX: "115%", fromY: "22%", fromRotate: 32, stagger: 0.18 },
];

/** One exploded piece: derives every visual property (position, scale,
 * blur, rotation, glow, opacity) from a single shared 0-1 `assembly`
 * progress value via useTransform, rather than a fixed-duration
 * variants/transition. That's what lets the SAME piece be driven either by
 * a time-based spring (page-load auto-entrance) or by scroll position
 * (assemble-on-scroll) - both just set the same underlying motion value,
 * and every derived style updates reactively either way. */
function RobotPiece({ piece, assembly }: { piece: Piece; assembly: MotionValue<number> }) {
  const local = useTransform(assembly, [piece.stagger, 1], [0, 1], { clamp: true });

  const x = useTransform(local, [0, 1], [piece.fromX, "0%"]);
  const y = useTransform(local, [0, 1], [piece.fromY, "0%"]);
  const rotate = useTransform(local, [0, 1], [piece.fromRotate, 0]);
  // "Running toward camera": starts small and far away, grows to full size
  // as it arrives - the actual sense of forward motion, not just a slide.
  const scale = useTransform(local, [0, 1], [0.3, 1]);
  const opacity = useTransform(local, [0, 1], [0, 1]);
  // Motion blur that's heaviest while the piece is furthest away/fastest,
  // and resolves to a sharp image once assembled.
  const blur = useTransform(local, [0, 0.7, 1], [10, 3, 0]);
  // Amber glow trail - builds as the piece launches, burns off as it
  // settles into place.
  const glow = useTransform(local, [0, 0.35, 1], [0, 30, 0]);
  const filter = useTransform([blur, glow], ([b, g]: number[]) => `blur(${b}px) drop-shadow(0 0 ${g}px rgba(255,184,0,0.9))`);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath: piece.clipPath, x, y, rotate, scale, opacity, filter }}
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
  );
}

/**
 * Original photorealistic android bust (AI-generated, not a stock asset) -
 * a single image split into three pieces purely via clip-path, so the
 * exploded-assembly entrance is "each piece's clipped window starts
 * offset and animates to (0,0)" rather than three separately-exported
 * crops that could subtly misalign at their cut edges.
 *
 * Assembly is driven by one shared 0-1 progress value with two possible
 * triggers, whichever happens first: a spring-timed auto-entrance shortly
 * after page load, or the visitor scrolling within the hero before that
 * timer fires (in which case scroll position itself scrubs the assembly
 * through the first ~quarter of the hero's scroll range). Either way,
 * once progress reaches 1 the robot stays fixed - scroll is no longer
 * read at all past that point.
 *
 * Mouse-tracking tilts the whole assembled container a few degrees toward
 * the cursor; entrance, glow trail, and tracking are all skipped under
 * reduced motion, leaving a single static image with no window listener
 * attached at all.
 */
export const RobotFlyby = ({ className }: RobotFlybyProps) => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Shared 0-1 assembly progress, read by every piece.
  const assembly = useMotionValue(0);

  // Hero is exactly one viewport tall (min-h-[100dvh]), so a hero-relative
  // useScroll `offset` (e.g. "start start" -> "end start") would measure a
  // *zero-pixel* range - the section's start and end edges are less than a
  // viewport apart, so that range degenerates to "any scroll at all jumps
  // straight to 1". Plain window scrollY, mapped over a fixed fraction of
  // the viewport height, gives an actual scrollable distance to scrub
  // through instead - and since Hero starts at the very top of the page,
  // "scrolling in the hero" and "scrolling down from the page top" are the
  // same motion here anyway.
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, (v) => {
    const range = window.innerHeight * SCROLL_TRIGGER_RANGE;
    return clamp(v / range, 0, 1);
  });

  // Whichever trigger fires first "claims" the entrance - auto-timer vs.
  // scroll - so they never fight each other mid-flight.
  const autoStartedRef = useRef(false);
  const scrollActiveRef = useRef(false);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduceMotion) return;
    const isMobile = window.innerWidth < 768;
    const duration = isMobile ? MOBILE_DURATION : DESKTOP_DURATION;
    autoTimeoutRef.current = setTimeout(() => {
      if (autoStartedRef.current) return; // scroll already took over
      autoStartedRef.current = true;
      animate(assembly, 1, { type: "spring", duration, bounce: ENTRANCE_BOUNCE });
    }, LOADING_SCREEN_DELAY_MS);
    return () => clearTimeout(autoTimeoutRef.current);
  }, [reduceMotion, assembly]);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    if (reduceMotion) return;
    if (autoStartedRef.current && !scrollActiveRef.current) return; // auto entrance already claimed it
    if (!scrollActiveRef.current) {
      if (v <= 0.001) return; // no real scroll yet - keep waiting on the auto-timer
      scrollActiveRef.current = true;
      autoStartedRef.current = true;
      clearTimeout(autoTimeoutRef.current);
    }
    if (v >= 1) {
      assembly.set(1);
      scrollActiveRef.current = false; // fully assembled - stop reading scroll for good
      return;
    }
    if (v > assembly.get()) assembly.set(v); // ratchet: never un-assemble on scroll-up
  });

  // Container "look at cursor" tilt - written imperatively via
  // useMotionValue (never React state) so tracking the mouse across the
  // whole window never triggers a re-render, then damped through a spring
  // for smooth, responsive tracking.
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
      // Angle from the robot's center to the cursor, normalized to the
      // viewport half-dimensions so it reads as "where on screen is the
      // cursor" rather than being sensitive to the robot's own size.
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
  // values, nothing to animate.
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

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <motion.div
        className="relative mx-auto h-full w-full"
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
      >
        {PIECES.map((piece) => (
          <RobotPiece key={piece.id} piece={piece} assembly={assembly} />
        ))}
      </motion.div>
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
