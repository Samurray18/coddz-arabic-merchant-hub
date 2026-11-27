import { cn } from "@/lib/utils";

export function ShipmentsEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <style>{`@media (prefers-reduced-motion: no-preference){.sh-pin{animation:sh-pulse 1.5s ease-in-out infinite;}}@keyframes sh-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}`}</style>
      <path d="M30 120 Q80 90 120 120 T210 120" fill="none" stroke="var(--illustration-outline)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
      <g className="sh-pin" style={{ transformOrigin: "200px 90px" }}>
        <path d="M200 70 C188 70 178 80 178 92 C178 108 200 130 200 130 C200 130 222 108 222 92 C222 80 212 70 200 70 Z" fill="var(--accent)" />
        <circle cx="200" cy="92" r="6" fill="#fff" />
      </g>
      {/* scooter */}
      <circle cx="80" cy="135" r="12" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <circle cx="130" cy="135" r="12" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <path d="M80 123 L100 100 L120 100 L130 123" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="95" y="92" width="30" height="12" rx="4" fill="var(--primary)" />
    </svg>
  );
}
