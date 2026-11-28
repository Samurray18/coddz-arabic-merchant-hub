import {
  corsHeaders,
  jsonError,
  jsonOk,
  logAuthFailureThrottled,
  logIntake,
  matchWilaya,
  normalizePhone,
  rateLimit,
  validateOrderBody,
  verifyHmacBase64,
  createOrder,
} from "../_shared/helpers.ts";

/**
 * Framework-free Shopify webhook handler so the auth flow can be unit tested
 * with an injected Supabase client. The Deno entry point lives in index.ts.
 */
export async function handleShopifyWebhook(req: Request, admin: any): Promise<Response> {
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

  const { data: integration } = await admin
    .from("integrations")
    .select("id, store_id, status")
    .eq("store_id", storeId)
    .eq("type", "shopify")
    .eq("status", "active")
    .maybeSingle();
  if (!integration) {
    return jsonError("Integration inactive", 403, cors);
  }

  const { data: secretRow } = await admin
    .from("integration_secrets")
    .select("webhook_secret")
    .eq("integration_id", integration.id)
    .maybeSingle();
  const secret = secretRow?.webhook_secret;
  if (!secret) {
    await logAuthFailureThrottled(admin, integration.store_id ?? storeId, "shopify", integration.id);
    return jsonError("Missing secret", 403, cors);
  }

  const rawBody = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  if (!hmac) {
    await logAuthFailureThrottled(admin, integration.store_id ?? storeId, "shopify", integration.id);
    return jsonError("Missing HMAC", 401, cors);
  }
  const ok = await verifyHmacBase64(secret, rawBody, hmac);
  if (!ok) {
    await logAuthFailureThrottled(admin, integration.store_id ?? storeId, "shopify", integration.id);
    return jsonError("Invalid signature", 401, cors);
  }

  const verifiedStoreId: string = integration.store_id ?? storeId;

  // rate limit only after HMAC verification succeeds
  const limited = await rateLimit(admin, verifiedStoreId);
  if (limited) {
    return jsonError("Rate limit exceeded", 429, cors);
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await logIntake(admin, verifiedStoreId, "shopify", "rejected", "Invalid JSON", null, null);
    return jsonError("Invalid JSON", 400, cors);
  }

  // topic handling: Shopify sends X-Shopify-Topic
  const topic = req.headers.get("x-shopify-topic") ?? payload?.topic ?? "orders/create";
  if (topic !== "orders/create") {
    await logIntake(admin, verifiedStoreId, "shopify", "accepted", null, payload, null);
    return jsonOk({ ok: true, ignored: topic }, 200, cors);
  }

  // map shopify order
  const shipping = payload.shipping_address ?? {};
  const billing = payload.billing_address ?? {};
  const customer = payload.customer ?? {};
  const name =
    [shipping.first_name ?? billing.first_name ?? customer.first_name, shipping.last_name ?? billing.last_name ?? customer.last_name]
      .filter(Boolean)
      .join(" ") || customer.email || "Shopify customer";
  const phoneRaw = shipping.phone ?? billing.phone ?? customer.phone ?? customer.default_address?.phone;
  const phone = normalizePhone(String(phoneRaw ?? ""));
  if (!phone) {
    await logIntake(admin, verifiedStoreId, "shopify", "rejected", "Invalid phone", payload, null);
    return jsonError("Invalid phone", 400, cors);
  }
  const province = shipping.province ?? billing.province ?? shipping.province_code ?? billing.province_code;
  const wilaya = matchWilaya(province);
  if (!wilaya) {
    await logIntake(admin, verifiedStoreId, "shopify", "rejected", "Invalid wilaya", payload, null);
    return jsonError("Invalid wilaya", 400, cors);
  }
  const commune = shipping.city ?? billing.city;
  const address = [shipping.address1 ?? billing.address1, shipping.address2 ?? billing.address2].filter(Boolean).join(", ");
  const delivery_price = (payload.shipping_lines ?? []).reduce(
    (s: number, l: any) => s + Number(l.price ?? 0),
    0,
  );
  const items = (payload.line_items ?? []).map((li: any) => ({
    name: li.title ?? li.name ?? "Item",
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
    notes: payload.note ?? undefined,
    items,
    external_id: String(payload.id),
  };

  const validation = validateOrderBody(body);
  if (!validation.ok) {
    await logIntake(admin, verifiedStoreId, "shopify", "rejected", validation.message, payload, null);
    return jsonError(validation.message, 400, cors);
  }

  try {
    const result = await createOrder(admin, verifiedStoreId, validation.order, "shopify", validation.externalId, payload);
    const status = result.duplicate ? "duplicate" : "accepted";
    await logIntake(admin, verifiedStoreId, "shopify", status, null, payload, result.order_id);
    return jsonOk({ ok: true, order_id: result.order_id, order_number: result.order_number }, 200, cors);
  } catch (e: any) {
    const msg = e?.message ?? "Internal error";
    await logIntake(admin, verifiedStoreId, "shopify", "rejected", msg, payload, null);
    return jsonError("Failed to create order", 500, cors);
  }
}
