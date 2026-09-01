import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Reveals text one word at a time as it scrolls into view. Used sparingly
 * as a signature moment, not on every heading - the same trick on every
 * section reads as templated rather than deliberate. */
export function SplitText({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className={cn("inline", className)}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className={cn("inline-block", wordClassName)}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.span>
  );
}
