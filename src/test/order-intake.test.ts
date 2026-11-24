import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  matchWilaya,
  timingSafeEqual,
  verifyHmacBase64,
  computeFlags,
  createOrder,
} from "../../supabase/functions/_shared/helpers";

describe("normalizePhone", () => {
  it("accepts 05/06/07 + 8 digits", () => {
    expect(normalizePhone("0551234567")).toBe("0551234567");
    expect(normalizePhone("0662345678")).toBe("0662345678");
    expect(normalizePhone("0773456789")).toBe("0773456789");
  });
  it("strips spaces and dashes", () => {
    expect(normalizePhone("0551 23 45 67")).toBe("0551234567");
    expect(normalizePhone("0551-23-45-67")).toBe("0551234567");
  });
  it("converts +213", () => {
    expect(normalizePhone("+213551234567")).toBe("0551234567");
  });
  it("converts 00213", () => {
    expect(normalizePhone("00213551234567")).toBe("0551234567");
  });
  it("rejects invalid", () => {
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("0881234567")).toBeNull();
    expect(normalizePhone("")).toBeNull();
  });
});

describe("matchWilaya", () => {
  it("matches by code", () => {
    expect(matchWilaya("16")).toBe("Alger");
    expect(matchWilaya("06")).toBe("Béjaïa");
    expect(matchWilaya("6")).toBe("Béjaïa");
    expect(matchWilaya("58")).toBe("El Meniaa");
  });
  it("matches Arabic names", () => {
    expect(matchWilaya("الجزائر")).toBe("Alger");
    expect(matchWilaya("وهران")).toBe("Oran");
    expect(matchWilaya("قسنطينة")).toBe("Constantine");
  });
  it("matches French/Latin names", () => {
    expect(matchWilaya("Alger")).toBe("Alger");
    expect(matchWilaya("Oran")).toBe("Oran");
    expect(matchWilaya("alger")).toBe("Alger");
  });
  it("handles typos/variants", () => {
    expect(matchWilaya("Alger")).toBe("Alger");
    expect(matchWilaya("Algiers")).toBe("Alger");
    expect(matchWilaya("الجزائر العاصمة")).toBe("Alger");
    expect(matchWilaya("Bejaia")).toBe("Béjaïa");
    expect(matchWilaya("Bordj Bou Arreridj")).toBe("Bordj Bou Arréridj");
  });
  it("rejects unknown", () => {
    expect(matchWilaya("Atlantis")).toBeNull();
    expect(matchWilaya("")).toBeNull();
    expect(matchWilaya(null)).toBeNull();
  });
});

describe("timingSafeEqual", () => {
  it("returns true for equal strings", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
  });
  it("returns false for different", () => {
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });
});

describe("verifyHmacBase64", () => {
  it("verifies a valid HMAC", async () => {
    const secret = "shhh";
    const msg = "hello world";
    // compute expected
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
    const bytes = new Uint8Array(sig);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = btoa(bin);
    expect(await verifyHmacBase64(secret, msg, b64)).toBe(true);
    expect(await verifyHmacBase64(secret, msg, "AAAA")).toBe(false);
    expect(await verifyHmacBase64("other", msg, b64)).toBe(false);
  });
});

describe("computeFlags", () => {
  it("computes flags with a fake client", async () => {
    const blacklistRows = [{ id: "b1" }];
    const dupRows = [{ id: "o1" }];
    const fakeClient: any = {
      from: (table: string) => {
        if (table === "blacklist") {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  limit: () => Promise.resolve({ data: blacklistRows }),
                }),
              }),
            }),
          };
        }
        if (table === "orders") {
          // differentiate by call: first call duplicate check (in + gte), second count (eq status returned)
          let callCount = 0;
          return {
            select: (_cols: any, opts?: any) => {
              callCount++;
              if (opts?.head) {
                // previous_returns count
                return {
                  eq: () => ({
                    eq: () => ({
                      eq: () => Promise.resolve({ count: 2, data: null }),
                    }),
                  }),
                };
              }
              // duplicate check
              return {
                eq: () => ({
                  eq: () => ({
                    in: () => ({
                      gte: () => Promise.resolve({ data: dupRows }),
                    }),
                  }),
                }),
              };
            },
          };
        }
        return { select: () => ({ eq: () => Promise.resolve({ data: [] }) }) };
      },
    };
    const flags = await computeFlags(fakeClient, "store-1", "0551234567");
    expect(flags.blacklisted).toBe(true);
    expect(flags.duplicate).toBe(true);
    expect(flags.previous_returns).toBe(2);
  });
});

describe("createOrder inserts", () => {
  it("items carry store_id and no sku; events carry no payload", async () => {
    const insertedItems: any[] = [];
    const insertedEvents: any[] = [];
    let deletedOrder = false;
    const fakeClient: any = {
      from: (table: string) => {
        if (table === "blacklist") {
          return { select: () => ({ eq: () => ({ eq: () => ({ limit: () => Promise.resolve({ data: [] }) }) }) }) };
        }
        if (table === "orders") {
          const makeChain = (terminal: any) => {
            const chain: any = {};
            chain.eq = () => chain;
            chain.in = () => chain;
            chain.gte = () => Promise.resolve({ data: [], count: 0 });
            chain.limit = () => ({ maybeSingle: () => Promise.resolve({ data: null }) });
            chain.maybeSingle = () => Promise.resolve({ data: null });
            return chain;
          };
          return {
            select: (_cols?: any, opts?: any) => {
              if (opts?.head) {
                // previous_returns count
                const chain: any = {};
                chain.eq = () => chain;
                return { ...chain, then: (cb: any) => cb({ count: 0, data: null }) };
              }
              return makeChain(null);
            },
            insert: (row: any) => ({
              select: () => ({
                single: () => Promise.resolve({ data: { id: "order-1", number: "DZ-1001", status: "new" }, error: null }),
              }),
            }),
            delete: () => ({ eq: () => { deletedOrder = true; return Promise.resolve({}); } }),
          };
        }
        if (table === "products") {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [{ id: "p1", name: "ساعة", sku: "SKU-1", cost: 3000 }] }),
            }),
          };
        }
        if (table === "order_items") {
          return {
            insert: (rows: any) => {
              insertedItems.push(...(Array.isArray(rows) ? rows : [rows]));
              return Promise.resolve({ error: null });
            },
          };
        }
        if (table === "order_events") {
          return {
            insert: (row: any) => {
              insertedEvents.push(row);
              return Promise.resolve({ error: null });
            },
          };
        }
        if (table === "intake_logs") {
          return { insert: () => Promise.resolve({}) };
        }
        return { select: () => ({ eq: () => Promise.resolve({ data: [] }) }) };
      },
    };

    const order = {
      customer_name: "أحمد",
      phone: "0551234567",
      wilaya: "Alger",
      delivery_type: "home" as const,
      delivery_price: 500,
      total: 5000,
      items: [{ name: "ساعة", sku: "SKU-1", quantity: 1, price: 4500 }],
    };

    const result = await createOrder(fakeClient, "store-1", order, "api", "ext-1", {});
    expect(result.order_id).toBe("order-1");
    expect(insertedItems.length).toBe(1);
    expect(insertedItems[0].store_id).toBe("store-1");
    expect(insertedItems[0]).not.toHaveProperty("sku");
    expect(insertedItems[0].cost).toBe(3000);
    expect(insertedEvents.length).toBe(1);
    expect(insertedEvents[0]).not.toHaveProperty("payload");
    expect(insertedEvents[0].to_status).toBe("new");
    expect(insertedEvents[0].note).toContain("source: api");
    expect(deletedOrder).toBe(false);
  });
});
