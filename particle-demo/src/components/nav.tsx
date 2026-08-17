const LINKS = ["Home", "Services", "Works", "About"];

/** Minimal pill nav floating over the particle field. */
export function Nav() {
  return (
    <nav className="fixed left-1/2 top-5 z-30 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <span className="mx-2 flex items-center gap-2 pr-1">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-teal-400 to-violet-500">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-black/80" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white/90">nebula</span>
        </span>
        {LINKS.map((l) => (
          <a
            key={l}
            href="#"
            className="rounded-full px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            {l}
          </a>
        ))}
        <button className="ml-1 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-opacity hover:opacity-90">
          Contact Us
        </button>
      </div>
    </nav>
  );
}
