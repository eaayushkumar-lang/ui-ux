import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/logo-mark";
import { LiquidHeroTitle } from "@/components/liquid-text";
import { EASE_OUT as EASE } from "@/lib/motion";

const DURATION_MS = 1500;

/** Full-screen splash shown once on first mount of the app - not on
 * client-side route changes, since those never remount App - then fades
 * into the real site. Reuses LiquidHeroTitle for the wordmark so the
 * "liquid" motion is the same system used everywhere else on the site,
 * not a bespoke one-off effect. */
export function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-center gap-4"
          >
            <span className="motion-safe:animate-breathe">
              <LogoMark className="h-12 w-12" />
            </span>
            <span className="font-mono text-2xl tracking-[0.02em] text-ink">
              <LiquidHeroTitle>
                AUXAI<span className="text-accent">.AI</span>
              </LiquidHeroTitle>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
