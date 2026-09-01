import { useId, useRef, useState, type ReactNode } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Liquid text distortion, built on SVG feTurbulence + feDisplacementMap.
 *
 * The continuous base wobble runs as a declarative SMIL <animate> on
 * baseFrequency - it costs nothing on the JS thread and never touches
 * React, since it's the browser's own SVG animation timeline. Only the
 * hover "melt" (a transient, low-frequency event) is driven imperatively,
 * via Motion's animate() writing straight to the SVG attribute through a
 * ref - never through React state, so it never re-renders on every frame.
 */
export function LiquidHeroTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const rawId = useId().replace(/[:]/g, "");
  const filterId = `liquid-hero-${rawId}`;
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  function tweenScaleTo(target: number, duration: number) {
    if (reduceMotion || !displaceRef.current) return;
    controlsRef.current?.stop();
    const from = Number(displaceRef.current.getAttribute("scale")) || 0;
    controlsRef.current = animate(from, target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (value) => displaceRef.current?.setAttribute("scale", String(value)),
    });
  }

  return (
    <span
      onMouseEnter={() => tweenScaleTo(28, 0.5)}
      onMouseLeave={() => tweenScaleTo(6, 0.7)}
      className={cn("inline-block", className)}
      style={reduceMotion ? undefined : { filter: `url(#${filterId})` }}
    >
      {children}
      {!reduceMotion && (
        <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves={2}
              seed={7}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="11s"
                repeatCount="indefinite"
                values="0.010 0.016;0.015 0.021;0.010 0.016"
              />
            </feTurbulence>
            <feDisplacementMap
              ref={displaceRef}
              in="SourceGraphic"
              in2="noise"
              scale={6}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
    </span>
  );
}

/** One-time liquid "settle" reveal for section headings: starts distorted,
 * animates to perfectly crisp as it enters the viewport, then the filter
 * is removed entirely so it costs nothing for the rest of the page's life. */
export function LiquidHeadingReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const rawId = useId().replace(/[:]/g, "");
  const filterId = `liquid-reveal-${rawId}`;
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const [settled, setSettled] = useState(Boolean(reduceMotion));

  function reveal() {
    if (reduceMotion || settled || !displaceRef.current) return;
    animate(30, 0, {
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (value) => displaceRef.current?.setAttribute("scale", String(value)),
      onComplete: () => setSettled(true),
    });
  }

  return (
    <motion.span
      onViewportEnter={reveal}
      viewport={{ once: true, amount: 0.6 }}
      className={cn("inline-block", className)}
      style={!settled ? { filter: `url(#${filterId})` } : undefined}
    >
      {children}
      {!settled && (
        <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.03"
              numOctaves={2}
              seed={3}
              result="noise"
            />
            <feDisplacementMap
              ref={displaceRef}
              in="SourceGraphic"
              in2="noise"
              scale={30}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
    </motion.span>
  );
}

/** Cheap left-to-right shimmer sweep for the tagline: a moving gradient
 * clipped to the text, not a filter - runs indefinitely so it's kept to a
 * tiny element with a small paint region. */
export function ShimmerText({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        !reduceMotion && "motion-safe:animate-shimmer",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(100deg, var(--color-ink-dim) 30%, var(--color-accent) 50%, var(--color-ink-dim) 70%)",
        backgroundSize: "220% 100%",
        color: reduceMotion ? "var(--color-ink-dim)" : undefined,
      }}
    >
      {children}
    </span>
  );
}
