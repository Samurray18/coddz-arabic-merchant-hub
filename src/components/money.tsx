import { useLanguage } from "@/hooks/use-language";
import { formatDA, type Lang3 } from "@/lib/coddz";

export function Money({ value, className }: { value: number; className?: string }) {
  const { lang } = useLanguage();
  const l = (lang as Lang3) || "ar";
  const dir = l === "ar" ? "rtl" : "ltr";
  return (
    <bdi dir={dir} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {formatDA(value, l)}
    </bdi>
  );
}
