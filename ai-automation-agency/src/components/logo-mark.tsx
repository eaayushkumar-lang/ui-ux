export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="presentation" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--bg-base)" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
      <circle cx="16" cy="16" r="3" fill="var(--accent-secondary)" />
    </svg>
  );
}
