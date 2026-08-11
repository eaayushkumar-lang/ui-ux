import { motion } from "framer-motion";
import { ClientLogos } from "@/components/client-logos";

export function TrustStrip() {
  return (
    <section className="relative z-10 rounded-t-[2rem] border-b border-line/60 bg-surface py-10 shadow-[0_-32px_64px_-32px_rgba(10,6,3,0.6)]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center font-mono text-[12px] tracking-[0.08em] text-ink-faint lg:text-left"
        >
          Systems running inside
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <ClientLogos className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 lg:justify-between" />
        </motion.div>
      </div>
    </section>
  );
}
