const LINK_GROUPS = [
  {
    title: 'Services',
    links: ['Building AI Agents', 'Workflow Automation', 'Voice Agents', 'Full AI Systems'],
  },
  {
    title: 'Company',
    links: ['How It Works', 'Reviews', 'FAQ'],
  },
  {
    title: 'Get Started',
    links: ['Book a Call'],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-[13px] font-bold text-white">
                A
              </span>
              AUXAI<span className="text-muted">.AI</span>
            </a>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              We don&rsquo;t automate tasks. We build systems that outperform everyone.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {group.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-[14px] text-muted transition-colors duration-200 ease-out hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-[13px] text-muted-foreground">
            © {new Date().getFullYear()} AUXAI.AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[13px] text-muted-foreground">
            <a href="#top" className="transition-colors duration-200 ease-out hover:text-foreground">
              Privacy
            </a>
            <a href="#top" className="transition-colors duration-200 ease-out hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
