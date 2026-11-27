import { cn } from "@/lib/utils";

export function AnalyticsEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="40" y="140" width="160" height="4" rx="2" fill="var(--illustration-outline)" />
      <rect x="50" y="90" width="20" height="50" rx="4" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="80" y="70" width="20" height="70" rx="4" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="110" y="100" width="20" height="40" rx="4" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="140" y="60" width="20" height="80" rx="4" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <circle cx="195" cy="55" r="20" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M185 55 L193 63 L205 47" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
