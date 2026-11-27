import { cn } from "@/lib/utils";

export function ProductsEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <style>{`@media (prefers-reduced-motion: no-preference){.pe-tag{animation:pe-pulse 2s ease-in-out infinite;}}@keyframes pe-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}`}</style>
      <rect x="40" y="90" width="160" height="12" rx="6" fill="var(--illustration-outline)" />
      <rect x="50" y="50" width="40" height="40" rx="8" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="100" y="50" width="40" height="40" rx="8" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="150" y="50" width="40" height="40" rx="8" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <g className="pe-tag" style={{ transformOrigin: "180px 40px" }}>
        <rect x="160" y="20" width="40" height="24" rx="6" fill="var(--accent)" />
        <path d="M170 44 L175 50 L180 44" fill="var(--accent)" />
      </g>
      <circle cx="200" cy="140" r="16" fill="var(--accent)" />
      <path d="M200 132 L200 148 M192 140 L208 140" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
