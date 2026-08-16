import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, useReducedMotion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SPRING_HOVER } from "@/lib/motion";

const buttonVariants = cva(
  "liquid-metal gpu group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[var(--radius-pill)] font-medium transition-[background-color,border-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "text-accent-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1.5px_0_rgba(0,0,0,0.28),0_0_0_1px_rgba(193,80,46,0.35),0_16px_36px_-16px_rgba(158,58,28,0.65)]",
        secondary:
          "bg-transparent text-ink border border-line shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(193,80,46,0),0_14px_34px_-16px_rgba(193,80,46,0)] hover:border-accent/50",
        ghost:
          "bg-transparent text-ink-dim shadow-[0_0_26px_-8px_rgba(193,80,46,0)] hover:text-ink",
      },
      size: {
        default: "h-12 px-6 text-[15px]",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonVariant = "primary" | "secondary" | "ghost";

const HOVER_GLOW: Record<ButtonVariant, string> = {
  primary:
    "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1.5px 0 rgba(0,0,0,0.3), 0 0 0 1px rgba(193,80,46,0.6), 0 26px 60px -16px rgba(158,58,28,0.9)",
  secondary:
    "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(193,80,46,0.3), 0 14px 34px -16px rgba(193,80,46,0.45)",
  ghost: "0 0 26px -8px rgba(193,80,46,0.35)",
};

/** Cursor-tracked metallic sheen, layered under the variant's own fill.
 * A radial highlight that follows --mx/--my (set imperatively on
 * mousemove, never through React state) plus, for primary, the existing
 * diagonal glass-shine and the amber-to-orange base gradient. */
function liquidBackground(variant: ButtonVariant) {
  const sheenAlpha = variant === "primary" ? 0.45 : 0.16;
  const sheen = `radial-gradient(140px circle at var(--mx, 50%) var(--my, 20%), rgba(255,255,255,${sheenAlpha}), transparent 62%)`;
  if (variant === "primary") {
    return `${sheen}, linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%), linear-gradient(90deg, var(--color-accent), var(--color-accent-2))`;
  }
  return sheen;
}

// Native event handler names whose React DOM signature conflicts with
// Motion's own (e.g. onDrag receives a Motion PanInfo, not a DragEvent).
// Nothing in this app relies on the native drag/animation events, so it's
// safe to omit them from the prop surface.
type MotionConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, MotionConflictingHandlers>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const MotionButton = motion.button;
const MotionSlot = motion.create(Slot);

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size,
      asChild = false,
      onMouseMove,
      onClick,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const Comp = asChild ? MotionSlot : MotionButton;
    const localRef = React.useRef<HTMLButtonElement>(null);
    const v = (variant ?? "primary") as ButtonVariant;
    const reduceMotion = useReducedMotion();

    function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
      // Liquid-metal cursor-follow sheen is purely decorative - skip the
      // imperative style writes under reduced motion so --mx/--my stay at
      // their static CSS-default fallback (a fixed, non-tracking highlight).
      if (!reduceMotion) {
        const el = localRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          el.style.setProperty("--my", `${event.clientY - rect.top}px`);
        }
      }
      onMouseMove?.(event);
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      const el = localRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--cx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--cy", `${event.clientY - rect.top}px`);
        // Toggle the attribute off and force a reflow so the CSS ripple
        // animation restarts on every click, not just the first.
        el.removeAttribute("data-rippling");
        void el.offsetWidth;
        el.setAttribute("data-rippling", "true");
      }
      onClick?.(event);
    }

    return (
      <Comp
        ref={mergeRefs(forwardedRef, localRef)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ backgroundImage: liquidBackground(v), ...style }}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.03, boxShadow: HOVER_GLOW[v] }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING_HOVER}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
