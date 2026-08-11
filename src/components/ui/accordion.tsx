import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_HOVER } from "@/lib/motion";

const Accordion = AccordionPrimitive.Root;
const MotionTrigger = motion.create(AccordionPrimitive.Trigger);

// See button.tsx for why these are omitted: their native DOM event
// signature conflicts with Motion's own (e.g. onDrag receives a Motion
// PanInfo, not a DragEvent), and nothing here uses the native versions.
type MotionConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>, MotionConflictingHandlers>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <MotionTrigger
      ref={ref}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 12px 28px -18px rgba(255,184,0,0.55)",
        transition: SPRING_HOVER,
      }}
      className={cn(
        "gpu group -mx-3 flex cursor-pointer flex-1 items-center justify-between gap-6 rounded-xl px-3 py-6 text-left text-lg font-medium text-ink transition-colors hover:bg-white/[0.03] hover:text-accent",
        className,
      )}
      {...props}
    >
      {children}
      <Plus
        className="h-5 w-5 shrink-0 text-ink-faint transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:text-accent"
        strokeWidth={1.75}
      />
    </MotionTrigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up motion-reduce:!animate-none"
    {...props}
  >
    <div className={cn("pb-6 pr-10 text-[15px] leading-relaxed text-ink-dim", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
