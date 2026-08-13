import { useEffect, useRef, useState } from "react";
import {
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

const MAX_TILT_DEG = 12;
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
  // Resting (exploded) position - visibly separated from its assembled
  // position but still in-frame, not flung off-screen. This is where the
  // piece sits by default, before any scrolling happens.
  restX: string;
  restY: string;
  restRotate: number;
  // Fraction of the shared assembly progress this piece waits for before
  // it starts moving - gives the pieces a staggered arrival without
  // needing a separate timeline per piece.
  stagger: number;
};

const PIECES: Piece[] = [
  { id: "top", clipPath: "inset(0% 0% 42% 0%)", restX: "0%", restY: "-18%", restRotate: -4, stagger: 0 },
  { id: "left", clipPath: "inset(58% 50% 0% 0%)", restX: "-32%", restY: "8%", restRotate: -11, stagger: 0.08 },
  { id: "right", clipPath: "inset(58% 0% 0% 50%)", restX: "32%", restY: "8%", restRotate: 11, stagger: 0.12 },
];

/** One exploded piece: derives every visual property (position, scale,
 * blur, glow) from a single shared 0-1 `assembly` progress value via
 * useTransform, so it's a pure function of progress rather than a
 * fixed-duration transition - required for scroll-scrubbing, since scroll
 * position can move forward AND backward at any speed. */
function RobotPiece({ piece, assembly }: { piece: Piece; assembly: MotionValue<number> }) {
  const local = useTransform(assembly, [piece.stagger, 1], [0, 1], { clamp: true });

  const x = useTransform(local, [0, 1], [piece.restX, "0%"]);
  const y = useTransform(local, [0, 1], [piece.restY, "0%"]);
  const rotate = useTransform(local, [0, 1], [piece.restRotate, 0]);
  const scale = useTransform(local, [0, 1], [0.92, 1]);
  // Slight blur while separated, resolving to a sharp image once joined.
  const blur = useTransform(local, [0, 1], [4, 0]);
  // Ambient amber glow marks the piece as "still disassembled"; it fades
  // out as the piece arrives at its assembled position.
  const glow = useTransform(local, [0, 1], [16, 0]);
  const filter = useTransform([blur, glow], ([b, g]: number[]) => `blur(${b}px) drop-shadow(0 0 ${g}px rgba(255,184,0,0.85))`);

  return (
    <motion.div className="absolute inset-0" style={{ clipPath: piece.clipPath, x, y, rotate, scale, filter }}>
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
 * a single image split into three pieces purely via clip-path, so
 * "assembly" is just each piece's clipped window moving to (0,0) rather
 * than three separately-exported crops that could subtly misalign at
 * their cut edges.
 *
 * Resting state (no scroll yet) is EXPLODED: pieces sit visibly separated,
 * slightly blurred, with an ambient amber glow - there is no auto-timer,
 * nothing plays on page load. Assembly is driven entirely by scroll
 * position within the first quarter-viewport of scrolling, bidirectionally
 * (scrolling back up re-separates the pieces) right up until the pieces
 * fully join, at which point it locks permanently - further scrolling
 * (in either direction) no longer affects the robot at all.
 *
 * Mouse-tracking tilts the whole assembled container a few degrees toward
 * the cursor, but only once assembly has locked - it stays inert while
 * still exploded. Everything scroll/glow/tracking-related is skipped
 * under reduced motion, leaving a single static, fully assembled image
 * with no window listener attached at all.
 */
export const RobotFlyby = ({ className }: RobotFlybyProps) => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Shared 0-1 assembly progress, read by every piece. Starts at 0
  // (exploded) and stays there until scroll moves it.
  const assembly = useMotionValue(0);
  const [assembled, setAssembled] = useState(false);

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

  // Once assembly reaches 1, further scroll (up or down) is ignored -
  // "assembled" is a one-way lock, not just a momentary state.
  const lockedRef = useRef(false);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    if (reduceMotion || lockedRef.current) return;
    if (v >= 1) {
      assembly.set(1);
      lockedRef.current = true;
      setAssembled(true);
      return;
    }
    assembly.set(v); // bidirectional: scrolling back up re-separates the pieces
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
    // Only tracks the cursor once the robot has actually assembled - while
    // still exploded, the container stays inert.
    if (reduceMotion || !assembled) return;
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
  }, [reduceMotion, assembled, rawTiltX, rawTiltY]);

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
