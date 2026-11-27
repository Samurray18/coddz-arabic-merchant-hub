import { useLanguage } from "@/hooks/use-language";
import { formatDate, type Lang3 } from "@/lib/coddz";

export function LocalDate({ value, className }: { value: string | Date | null | undefined; className?: string }) {
  const { lang } = useLanguage();
  const l = (lang as Lang3) || "ar";
  return (
    <bdi dir="ltr" className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {formatDate(value, l)}
    </bdi>
  );
}

export { formatDate };
