import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  matchWilaya,
  normalizePhone,
  corsHeaders,
  jsonError,
  jsonOk,
  verifyHmacBase64,
  validateOrderBody,
  createOrder,
  logIntake,
  rateLimit,
} from "../_shared/helpers.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? undefined;
  const cors = corsHeaders(origin);
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405, cors);
  }

  const url = new URL(req.url);
  const storeId = url.searchParams.get("store");
  if (!storeId) {
    return jsonError("Missing store param", 400, cors);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  // ping handling: WooCommerce sends a test ping with no signature? Handle missing topic -> 200
  const topic = req.headers.get("x-wc-webhook-topic");

  const limited = await rateLimit(admin, storeId);
  if (limited) {
    return jsonError("Rate limit exceeded", 429, cors);
  }

  const { data: integration } = await admin
    .from("integrations")
    .select("id, status")
    .eq("store_id", storeId)
    .eq("type", "woocommerce")
    .maybeSingle();
  if (!integration || integration.status !== "active") {
    // ping during setup may happen before integration exists; still 200
    if (!topic) {
      return jsonOk({ ok: true }, 200, cors);
    }
    await logIntake(admin, storeId, "woocommerce", "rejected", "Integration inactive", null, null);
    return jsonError("Integration inactive", 403, cors);
  }

  const { data: secretRow } = await admin
    .from("integration_secrets")
    .select("secret")
    .eq("store_id", storeId)
    .eq("type", "woocommerce")
    .maybeSingle();
  const secret = secretRow?.secret;

  const rawBody = await req.text();

  // ping: empty body or no topic -> 200
  if (!topic || !rawBody) {
    return jsonOk({ ok: true }, 200, cors);
  }

  if (!secret) {
    await logIntake(admin, storeId, "woocommerce", "rejected", "Missing secret", null, null);
    return jsonError("Missing secret", 403, cors);
  }

  const signature = req.headers.get("x-wc-webhook-signature");
  if (!signature) {
    await logIntake(admin, storeId, "woocommerce", "rejected", "Missing signature", null, null);
    return jsonError("Missing signature", 401, cors);
  }
  const ok = await verifyHmacBase64(secret, rawBody, signature);
  if (!ok) {
    await logIntake(admin, storeId, "woocommerce", "rejected", "Invalid signature", null, null);
    return jsonError("Invalid signature", 401, cors);
  }

  if (topic !== "order.created") {
    let payload: any = null;
    try { payload = JSON.parse(rawBody); } catch {}
    await logIntake(admin, storeId, "woocommerce", "accepted", null, payload, null);
    return jsonOk({ ok: true, ignored: topic }, 200, cors);
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await logIntake(admin, storeId, "woocommerce", "rejected", "Invalid JSON", null, null);
    return jsonError("Invalid JSON", 400, cors);
  }

  const billing = payload.billing ?? {};
  const shipping = payload.shipping ?? {};
  const firstName = shipping.first_name ?? billing.first_name ?? "";
  const lastName = shipping.last_name ?? billing.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || "WooCommerce customer";
  const phoneRaw = billing.phone ?? shipping.phone;
  const phone = normalizePhone(String(phoneRaw ?? ""));
  if (!phone) {
    await logIntake(admin, storeId, "woocommerce", "rejected", "Invalid phone", payload, null);
    return jsonError("Invalid phone", 400, cors);
  }
  const state = shipping.state ?? billing.state;
  const wilaya = matchWilaya(state);
  if (!wilaya) {
    await logIntake(admin, storeId, "woocommerce", "rejected", "Invalid wilaya", payload, null);
    return jsonError("Invalid wilaya", 400, cors);
  }
  const commune = shipping.city ?? billing.city;
  const address = [shipping.address_1 ?? billing.address_1, shipping.address_2 ?? billing.address_2].filter(Boolean).join(", ");
  const delivery_price = Number(payload.shipping_total ?? 0);
  const items = (payload.line_items ?? []).map((li: any) => ({
    name: li.name ?? "Item",
    sku: li.sku ?? undefined,
    quantity: Number(li.quantity ?? 1),
    price: Number(li.price ?? 0),
  }));
  const total = items.reduce((s: number, it: any) => s + it.price * it.quantity, 0) + delivery_price;

  const body = {
    customer_name: name,
    phone,
    wilaya,
    commune,
    address,
    delivery_type: "home",
    delivery_price,
    total,
    notes: payload.customer_note ?? undefined,
    items,
    external_id: String(payload.id),
  };

  const validation = validateOrderBody(body);
  if (!validation.ok) {
    await logIntake(admin, storeId, "woocommerce", "rejected", validation.message, payload, null);
    return jsonError(validation.message, 400, cors);
  }

  try {
    const result = await createOrder(admin, storeId, validation.order, "woocommerce", validation.externalId, payload);
    const status = result.duplicate ? "duplicate" : "accepted";
    await logIntake(admin, storeId, "woocommerce", status, null, payload, result.order_id);
    return jsonOk({ ok: true, order_id: result.order_id, order_number: result.order_number }, 200, cors);
  } catch (e: any) {
    const msg = e?.message ?? "Internal error";
    await logIntake(admin, storeId, "woocommerce", "rejected", msg, payload, null);
    return jsonError("Failed to create order", 500, cors);
  }
});
