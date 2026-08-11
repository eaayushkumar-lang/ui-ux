import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SPRING_HOVER } from "@/lib/motion";

const buttonVariants = cva(
  "gpu group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] font-medium transition-[background-color,border-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0)_50%),linear-gradient(90deg,var(--color-accent),var(--color-accent-2))] text-accent-ink shadow-[0_0_0_1px_rgba(255,184,0,0.35),0_16px_36px_-16px_rgba(255,107,0,0.65)]",
        secondary:
          "bg-transparent text-ink border border-line shadow-[0_0_0_1px_rgba(255,184,0,0),0_14px_34px_-16px_rgba(255,184,0,0)] hover:border-accent/50 hover:bg-accent/[0.08]",
        ghost:
          "bg-transparent text-ink-dim shadow-[0_0_26px_-8px_rgba(255,184,0,0)] hover:text-ink hover:bg-accent/[0.06]",
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

const HOVER_GLOW: Record<string, string> = {
  primary:
    "0 0 0 1px rgba(255,184,0,0.6), 0 26px 60px -16px rgba(255,107,0,0.9)",
  secondary: "0 0 0 1px rgba(255,184,0,0.3), 0 14px 34px -16px rgba(255,184,0,0.45)",
  ghost: "0 0 26px -8px rgba(255,184,0,0.35)",
};

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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? MotionSlot : MotionButton;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.03, boxShadow: HOVER_GLOW[variant ?? "primary"] }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING_HOVER}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
