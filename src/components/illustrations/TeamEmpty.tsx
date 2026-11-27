import { cn } from "@/lib/utils";

export function TeamEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="70" y="100" width="100" height="40" rx="8" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <circle cx="90" cy="60" r="14" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M72 90 Q90 72 108 90" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="50" r="14" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <path d="M102 80 Q120 62 138 80" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="60" r="14" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M132 90 Q150 72 168 90" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
