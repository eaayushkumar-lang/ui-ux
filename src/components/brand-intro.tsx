import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LogoMark } from "@/components/logo-mark";

const BRAND = "AUXAI.AI";
const TAGLINE = "We don't automate tasks. We build systems that outperform everyone.";
// Index in BRAND where the accent-coloured ".AI" begins ("AUXAI" | ".AI").
const ACCENT_FROM = 5;

// Snappy, staggered letter reveal: blur-to-focus + a small rise, cascading
// left-to-right. Kept short so the whole intro lands in the 1.5-2.5s window.
const letterContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};
const letter: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

// Tagline: word-by-word rise, a distinct-but-complementary motion that starts
// once the brand name has essentially landed.
const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.75 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/**
 * Branded intro that plays on every page load: the logo mark + "AUXAI.AI"
 * reveal letter-by-letter (blur-to-focus), the tagline rises word-by-word,
 * then the whole layer fades out to hand off to the settled hero.
 *
 * It is a FOREGROUND layer over a translucent, blurred scrim - the fixed
 * ScrollVideo (already streaming its fast first frame at z-0) stays visible,
 * dimmed, behind it. This is deliberately NOT the old blocking LoadingScreen:
 * the scrim is see-through, `pointer-events-none` never traps interaction, and
 * nothing waits on the video's full frame-cache extraction.
 *
 * Reduced motion: the layer is skipped entirely, so the hero (which itself
 * settles instantly under <MotionConfig reducedMotion="user">) shows at once.
 */
export function BrandIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(false);
      return;
    }
    // Tagline finishes ~1.5s; hold it a beat, then trigger the exit fade. Exit
    // adds ~0.55s, so the whole intro is gone by ~2.4s.
    const t = window.setTimeout(() => setVisible(false), 1850);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="brand-intro"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#f4eadd]/55 px-6 text-center backdrop-blur-[7px]"
        >
          {/* Logo mark: scales + un-rotates into focus ahead of the letters. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <LogoMark className="h-14 w-14 drop-shadow-[0_6px_18px_rgba(193,80,46,0.28)]" />
          </motion.div>

          {/* Brand name: staggered letter reveal. */}
          <motion.h1
            variants={letterContainer}
            initial="hidden"
            animate="show"
            className="flex text-5xl font-medium tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            {BRAND.split("").map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                variants={letter}
                className={`inline-block ${i >= ACCENT_FROM ? "text-accent" : ""}`}
              >
                {ch}
              </motion.span>
            ))}
          </motion.h1>

          {/* Tagline: word-by-word rise. */}
          <motion.p
            variants={wordContainer}
            initial="hidden"
            animate="show"
            className="max-w-xl text-balance text-lg leading-relaxed text-ink-dim sm:text-xl"
          >
            {TAGLINE.split(" ").map((w, i) => (
              <motion.span key={`${w}-${i}`} variants={word} className="mr-[0.28em] inline-block">
                {w}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
