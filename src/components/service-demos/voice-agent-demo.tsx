import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic } from "lucide-react";
import { TypingText } from "./typing-text";
import { EASE_IN_OUT } from "@/lib/motion";

const RESPONSE = "Hello, this is AUXAI. How can I help you today?";
const BAR_COUNT = 22;

export function VoiceAgentDemo() {
  const reduceMotion = useReducedMotion();
  const [started, setStarted] = useState(false);
  const playing = started && !reduceMotion;

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
      className="mx-auto w-full max-w-md rounded-2xl border border-line/70 bg-bg/60 p-5"
    >
      <div className="flex items-center gap-2 pb-4">
        <span className="h-2 w-2 rounded-full bg-accent motion-safe:animate-breathe" />
        <span className="font-mono text-[11px] tracking-[0.08em] text-ink-faint">
          Voice Agent · live
        </span>
      </div>

      <div className="flex h-16 items-end justify-center gap-[3px]" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <motion.span
            key={i}
            className="h-full w-[3px] rounded-full bg-gradient-to-t from-accent-2 to-accent"
            style={{ transformOrigin: "bottom" }}
            animate={playing ? { scaleY: [0.15, 1, 0.3, 0.8, 0.15] } : { scaleY: 0.4 }}
            transition={
              playing
                ? {
                    duration: 1.1 + (i % 5) * 0.12,
                    repeat: Infinity,
                    ease: EASE_IN_OUT,
                    delay: i * 0.035,
                  }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 border-t border-line/60 pt-4">
        <motion.span
          animate={playing ? { scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity, ease: EASE_IN_OUT }}
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
        >
          <Mic className="h-3.5 w-3.5" strokeWidth={1.75} />
        </motion.span>
        <p className="text-sm leading-relaxed text-ink">
          <TypingText text={RESPONSE} start={started} speed={26} startDelay={400} />
        </p>
      </div>
    </motion.div>
  );
}
