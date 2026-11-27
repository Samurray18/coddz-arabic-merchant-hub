import { cn } from "@/lib/utils";

export function SuccessScene({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <style>{`@media (prefers-reduced-motion: no-preference){.sc-conf{animation:sc-pop 1.2s ease-out infinite;}}@keyframes sc-pop{0%{transform:scale(0.8);opacity:0.6;}50%{transform:scale(1.1);opacity:1;}100%{transform:scale(1);opacity:0.8;}}`}</style>
      <circle cx="120" cy="90" r="50" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
      <path d="M90 90 L110 110 L150 70" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <g className="sc-conf">
        <circle cx="60" cy="40" r="4" fill="var(--primary)" />
        <circle cx="180" cy="40" r="4" fill="var(--accent)" />
        <circle cx="50" cy="140" r="4" fill="var(--accent)" />
        <circle cx="190" cy="140" r="4" fill="var(--primary)" />
        <rect x="100" y="25" width="8" height="8" rx="2" fill="var(--primary)" transform="rotate(20 104 29)" />
        <rect x="140" y="150" width="8" height="8" rx="2" fill="var(--accent)" transform="rotate(-15 144 154)" />
      </g>
    </svg>
  );
}
