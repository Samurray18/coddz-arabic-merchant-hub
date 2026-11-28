import { afterEach, describe, expect, it, vi } from "vitest";
import { AUTH_FAILURE_MESSAGE, hmacSha256Base64 } from "../../supabase/functions/_shared/helpers";
import { handleShopifyWebhook } from "../../supabase/functions/ingest-shopify/handler";
import { handleWooCommerceWebhook } from "../../supabase/functions/ingest-woocommerce/handler";

type Filter = { column: string; value: unknown; op?: "gte" };
type Query = { table: string; select?: string; filters?: Filter[]; row?: any };

interface FakeAdminOptions {
  integration?: any;
  secret?: string | null;
  now?: () => number;
}

/**
 * Fake Supabase client using the real schema column names:
 * integration_secrets(integration_id, webhook_secret, updated_at).
 */
function createFakeAdmin(options: FakeAdminOptions = {}) {
  const integration = options.integration ?? {
    id: "int-1",
    store_id: "store-1",
    status: "active",
  };
  const secret = options.secret === undefined ? "webhook-secret" : options.secret;
  const secretRows = secret ? [{ integration_id: integration?.id, webhook_secret: secret, updated_at: "2026-01-01T00:00:00Z" }] : [];
  const logs: any[] = [];
  const queries: Query[] = [];
  const now = options.now ?? (() => Date.now());

  const matches = (filters: Filter[]) =>
    logs.filter((log) =>
      filters.every((filter) => {
        if (filter.op === "gte") return String(log[filter.column] ?? "") >= String(filter.value);
        return log[filter.column] === filter.value;
      }),
    );

  const admin: any = {
    from(table: string) {
      if (table === "integrations") {
        const filters: Filter[] = [];
        let select = "";
        const chain: any = {
          select: (cols: string) => {
            select = cols;
            return chain;
          },
          eq: (column: string, value: unknown) => {
            filters.push({ column, value });
            return chain;
          },
          maybeSingle: async () => {
            queries.push({ table, select, filters });
            const row = integration && filters.every((f) => integration[f.column] === f.value) ? { ...integration } : null;
            return { data: row, error: null };
          },
        };
        return chain;
      }

      if (table === "integration_secrets") {
        const filters: Filter[] = [];
        let select = "";
        const chain: any = {
          select: (cols: string) => {
            select = cols;
            return chain;
          },
          eq: (column: string, value: unknown) => {
            filters.push({ column, value });
            return chain;
          },
          maybeSingle: async () => {
            queries.push({ table, select, filters });
            const secretRow: any = secretRows[0];
            const row = secretRow && filters.every((f) => secretRow[f.column] === f.value) ? { ...secretRow } : null;
            return { data: row, error: null };
          },
        };
        return chain;
      }

      if (table === "intake_logs") {
        const filters: Filter[] = [];
        let select = "";
        let selectOptions: any;
        const chain: any = {
          select: (cols: string, opts?: any) => {
            select = cols;
            selectOptions = opts;
            return chain;
          },
          eq: (column: string, value: unknown) => {
            filters.push({ column, value });
            return chain;
          },
          gte: (column: string, value: unknown) => {
            filters.push({ column, value, op: "gte" });
            return chain;
          },
          insert: (row: any) => {
            const stored = { id: `log-${logs.length + 1}`, created_at: new Date(now()).toISOString(), ...row };
            logs.push(stored);
            queries.push({ table, row: stored });
            return Promise.resolve({ error: null });
          },
          then: (resolve: any, reject: any) => {
            const rows = matches(filters);
            queries.push({ table, select, filters, ...(selectOptions ? { row: selectOptions } : {}) });
            return Promise.resolve({
              data: selectOptions?.head ? null : rows,
              count: rows.length,
              error: null,
            }).then(resolve, reject);
          },
        };
        return chain;
      }

      throw new Error(`Unexpected table: ${table}`);
    },
  };

  return { admin, logs, queries };
}

function webhookRequest(store: string, headers: Record<string, string>, body: string): Request {
  return new Request(`https://example.test/webhook?store=${encodeURIComponent(store)}`, {
    method: "POST",
    headers,
    body,
  });
}

const shopifyIntegration = { id: "int-shopify", store_id: "store-1", status: "active", type: "shopify" };
const wooIntegration = { id: "int-woo", store_id: "store-1", status: "active", type: "woocommerce" };

afterEach(() => {
  vi.useRealTimers();
});

