import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] font-medium transition-[transform,background-color,border-color,color,box-shadow,filter] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] active:duration-100",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-accent via-accent-2 to-coral text-accent-ink shadow-[0_0_0_1px_rgba(245,158,11,0.35),0_16px_36px_-16px_rgba(217,88,12,0.65)] hover:shadow-[0_0_0_1px_rgba(245,158,11,0.55),0_20px_48px_-14px_rgba(255,107,74,0.8)] hover:brightness-[1.06]",
        secondary:
          "bg-transparent text-ink border border-line hover:border-accent/50 hover:bg-accent/[0.08]",
        ghost: "bg-transparent text-ink-dim hover:text-ink hover:bg-accent/[0.06]",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
