import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  CircleHelp,
  LayoutGrid,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { SPRING_ISLAND } from "@/lib/motion";
import { CAL_LINK } from "@/lib/links";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

const SECTION_IDS = ["hero", "services", "demo-systems", "how-it-works", "why", "built-for", "faq", "cta"];

const links: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "services", label: "Solutions", icon: LayoutGrid },
  { id: "how-it-works", label: "How It Works", icon: Workflow },
  { id: "why", label: "Why Aurevyn", icon: Sparkles },
  { id: "built-for", label: "Industries", icon: Building2 },
  { id: "faq", label: "FAQ", icon: CircleHelp },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLabel({ expanded, children }: { expanded: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={SPRING_ISLAND}
          className="overflow-hidden whitespace-nowrap"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function NavItem({
  id,
  label,
  icon: Icon,
  expanded,
  active,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  expanded: boolean;
  active: boolean;
}) {
  return (
    <motion.button
      layout
      type="button"
      onClick={() => scrollTo(id)}
      transition={SPRING_ISLAND}
      className={cn(
        "relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
        active ? "text-accent" : "text-ink-dim hover:text-ink",
      )}
      aria-current={active}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          transition={SPRING_ISLAND}
          className="absolute inset-0 rounded-full border border-accent/40 bg-accent/15 shadow-[0_0_18px_-4px_rgba(193,80,46,0.7)]"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <NavLabel expanded={expanded}>{label}</NavLabel>
      </span>
    </motion.button>
  );
}

function NavBlogLink({ expanded }: { expanded: boolean }) {
  return (
    <MotionLink
      layout
      to="/blog"
      transition={SPRING_ISLAND}
      className="relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-dim transition-colors hover:text-ink"
    >
      <span className="relative z-10 flex items-center gap-2">
        <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <NavLabel expanded={expanded}>Blog</NavLabel>
      </span>
    </MotionLink>
  );
}

function NavCTA({ expanded }: { expanded: boolean }) {
  return (
    <motion.a
      layout
      href={CAL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_ISLAND}
      className="relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-3 py-2 text-sm font-medium text-accent-ink shadow-[0_0_0_1px_rgba(193,80,46,0.35),0_10px_24px_-10px_rgba(158,58,28,0.7)]"
    >
      <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <NavLabel expanded={expanded}>
        <span className="flex items-center gap-1">
          Book Audit
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        </span>
      </NavLabel>
    </motion.a>
  );
}

export function Navbar() {
  const reduceMotion = useReducedMotion();
  const active = useActiveSection(SECTION_IDS);

  const [scrolled, setScrolled] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [tapOpen, setTapOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 32);
  });

  const expanded = !scrolled || hoverOpen || tapOpen;

  useEffect(() => {
    if (!tapOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setTapOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [tapOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.div
        ref={navRef}
        layout
        transition={reduceMotion ? { duration: 0 } : SPRING_ISLAND}
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => setHoverOpen(false)}
        onClick={() => {
          if (scrolled && !hoverOpen) setTapOpen((v) => !v);
        }}
        className="glass-card pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-accent/20 p-1.5 shadow-[0_0_0_1px_rgba(193,80,46,0.08),0_20px_48px_-20px_rgba(0,0,0,0.8),0_0_32px_-12px_rgba(193,80,46,0.35)]"
      >
        <motion.button
          layout
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            scrollTo("hero");
          }}
          transition={SPRING_ISLAND}
          aria-label="Aurevyn home"
          className={cn(
            "relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
            active === "hero" && "bg-accent/15",
          )}
        >
          <LogoMark className="h-5 w-5" />
        </motion.button>

        <div
          className="flex items-center gap-1 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((link) => (
            <NavItem
              key={link.id}
              id={link.id}
              label={link.label}
              icon={link.icon}
              expanded={expanded}
              active={active === link.id}
            />
          ))}
          <NavBlogLink expanded={expanded} />
          <NavCTA expanded={expanded} />
        </div>
      </motion.div>
    </header>
  );
}
