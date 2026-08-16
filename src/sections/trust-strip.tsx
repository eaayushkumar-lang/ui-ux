import { motion, useReducedMotion } from "framer-motion";

interface Metric {
  value: string;
  label: string;
}

const metrics: Metric[] = [
  { value: "50+", label: "Clients" },
  { value: "200+", label: "Automations" },
  { value: "10M+", label: "Tasks Automated" },
  { value: "99.9%", label: "Uptime" },
];

function MetricItem({ metric }: { metric: Metric }) {
  return (
    <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap px-8 font-mono text-sm tracking-[0.02em]">
      <span className="text-accent">{metric.value}</span>
      <span className="text-ink-dim">{metric.label}</span>
    </span>
  );
}

export function TrustStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 overflow-hidden rounded-t-[2rem] border-b border-line/60 py-10 shadow-[0_-32px_64px_-32px_rgba(10,6,3,0.6)] [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center font-mono text-[12px] tracking-[0.08em] text-ink-faint"
        >
          Trusted by innovative teams worldwide
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        {reduceMotion ? (
          <div className="flex flex-wrap items-center justify-center">
            {metrics.map((metric) => (
              <MetricItem key={metric.label} metric={metric} />
            ))}
          </div>
        ) : (
          <div className="gpu-active marquee-track flex w-max items-center">
            {[...metrics, ...metrics].map((metric, i) => (
              <MetricItem key={`${metric.label}-${i}`} metric={metric} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
