import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Check,
  Database,
  Loader2,
  Mail,
  MessageCircle,
  Play,
  RotateCcw,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { TrialShell } from "@/components/trial-shell";
import { Button } from "@/components/ui/button";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  { label: "Lead comes in", icon: UserPlus },
  { label: "Add to CRM", icon: Database },
  { label: "Send welcome email", icon: Mail },
  { label: "Notify on Slack", icon: MessageCircle },
  { label: "Schedule follow-up", icon: CalendarClock },
];

type StepStatus = "pending" | "running" | "done";

const STEP_MS = 900;

export function TryAutomationPage() {
  const [statuses, setStatuses] = useState<StepStatus[]>(steps.map(() => "pending"));
  const [running, setRunning] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  function run() {
    if (running) return;
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setStatuses(steps.map(() => "pending"));
    setRunning(true);

    steps.forEach((_, i) => {
      const startAt = i * STEP_MS;
      timeouts.current.push(
        setTimeout(() => {
          setStatuses((prev) => prev.map((s, idx) => (idx === i ? "running" : s)));
        }, startAt),
        setTimeout(
          () => {
            setStatuses((prev) => prev.map((s, idx) => (idx === i ? "done" : s)));
            if (i === steps.length - 1) setRunning(false);
          },
          startAt + STEP_MS * 0.85,
        ),
      );
    });
  }

  function reset() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setStatuses(steps.map(() => "pending"));
    setRunning(false);
  }

  return (
    <TrialShell title="Try Workflow Automation" eyebrow="Workflow Automation">
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-card rounded-[var(--radius-card)] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col lg:flex-1 lg:flex-row lg:items-start">
                <WorkflowNode step={step} status={statuses[i]} />
                {i < steps.length - 1 && <Connector lit={statuses[i] === "done"} />}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-line/60 pt-6">
            <Button onClick={run} disabled={running}>
              {running ? "Running..." : "Run Workflow"}
              <Play className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            <Button variant="secondary" onClick={reset} disabled={running}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </TrialShell>
  );
}

function WorkflowNode({ step, status }: { step: Step; status: StepStatus }) {
  const Icon = step.icon;
  return (
    <div className="flex items-center gap-3 py-3 lg:w-28 lg:flex-col lg:items-center lg:py-0 lg:text-center">
      <motion.span
        animate={{ scale: status === "running" ? [1, 1.08, 1] : 1 }}
        transition={{
          duration: 0.8,
          repeat: status === "running" ? Infinity : 0,
          ease: EASE_IN_OUT,
        }}
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          status === "pending" && "border-line text-ink-faint",
          status === "running" &&
            "border-accent bg-accent/10 text-accent shadow-[0_0_20px_-2px_rgba(255,184,0,0.6)]",
          status === "done" && "border-accent bg-gradient-to-r from-accent to-accent-2 text-accent-ink",
        )}
      >
        {status === "running" ? (
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
        ) : status === "done" ? (
          <Check className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        )}
      </motion.span>
      <div className="lg:mt-3">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            status === "pending" ? "text-ink-faint" : "text-ink",
          )}
        >
          {step.label}
        </p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          {status}
        </p>
      </div>
    </div>
  );
}

function Connector({ lit }: { lit: boolean }) {
  return (
    <div className="flex h-6 items-center justify-center pl-6 lg:h-auto lg:flex-1 lg:pl-0 lg:pt-6">
      <motion.div
        animate={{
          opacity: lit ? 1 : 0.25,
          boxShadow: lit ? "0 0 12px 1px rgba(255,184,0,0.7)" : "0 0 0px rgba(255,184,0,0)",
        }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="h-full w-px bg-gradient-to-b from-accent to-accent-2 lg:h-px lg:w-full lg:bg-gradient-to-r"
      />
    </div>
  );
}
