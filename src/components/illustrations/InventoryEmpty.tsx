import { cn } from "@/lib/utils";

export function InventoryEmpty({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-hidden={title ? undefined : true} aria-label={title} className={cn("h-40 w-56", className)}>
      <rect x="60" y="100" width="120" height="40" rx="8" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="70" y="70" width="100" height="30" rx="6" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="80" y="45" width="80" height="25" rx="6" fill="var(--illustration-surface)" stroke="var(--primary)" strokeWidth="3" />
      <rect x="150" y="30" width="50" height="60" rx="6" fill="var(--illustration-surface)" stroke="var(--illustration-outline)" strokeWidth="3" />
      <path d="M160 45 L190 45 M160 55 L185 55 M160 65 L180 65" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
