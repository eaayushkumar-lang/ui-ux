import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { NoiseOverlay } from "@/components/noise-overlay";
import { PageTransition } from "@/components/page-transition";
import { EASE_OUT, SPRING_HOVER } from "@/lib/motion";

const MotionLink = motion.create(Link);

interface TrialShellProps {
  title: string;
  eyebrow: string;
  children: ReactNode;
}

export function TrialShell({ title, eyebrow, children }: TrialShellProps) {
  return (
    <PageTransition>
      <div className="relative min-h-dvh bg-bg">
        <NoiseOverlay />

        <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6">
            <MotionLink
              to="/"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_HOVER}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Home
            </MotionLink>
            <span className="h-4 w-px bg-line" aria-hidden="true" />
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            <span className="ml-auto hidden font-mono text-xs tracking-[0.08em] text-ink-faint sm:block">
              {eyebrow}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="text-balance text-4xl font-medium tracking-tight text-ink sm:text-5xl"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
            className="mt-10"
          >
            {children}
          </motion.div>
        </main>

        <TrialCTA />
      </div>
    </PageTransition>
  );
}

function TrialCTA() {
  return (
    <section className="relative z-10 border-t border-line/60 bg-surface py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="text-2xl font-medium tracking-tight text-ink sm:text-3xl"
        >
          Ready to build yours?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          className="mt-8"
        >
          <Button size="lg" asChild>
            <a href="mailto:hello@auxai.ai?subject=Book%20a%20call%20with%20AUXAI.AI">
              Book a Call
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
