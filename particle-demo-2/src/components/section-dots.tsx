import { holdCenterProgress } from "../particles/scroll-map";

const LABELS = ["Ring", "Helix", "Growth", "Eclipse", "Ecosystem"];

/** Right-edge scroll navigation: one dot per section, active = current formation. */
export function SectionDots({ active }: { active: number }) {
  function go(i: number) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Jump to the center of formation i's hold plateau.
    window.scrollTo({ top: holdCenterProgress(i) * max, behavior: "smooth" });
  }
  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex">
      {LABELS.map((label, i) => (
        <button key={label} onClick={() => go(i)} className="group flex items-center gap-2">
          <span
            className={`text-xs transition-opacity ${
              active === i ? "text-white opacity-100" : "text-white/50 opacity-0 group-hover:opacity-100"
            }`}
          >
            {label}
          </span>
          <span
            className={`h-2.5 w-2.5 rounded-full border transition-all ${
              active === i ? "scale-110 border-[#ff5a3c] bg-[#ff5a3c]" : "border-white/40 bg-transparent"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
