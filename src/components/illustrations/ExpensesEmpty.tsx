import { cn } from "@/lib/utils";

export function ExpensesEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="50" y="70" width="90" height="60" rx="10" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M50 90 L140 90" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="170" cy="60" r="22" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <circle cx="170" cy="60" r="10" fill="var(--accent)" />
      <circle cx="195" cy="110" r="16" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <circle cx="195" cy="110" r="7" fill="var(--accent)" />
      <rect x="60" y="100" width="70" height="6" rx="3" fill="var(--illustration-outline)" />
      <rect x="60" y="112" width="50" height="6" rx="3" fill="var(--illustration-outline)" />
    </svg>
  );
}
