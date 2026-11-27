import { cn } from "@/lib/utils";

export function OrdersEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 240 180"
      role="img"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("h-40 w-56", className)}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .ord-box { animation: ord-float 3s ease-in-out infinite; }
        }
        @keyframes ord-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
      <g className="ord-box">
        <rect x="70" y="60" width="100" height="70" rx="12" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
        <path d="M70 80 L170 80" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 60 L100 40 Q120 30 140 40 L140 60" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="190" cy="50" r="22" fill="var(--illustration-surface)" stroke="var(--accent)" strokeWidth="3" />
        <path d="M180 50 L188 58 L202 42" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
