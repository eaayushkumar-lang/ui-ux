const LINKS = ["Product", "Ecosystem", "Science", "Company"];

export function Nav() {
  return (
    <nav className="fixed left-1/2 top-5 z-40 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <span className="mx-2 flex items-center gap-2 pr-1">
          <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#ff5a3c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5a7bff]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white/90">aurora</span>
        </span>
        {LINKS.map((l) => (
          <a
            key={l}
            href="#"
            className="hidden rounded-full px-3 py-1.5 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white sm:block"
          >
            {l}
          </a>
        ))}
        <button className="ml-1 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-opacity hover:opacity-90">
          Get started
        </button>
      </div>
    </nav>
  );
}
