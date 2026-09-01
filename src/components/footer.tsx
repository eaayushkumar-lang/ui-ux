import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Logo } from "@/components/logo-mark";
import { BookACallButton } from "@/components/book-a-call-button";

interface QuickLink {
  label: string;
  id?: string;
  to?: string;
}

const quickLinks: QuickLink[] = [
  { id: "hero", label: "Home" },
  { id: "services", label: "What We Automate" },
  { id: "demo-systems", label: "Demo Systems" },
  { id: "how-it-works", label: "How It Works" },
  { id: "why", label: "Why Aurevyn" },
  { id: "built-for", label: "Industries" },
  { id: "faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { id: "contact", label: "Get Assessment" },
];

const social = [
  { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://www.twitter.com", label: "Twitter / X" },
  { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
  { icon: Github, href: "https://www.github.com", label: "GitHub" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-surface/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
              A new automation studio focused on building practical AI systems for modern
              businesses.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-mono text-[12px] tracking-[0.08em] text-ink-faint">
              Quick Links
            </span>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-[15px] text-ink-dim transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollTo(link.id!)}
                      className="text-[15px] text-ink-dim transition-colors hover:text-ink"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-mono text-[12px] tracking-[0.08em] text-ink-faint">
              Get in Touch
            </span>
            <a
              href="mailto:hello@aurevyn.ai"
              className="mt-4 flex items-center gap-2 text-[15px] text-ink-dim transition-colors hover:text-ink"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              hello@aurevyn.ai
            </a>
            <BookACallButton variant="secondary" size="sm" className="mt-6">
              Book Automation Audit
            </BookACallButton>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line/60 pt-8 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aurevyn. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="transition-colors hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
            <Link to="/experiments/scroll-morph-hero" className="transition-colors hover:text-ink">
              Experiments
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
