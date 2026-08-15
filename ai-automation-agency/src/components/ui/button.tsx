import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_HOVER } from "@/lib/motion";

// Native event handler names whose React DOM signature conflicts with
// Motion's own (e.g. onAnimationStart receives a Motion AnimationDefinition,
// not a native AnimationEvent). Nothing here relies on the native
// drag/animation events, so it's safe to drop them from the prop surface.
type MotionConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | MotionConflictingHandlers> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

/**
 * Primary = filled violet (--accent-primary). Secondary = outlined/ghost
 * orange (--accent-secondary), per CLAUDE.md's CTA spec. Hover/tap states
 * are Framer Motion (discrete, component-scoped) rather than GSAP, per the
 * working-style rule about not mixing the two libraries on one element.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_HOVER}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-150",
        variant === "primary" && "bg-primary text-ink hover:bg-primary/90",
        variant === "secondary" && "border border-secondary/60 text-secondary hover:bg-secondary/10",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
