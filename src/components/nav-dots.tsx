import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "How it works" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Book a call" },
];

export function NavDots() {
  const active = useActiveSection(sections.map((s) => s.id));

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
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(section.id)}
            aria-current={isActive}
            aria-label={`Go to ${section.label}`}
            className="group flex items-center gap-3"
          >
            <span
              className={cn(
                "pointer-events-none whitespace-nowrap font-mono text-[11px] tracking-[0.08em] text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                isActive && "text-accent opacity-100",
              )}
            >
              {section.label}
            </span>
            <span
              className={cn(
                "h-2 w-2 rounded-full border border-ink-faint/60 bg-transparent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent",
                isActive && "h-2.5 w-2.5 border-accent bg-accent",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
