import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/logo-mark";
import { EASE_OUT } from "@/lib/motion";

const SESSION_KEY = "intro-played";

// [PLACEHOLDER] - swap for the real agency name/tagline once provided.
const AGENCY_NAME = "[Agency Name]";
const TAGLINE_WORDS = "[Placeholder tagline — describe your value prop here]".split(" ");

const LOADING_MS = 800;
const LOGO_GAP_MS = 100;
const LOGO_DURATION_MS = 700;
const PAUSE_BEFORE_TAGLINE_MS = 250;
const TAGLINE_WORD_STAGGER_MS = 70;
const TAGLINE_WORD_DURATION_MS = 450;
const HOLD_MS = 500;
const WIPE_DURATION_MS = 750;

const loadingEndsAt = LOADING_MS;
const logoStartsAt = loadingEndsAt + LOGO_GAP_MS;
const logoEndsAt = logoStartsAt + LOGO_DURATION_MS;
const taglineStartsAt = logoEndsAt + PAUSE_BEFORE_TAGLINE_MS;
const taglineEndsAt =
  taglineStartsAt + (TAGLINE_WORDS.length - 1) * TAGLINE_WORD_STAGGER_MS + TAGLINE_WORD_DURATION_MS;
const wipeStartsAt = taglineEndsAt + HOLD_MS;
// Exported so other components (Hero) can delay their own page-load
// entrance until the wipe has actually revealed the page - otherwise their
// entrance plays out invisibly, hidden behind this overlay.
export const INTRO_TOTAL_MS = wipeStartsAt + WIPE_DURATION_MS;

// sessionStorage throws outright in some embedded/sandboxed contexts
// (cross-origin iframes, hardened privacy modes) rather than just being
// empty. Since the read below happens inside a useState initializer, an
// unguarded throw would take the whole app down on first render - so treat
// "storage unavailable" as "intro hasn't played yet" and move on.
function hasIntroPlayed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Non-fatal: the intro simply replays on the next load.
  }
}

/**
 * Full-screen intro overlay, staged as: brief loading indicator -> logo
 * mark + agency name scale/blur-in with a violet glow -> tagline fading in
 * word-by-word below -> a hold, then a fade + upward wipe revealing the
 * real site underneath.
 *
 * Plays once per browser session (sessionStorage-gated) - a route change
 * or component remount within the same session never replays it. Skipped
 * entirely under prefers-reduced-motion.
 */
export function IntroSequence() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !reduceMotion && !hasIntroPlayed());

  useEffect(() => {
    if (!visible) return;
    markIntroPlayed();
    const timer = setTimeout(() => setVisible(false), INTRO_TOTAL_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          data-testid="intro-overlay"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-6%" }}
          transition={{ duration: WIPE_DURATION_MS / 1000, ease: EASE_OUT }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: loadingEndsAt / 1000, ease: EASE_OUT }}
              className="absolute flex flex-col items-center gap-3"
            >
              <span
                className="h-10 w-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
                style={{ animationDuration: `${LOADING_MS}ms` }}
              />
              <LoadingPercent durationMs={LOADING_MS} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: LOGO_DURATION_MS / 1000, delay: logoStartsAt / 1000, ease: EASE_OUT }}
              className="flex flex-col items-center gap-4"
            >
              <span
                className="rounded-2xl"
                style={{ filter: "drop-shadow(0 0 22px color-mix(in srgb, var(--accent-primary) 55%, transparent))" }}
              >
                <LogoMark className="h-14 w-14" />
              </span>
              <span className="font-display text-2xl tracking-[0.04em] text-ink sm:text-3xl">{AGENCY_NAME}</span>
            </motion.div>

            <p className="flex max-w-md flex-wrap justify-center gap-x-1.5 px-6 text-center text-sm text-muted sm:text-base">
              {TAGLINE_WORDS.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: TAGLINE_WORD_DURATION_MS / 1000,
                    delay: (taglineStartsAt + i * TAGLINE_WORD_STAGGER_MS) / 1000,
                    ease: EASE_OUT,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Fake 0->100 percentage tick, purely for the loading beat's visual
 * texture - not wired to any real network/asset progress. */
function LoadingPercent({ durationMs }: { durationMs: number }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const elapsed = now - start;
      setPct(Math.min(100, Math.round((elapsed / durationMs) * 100)));
      if (elapsed < durationMs) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);

  return <span className="font-mono text-xs tabular-nums text-muted">{pct}%</span>;
}
