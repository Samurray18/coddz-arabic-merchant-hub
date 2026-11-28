import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleShopifyWebhook } from "./handler.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
  return handleShopifyWebhook(req, admin);
});
