import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext, type AuthContextValue } from "@/lib/auth-context";
import { LanguageProvider } from "@/hooks/use-language";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to, activeProps: _activeProps, ...rest }: any) => (
      <a href={typeof to === "string" ? to : "/"} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}));

vi.mock("@/integrations/supabase/client", () => {
  const orderRow = {
    id: "o1",
    store_id: "s1",
    payload: {
      number: "42",
      name: "Ahmed",
      phone: "0551234567",
      product: "Watch",
      date: "2026-01-02T10:00:00Z",
    },
    created_at: "2026-01-02T10:00:00Z",
    customer_name: "Ahmed",
    phone: "0551234567",
    number: "42",
    total: 12345,
    amount: 12345,
    status: "new",
  };
  const eventRow = {
    id: "e1",
    order_id: "o1",
    type: "note",
    note: "Checked",
    created_at: "2026-01-03T12:00:00Z",
    from_status: null,
    to_status: null,
    user_id: null,
  };
  const tables: Record<string, any[]> = {
    orders: [orderRow],
    order_events: [eventRow],
    products: [],
    profiles: [],
  };
  const supabase: any = {
    from: (table: string) => {
      const rows: any[] = tables[table] ?? [];
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        in: () => chain,
        order: () => chain,
        range: () => Promise.resolve({ data: rows, error: null }),
        limit: () => Promise.resolve({ data: rows, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        insert: () => chain,
        update: () => chain,
        delete: () => chain,
        then: (resolve: any, reject: any) => Promise.resolve({ data: rows, error: null }).then(resolve, reject),
      };
      return chain;
    },
    rpc: () =>
      Promise.resolve({
        data: [{ total_orders: 1, revenue: 12345, net_profit: 8000, orders_by_status: { new: 1 } }],
        error: null,
      }),
    auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
  };
  return { supabase };
});

import { Route as OrdersRoute } from "@/routes/orders";
import { Route as DashboardRoute } from "@/routes/dashboard";

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

function renderPage(Page: React.ComponentType) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <AuthContext.Provider value={makeAuth()}>
          <Page />
        </AuthContext.Provider>
      </LanguageProvider>
    </QueryClientProvider>,
  );
}

describe("Localized display components in order surfaces", () => {
  beforeEach(() => {
    window.localStorage.setItem("coddz_lang", "ar");
  });
  afterEach(() => {
    window.localStorage.removeItem("coddz_lang");
  });

  it("renders the order drawer amount and event date as bdi elements", async () => {
    const Page = OrdersRoute.options.component!;
    renderPage(Page);

    const viewButton = await screen.findByRole("button", { name: "عرض" });
    fireEvent.click(viewButton);

    const drawer = await screen.findByRole("dialog");
    const amount = Array.from(drawer.querySelectorAll("bdi")).find((el) => /345/.test(el.textContent ?? ""));
    expect(amount?.tagName).toBe("BDI");
    expect(amount?.getAttribute("dir")).toBe("rtl");
    expect(amount?.textContent).toContain("دج");

    let eventDate: HTMLElement | undefined;
    await waitFor(() => {
      eventDate = Array.from(drawer.querySelectorAll("bdi")).find((el) => /2026/.test(el.textContent ?? ""));
      expect(eventDate).toBeDefined();
    });
    expect(eventDate?.tagName).toBe("BDI");
    expect(eventDate?.textContent).toContain("2026");
  });

  it("renders dashboard pending order amounts as bdi elements", async () => {
    const Page = DashboardRoute.options.component!;
    renderPage(Page);

    await waitFor(() => expect(screen.getAllByText(/345/).length).toBeGreaterThan(0));
    const amount = screen.getAllByText(/345/).map((el) => el.closest("bdi")).find(Boolean);
    expect(amount?.tagName).toBe("BDI");
    expect(amount?.getAttribute("dir")).toBe("rtl");
    expect(amount?.textContent).toContain("دج");
  });
});
