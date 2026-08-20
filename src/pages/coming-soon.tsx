import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Logo } from "@/components/logo-mark";
import { NoiseOverlay } from "@/components/noise-overlay";
import { PageTransition } from "@/components/page-transition";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";

const MotionLink = motion.create(Link);

/** Shared shell for pages that are intentionally just placeholders for
 * now (Privacy, Terms) - a real link to land on rather than a dead "#"
 * href, without pretending the content exists yet. */
export function ComingSoonPage({ title }: { title: string }) {
  return (
    <PageTransition>
      <div className="relative flex min-h-dvh flex-col bg-bg">
        <NoiseOverlay />

        <header className="border-b border-line/60 bg-bg/80 backdrop-blur-xl">
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
          </div>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="glass-card flex flex-col items-center rounded-[var(--radius-card)] px-10 py-12 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Clock3 className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h1 className="mt-5 text-2xl font-medium tracking-tight text-ink">{title}</h1>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-dim">
              This page is coming soon. In the meantime, reach us directly at{" "}
              <a href="mailto:hello@aurevyn.ai" className="text-accent hover:text-coral">
                hello@aurevyn.ai
              </a>
              .
            </p>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
