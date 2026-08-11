import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { EASE_DRAWER, EASE_OUT } from "@/lib/motion";

const links = [
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "How it works" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  function scrollTo(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
              className="text-sm text-ink-dim transition-colors hover:text-ink"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button size="sm" onClick={() => scrollTo("cta")}>
            Book a Call
          </Button>
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center text-ink transition-transform duration-100 ease-out active:scale-90 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={reduceMotion ? undefined : { opacity: 0, rotate: -45, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.85 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={reduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, rotate: -45, scale: 0.85 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0.15 : 0.32,
              ease: EASE_DRAWER,
            }}
            className="overflow-hidden border-b border-white/10 bg-bg lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 pb-8 pt-4">
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className="py-3 text-left text-base text-ink-dim transition-colors hover:text-ink"
                >
                  {link.label}
                </button>
              ))}
              <Button className="mt-2 w-full" onClick={() => scrollTo("cta")}>
                Book a Call
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
