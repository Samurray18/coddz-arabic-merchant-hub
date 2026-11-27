import { cn } from "@/lib/utils";

export function IntegrationsEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="30" y="60" width="60" height="60" rx="10" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M50 80 L70 80 M50 95 L70 95 M50 110 L65 110" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M90 90 L120 90" stroke="var(--illustration-outline)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
      <rect x="130" y="50" width="80" height="80" rx="10" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <path d="M150 70 L190 70 M150 85 L185 85 M150 100 L180 100 M150 115 L175 115" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 75 L115 90 L100 105" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
