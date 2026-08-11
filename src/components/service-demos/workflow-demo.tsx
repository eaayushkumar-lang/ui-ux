import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Database, FileText, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const nodes = [
  { label: "Lead Form", icon: FileText },
  { label: "CRM Update", icon: Database },
  { label: "Email Sequence", icon: Mail },
  { label: "Slack Alert", icon: MessageCircle },
];

const CYCLE_MS = 5000;
const STEP_MS = CYCLE_MS / (nodes.length + 1);

export function WorkflowDemo() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (reduceMotion) {
      setActive(nodes.length - 1);
      return;
    }
    let step = -1;
    const interval = setInterval(() => {
      step = (step + 1) % (nodes.length + 1);
      setActive(step === nodes.length ? -1 : step);
    }, STEP_MS);
    return () => clearInterval(interval);
  }, [started, reduceMotion]);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
      className="mx-auto w-full max-w-md rounded-2xl border border-line/70 bg-bg/60 p-5"
    >
      <div className="flex items-center gap-2 pb-4">
        <span className="h-2 w-2 rounded-full bg-accent motion-safe:animate-breathe" />
        <span className="font-mono text-[11px] tracking-[0.08em] text-ink-faint">
          Pipeline · live
        </span>
      </div>

      <div className="flex flex-col">
        {nodes.map((node, i) => {
          const lit = reduceMotion || active >= i;
          const lineLit = reduceMotion || active > i;
          const Icon = node.icon;
          return (
            <div key={node.label}>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,box-shadow,color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    lit
                      ? "border-accent/60 bg-accent/12 text-accent shadow-[0_0_16px_-2px_rgba(255,184,0,0.6)]"
                      : "border-line text-ink-faint",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    lit ? "text-ink" : "text-ink-faint",
                  )}
                >
                  {node.label}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <div className="ml-[17px] h-6 w-px overflow-hidden">
                  <motion.div
                    animate={{ scaleY: lineLit ? 1 : 0 }}
                    style={{ transformOrigin: "top" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full bg-gradient-to-b from-accent to-accent-2"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
