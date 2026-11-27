import bagAsset from "@/assets/bag.asset.json";
import commerceAsset from "@/assets/commerce.asset.json";
import earbudsAsset from "@/assets/earbuds.asset.json";
import shoesAsset from "@/assets/shoes.asset.json";
import watchAsset from "@/assets/watch.asset.json";

export const BRAND_NAME = "COD YOU";
export const BRAND_NAME_AR = "كود يو";

export type Lang = "ar" | "fr" | "en";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "returned"
  | "canceled";

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "returned",
  "canceled",
] as const;

export const CARRIER_OPTIONS = [
  { key: "yalidine", name: "Yalidine" },
  { key: "zrexpress", name: "ZR Express" },
  { key: "dhd", name: "DHD" },
  { key: "noest", name: "Noest" },
  { key: "maystro", name: "Maystro Delivery" },
  { key: "procolis", name: "Procolis" },
  { key: "ecotrack", name: "Ecotrack" },
  { key: "guepex", name: "Guepex" },
] as const;

export const CARRIERS = CARRIER_OPTIONS.map((c) => c.name) as unknown as readonly string[];

export const PRODUCT_IMAGES = {
  watch: watchAsset.url,
  shoes: shoesAsset.url,
  earbuds: earbudsAsset.url,
  bag: bagAsset.url,
} as const;

export type ProductImageKey = keyof typeof PRODUCT_IMAGES;

export const HERO_ILLUSTRATION_URL = commerceAsset.url;

export interface Wilaya {
  code: string;
  ar: string;
  latin: string;
}

export const WILAYAS: readonly Wilaya[] = [
  { code: "01", ar: "أدرار", latin: "Adrar" },
  { code: "02", ar: "الشلف", latin: "Chlef" },
  { code: "03", ar: "الأغواط", latin: "Laghouat" },
  { code: "04", ar: "أم البواقي", latin: "Oum El Bouaghi" },
  { code: "05", ar: "باتنة", latin: "Batna" },
  { code: "06", ar: "بجاية", latin: "Béjaïa" },
  { code: "07", ar: "بسكرة", latin: "Biskra" },
  { code: "08", ar: "بشار", latin: "Béchar" },
  { code: "09", ar: "البليدة", latin: "Blida" },
  { code: "10", ar: "البويرة", latin: "Bouira" },
  { code: "11", ar: "تمنراست", latin: "Tamanrasset" },
  { code: "12", ar: "تبسة", latin: "Tébessa" },
  { code: "13", ar: "تلمسان", latin: "Tlemcen" },
  { code: "14", ar: "تيارت", latin: "Tiaret" },
  { code: "15", ar: "تيزي وزو", latin: "Tizi Ouzou" },
  { code: "16", ar: "الجزائر", latin: "Alger" },
  { code: "17", ar: "الجلفة", latin: "Djelfa" },
  { code: "18", ar: "جيجل", latin: "Jijel" },
  { code: "19", ar: "سطيف", latin: "Sétif" },
  { code: "20", ar: "سعيدة", latin: "Saïda" },
  { code: "21", ar: "سكيكدة", latin: "Skikda" },
  { code: "22", ar: "سيدي بلعباس", latin: "Sidi Bel Abbès" },
  { code: "23", ar: "عنابة", latin: "Annaba" },
  { code: "24", ar: "قالمة", latin: "Guelma" },
  { code: "25", ar: "قسنطينة", latin: "Constantine" },
  { code: "26", ar: "المدية", latin: "Médéa" },
  { code: "27", ar: "مستغانم", latin: "Mostaganem" },
  { code: "28", ar: "المسيلة", latin: "M'Sila" },
  { code: "29", ar: "معسكر", latin: "Mascara" },
  { code: "30", ar: "ورقلة", latin: "Ouargla" },
  { code: "31", ar: "وهران", latin: "Oran" },
  { code: "32", ar: "البيض", latin: "El Bayadh" },
  { code: "33", ar: "إليزي", latin: "Illizi" },
  { code: "34", ar: "برج بوعريريج", latin: "Bordj Bou Arréridj" },
  { code: "35", ar: "بومرداس", latin: "Boumerdès" },
  { code: "36", ar: "الطارف", latin: "El Tarf" },
  { code: "37", ar: "تندوف", latin: "Tindouf" },
  { code: "38", ar: "تيسمسيلت", latin: "Tissemsilt" },
  { code: "39", ar: "الوادي", latin: "El Oued" },
  { code: "40", ar: "خنشلة", latin: "Khenchela" },
  { code: "41", ar: "سوق أهراس", latin: "Souk Ahras" },
  { code: "42", ar: "تيبازة", latin: "Tipaza" },
  { code: "43", ar: "ميلة", latin: "Mila" },
  { code: "44", ar: "عين الدفلى", latin: "Aïn Defla" },
  { code: "45", ar: "النعامة", latin: "Naâma" },
  { code: "46", ar: "عين تموشنت", latin: "Aïn Témouchent" },
  { code: "47", ar: "غرداية", latin: "Ghardaïa" },
  { code: "48", ar: "غليزان", latin: "Relizane" },
  { code: "49", ar: "تيميمون", latin: "Timimoun" },
  { code: "50", ar: "برج باجي مختار", latin: "Bordj Badji Mokhtar" },
  { code: "51", ar: "أولاد جلال", latin: "Ouled Djellal" },
  { code: "52", ar: "بني عباس", latin: "Béni Abbès" },
  { code: "53", ar: "إن صالح", latin: "In Salah" },
  { code: "54", ar: "إن قزام", latin: "In Guezzam" },
  { code: "55", ar: "تقرت", latin: "Touggourt" },
  { code: "56", ar: "جانت", latin: "Djanet" },
  { code: "57", ar: "المغير", latin: "El M'Ghair" },
  { code: "58", ar: "المنيعة", latin: "El Meniaa" },
] as const;

