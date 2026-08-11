import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { CountUp } from "./count-up";
import { EASE_OUT as EASE } from "@/lib/motion";

interface Metric {
  label: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}

const metrics: Metric[] = [
  { label: "Tasks Automated", value: 1247, icon: Zap },
  { label: "Time Saved", value: 340, icon: Clock, suffix: " hrs" },
  { label: "Revenue Impact", value: 47, icon: TrendingUp, prefix: "+", suffix: "%" },
];

const bars = [
  { label: "Automation coverage", value: 82 },
  { label: "Response accuracy", value: 96 },
];

const chartBars = [40, 65, 50, 80, 60, 95, 75];

export function FullSystemDemo() {
  const [started, setStarted] = useState(false);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
      className="mx-auto w-full max-w-md rounded-2xl border border-line/70 bg-bg/60 p-5"
    >
      <div className="flex items-center gap-2 pb-4">
        <span className="h-2 w-2 rounded-full bg-accent motion-safe:animate-breathe" />
        <span className="font-mono text-[11px] tracking-[0.08em] text-ink-faint">
          System · live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-line/60 bg-surface-3/40 p-3">
            <m.icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
            <p className="mt-2 font-mono text-lg font-medium text-ink">
              <CountUp value={m.value} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} />
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-ink-faint">{m.label}</p>
          </div>
        ))}
      </div>

      <div
        className="mt-5 flex items-end justify-between gap-1.5 border-t border-line/60 pt-4"
        style={{ height: 56 }}
        aria-hidden="true"
      >
        {chartBars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={started ? { scaleY: h / 100 } : undefined}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.06, ease: EASE }}
            style={{ transformOrigin: "bottom", height: 56 }}
            className="w-full rounded-t-sm bg-gradient-to-t from-accent-2/70 to-accent"
          />
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between text-[11px] text-ink-faint">
              <span>{bar.label}</span>
              <span className="font-mono text-ink-dim">{bar.value}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={started ? { scaleX: bar.value / 100 } : undefined}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: EASE }}
                style={{ transformOrigin: "left" }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
