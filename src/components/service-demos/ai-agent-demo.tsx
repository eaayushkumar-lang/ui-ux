import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { TypingText } from "./typing-text";
import { EASE_OUT as EASE } from "@/lib/motion";

const RESPONSE = "Done! Meeting scheduled for tomorrow 3 PM with the marketing team.";

export function AIAgentDemo() {
  const reduceMotion = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => setShowReply(true), reduceMotion ? 0 : 700);
    return () => clearTimeout(timeout);
  }, [started, reduceMotion]);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
      className="mx-auto w-full max-w-md rounded-2xl border border-line/70 bg-bg/60 p-4"
    >
      <div className="flex items-center gap-2 border-b border-line/60 pb-3">
        <span className="h-2 w-2 rounded-full bg-accent motion-safe:animate-breathe" />
        <span className="font-mono text-[11px] tracking-[0.08em] text-ink-faint">
          AI Agent · live
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={started ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, ease: EASE }}
          className="ml-auto flex max-w-[80%] items-start gap-2"
        >
          <div className="rounded-2xl rounded-tr-sm bg-surface-3 px-4 py-2.5 text-sm text-ink">
            Schedule my meeting
          </div>
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-ink-dim">
            <User className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={showReply ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex max-w-[85%] items-start gap-2"
        >
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <div className="min-h-[2.25rem] rounded-2xl rounded-tl-sm border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-sm text-ink">
            <TypingText text={RESPONSE} start={showReply} speed={22} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