export type Lang3 = "ar" | "fr" | "en";

export function formatDA(amount: number, lang: Lang3 = "ar"): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const sign = safe < 0 ? "-" : "";
  const abs = Math.abs(safe).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
  const currency = lang === "ar" ? "دج" : "DA";
  return `${sign}${abs}\u202F${currency}`;
}

export function normalizeAlgerianPhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (/^0[567]\d{8}$/.test(cleaned)) return cleaned;
  if (/^\+213[567]\d{8}$/.test(cleaned)) return `0${cleaned.slice(4)}`;
  if (/^00213[567]\d{8}$/.test(cleaned)) return `0${cleaned.slice(5)}`;
  return null;
}

export function isValidAlgerianPhone(raw: string): boolean {
  return normalizeAlgerianPhone(raw) !== null;
}

function stripAccentsWilaya(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function wilayaLabel(value: string | null | undefined, lang: Lang3 = "ar"): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  // numeric code
  if (/^\d{1,2}$/.test(raw)) {
    const code = raw.padStart(2, "0");
    const w = WILAYAS.find((x) => x.code === code);
    if (w) return lang === "ar" ? w.ar : w.latin;
  }
  const norm = stripAccentsWilaya(raw).toLowerCase().replace(/^al\\s+/i, "").replace(/^el\\s+/i, "").replace(/^ال/, "").trim();
  // try exact match on ar or latin
  for (const w of WILAYAS) {
    const arN = stripAccentsWilaya(w.ar).toLowerCase().replace(/^ال/, "").trim();
    const latN = stripAccentsWilaya(w.latin).toLowerCase().trim();
    if (norm === arN || norm === latN) return lang === "ar" ? w.ar : w.latin;
  }
  // contains match
  for (const w of WILAYAS) {
    const arN = stripAccentsWilaya(w.ar).toLowerCase().replace(/^ال/, "").trim();
    const latN = stripAccentsWilaya(w.latin).toLowerCase().trim();
    if (arN.includes(norm) || norm.includes(arN) || latN.includes(norm) || norm.includes(latN)) {
      return lang === "ar" ? w.ar : w.latin;
    }
  }
  return raw;
}

export function formatDate(value: string | Date | null | undefined, lang: Lang3 = "ar"): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const locale = lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-DZ" : "en-GB";
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit", numberingSystem: "latn" }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizeAlgerianPhone(phone);
  const intl = normalized ? `213${normalized.slice(1)}` : phone.replace(/\D/g, "");
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

export function getProductImage(image?: string): string {
  if (!image) return PRODUCT_IMAGES.watch;
  if (image in PRODUCT_IMAGES) {
    return PRODUCT_IMAGES[image as ProductImageKey];
  }
  return image;
}

export const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  new: "bg-status-new-bg text-status-new border-status-new/25",
  confirmed: "bg-status-confirmed-bg text-status-confirmed border-status-confirmed/25",
  shipped: "bg-status-shipped-bg text-status-shipped border-status-shipped/25",
  delivered: "bg-status-delivered-bg text-status-delivered border-status-delivered/25",
  returned: "bg-status-returned-bg text-status-returned border-status-returned/25",
  canceled: "bg-status-canceled-bg text-status-canceled border-status-canceled/25",
};