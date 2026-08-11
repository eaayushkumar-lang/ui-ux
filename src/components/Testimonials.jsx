import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const TESTIMONIALS = [
  {
    quote:
      'AUXAI.AI replaced three ops hires with a single agent system. We book more calls now than we did with a full SDR team.',
    name: 'Marcus Chen',
    role: 'Founder, Vantage Logistics',
  },
  {
    quote:
      'The voice agent alone paid for the entire engagement in the first month. It never misses a lead, day or night.',
    name: 'Sarah Okafor',
    role: 'COO, Brightline Realty',
  },
  {
    quote:
      'This wasn’t a chatbot bolted onto our CRM. It’s an actual system — and it just keeps getting better.',
    name: 'David Kaplan',
    role: 'CEO, Forge Consulting',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Testimonials() {
  return (
    <section id="reviews" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-2xl"
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">Reviews</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Trusted by teams who need it to just work.
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            variants={cardVariants}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-7 transition-colors duration-300 ease-out hover:border-border-strong sm:p-8"
          >
            <div>
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[12px] font-semibold text-white">
                {t.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                <p className="text-[12px] text-muted">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
