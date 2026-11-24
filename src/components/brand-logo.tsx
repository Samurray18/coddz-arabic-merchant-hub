import { BRAND_NAME } from "@/lib/coddz";

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box = size === "sm" ? "w-8 h-8 text-[16px]" : size === "lg" ? "w-12 h-12 text-[26px]" : "w-10 h-10 text-[22px]";
  const text = size === "sm" ? "text-title-md" : size === "lg" ? "text-headline-md" : "text-title-lg";
  return (
    <div className="flex items-center gap-2">
      <div className={`${box} rounded-md bg-primary text-on-primary flex items-center justify-center shrink-0`}>
        <span className="material-symbols-outlined">{size === "sm" ? "monitoring" : "monitoring"}</span>
      </div>
      <span className={`font-display ${text} text-on-surface`} style={{ fontWeight: 800 }}>
        {BRAND_NAME}
      </span>
    </div>
  );
}