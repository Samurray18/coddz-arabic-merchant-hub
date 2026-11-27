import { cn } from "@/lib/utils";

export function ConfirmationEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="70" y="40" width="100" height="110" rx="14" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M95 40 L95 25 Q120 15 145 25 L145 40" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <path d="M90 90 L110 110 L150 70" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="190" cy="60" r="18" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <path d="M182 60 L188 66 L198 54" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
