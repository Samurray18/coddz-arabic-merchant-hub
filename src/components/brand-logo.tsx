import { BRAND_NAME } from "@/lib/coddz";

const MARK = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" aria-hidden="true">
    <path d="M256 36 C198 36 138 50 96 68 C82 74 74 87 74 102 L74 238 C74 352 152 434 246 474 C250 476 253 477 256 477 L256 36 Z" fill="#1D5B3A" />
    <path d="M256 36 C314 36 374 50 416 68 C430 74 438 87 438 102 L438 238 C438 352 360 434 266 474 C262 476 259 477 256 477 L256 36 Z" fill="#256B45" />
    <path d="M254 114 L154 166 L184 182 L284 130 Z" fill="#FFFFFF" />
    <path d="M298 137 L198 189 L254 218 L354 166 Z" fill="#FFFFFF" />
    <path d="M148 176 L148 296 L248 348 L248 228 L204 205 L204 246 L182 234 L182 193 Z" fill="#FFFFFF" />
    <path d="M262 228 L360 176 C402 154 446 128 486 98 C466 146 432 184 388 206 L448 192 C416 226 378 244 338 256 L392 254 C358 282 316 306 262 346 Z" fill="#5CD692" />
  </svg>
);

export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span className={className} style={{ width: size, height: size, display: "inline-block" }}>
      {MARK}
    </span>
  );
}

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const text = size === "sm" ? "text-title-md" : size === "lg" ? "text-headline-md" : "text-title-lg";
  return (
    <div className="flex items-center gap-2">
      <span className={`${box} shrink-0`}>{MARK}</span>
      <span className={`font-display ${text} text-on-surface`} style={{ fontWeight: 800 }}>
        {BRAND_NAME}
      </span>
    </div>
  );
}
