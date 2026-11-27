import { cn } from "@/lib/utils";

export function CustomersEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <circle cx="80" cy="60" r="18" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M55 110 Q80 85 105 110" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="60" r="18" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <path d="M135 110 Q160 85 185 110" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <rect x="180" y="30" width="40" height="24" rx="6" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M190 54 L195 60 L200 54" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
