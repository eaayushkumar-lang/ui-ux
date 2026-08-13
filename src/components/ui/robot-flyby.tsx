import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_ENTRANCE, SPRING_HEAD_TILT } from "@/lib/motion";
import { LOADING_SCREEN_MS } from "@/components/loading-screen";

// The hero mounts (and this entrance animation starts) immediately, at the
// same time as the full-screen LoadingScreen overlay - without this delay
// the whole exploded-assembly plays out hidden behind that splash and the
// visitor never actually sees it happen. Starting exactly when the splash
// begins its own fade-out means the assembly is revealed mid-flight through
// the dissolving overlay, which reads as a deliberate reveal rather than a
// coincidence of two unrelated timers.
const LOADING_SCREEN_DELAY = LOADING_SCREEN_MS / 1000;

const MAX_HEAD_TILT_DEG = 15;

interface RobotFlybyProps {
  className?: string;
}

type FlightVariant = {
  hidden: { x: number; y: number; rotate: number; opacity: number };
  visible: { x: number; y: number; rotate: number; opacity: number };
};

/** Each part flies in from a different edge with its own spin, then settles
 * flat at 0/0/0 - the actual body geometry is drawn at its final resting
 * position, so animating a part's group is just "start offset, end at
 * (0,0,0)" rather than needing two separate coordinate systems. */
function flightVariant(fromX: number, fromY: number, fromRotate: number): FlightVariant {
  return {
    hidden: { x: fromX, y: fromY, rotate: fromRotate, opacity: 0 },
    visible: { x: 0, y: 0, rotate: 0, opacity: 1 },
  };
}

const TORSO_FLIGHT = flightVariant(0, 220, 8);
const HEAD_FLIGHT = flightVariant(0, -260, -22);
const LEFT_ARM_FLIGHT = flightVariant(-260, 20, -50);
const RIGHT_ARM_FLIGHT = flightVariant(260, 20, 50);

// Torso first, then head, then both arms "attach" last - matches the
// requested assembly order rather than a uniform stagger.
const TORSO_DELAY = 0;
const HEAD_DELAY = 0.35;
const LEFT_ARM_DELAY = 0.65;
const RIGHT_ARM_DELAY = 0.78;

