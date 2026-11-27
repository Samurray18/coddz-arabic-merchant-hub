import { cn } from "@/lib/utils";

export function ErrorScene({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="80" y="60" width="80" height="60" rx="8" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M80 60 L100 40 L160 40 L160 60" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M95 55 L105 45 M105 55 L95 45" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <path d="M170 100 L200 100 M185 85 L185 115" stroke="var(--illustration-outline)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="185" cy="130" r="8" fill="var(--illustration-outline)" />
    </svg>
  );
}
