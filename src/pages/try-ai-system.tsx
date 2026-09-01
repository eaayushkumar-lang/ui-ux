import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Clock, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { TrialShell } from "@/components/trial-shell";
import { CountUp } from "@/components/service-demos/count-up";
import { EASE_OUT } from "@/lib/motion";

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
  { label: "Revenue Impact", value: 127, icon: TrendingUp, prefix: "+$", suffix: "K" },
  { label: "Active Workflows", value: 23, icon: Activity },
];

const PERFORMANCE = [42, 55, 48, 70, 64, 85, 92];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CATEGORIES = [
  { label: "Emails", value: 320 },
  { label: "CRM Updates", value: 210 },
  { label: "Scheduling", value: 180 },
  { label: "Support", value: 260 },
  { label: "Reports", value: 140 },
];

const NAMES = ["John", "Sarah", "Marcus", "Elena", "Priya", "Diego"];
const DOMAINS = ["company.com", "clientco.io", "acme-corp.com"];
const CHANNELS = ["sales", "support", "ops", "leadership"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomLeadId(): number {
  return 1000 + Math.floor(Math.random() * 9000);
}

const ACTIVITY_TEMPLATES = [
  () => `Email sent to ${randomFrom(NAMES).toLowerCase()}@${randomFrom(DOMAINS)}`,
  () => `CRM updated for lead #${randomLeadId()}`,
  () => `Slack notification sent to #${randomFrom(CHANNELS)}`,
  () => `Voice call completed with ${randomFrom(NAMES)}`,
  () => `Follow-up scheduled for lead #${randomLeadId()}`,
  () => `Welcome sequence triggered for new signup`,
];

function generateActivity(): string {
  return randomFrom(ACTIVITY_TEMPLATES)();
}

interface ActivityItem {
  id: number;
  text: string;
}

export function TryAISystemPage() {
  // Initial paint cycles through every template once (deterministic) so the
  // feed reads as varied on first load; live 3s refreshes below are
  // genuinely random, same as real activity would drift over time.
  const [activity, setActivity] = useState<ActivityItem[]>(() =>
    ACTIVITY_TEMPLATES.slice(0, 5).map((template, i) => ({ id: i, text: template() })),
  );
  const idRef = useRef(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivity((prev) => {
        const next: ActivityItem = { id: idRef.current++, text: generateActivity() };
        return [next, ...prev].slice(0, 8);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TrialShell title="Your AI System Dashboard" eyebrow="Full AI Systems">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-card rounded-2xl p-4 sm:p-5">
            <metric.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <p className="mt-3 font-mono text-2xl font-medium text-ink sm:text-3xl">
              <CountUp value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
            </p>
            <p className="mt-1 text-[12px] leading-tight text-ink-faint">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-[var(--radius-card)] p-6 lg:col-span-2">
          <h2 className="text-sm font-medium text-ink">Automation Performance</h2>
          <p className="text-[12px] text-ink-faint">Last 7 days</p>
          <PerformanceChart />
        </div>

        <div className="glass-card flex max-h-[420px] flex-col rounded-[var(--radius-card)] p-6">
          <h2 className="text-sm font-medium text-ink">Live Activity</h2>
          <p className="text-[12px] text-ink-faint">Auto-updating</p>
          <ul className="mt-4 flex-1 space-y-3 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {activity.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-dim"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent motion-safe:animate-breathe" />
                  {item.text}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className="glass-card mt-6 rounded-[var(--radius-card)] p-6">
        <h2 className="text-sm font-medium text-ink">Tasks by Category</h2>
        <p className="text-[12px] text-ink-faint">This month</p>
        <CategoryChart />
      </div>
    </TrialShell>
  );
}

function PerformanceChart() {
  const width = 560;
  const height = 160;
  const max = 100;
  const points = PERFORMANCE.map((value, i) => ({
    x: (i / (PERFORMANCE.length - 1)) * width,
    y: height - (value / max) * height,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <div className="mt-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="perf-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="perf-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-2)" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#perf-area)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE_OUT }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#perf-line)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            className="fill-accent"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.15, ease: EASE_OUT }}
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-ink-faint">
        {DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}

function CategoryChart() {
  const max = Math.max(...CATEGORIES.map((c) => c.value));
  return (
    <div className="mt-6 flex h-40 items-end justify-between gap-3 sm:gap-6">
      {CATEGORIES.map((cat, i) => (
        <div key={cat.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end overflow-hidden rounded-t-md">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: cat.value / max }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_OUT }}
              style={{ transformOrigin: "bottom", height: 128 }}
              className="w-full rounded-t-md bg-gradient-to-t from-accent-2/70 to-accent"
            />
          </div>
          <span className="text-center font-mono text-[10px] leading-tight text-ink-faint">
            {cat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