// Amber glow trail: a strong drop-shadow at launch that burns off to
// nothing as each part reaches its resting position, applied via `filter`
// (which follows a shape's actual silhouette, unlike box-shadow) so the
// glow trail wraps every part's true outline rather than its bounding box.
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
 * Original sci-fi android bust - glossy black chrome, rounded helmet visor,
 * amber circuitry seams, a diagonally-accented chest plate, and articulated
 * arms/hands - built as one shared SVG canvas so every part (head, torso,
 * each arm) shares one coordinate space and lines up exactly at the seams.
 * That also makes the exploded-assembly entrance straightforward: each part
 * is drawn at its final resting position, then wrapped in a `motion.g`
 * that starts offset off-canvas and animates to (0,0,0) - no separate
 * "assembled" layout to keep in sync with a "flying" one.
 *
 * Mouse-tracking, entrance, and glow-trail are all skipped under reduced
 * motion - see the bottom of this component - leaving a single static,
 * fully assembled render with no window listener attached at all.
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

  // Head "look at cursor": written imperatively via useMotionValue (never
  // React state) so tracking the mouse across the whole window never
  // triggers a re-render, then damped through a spring for a soft glance
  // rather than a jittery snap-to-pointer.
  const rawTiltY = useMotionValue(0);
  const rawTiltX = useMotionValue(0);
  const tiltY = useSpring(rawTiltY, SPRING_HEAD_TILT);
  const tiltX = useSpring(rawTiltX, SPRING_HEAD_TILT);

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMouseMove(event: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Track relative to the head's approximate position (upper third of
      // the container), not the container's center, so the glance reads as
      // coming from the head itself.
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height * 0.2;
      const dx = clamp((event.clientX - originX) / (window.innerWidth / 2), -1, 1);
      const dy = clamp((event.clientY - originY) / (window.innerHeight / 2), -1, 1);
      rawTiltY.set(dx * MAX_HEAD_TILT_DEG);
      rawTiltX.set(-dy * MAX_HEAD_TILT_DEG);
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [reduceMotion, rawTiltX, rawTiltY]);

  // Reduced motion: every part's variant is skipped entirely so it renders
  // straight at its resting "visible" transform with nothing to animate -
  // `animate` is "visible" from the very first paint, same as how a normal
  // static (non-explosion) render would look.
  const showAssembled = reduceMotion || hasEntered;
  const animateOnMount = !reduceMotion;
  const partTransition = (delay: number) => ({
    ...SPRING_ENTRANCE,
    delay: LOADING_SCREEN_DELAY + (isMobile ? delay * 0.6 : delay),
  });
  // The glow trail lives on a nested motion.g (so it can wrap each part's
  // real silhouette rather than the flight group's translate/rotate), which
  // means it does NOT automatically inherit its parent's delay - variants
  // propagate to children immediately, not gated by the parent's own
  // transition. Without its own matching delay here the glow would flash by
  // during the loading-screen splash while the part itself only starts
  // moving once that's gone.
  const glowTransition = (delay: number) => ({
    duration: 0.9,
    ease: "easeOut" as const,
    delay: LOADING_SCREEN_DELAY + (isMobile ? delay * 0.6 : delay),
  });

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 0 240 320"
        className="mx-auto h-full w-full max-w-[280px]"
        style={{ overflow: "visible" }}
        role="img"
        aria-label="Animated android illustration"
      >
        <defs>
          <linearGradient id="robotChrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a5a5e" />
            <stop offset="14%" stopColor="#1c1c1e" />
            <stop offset="45%" stopColor="#050505" />
            <stop offset="72%" stopColor="#161616" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <linearGradient id="robotSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f7" />
            <stop offset="55%" stopColor="#cfd0d4" />
            <stop offset="100%" stopColor="#9a9aa2" />
          </linearGradient>
          <radialGradient id="robotVisor" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="55%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>

        {/* Torso (+ shoulders, neck) - assembles first */}
        <motion.g
          animate={showAssembled ? "visible" : "hidden"}
          variants={TORSO_FLIGHT}
          transition={partTransition(TORSO_DELAY)}
        >
          <motion.g
            variants={animateOnMount ? GLOW_TRAIL : undefined}
            transition={animateOnMount ? glowTransition(TORSO_DELAY) : undefined}
          >
            {/* neck */}
            <rect x="106" y="88" width="28" height="18" rx="8" fill="url(#robotChrome)" />
            {/* shoulders */}
            <ellipse cx="66" cy="114" rx="27" ry="24" fill="url(#robotChrome)" />
            <ellipse cx="174" cy="114" rx="27" ry="24" fill="url(#robotChrome)" />
            <ellipse cx="60" cy="106" rx="9" ry="5" fill="#ffffff" opacity="0.18" />
            <ellipse cx="168" cy="106" rx="9" ry="5" fill="#ffffff" opacity="0.18" />
            {/* torso shell */}
            <rect x="74" y="98" width="92" height="118" rx="30" fill="url(#robotChrome)" />
            <path d="M 78 130 Q 120 108 162 130" fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="3" />
            {/* chest plate */}
            <path
              d="M 96 118 L 144 118 L 150 156 L 128 182 L 112 182 L 90 156 Z"
              fill="url(#robotSilver)"
            />
            <line x1="99" y1="128" x2="141" y2="168" stroke="#FFB800" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
            <line x1="108" y1="122" x2="136" y2="150" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            {/* torso seam glow */}
            <path
              d="M 74 168 Q 120 178 166 168"
              fill="none"
              stroke="#FFB800"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.75"
            />
          </motion.g>
        </motion.g>

        {/* Head - assembles second */}
        <motion.g
          animate={showAssembled ? "visible" : "hidden"}
          variants={HEAD_FLIGHT}
          transition={partTransition(HEAD_DELAY)}
        >
          <motion.g
            style={{ rotateX: tiltX, rotateY: tiltY, transformOrigin: "120px 96px" }}
            variants={animateOnMount ? GLOW_TRAIL : undefined}
            transition={animateOnMount ? glowTransition(HEAD_DELAY) : undefined}
          >
            {/* helmet dome */}
            <path
              d="M 120 16 C 147 16 161 39 159 63 C 157 85 140 100 120 100 C 100 100 83 85 81 63 C 79 39 93 16 120 16 Z"
              fill="url(#robotChrome)"
            />
            <path d="M 92 30 C 100 22 110 18 120 17" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
            {/* visor */}
            <path
              d="M 94 58 C 94 48 105 43 120 43 C 135 43 146 48 146 58 C 146 70 135 77 120 77 C 105 77 94 70 94 58 Z"
              fill="url(#robotVisor)"
            />
            <path d="M 100 51 C 106 47 114 45 121 45" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
            {/* temple glow ring */}
            <circle cx="152" cy="60" r="9" fill="none" stroke="#FFB800" strokeWidth="3" opacity="0.95" />
            <circle cx="152" cy="60" r="9" fill="none" stroke="#FFD770" strokeWidth="1" opacity="0.6" />
          </motion.g>
        </motion.g>

        {/* Left arm (upper arm, forearm, hand) - attaches last */}
        <motion.g
          animate={showAssembled ? "visible" : "hidden"}
          variants={LEFT_ARM_FLIGHT}
          transition={partTransition(LEFT_ARM_DELAY)}
        >
          <motion.g
            variants={animateOnMount ? GLOW_TRAIL : undefined}
            transition={animateOnMount ? glowTransition(LEFT_ARM_DELAY) : undefined}
          >
            <rect x="39" y="124" width="27" height="62" rx="13" fill="url(#robotChrome)" />
            <circle cx="52" cy="130" r="3.5" fill="#FFB800" opacity="0.9" />
            <circle cx="52" cy="182" r="3.5" fill="#FFB800" opacity="0.9" />
            <g transform="rotate(14 52 186)">
              <rect x="41" y="186" width="23" height="56" rx="11" fill="url(#robotChrome)" />
              <circle cx="52" cy="240" r="3.5" fill="#FFB800" opacity="0.9" />
              {/* hand */}
              <rect x="40" y="240" width="24" height="26" rx="9" fill="url(#robotChrome)" />
              {[-11, -4, 4, 11].map((dx) => (
                <g key={dx} transform={`rotate(${dx * 1.4} ${52 + dx} 262)`}>
                  <rect x={48 + dx} y={252} width="7" height="24" rx="3.5" fill="url(#robotChrome)" />
                  <circle cx={51.5 + dx} cy={254} r="2.4" fill="#FFB800" opacity="0.9" />
                </g>
              ))}
            </g>
          </motion.g>
        </motion.g>

        {/* Right arm - mirror of the left, attaches last */}
        <motion.g
          animate={showAssembled ? "visible" : "hidden"}
          variants={RIGHT_ARM_FLIGHT}
          transition={partTransition(RIGHT_ARM_DELAY)}
        >
          <motion.g
            variants={animateOnMount ? GLOW_TRAIL : undefined}
            transition={animateOnMount ? glowTransition(RIGHT_ARM_DELAY) : undefined}
          >
            <rect x="174" y="124" width="27" height="62" rx="13" fill="url(#robotChrome)" />
            <circle cx="188" cy="130" r="3.5" fill="#FFB800" opacity="0.9" />
            <circle cx="188" cy="182" r="3.5" fill="#FFB800" opacity="0.9" />
            <g transform="rotate(-14 188 186)">
              <rect x="176" y="186" width="23" height="56" rx="11" fill="url(#robotChrome)" />
              <circle cx="188" cy="240" r="3.5" fill="#FFB800" opacity="0.9" />
              {/* hand */}
              <rect x="176" y="240" width="24" height="26" rx="9" fill="url(#robotChrome)" />
              {[-11, -4, 4, 11].map((dx) => (
                <g key={dx} transform={`rotate(${dx * 1.4} ${188 + dx} 262)`}>
                  <rect x={184 + dx} y={252} width="7" height="24" rx="3.5" fill="url(#robotChrome)" />
                  <circle cx={187.5 + dx} cy={254} r="2.4" fill="#FFB800" opacity="0.9" />
                </g>
              ))}
            </g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
