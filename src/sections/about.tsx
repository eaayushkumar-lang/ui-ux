import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { CountUp } from "@/components/service-demos/count-up";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { cn } from "@/lib/utils";

const STAT_HOVER_SHADOW =
  "0 0 0 1px rgba(255,184,0,0.4), 0 24px 48px -18px rgba(0,0,0,0.65), 0 0 36px -8px rgba(255,184,0,0.35)";
const STAT_BASE_SHADOW =
  "0 0 0 1px rgba(255,184,0,0), 0 24px 48px -18px rgba(0,0,0,0), 0 0 36px -8px rgba(255,184,0,0)";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 50, suffix: "+", label: "AI Systems Built" },
  { value: 200, suffix: "+", label: "Workflows Automated" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 24, suffix: "/7", label: "AI Uptime" },
];

export function About() {
  return (
    <section id="about" className="relative z-10 bg-bg py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto w-full max-w-xs lg:mx-0"
          >
            <div
              className="gpu-active relative mx-auto aspect-square w-full max-w-[280px] rounded-[2rem] border border-accent/25 bg-gradient-to-br from-surface-3 to-bg motion-safe:animate-breathe"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,184,0,0.12), 0 40px 80px -30px rgba(0,0,0,0.7), 0 0 60px -10px rgba(255,184,0,0.45)",
              }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-20 w-20 text-accent/70" strokeWidth={1.25} />
              </div>
              <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/30 bg-bg/80 px-3 py-1 font-mono text-[11px] tracking-[0.06em] text-ink-faint backdrop-blur">
                <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.75} />
                Ayush · Founder
              </span>
            </div>
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
            >
              <LiquidHeadingReveal>The Mind Behind AUXAI.AI</LiquidHeadingReveal>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-dim"
            >
              Founded by Ayush, AUXAI.AI was built with one mission — to give businesses the
              unfair advantage of AI without the complexity. We don't just automate tasks. We
              engineer intelligent systems that think, adapt, and outperform.
            </motion.p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { ref, onMouseMove } = useCursorGlow<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      whileHover={{ scale: 1.05, y: -4, boxShadow: STAT_HOVER_SHADOW, transition: SPRING_HOVER }}
      style={{ boxShadow: STAT_BASE_SHADOW }}
      className={cn(
        "gpu cursor-glow glass-card cursor-pointer rounded-2xl p-4 text-center sm:p-5",
      )}
    >
      <p className="font-mono text-2xl font-medium text-accent sm:text-3xl">
        <CountUp value={stat.value} suffix={stat.suffix} />
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-ink-faint sm:text-[13px]">{stat.label}</p>
    </motion.div>
  );
}
