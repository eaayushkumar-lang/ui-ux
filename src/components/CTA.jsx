import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

export default function CTA() {
  return (
    <section id="cta" className="relative mx-auto max-w-6xl px-6 pb-28 sm:px-8 sm:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-3xl border border-border-strong bg-card px-6 py-16 text-center sm:px-16 sm:py-24"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[240px] w-[240px] translate-x-1/3 translate-y-1/3 rounded-full bg-accent/20 blur-[110px]" />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Ready for a system that outperforms everyone?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted sm:text-lg">
            Book a call and we&rsquo;ll map the exact AI system your operation needs — no generic
            pitch, no fluff.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-7 py-4 text-[14px] font-semibold text-background transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Book a Call
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-7 py-4 text-[14px] font-semibold text-foreground transition-colors duration-200 ease-out hover:bg-white/5 active:scale-[0.97]"
            >
              Get Started
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
