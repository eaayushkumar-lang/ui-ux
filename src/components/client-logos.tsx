const clients = [
  { name: "Halcyon Freight", mark: "H" },
  { name: "Meridian Health Group", mark: "M" },
  { name: "Ferro Industrial", mark: "F" },
  { name: "Clearwater Capital", mark: "C" },
  { name: "Thornwood & Co", mark: "T" },
  { name: "Pallas Robotics", mark: "P" },
];

function MonogramMark({ letter }: { letter: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="9"
        className="fill-none stroke-ink-faint/60"
        strokeWidth="1.25"
      />
      <text
        x="20"
        y="21.5"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-ink-dim font-mono text-[15px] font-medium"
      >
        {letter}
      </text>
    </svg>
  );
}

export function ClientLogos({ className }: { className?: string }) {
  return (
    <ul
      className={className}
      aria-label="Companies using AUXAI.AI systems"
    >
      {clients.map((client) => (
        <li key={client.name} className="flex items-center gap-3">
          <MonogramMark letter={client.mark} />
          <span className="whitespace-nowrap font-mono text-[13px] tracking-[0.01em] text-ink-faint">
            {client.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
