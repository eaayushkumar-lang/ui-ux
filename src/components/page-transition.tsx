import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/** Wraps a page's content so route changes get a real enter/exit
 * animation under AnimatePresence, instead of an abrupt swap. */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
