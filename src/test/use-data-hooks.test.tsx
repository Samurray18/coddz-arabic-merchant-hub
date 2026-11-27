import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthContext } from "@/lib/auth-context";
import type { AuthContextValue } from "@/lib/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fakeTables: Record<string, any[]> = {};
const shipmentInserts: any[] = [];

vi.mock("@/integrations/supabase/client", () => {
  const supabase: any = {
    from: (table: string) => {
      const rows: any[] = fakeTables[table] ?? [];
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        order: () => chain,
        range: (from: number, to: number) => Promise.resolve({ data: rows.slice(from, to + 1), error: null }),
        limit: (n: number) => Promise.resolve({ data: rows.slice(0, n), error: null }),
        maybeSingle: () => Promise.resolve({ data: table === "user_roles" ? { role: "owner" } : null, error: null }),
        single: () => Promise.resolve({ data: { id: "created-1" }, error: null }),
        insert: (row: any) => {
          shipmentInserts.push(row);
          return { select: () => ({ single: () => Promise.resolve({ data: { id: "created-1" }, error: null }) }) };
        },
        update: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
        delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
      };
      chain.then = (res: any, rej: any) => Promise.resolve({ data: rows, error: null }).then(res, rej);
      return chain;
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
    auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
  };
  return { supabase };
});

import { useCustomers, useShipments, useCreateShipment } from "@/hooks/use-data";

function makeAuth(): AuthContextValue {
  return {
    user: { id: "u1", email: "a@b.com" } as any,
    session: null,
    loading: false,
    storeLoaded: true,
    storeId: "s1",
    storeName: "My Shop",
    storeWilaya: "Alger",
    onboardingCompleted: true,
    onboardingStep: 5,
    signOut: async () => {},
    refreshStore: async () => {},
  };
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={qc}>
      <AuthContext.Provider value={makeAuth()}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
  return wrapper;
}

describe("useCustomers aggregation", () => {
  beforeEach(() => {
    fakeTables["orders"] = [];
    fakeTables["blacklist"] = [];
    shipmentInserts.length = 0;
  });

  it("merges orders per phone and counts delivered/returned", async () => {
    fakeTables["orders"] = [
      { id: "o1", phone: "0551234567", customer_name: "أحمد", wilaya: "16 - Alger", total: 5000, status: "delivered", created_at: "2026-01-02T10:00:00Z" },
      { id: "o2", phone: "0551234567", customer_name: "", wilaya: "", total: 3000, status: "new", created_at: "2026-01-01T10:00:00Z" },
    ];
    fakeTables["blacklist"] = [];

    const { result } = renderHook(() => useCustomers(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    const agg = result.current.data![0]!;
    expect(agg.orders).toBe(2);
    expect(agg.total).toBe(8000);
    expect(agg.delivered).toBe(1);
    expect(agg.returned).toBe(0);
    expect(agg.blacklisted).toBe(false);
    expect(agg.lastDate).toBe("2026-01-02T10:00:00Z");
  });

  it("marks blacklisted phones and aggregates returned orders", async () => {
    fakeTables["orders"] = [
      { id: "o1", phone: "0559998888", customer_name: "سارة", wilaya: "31 - Oran", total: 12000, status: "returned", created_at: "2026-02-01T10:00:00Z" },
    ];
    fakeTables["blacklist"] = [{ phone: "0559998888" }];

    const { result } = renderHook(() => useCustomers(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0]!.blacklisted).toBe(true);
    expect(result.current.data![0]!.returned).toBe(1);
    expect(result.current.data![0]!.total).toBe(12000);
  });
});

describe("useShipments", () => {
  it("returns the shipment list for the store", async () => {
    fakeTables["shipments"] = [
      { id: "sh1", order_id: "o1", carrier: "Yalidine", tracking_number: "TRK123", cod_amount: 500, status: "pending", created_at: "2026-01-01T10:00:00Z" },
    ];

    const { result } = renderHook(() => useShipments(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0]!.tracking_number).toBe("TRK123");
    expect(result.current.data![0]!.cod_amount).toBe(500);
  });
});

describe("useCreateShipment", () => {
  it("inserts the shipment with pending status and invalidates the list", async () => {
    const { result } = renderHook(() => useCreateShipment(), { wrapper: makeWrapper() });
    await act(async () => {
      result.current.mutate({ orderId: "o1", carrier: "Yalidine", trackingNumber: "TRK123", codAmount: 500 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(shipmentInserts).toHaveLength(1);
    expect(shipmentInserts[0]).toMatchObject({
      store_id: "s1",
      order_id: "o1",
      carrier: "Yalidine",
      tracking_number: "TRK123",
      cod_amount: 500,
      status: "pending",
    });
  });
});
