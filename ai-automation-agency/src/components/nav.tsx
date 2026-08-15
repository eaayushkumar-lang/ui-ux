import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#system", label: "System" },
  { href: "#services", label: "Services" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Nav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 sm:px-10">
      <a href="#hero" className="flex items-center gap-2.5" onClick={(e) => (e.preventDefault(), scrollToId("hero"))}>
        <LogoMark className="h-8 w-8" />
        <span className="font-display text-sm tracking-[0.03em] text-ink">[Agency Name]</span>
      </a>

      <div className="hidden items-center gap-8 sm:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToId(link.href.slice(1));
            }}
            className="text-sm text-muted transition-colors duration-150 hover:text-ink"
          >
            {link.label}
          </a>
        ))}
      </div>

      <Button variant="primary" className="px-5 py-2.5 text-xs sm:text-sm" onClick={() => scrollToId("services")}>
        Contact Us
      </Button>
    </nav>
  );
}
