// Simple hand-drawn line icons, orange accent per CLAUDE.md's card spec -
// deliberately not pulling in an icon library dependency the tech stack
// doesn't call for.

export function WorkflowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <rect x="15" y="4" width="6" height="6" rx="1.5" />
      <rect x="9" y="14" width="6" height="6" rx="1.5" />
      <path d="M6 10v2a2 2 0 0 0 2 2h1" strokeLinecap="round" />
      <path d="M18 10v2a2 2 0 0 1-2 2h-1" strokeLinecap="round" />
    </svg>
  );
}

export function AgentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <circle cx="9" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 8V4" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.2" />
    </svg>
  );
}

export function DataIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5V12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5.5" strokeLinecap="round" />
      <path d="M5 12v6.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V12" strokeLinecap="round" />
    </svg>
  );
}
