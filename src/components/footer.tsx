import { Linkedin, Mail, Twitter } from "lucide-react";
import { Logo } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";

const links = [
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "How it works" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

const social = [
  { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://www.twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@auxai.ai", label: "Email" },
];

export function Footer() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <footer className="border-t border-line/60 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
              AI agents and automation systems for teams who refuse to compete on effort.
            </p>
            <Button size="sm" variant="secondary" className="mt-6" onClick={() => scrollTo("cta")}>
              Book a Call
            </Button>
          </div>

          <div>
            <span className="font-mono text-[12px] tracking-[0.08em] text-ink-faint">
              Navigate
            </span>
            <ul className="mt-4 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="text-[15px] text-ink-dim transition-colors hover:text-ink"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-mono text-[12px] tracking-[0.08em] text-ink-faint">
              Connect
            </span>
            <ul className="mt-4 flex flex-col gap-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center gap-2 text-[15px] text-ink-dim transition-colors hover:text-ink"
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line/60 pt-8 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AUXAI.AI. All rights reserved.</p>
          <p>Built for teams who build systems, not task lists.</p>
        </div>
      </div>
    </footer>
  );
}