describe("Shopify webhook authentication", () => {
  it("reads webhook_secret by integration_id and accepts a valid HMAC", async () => {
    const body = JSON.stringify({ id: 1001 });
    const { admin, logs, queries } = createFakeAdmin({ integration: shopifyIntegration, secret: "shopify-secret" });
    const signature = await hmacSha256Base64("shopify-secret", body);

    const res = await handleShopifyWebhook(
      webhookRequest("store-1", { "x-shopify-hmac-sha256": signature, "x-shopify-topic": "orders/updated" }, body),
      admin,
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ok: true, ignored: "orders/updated" });
    expect(queries).toContainEqual({
      table: "integration_secrets",
      select: "webhook_secret",
      filters: [{ column: "integration_id", value: "int-shopify" }],
    });
    expect(logs.some((log) => log.error === AUTH_FAILURE_MESSAGE)).toBe(false);
  });

  it("returns 401 for an invalid HMAC", async () => {
    const { admin, logs } = createFakeAdmin({ integration: shopifyIntegration, secret: "shopify-secret" });

    const res = await handleShopifyWebhook(
      webhookRequest("store-1", { "x-shopify-hmac-sha256": "invalid", "x-shopify-topic": "orders/create" }, "{}"),
      admin,
    );

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toMatchObject({ error: "Invalid signature" });
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      store_id: "store-1",
      source: "shopify",
      status: "rejected",
      error: AUTH_FAILURE_MESSAGE,
    });
  });

  it("returns 403 when the secret row is missing", async () => {
    const { admin, logs } = createFakeAdmin({ integration: shopifyIntegration, secret: null });

    const res = await handleShopifyWebhook(
      webhookRequest("store-1", { "x-shopify-hmac-sha256": "anything", "x-shopify-topic": "orders/create" }, "{}"),
      admin,
    );

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({ error: "Missing secret" });
    expect(logs[0]).toMatchObject({ status: "rejected", error: AUTH_FAILURE_MESSAGE });
  });

  it("writes only one auth-failure row in 10 minutes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const { admin, logs } = createFakeAdmin({ integration: shopifyIntegration, secret: "shopify-secret" });
    const send = () =>
      handleShopifyWebhook(
        webhookRequest("store-1", { "x-shopify-hmac-sha256": "invalid", "x-shopify-topic": "orders/create" }, "{}"),
        admin,
      );

    await send();
    expect(logs).toHaveLength(1);

    vi.setSystemTime(new Date("2026-01-01T00:09:00.000Z"));
    await send();
    expect(logs).toHaveLength(1);

    vi.setSystemTime(new Date("2026-01-01T00:11:00.000Z"));
    await send();
    expect(logs).toHaveLength(2);
  });

  it("does not log failures for unknown stores", async () => {
    const { admin, logs } = createFakeAdmin({ integration: null, secret: null });

    const res = await handleShopifyWebhook(
      webhookRequest("attacker-store", { "x-shopify-hmac-sha256": "invalid" }, "{}"),
      admin,
    );

    expect(res.status).toBe(403);
    expect(logs).toHaveLength(0);
  });
});

describe("WooCommerce webhook authentication", () => {
  it("reads webhook_secret by integration_id and accepts a valid HMAC", async () => {
    const body = JSON.stringify({ id: 2001 });
    const { admin, logs, queries } = createFakeAdmin({ integration: wooIntegration, secret: "woo-secret" });
    const signature = await hmacSha256Base64("woo-secret", body);

    const res = await handleWooCommerceWebhook(
      webhookRequest(
        "store-1",
        { "x-wc-webhook-signature": signature, "x-wc-webhook-topic": "order.updated" },
        body,
      ),
      admin,
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ok: true, ignored: "order.updated" });
    expect(queries).toContainEqual({
      table: "integration_secrets",
      select: "webhook_secret",
      filters: [{ column: "integration_id", value: "int-woo" }],
    });
    expect(logs.some((log) => log.error === AUTH_FAILURE_MESSAGE)).toBe(false);
  });

  it("returns 401 for an invalid HMAC", async () => {
    const { admin, logs } = createFakeAdmin({ integration: wooIntegration, secret: "woo-secret" });

    const res = await handleWooCommerceWebhook(
      webhookRequest(
        "store-1",
        { "x-wc-webhook-signature": "invalid", "x-wc-webhook-topic": "order.created" },
        "{}",
      ),
      admin,
    );

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toMatchObject({ error: "Invalid signature" });
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      store_id: "store-1",
      source: "woocommerce",
      status: "rejected",
      error: AUTH_FAILURE_MESSAGE,
    });
  });

  it("returns 403 when the secret row is missing", async () => {
    const { admin, logs } = createFakeAdmin({ integration: wooIntegration, secret: null });

    const res = await handleWooCommerceWebhook(
      webhookRequest(
        "store-1",
        { "x-wc-webhook-signature": "anything", "x-wc-webhook-topic": "order.created" },
        "{}",
      ),
      admin,
    );

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({ error: "Missing secret" });
    expect(logs[0]).toMatchObject({ status: "rejected", error: AUTH_FAILURE_MESSAGE });
  });

  it("writes only one auth-failure row in 10 minutes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const { admin, logs } = createFakeAdmin({ integration: wooIntegration, secret: "woo-secret" });
    const send = () =>
      handleWooCommerceWebhook(
        webhookRequest(
          "store-1",
          { "x-wc-webhook-signature": "invalid", "x-wc-webhook-topic": "order.created" },
          "{}",
        ),
        admin,
      );

    await send();
    expect(logs).toHaveLength(1);

    vi.setSystemTime(new Date("2026-01-01T00:09:00.000Z"));
    await send();
    expect(logs).toHaveLength(1);

    vi.setSystemTime(new Date("2026-01-01T00:11:00.000Z"));
    await send();
    expect(logs).toHaveLength(2);
  });

  it("does not log failures for unknown stores", async () => {
    const { admin, logs } = createFakeAdmin({ integration: null, secret: null });

    const res = await handleWooCommerceWebhook(
      webhookRequest("attacker-store", { "x-wc-webhook-topic": "order.created", "x-wc-webhook-signature": "invalid" }, "{}"),
      admin,
    );

    expect(res.status).toBe(403);
    expect(logs).toHaveLength(0);
  });
});
