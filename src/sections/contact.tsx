import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";
import {
  CONTACT_DESTINATION_EMAIL,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "@/lib/emailjs";
import { cn } from "@/lib/utils";

const SERVICES = [
  "AI Customer Support",
  "Lead Qualification & Routing",
  "Appointment Automation",
  "AI Follow-Up Systems",
  "Internal Operations",
  "Custom AI Agent",
  "Not sure yet — help me figure it out",
];

const TEAM_SIZES = ["Just me", "2-5", "6-20", "21-50", "50+"];
const INDUSTRIES = [
  "Dental / Healthcare",
  "Real Estate",
  "Professional Services",
  "Sales / Revenue",
  "Local Business / Retail",
  "E-commerce",
  "Other",
];

const STORAGE_KEY = "aurevyn_contact_submissions";
const MESSAGE_MIN_LENGTH = 10;

interface FormState {
  name: string;
  email: string;
  company: string;
  website: string;
  industry: string;
  teamSize: string;
  service: string;
  biggestWorkflow: string;
  message: string;
}

type Status = "idle" | "sending" | "success" | "error";

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  industry: "",
  teamSize: "",
  service: "",
  biggestWorkflow: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) errors.name = "Tell us your name.";
  if (!values.email.trim()) errors.email = "An email address is required.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "That doesn't look like a valid email.";
  if (!values.service) errors.service = "Pick what you're looking for.";
  if (!values.message.trim()) errors.message = "A few words about what you need.";
  else if (values.message.trim().length < MESSAGE_MIN_LENGTH)
    errors.message = `At least ${MESSAGE_MIN_LENGTH} characters, please.`;
  return errors;
}

function saveSubmission(values: FormState) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const next = Array.isArray(existing) ? existing : [];
    next.push({ ...values, submittedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage can throw in private-browsing / storage-full — the
    // submission still gets its EmailJS attempt.
  }
}

const fieldClass =
  "w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-accent/50 focus:outline-none disabled:opacity-50";
const errorFieldClass = "border-[#ff6b6b]/50 focus:border-[#ff6b6b]/70";

export function Contact() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const sending = status === "sending";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("sending");
    saveSubmission(values);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: values.name,
          from_email: values.email,
          company: values.company,
          website: values.website,
          industry: values.industry,
          team_size: values.teamSize,
          service: values.service,
          biggest_workflow: values.biggestWorkflow,
          message: values.message,
          to_email: CONTACT_DESTINATION_EMAIL,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-2xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl"
        >
          <LiquidHeadingReveal>Get your free automation assessment.</LiquidHeadingReveal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mx-auto mt-5 max-w-lg text-center text-[17px] leading-relaxed text-ink-dim"
        >
          Tell us how your business works today. We'll identify the repetitive workflows worth
          automating — and send back a clear assessment, not a sales pitch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="glass-card relative mt-12 overflow-hidden rounded-[var(--radius-card)] border-accent/20 p-8 sm:p-10"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center py-8 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#04140a] shadow-[0_0_40px_-6px_rgba(74,222,128,0.6)]"
                >
                  <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
                </motion.span>
                <h3 className="mt-6 text-xl font-medium text-ink">Assessment Request Sent!</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-dim">
                  We'll review your workflows and respond within 24 hours with a
                  clear assessment of what's worth automating.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setValues(initialState);
                    setStatus("idle");
                  }}
                  className="mt-6 text-[13px] text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                >
                  Send another request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Your Name" error={errors.name}>
                    <input
                      type="text"
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Full name"
                      disabled={sending}
                      className={cn(fieldClass, errors.name && errorFieldClass)}
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                      disabled={sending}
                      className={cn(fieldClass, errors.email && errorFieldClass)}
                    />
                  </Field>
                </div>

                {/* Row 2: Company + Website */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Business Name" optional>
                    <input
                      type="text"
                      value={values.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Your business"
                      disabled={sending}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Website" optional>
                    <input
                      type="url"
                      value={values.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://..."
                      disabled={sending}
                      className={fieldClass}
                    />
                  </Field>
                </div>

                {/* Row 3: Industry + Team Size */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Industry" optional>
                    <SelectField
                      value={values.industry}
                      onChange={(v) => update("industry", v)}
                      placeholder="Select industry"
                      options={INDUSTRIES}
                      disabled={sending}
                    />
                  </Field>
                  <Field label="Team Size" optional>
                    <SelectField
                      value={values.teamSize}
                      onChange={(v) => update("teamSize", v)}
                      placeholder="How many people"
                      options={TEAM_SIZES}
                      disabled={sending}
                    />
                  </Field>
                </div>

                {/* Service */}
                <Field label="What are you looking for?" error={errors.service}>
                  <SelectField
                    value={values.service}
                    onChange={(v) => update("service", v)}
                    placeholder="Select a service"
                    options={SERVICES}
                    disabled={sending}
                    error={!!errors.service}
                  />
                </Field>

                {/* Biggest workflow */}
                <Field label="What's the most repetitive workflow in your business?" optional>
                  <input
                    type="text"
                    value={values.biggestWorkflow}
                    onChange={(e) => update("biggestWorkflow", e.target.value)}
                    placeholder="e.g. Answering patient inquiries, following up on proposals..."
                    disabled={sending}
                    className={fieldClass}
                  />
                </Field>

                {/* Message */}
                <Field label="Anything else we should know?" error={errors.message}>
                  <textarea
                    value={values.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="What does your day-to-day look like? What would you automate first?"
                    rows={3}
                    disabled={sending}
                    className={cn(fieldClass, "resize-none", errors.message && errorFieldClass)}
                  />
                </Field>

                {status === "error" && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 px-4 py-3 text-[13px] leading-relaxed text-[#ff8787]">
                    <MailWarning className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>
                      Something went wrong. Please try again or email us directly at{" "}
                      <a
                        href={`mailto:${CONTACT_DESTINATION_EMAIL}`}
                        className="underline decoration-current underline-offset-2"
                      >
                        {CONTACT_DESTINATION_EMAIL}
                      </a>
                      .
                    </span>
                  </div>
                )}

                <Button type="submit" size="lg" className="mt-2 w-full" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      Sending...
                    </>
                  ) : (
                    "Get My Automation Assessment"
                  )}
                </Button>

                <p className="text-center text-[12px] text-ink-faint">
                  Free. No obligation. We'll send a clear assessment of what's worth automating.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function SelectField({
  value,
  onChange,
  placeholder,
  options,
  disabled,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  disabled?: boolean;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          fieldClass,
          "appearance-none pr-10",
          !value && "text-ink-faint",
          error && errorFieldClass,
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-ink">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        strokeWidth={1.75}
      />
    </div>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-ink-dim">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>}
      </span>
      {children}
      {error && (
        <span className="flex items-center gap-1.5 text-[12px] text-[#ff6b6b]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </span>
      )}
    </label>
  );
}
