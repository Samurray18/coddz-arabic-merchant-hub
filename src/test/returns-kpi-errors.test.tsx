import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthContext } from "@/lib/auth-context";
import type { AuthContextValue } from "@/lib/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { computeDashboardKpis } from "@/lib/kpi";

vi.mock("@/integrations/supabase/client", () => {
  const supabase: any = {
    from: () => ({
      update: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
      select: () => ({ eq: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { status: "shipped", payload: {} }, error: null }) }) }) }),
      insert: () => Promise.resolve({ error: null }),
    }),
    auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
  };
  return { supabase };
});

import { useRecordReturn } from "@/hooks/use-data";

function makeAuth(): AuthContextValue {
  return {
    user: { id: "u1", email: "a@b.com" } as any,
    session: null,
    loading: false,
    storeLoaded: true,
    storeId: "s1",
    storeName: "Shop",
    storeWilaya: "Alger",
    onboardingCompleted: true,
    onboardingStep: 5,
    signOut: async () => {},
    refreshStore: async () => {},
  };
}

describe("useRecordReturn", () => {
  it("restock true sends return_restock: true", async () => {
    const captured: any[] = [];
    const supabaseMod = await import("@/integrations/supabase/client");
    const supabase: any = supabaseMod.supabase;
    const origFrom = supabase.from.bind(supabase);
    supabase.from = (table: string) => {
      if (table === "orders") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { status: "shipped", payload: {} }, error: null }) }) }) }),
          update: (patch: any) => {
            captured.push(patch);
            return { eq: () => ({ eq: () => Promise.resolve({ error: null }) }) };
          },
        };
      }
      return { insert: () => Promise.resolve({ error: null }) };
    };

    const qc = new QueryClient();
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={qc}>
        <AuthContext.Provider value={makeAuth()}>{children}</AuthContext.Provider>
      </QueryClientProvider>
    );
    const { result } = renderHook(() => useRecordReturn(), { wrapper });
    await act(async () => {
      result.current.mutate({ id: "o1", reason: "damaged", restock: true });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(captured[0].return_restock).toBe(true);
    expect(captured[0].status).toBe("returned");
  });

  it("restock false sends return_restock: false", async () => {
    const captured: any[] = [];
    const supabaseMod = await import("@/integrations/supabase/client");
    const supabase: any = supabaseMod.supabase;
    supabase.from = (table: string) => {
      if (table === "orders") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { status: "new", payload: {} }, error: null }) }) }) }),
          update: (patch: any) => {
            captured.push(patch);
            return { eq: () => ({ eq: () => Promise.resolve({ error: null }) }) };
          },
        };
      }
      return { insert: () => Promise.resolve({ error: null }) };
    };

    const qc = new QueryClient();
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={qc}>
        <AuthContext.Provider value={makeAuth()}>{children}</AuthContext.Provider>
      </QueryClientProvider>
    );
    const { result } = renderHook(() => useRecordReturn(), { wrapper });
    await act(async () => {
      result.current.mutate({ id: "o2", reason: "no restock", restock: false });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(captured[0].return_restock).toBe(false);
  });
});

describe("computeDashboardKpis", () => {
  it("handles more than 50 orders via stats", () => {
    const stats = {
      total_orders: 120,
      revenue: 500000,
      net_profit: 120000,
      orders_by_status: { new: 10, confirmed: 20, shipped: 30, delivered: 50, returned: 5, canceled: 5 },
    };
    const kpis = computeDashboardKpis(stats);
    expect(kpis.totalOrders).toBe(120);
    expect(kpis.deliveryRate).toBe(42); // 50/120 = 41.67 -> 42
    expect(kpis.returnRate).toBe(8); // 10/120 = 8.33 -> 8
    expect(kpis.netProfit).toBe(120000);
  });
});

describe("error handling fake client", () => {
  it("surfaces error from order_items insert", async () => {
    // Test the helper logic: createOrder with fake client returning error on order_items insert
    const { createOrder } = await import("../../supabase/functions/_shared/helpers");
    const inserted: any = {};
    const fakeClient: any = {
      from: (table: string) => {
        if (table === "blacklist") return { select: () => ({ eq: () => ({ eq: () => ({ limit: () => Promise.resolve({ data: [] }) }) }) }) };
        if (table === "orders") {
          return {
            select: () => ({ eq: () => ({ eq: () => ({ eq: () => ({ limit: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }) }) }) }) }),
            insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "o1", number: "DZ-1", status: "new" }, error: null }) }) }),
            delete: () => ({ eq: () => ({ eq: () => Promise.resolve({}) }) }),
          };
        }
        if (table === "products") return { select: () => ({ eq: () => Promise.resolve({ data: [] }) }) };
        if (table === "order_items") return { insert: () => Promise.resolve({ error: { message: "insert failed" } }) };
        if (table === "order_events") return { insert: () => Promise.resolve({ error: null }) };
        if (table === "intake_logs") return { insert: () => Promise.resolve({}) };
        return { select: () => ({ eq: () => Promise.resolve({ data: [] }) }) };
      },
    };
    const order = {
      customer_name: "أحمد",
      phone: "0551234567",
      wilaya: "Alger",
      delivery_type: "home" as const,
      delivery_price: 0,
      total: 100,
      items: [{ name: "item", quantity: 1, price: 100 }],
    };
    await expect(createOrder(fakeClient, "s1", order, "manual", null, {})).rejects.toBeTruthy();
  });
});
