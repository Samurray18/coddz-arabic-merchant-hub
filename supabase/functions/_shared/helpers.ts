// Pure TypeScript helpers shared by edge functions and unit tests.
// No framework/Deno-specific code. Uses Web Crypto (available in Deno + Node 18+).

export interface WilayaEntry {
  code: string;
  ar: string;
  latin: string;
}

// Copied from src/lib/coddz.ts (keep in sync)
export const WILAYAS: WilayaEntry[] = [
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
];

const ALIASES: Record<string, string> = {
  algiers: "alger",
  algeria: "alger",
  bejaya: "bejaia",
};

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeName(s: string): string {
  let out = stripAccents(s).toLowerCase().trim();
  // remove leading "ال" / "el " / "al "
  out = out.replace(/^(ال|el |al )/i, "");
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

export function normalizePhone(raw: string): string | null {
  const cleaned = String(raw ?? "").replace(/[\s\-().]/g, "");
  if (/^0[567]\d{8}$/.test(cleaned)) return cleaned;
  if (/^\+213[567]\d{8}$/.test(cleaned)) return `0${cleaned.slice(4)}`;
  if (/^00213[567]\d{8}$/.test(cleaned)) return `0${cleaned.slice(5)}`;
  return null;
}

export function matchWilaya(input: unknown): string | null {
  if (input === null || input === undefined) return null;
  const raw = String(input).trim();
  if (!raw) return null;
  // numeric code
  if (/^\d{1,2}$/.test(raw)) {
    const code = raw.padStart(2, "0");
    const w = WILAYAS.find((x) => x.code === code);
    return w ? w.latin : null;
  }
  const norm = normalizeName(raw);
  const aliased = ALIASES[norm] ?? norm;
  // try exact / contains on ar and latin
  for (const w of WILAYAS) {
    const arN = normalizeName(w.ar);
    const latN = normalizeName(w.latin);
    if (aliased === arN || aliased === latN) return w.latin;
  }
  // contains
  for (const w of WILAYAS) {
    const arN = normalizeName(w.ar);
    const latN = normalizeName(w.latin);
    if (arN.includes(aliased) || aliased.includes(arN)) return w.latin;
    if (latN.includes(aliased) || aliased.includes(latN)) return w.latin;
  }
  return null;
}

export async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hmacSha256Base64(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const bytes = new Uint8Array(sig);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyHmacBase64(secret: string, message: string, signatureBase64: string): Promise<boolean> {
  const computed = await hmacSha256Base64(secret, message);
  return timingSafeEqual(computed, signatureBase64);
}

export function corsHeaders(origin?: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization, X-Shopify-Hmac-Sha256, X-WC-Webhook-Signature, X-WC-Webhook-Topic",
    "Access-Control-Max-Age": "86400",
  };
}

export function jsonError(message: string, status: number, extra?: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function jsonOk(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
  });
}

// Flags computation
export interface Flags {
  blacklisted: boolean;
  duplicate: boolean;
  previous_returns: number;
}

export async function computeFlags(client: any, storeId: string, phone: string): Promise<Flags> {
  const blacklistedRes = await client
    .from("blacklist")
    .select("id")
    .eq("store_id", storeId)
    .eq("phone", phone)
    .limit(1);
  const blacklisted = Array.isArray(blacklistedRes?.data) && blacklistedRes.data.length > 0;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const dupRes = await client
    .from("orders")
    .select("id")
    .eq("store_id", storeId)
    .eq("phone", phone)
    .in("status", ["new", "confirmed", "shipped"])
    .gte("created_at", since);
  const duplicate = Array.isArray(dupRes?.data) && dupRes.data.length > 0;

  const retRes = await client
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("phone", phone)
    .eq("status", "returned");
  const previous_returns = typeof retRes?.count === "number" ? retRes.count : (Array.isArray(retRes?.data) ? retRes.data.length : 0);

  return { blacklisted, duplicate, previous_returns };
}

export interface NormalizedOrder {
  customer_name: string;
  phone: string;
  wilaya: string;
  commune?: string;
  address?: string;
  delivery_type: "home" | "desk";
  delivery_price: number;
  total: number;
  notes?: string;
  items: Array<{ name: string; sku?: string; quantity: number; price: number; product_id?: string | null }>;
}

export interface CreateOrderResult {
  order_id: string;
  order_number: string;
  status: string;
  duplicate: boolean;
}

