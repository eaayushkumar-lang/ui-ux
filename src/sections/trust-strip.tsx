import { motion, useReducedMotion } from "framer-motion";

// Honest micro-proof: how we work, not fabricated client counts or metrics.
const proofs: string[] = [
  "AI-Driven",
  "Custom-Built",
  "Human-in-the-Loop",
  "Built Around Your Workflow",
  "Scalable Systems",
  "Own Your Accounts & Data",
];

function ProofItem({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2 whitespace-nowrap px-8 font-mono text-sm tracking-[0.02em]">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <span className="text-ink-dim">{label}</span>
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
          How every AUXAI.AI system is built
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
            {proofs.map((label) => (
              <ProofItem key={label} label={label} />
            ))}
          </div>
        ) : (
          <div className="gpu-active marquee-track flex w-max items-center">
            {[...proofs, ...proofs].map((label, i) => (
              <ProofItem key={`${label}-${i}`} label={label} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
