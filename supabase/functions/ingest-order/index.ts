import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  normalizePhone,
  matchWilaya,
  sha256Hex,
  corsHeaders,
  jsonError,
  jsonOk,
  validateOrderBody,
  createOrder,
  logIntake,
  rateLimit,
  computeFlags,
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

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  // auth via api key
  let apiKeyRaw = req.headers.get("x-api-key");
  const auth = req.headers.get("authorization");
  if (!apiKeyRaw && auth && auth.toLowerCase().startsWith("bearer ")) {
    apiKeyRaw = auth.slice(7).trim();
  }
  if (!apiKeyRaw) {
    return jsonError("Missing API key", 401, cors);
  }
  const keyHash = await sha256Hex(apiKeyRaw);
  const { data: keyRow, error: keyErr } = await admin
    .from("api_keys")
    .select("id, store_id, revoked_at")
    .eq("key_hash", keyHash)
    .maybeSingle();
  if (keyErr || !keyRow || keyRow.revoked_at) {
    return jsonError("Invalid API key", 401, cors);
  }
  const storeId = keyRow.store_id;

  // rate limit
  const limited = await rateLimit(admin, storeId);
  if (limited) {
    return jsonError("Rate limit exceeded", 429, cors);
  }

  // update last_used_at (best effort)
  await admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyRow.id);

  let body: any;
  try {
    body = await req.json();
  } catch {
    await logIntake(admin, storeId, "api", "rejected", "Invalid JSON", null, null);
    return jsonError("Invalid JSON body", 400, cors);
  }

  const validation = validateOrderBody(body);
  if (!validation.ok) {
    await logIntake(admin, storeId, "api", "rejected", validation.message, body, null);
    return jsonError(validation.message, 400, cors);
  }

  try {
    const result = await createOrder(admin, storeId, validation.order, "api", validation.externalId, body);
    const status = result.duplicate ? "duplicate" : "accepted";
    await logIntake(admin, storeId, "api", status, null, body, result.order_id);
    const httpStatus = result.duplicate ? 200 : 201;
    return jsonOk({ order_id: result.order_id, order_number: result.order_number, status: result.status }, httpStatus, cors);
  } catch (e: any) {
    const msg = e?.message ?? "Internal error";
    await logIntake(admin, storeId, "api", "rejected", msg, body, null);
    return jsonError("Failed to create order", 500, cors);
  }
});
