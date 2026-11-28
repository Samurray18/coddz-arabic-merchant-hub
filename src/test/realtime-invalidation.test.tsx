import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext, type AuthContextValue } from "@/lib/auth-context";

const handlers: Record<string, (payload: any) => void> = {};

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}));

vi.mock("@/integrations/supabase/client", () => {
  const channel: any = {
    on: (_type: string, filter: any, handler: (payload: any) => void) => {
      handlers[`${filter.event}-${filter.table}`] = handler;
      return channel;
    },
    subscribe: (onStatus: (status: string) => void) => {
      onStatus("SUBSCRIBED");
      return channel;
    },
  };
  return {
    supabase: {
      channel: () => channel,
      removeChannel: () => Promise.resolve({ error: null }),
    },
  };
});

import { RealtimeProvider } from "@/components/realtime-provider";

function makeAuth(): AuthContextValue {
  return {
    user: { id: "u1", email: "merchant@example.com" } as any,
    session: null,
    loading: false,
    storeLoaded: true,
    storeId: "s1",
    storeName: "Test Store",
    storeWilaya: "16 - Alger",
    onboardingCompleted: true,
    onboardingStep: 5,
    signOut: async () => {},
    refreshStore: async () => {},
  };
}

describe("RealtimeProvider customer invalidation", () => {
  beforeEach(() => {
    for (const key of Object.keys(handlers)) delete handlers[key];
  });

  it("invalidates the customers query on an order event, at most once per 2 seconds", async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidate = vi.spyOn(qc, "invalidateQueries");

    render(
      <QueryClientProvider client={qc}>
        <AuthContext.Provider value={makeAuth()}>
          <RealtimeProvider>
            <div>connected</div>
          </RealtimeProvider>
        </AuthContext.Provider>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(handlers["INSERT-orders"]).toBeDefined());
    expect(handlers["UPDATE-orders"]).toBeDefined();
    expect(handlers["INSERT-order_events"]).toBeDefined();

    handlers["INSERT-orders"]!({ new: { id: "o1", store_id: "s1" } });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["customers", "s1"] });

    handlers["UPDATE-orders"]!({ new: { id: "o1", store_id: "s1" } });
    handlers["INSERT-order_events"]!({ new: { id: "e1", order_id: "o1", store_id: "s1" } });
    const customerCalls = invalidate.mock.calls.filter(
      (call) => JSON.stringify(call[0]?.queryKey) === JSON.stringify(["customers", "s1"]),
    );
    expect(customerCalls).toHaveLength(1);

    // Orders and related queries are still refreshed for every event.
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["orders", "s1"] });
  });
});
