import { useState } from "react";
import { motion } from "framer-motion";
import { Workflow } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { Button } from "@/components/ui/button";

const DEMO_CALL_LINK = "https://cal.com/aurevyn/discovery";

interface ProofItem {
  src: string;
  title: string;
  caption: string;
}

// Drop the matching screenshot into public/proof/ using these exact
// filenames and it renders automatically - no code change needed.
const items: ProofItem[] = [
  {
    src: "/proof/dental-booking-agent.png",
    title: "Dental Booking Agent",
    caption:
      "A patient chat widget qualifies the caller and books the appointment automatically — with a fallback reply if it isn't ready to book yet.",
  },
  {
    src: "/proof/appointment-agent.png",
    title: "Appointment Automation System",
    caption:
      "Webhook and email requests flow into one booking agent that checks Google Calendar availability and replies with a confirmed appointment.",
  },
  {
    src: "/proof/dental-whatsapp-receptionist.png",
    title: "WhatsApp AI Receptionist",
    caption:
      "A dental clinic's WhatsApp line: the AI checks intent, finds an open slot, confirms the booking, updates the CRM, and notifies the team on Slack.",
  },
  {
    src: "/proof/lead-qualifier.png",
    title: "Lead Capture & Qualification",
    caption:
      "Every inbound form submission is scored automatically — hot leads go straight to sales, cold ones enter a nurture sequence.",
  },
  {
    src: "/proof/real-estate-lead-handling.png",
    title: "Real Estate Lead Handling",
    caption:
      "A Facebook lead ad triggers qualification, notifies the agent, sends matching properties, and updates the CRM — no manual entry.",
  },
];

export function Proof() {
  return (
    <section id="proof" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
          >
            Proof &amp; trust
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>See It Working Live</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Real workflows. Real results. Built and tested.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ProofCard key={item.title} item={item} index={i} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <Button asChild size="lg">
            <a href={DEMO_CALL_LINK} target="_blank" rel="noopener noreferrer">
              Book a Free Demo
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProofCard({ item, index }: { item: ProofItem; index: number }) {
  const [errored, setErrored] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      className="glass-card flex flex-col overflow-hidden rounded-[var(--radius-card)]"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-line/60 bg-bg/60">
        {errored ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <Workflow className="h-5 w-5 text-ink-faint" strokeWidth={1.75} />
            <p className="font-mono text-[11px] leading-snug text-ink-faint">
              Screenshot pending
            </p>
          </div>
        ) : (
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover object-top"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full border border-line/70 bg-bg/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint backdrop-blur-sm">
          Aurevyn Demo
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-medium text-ink">{item.title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{item.caption}</p>
      </div>
    </motion.article>
  );
}
