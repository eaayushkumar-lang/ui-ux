import { useEffect, useRef, useState } from "react";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "What we automate" },
  { id: "demo", label: "Demo" },
  { id: "demo-systems", label: "Demo systems" },
  { id: "before-after", label: "Before / after" },
  { id: "how-it-works", label: "How it works" },
  { id: "why", label: "Why Aurevyn" },
  { id: "founder", label: "Founder" },
  { id: "built-for", label: "Built for" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Book audit" },
  { id: "contact", label: "Contact" },
];

export function NavDots() {
  const active = useActiveSection(sections.map((s) => s.id));
  const prevActiveRef = useRef(active);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  // When a section stops being active, briefly play the fade-out-label
  // animation on its label so the handoff between sections reads as a
  // deliberate state change rather than an abrupt opacity cut.
  useEffect(() => {
    if (prevActiveRef.current === active) return;
    const previous = prevActiveRef.current;
    prevActiveRef.current = active;
    setLeavingId(previous);
    const timeout = setTimeout(() => {
      setLeavingId((current) => (current === previous ? null : current));
    }, 600);
    return () => clearTimeout(timeout);
  }, [active]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {sections.map((section) => {
        const isActive = active === section.id;
        const isLeaving = leavingId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(section.id)}
            aria-current={isActive}
            aria-label={`Go to ${section.label}`}
            className="group flex items-center gap-3 transition-transform duration-100 ease-out active:scale-90"
          >
            <span
              className={cn(
                "pointer-events-none translate-x-2 whitespace-nowrap font-mono text-[11px] tracking-[0.08em] text-ink-faint opacity-0 scale-95 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100",
                isActive && "translate-x-0 scale-100 text-accent opacity-100",
                isLeaving && "animate-fade-out-label",
              )}
            >
              {section.label}
            </span>
            <span
              className={cn(
                "h-2.5 w-2.5 scale-75 rounded-full border border-ink-faint/60 bg-transparent transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-100 group-hover:border-accent",
                isActive && "scale-100 border-accent bg-accent",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