export async function createOrder(
  client: any,
  storeId: string,
  order: NormalizedOrder,
  source: string,
  externalId: string | null | undefined,
  rawPayload: unknown,
): Promise<CreateOrderResult> {
  const flags = await computeFlags(client, storeId, order.phone);

  // idempotency: check existing
  if (externalId) {
    const existingRes = await client
      .from("orders")
      .select("id, number, status")
      .eq("store_id", storeId)
      .eq("source", source)
      .eq("external_order_id", externalId)
      .limit(1)
      .maybeSingle();
    if (existingRes?.data) {
      return {
        order_id: existingRes.data.id,
        order_number: existingRes.data.number,
        status: existingRes.data.status,
        duplicate: true,
      };
    }
  }

  const insertPayload = {
    store_id: storeId,
    customer_name: order.customer_name,
    phone: order.phone,
    wilaya: order.wilaya,
    commune: order.commune ?? null,
    address: order.address ?? null,
    delivery_type: order.delivery_type,
    delivery_price: order.delivery_price,
    total: order.total,
    notes: order.notes ?? null,
    source,
    external_order_id: externalId ?? null,
    flags,
    status: "new",
    confirmation_status: "pending",
    payload: rawPayload ?? {},
  };

  const { data: inserted, error: insErr } = await client
    .from("orders")
    .insert(insertPayload)
    .select("id, number, status")
    .single();

  if (insErr) {
    // unique violation -> fetch existing
    if (insErr.code === "23505" && externalId) {
      const existingRes = await client
        .from("orders")
        .select("id, number, status")
        .eq("store_id", storeId)
        .eq("source", source)
        .eq("external_order_id", externalId)
        .limit(1)
        .maybeSingle();
      if (existingRes?.data) {
        return {
          order_id: existingRes.data.id,
          order_number: existingRes.data.number,
          status: existingRes.data.status,
          duplicate: true,
        };
      }
    }
    throw insErr;
  }

  const orderId = inserted.id;
  const orderNumber = inserted.number;

  // match items to products
  const items = order.items ?? [];
  if (items.length) {
    // load products for store
    const { data: products } = await client
      .from("products")
      .select("id, payload")
      .eq("store_id", storeId);
    const productList = Array.isArray(products) ? products : [];
    const findProduct = (it: any) => {
      if (it.sku) {
        const bySku = productList.find((p: any) => (p.payload?.sku ?? p.payload?.["sku"]) === it.sku);
        if (bySku) return bySku.id;
      }
      const byName = productList.find((p: any) => (p.payload?.name ?? p.payload?.["name"]) === it.name);
      return byName ? byName.id : null;
    };
    const itemRows = items.map((it) => ({
      order_id: orderId,
      product_id: findProduct(it),
      name: it.name,
      sku: it.sku ?? null,
      quantity: it.quantity,
      price: it.price,
    }));
    await client.from("order_items").insert(itemRows);
  }

  // order_events
  await client.from("order_events").insert({
    order_id: orderId,
    store_id: storeId,
    type: "created",
    payload: { source, external_id: externalId ?? null },
  });

  return {
    order_id: orderId,
    order_number: orderNumber,
    status: inserted.status ?? "new",
    duplicate: false,
  };
}

export async function logIntake(
  client: any,
  storeId: string,
  source: string,
  status: "accepted" | "rejected" | "duplicate",
  error: string | null,
  payload: unknown,
  orderId: string | null,
): Promise<void> {
  await client.from("intake_logs").insert({
    store_id: storeId,
    source,
    status,
    error,
    payload: payload ?? {},
    order_id: orderId,
  });
}

export async function rateLimit(client: any, storeId: string): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 1000).toISOString();
  const { data, count } = await client
    .from("intake_logs")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .gte("created_at", since);
  const n = typeof count === "number" ? count : Array.isArray(data) ? data.length : 0;
  return n > 60;
}

export function validateOrderBody(body: any): { ok: true; order: NormalizedOrder; externalId: string | null } | { ok: false; message: string } {
  if (!body || typeof body !== "object") return { ok: false, message: "Invalid JSON body" };
  const customer_name = String(body.customer_name ?? "").trim();
  if (!customer_name) return { ok: false, message: "customer_name is required" };
  const phone = normalizePhone(String(body.phone ?? ""));
  if (!phone) return { ok: false, message: "Invalid phone number" };
  const wilaya = matchWilaya(body.wilaya);
  if (!wilaya) return { ok: false, message: "Invalid wilaya" };
  const delivery_type = body.delivery_type === "desk" ? "desk" : "home";
  const delivery_price = Number(body.delivery_price ?? 0);
  if (!Number.isFinite(delivery_price) || delivery_price < 0) return { ok: false, message: "Invalid delivery_price" };
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) return { ok: false, message: "items is required" };
  const normItems: NormalizedOrder["items"] = [];
  for (const it of items) {
    const name = String(it?.name ?? "").trim();
    if (!name) return { ok: false, message: "item name is required" };
    const quantity = Number(it?.quantity ?? 0);
    if (!Number.isFinite(quantity) || quantity <= 0) return { ok: false, message: "Invalid item quantity" };
    const price = Number(it?.price ?? 0);
    if (!Number.isFinite(price) || price < 0) return { ok: false, message: "Invalid item price" };
    normItems.push({ name, sku: it?.sku ? String(it.sku) : undefined, quantity, price });
  }
  const itemsTotal = normItems.reduce((s, it) => s + it.price * it.quantity, 0);
  const total = itemsTotal + delivery_price;
  const order: NormalizedOrder = {
    customer_name,
    phone,
    wilaya,
    commune: body.commune ? String(body.commune) : undefined,
    address: body.address ? String(body.address) : undefined,
    delivery_type,
    delivery_price,
    total,
    notes: body.notes ? String(body.notes) : undefined,
    items: normItems,
  };
  const externalId = body.external_id ? String(body.external_id) : null;
  return { ok: true, order, externalId };
}
