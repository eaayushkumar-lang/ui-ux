import { Hexagon } from "lucide-react";
import { Reveal } from "@/components/reveal";

const QUICK_LINKS = ["Home", "Services", "About", "Pricing", "Case Studies", "Blog", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a] px-5 py-16 sm:px-8 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <Reveal className="max-w-sm">
            <div className="flex items-center gap-2">
              <Hexagon size={22} strokeWidth={1.5} className="text-white" />
              <span className="text-lg font-medium tracking-tight text-white">novaai</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              AI agents and automation systems for teams who refuse to compete on effort.
            </p>
          </Reveal>

          {/* Quick Links */}
          <Reveal delay={120}>
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">Quick Links</div>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Get in Touch */}
          <Reveal delay={240}>
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">Get in Touch</div>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:hello@novaai.com"
                  className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
                >
                  hello@novaai.com
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                  Book a Free Call
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            © {new Date().getFullYear()} novaai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
