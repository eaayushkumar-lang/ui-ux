import { type ElementType, type ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** transition-delay in ms (spec assigns explicit per-block delays). */
  delay?: number;
  className?: string;
  /** Render as a different element (e.g. "li", "h1") - defaults to div. */
  as?: ElementType;
}

/**
 * Wraps a block in the shared fade-up reveal. Hidden -> visible swaps
 * translate-y-8/opacity-0 for translate-y-0/opacity-100 over 700ms ease-out
 * once the element scrolls into view, with the caller's per-block delay.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
