const ITEMS: { label: string; index: 0 | 1 | 2 }[] = [
  { label: "Torus", index: 0 },
  { label: "Galaxy", index: 1 },
  { label: "Brain", index: 2 },
];

/**
 * Quick manual override for testing. Each button scrolls the page to the
 * matching third, which is what actually drives the morph (scroll is the source
 * of truth), so the toggle and scrolling stay consistent.
 */
export function FormationToggle({ active }: { active: number }) {
  function go(index: number) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (index / 2) * max, behavior: "smooth" });
  }
  return (
    <div className="fixed bottom-5 right-5 z-30">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/55 p-1 backdrop-blur-md">
        {ITEMS.map((it) => (
          <button
            key={it.label}
            onClick={() => go(it.index)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active === it.index
                ? "bg-white text-black"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
