import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles, ChevronDown } from 'lucide-react';
import { useScrollProgress, useImperativeScrollStyle } from '../lib/useScrollProgress';

const EASE = [0.16, 1, 0.3, 1];

function applyHeadlineStyle(el, p) {
  const opacity = 1 - Math.min(1, p / 0.28);
  const y = -60 * Math.min(1, p / 0.3);
  el.style.opacity = String(opacity);
  el.style.transform = `translateY(${y}px)`;
}

function applyFadeOnly(el, p) {
  el.style.opacity = String(1 - Math.min(1, p / 0.28));
}

const LAYERS = [
  { label: 'Discover', sub: 'Map the workflow', tint: 'from-primary/25 to-primary/0', x: -220, rotate: -18 },
  { label: 'Design', sub: 'Architect the agent', tint: 'from-secondary/25 to-secondary/0', x: 220, rotate: 16 },
  { label: 'Deploy', sub: 'Ship into production', tint: 'from-accent/25 to-accent/0', x: -160, rotate: 12 },
  { label: 'Outperform', sub: 'Compound the results', tint: 'from-white/15 to-white/0', x: 0, rotate: 0 },
];

function StackLayer({ index, total, progress, label, sub, tint, x, rotate }) {
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;

  const y = useTransform(progress, [start, mid, end], [140, 0, -60 - index * 30]);
  const layerX = useTransform(progress, [start, mid], [x, 0]);
  const layerRotate = useTransform(progress, [start, mid], [rotate, 0]);
  const scale = useTransform(progress, [start, mid, 1], [0.82, 1, 1 - index * 0.02]);
  const opacity = useTransform(progress, [start, start + 0.06, end, 1], [0, 1, 1, index === total - 1 ? 1 : 0.35]);
  const blur = useTransform(progress, [start, start + 0.08], [6, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{
        y,
        x: layerX,
        rotate: layerRotate,
        scale,
        opacity,
        filter,
        zIndex: index,
      }}
      className="absolute flex h-[210px] w-[280px] flex-col justify-between rounded-2xl border border-border-strong bg-card/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:h-[240px] sm:w-[320px]"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tint}`} />
      <div className="relative flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          0{index + 1}
        </span>
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_#7c3aed]" />
      </div>
      <div className="relative">
        <p className="text-xl font-semibold text-foreground sm:text-2xl">{label}</p>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const scrollCueRef = useRef(null);
  const scrollYProgress = useScrollProgress(containerRef);
  useImperativeScrollStyle(scrollYProgress, headlineRef, applyHeadlineStyle);
  useImperativeScrollStyle(scrollYProgress, scrollCueRef, applyFadeOnly);

  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <section id="top" ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden [perspective:1800px]">
        <motion.div
          style={{ scale: glowScale }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]" />
          <div className="absolute bottom-[-15%] right-[8%] h-[420px] w-[420px] rounded-full bg-accent/20 blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[5%] h-[380px] w-[380px] rounded-full bg-secondary/20 blur-[120px]" />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 40%, transparent 80%)',
          }}
        />

        <div ref={headlineRef} className="relative z-20 flex flex-col items-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-white/5 px-4 py-1.5 text-[12px] font-medium text-muted"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI Systems for Ambitious Operators
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="max-w-3xl text-[42px] font-semibold leading-[1.08] tracking-tight text-gradient sm:text-6xl md:text-7xl"
          >
            We Don&rsquo;t Automate Tasks.
            <br />
            We Build <span className="text-gradient-accent">Systems</span> That Outperform Everyone.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.32 }}
            className="mt-6 max-w-xl text-base text-muted sm:text-lg"
          >
            AUXAI.AI designs, builds, and ships AI agents and automation systems that run your
            operations while you focus on growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.44 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#cta"
              className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-3.5 text-[14px] font-semibold text-background transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Book a Call
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-6 py-3.5 text-[14px] font-semibold text-foreground transition-colors duration-200 ease-out hover:bg-white/5 active:scale-[0.97]"
            >
              See What We Build
            </a>
          </motion.div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center [transform-style:preserve-3d]">
          {LAYERS.map((layer, i) => (
            <StackLayer key={layer.label} index={i} total={LAYERS.length} progress={scrollYProgress} {...layer} />
          ))}
        </div>

        <div ref={scrollCueRef} className="absolute bottom-8 z-20 flex flex-col items-center gap-2 text-muted">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
