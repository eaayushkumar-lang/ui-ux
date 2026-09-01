import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-surface-3" />
      <path d="M16 6 L26 24 H20.5 L16 15.5 L11.5 24 H6 Z" className="fill-accent" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-mono text-[15px] font-medium tracking-[0.02em] text-ink">
        Aurevyn
      </span>
    </span>
  );
}
