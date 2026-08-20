import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Mic, PhoneOff, RotateCcw } from "lucide-react";
import { TrialShell } from "@/components/trial-shell";
import { TypingText } from "@/components/service-demos/typing-text";
import { Button } from "@/components/ui/button";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Line {
  role: "ai" | "user";
  text: string;
}

const SCRIPT: Line[] = [
  { role: "ai", text: "Hello, this is Aurevyn. How can I help you today?" },
  { role: "user", text: "I need to book an appointment" },
  { role: "ai", text: "Sure! I can help with that. What date works best for you?" },
  { role: "user", text: "Tomorrow at 3 PM" },
  {
    role: "ai",
    text: "Perfect. I've booked your appointment for tomorrow at 3 PM. You'll receive a confirmation shortly.",
  },
];

type CallState = "idle" | "active" | "ended";

export function TryVoiceAgentPage() {
  const reduceMotion = useReducedMotion();
  const [callState, setCallState] = useState<CallState>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startCall() {
    setCallState("active");
    setVisibleLines(0);
    setSeconds(0);
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

    SCRIPT.forEach((_, i) => {
      timers.current.push(setTimeout(() => setVisibleLines(i + 1), 900 + i * 1700));
    });
  }

  function endCall() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCallState((prev) => (prev === "active" ? "ended" : prev));
  }

  function resetDemo() {
    setCallState("idle");
    setVisibleLines(0);
    setSeconds(0);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <TrialShell title="Try Voice Agent" eyebrow="Voice Agents">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        {callState !== "ended" && (
          <>
            <motion.button
              type="button"
              onClick={callState === "idle" ? startCall : endCall}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={callState === "idle" ? "Start call" : "End call"}
              className={cn(
                "relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full transition-colors duration-300",
                callState === "active"
                  ? "bg-gradient-to-r from-accent to-accent-2 text-accent-ink shadow-[0_0_0_1px_rgba(193,80,46,0.4),0_0_60px_-10px_rgba(193,80,46,0.8)]"
                  : "border border-accent/40 bg-accent/10 text-accent",
              )}
            >
              {callState === "active" && !reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-accent/50"
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: EASE_OUT }}
                />
              )}
              <Mic className="h-10 w-10" strokeWidth={1.5} />
            </motion.button>
            <p className="mt-4 font-mono text-sm text-ink-dim">
              {callState === "active" ? `${mm}:${ss}` : "Tap to start a call"}
            </p>
          </>
        )}

        {callState === "active" && (
          <>
            <div
              className="mt-8 flex h-14 items-end justify-center gap-[3px]"
              aria-hidden="true"
            >
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="h-full w-[3px] rounded-full bg-gradient-to-t from-accent-2 to-accent"
                  style={{ transformOrigin: "bottom" }}
                  animate={
                    reduceMotion ? { scaleY: 0.4 } : { scaleY: [0.15, 1, 0.3, 0.8, 0.15] }
                  }
                  transition={{
                    duration: 1 + (i % 5) * 0.1,
                    repeat: Infinity,
                    ease: EASE_IN_OUT,
                    delay: i * 0.03,
                  }}
                />
              ))}
            </div>

            <div className="glass-card mt-8 w-full rounded-[var(--radius-card)] p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                {SCRIPT.slice(0, visibleLines).map((line, i) => (
                  <TranscriptLine key={i} line={line} isLatest={i === visibleLines - 1} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={endCall}
              className="mt-6 flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink-dim transition-colors hover:border-ink/40 hover:text-ink"
            >
              <PhoneOff className="h-4 w-4" strokeWidth={1.75} />
              End Call
            </button>
          </>
        )}

        {callState === "ended" && <CallSummary duration={`${mm}:${ss}`} onRestart={resetDemo} />}
      </div>
    </TrialShell>
  );
}

function TranscriptLine({ line, isLatest }: { line: Line; isLatest: boolean }) {
  const isAI = line.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className={cn("flex flex-col gap-1", !isAI && "items-end text-right")}
    >
      <span
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.1em]",
          isAI ? "text-accent" : "text-ink-faint",
        )}
      >
        {isAI ? "Aurevyn" : "Caller"}
      </span>
      <p className="max-w-[85%] text-sm leading-relaxed text-ink">
        {isLatest ? <TypingText text={line.text} start speed={22} /> : line.text}
      </p>
    </motion.div>
  );
}

function CallSummary({ duration, onRestart }: { duration: string; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="glass-card w-full rounded-[var(--radius-card)] p-8 text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Check className="h-6 w-6" strokeWidth={2} />
      </span>
      <h2 className="mt-4 text-xl font-medium text-ink">Call complete</h2>
      <dl className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-4 text-left">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">Duration</dt>
          <dd className="mt-1 font-mono text-ink">{duration}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">Outcome</dt>
          <dd className="mt-1 text-ink">Booked</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">Next step</dt>
          <dd className="mt-1 text-ink">Confirmed</dd>
        </div>
      </dl>
      <Button variant="secondary" className="mt-8" onClick={onRestart}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Try again
      </Button>
    </motion.div>
  );
}
