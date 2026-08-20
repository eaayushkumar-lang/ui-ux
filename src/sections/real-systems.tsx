import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone, UserCheck, Headset, CalendarClock, Repeat, type LucideIcon } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  label: string;
  detail: string;
}

interface Workflow {
  icon: LucideIcon;
  name: string;
  trigger: string;
  steps: WorkflowStep[];
  outcome: string;
}

const workflows: Workflow[] = [
  {
    icon: Phone,
    name: "AI Receptionist",
    trigger: "Phone call or website inquiry",
    steps: [
      { label: "Greeting", detail: "AI answers with your business name, tone, and hours" },
      { label: "Intent Detection", detail: "Identifies whether the caller wants to book, ask a question, or report an issue" },
      { label: "Qualification", detail: "Asks the right follow-up questions based on service type" },
      { label: "Action", detail: "Books an appointment, sends info, or routes to the right team member" },
    ],
    outcome: "Every inquiry handled in seconds. Your staff only talks to qualified, pre-informed callers.",
  },
  {
    icon: UserCheck,
    name: "Lead Qualification",
    trigger: "New form submission or inbound message",
    steps: [
      { label: "Capture", detail: "Pulls name, contact, and intent from any channel — form, email, chat, or DM" },
      { label: "Qualify", detail: "Scores the lead against your criteria — budget, timeline, service fit" },
      { label: "Enrich", detail: "Looks up company info and adds context to your CRM record" },
      { label: "Route", detail: "Hot leads get instant follow-up. Cold leads enter a nurture sequence" },
    ],
    outcome: "Your sales team only sees qualified leads with full context. Nothing falls through.",
  },
  {
    icon: Headset,
    name: "Customer Support",
    trigger: "Support ticket, chat message, or email",
    steps: [
      { label: "Classify", detail: "Identifies the issue type — billing, technical, scheduling, general" },
      { label: "Resolve", detail: "Handles common questions instantly with accurate, personalized answers" },
      { label: "Escalate", detail: "Routes complex issues to the right person with full conversation history" },
      { label: "Follow-up", detail: "Confirms resolution and sends satisfaction check automatically" },
    ],
    outcome: "80% of repetitive questions handled without a person. Complex issues reach the right person faster.",
  },
  {
    icon: CalendarClock,
    name: "Appointment System",
    trigger: "Booking request from any channel",
    steps: [
      { label: "Availability", detail: "Checks real-time calendar availability across staff" },
      { label: "Qualification", detail: "Confirms the service, collects intake details, verifies eligibility" },
      { label: "Booking", detail: "Schedules the appointment and sends confirmation to both parties" },
      { label: "Reminders", detail: "Automated reminders at 24h and 1h — reschedule link included" },
    ],
    outcome: "A full calendar without the back-and-forth. No-show rate drops with automated reminders.",
  },
  {
    icon: Repeat,
    name: "Follow-Up Engine",
    trigger: "Elapsed time or status change in CRM",
    steps: [
      { label: "Monitor", detail: "Watches for leads, proposals, or tasks that haven't progressed" },
      { label: "Compose", detail: "Drafts a personalized follow-up based on the last interaction and context" },
      { label: "Send", detail: "Delivers via the right channel — email, SMS, or internal notification" },
      { label: "Track", detail: "Logs response and updates the record. Alerts a person if action is needed" },
    ],
    outcome: "Nothing goes stale. Every lead, proposal, and task gets followed up on schedule.",
  },
];

export function RealSystems() {
  const [active, setActive] = useState(0);
  const current = workflows[active];

  return (
    <section id="real-systems" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
          >
            Real systems
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
          >
            <LiquidHeadingReveal>Here's what it looks like inside.</LiquidHeadingReveal>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-ink-dim"
          >
            Each workflow runs automatically from a single trigger — no manual steps, no one
            watching it.
          </motion.p>
        </div>

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {workflows.map((w, i) => {
            const Icon = w.icon;
            return (
              <button
                key={w.name}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[13px] transition-all duration-200",
                  active === i
                    ? "border-accent/50 bg-accent/10 text-accent shadow-[0_0_16px_-4px_rgba(193,80,46,0.4)]"
                    : "border-line/70 bg-bg/40 text-ink-dim hover:border-accent/30 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {w.name}
              </button>
            );
          })}
        </motion.div>

        {/* Active workflow detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-card mt-8 rounded-[var(--radius-card)] p-6 sm:p-8"
          >
            {/* Trigger */}
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                Trigger
              </span>
              <span className="text-[15px] text-ink-dim">{current.trigger}</span>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {current.steps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/70 bg-bg/60 font-mono text-[12px] text-ink-faint">
                      {i + 1}
                    </span>
                    {i < current.steps.length - 1 && (
                      <span className="my-1 h-4 w-px bg-line/50" aria-hidden />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-[15px] font-medium text-ink">{step.label}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-dim">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Outcome */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  Outcome
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink">{current.outcome}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
