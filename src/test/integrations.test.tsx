import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/lib/auth-context";
import type { AuthContextValue } from "@/lib/auth-context";
import { LanguageProvider } from "@/hooks/use-language";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ children, to, ...rest }: any) => (
      <a href={typeof to === "string" ? to : "/"} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock("@/components/require-auth", () => ({
  RequireAuth: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/components/dashboard-shell", () => ({
  DashboardShell: ({ children }: any) => <div>{children}</div>,
}));

const fakeTables: Record<string, any[]> = {};

vi.mock("@/integrations/supabase/client", () => {
  const supabase: any = {
    from: (table: string) => {
      const rows: any[] = fakeTables[table] ?? [];
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        order: () => chain,
        range: (f: number, t: number) => Promise.resolve({ data: rows.slice(f, t + 1), error: null }),
        limit: (n: number) => Promise.resolve({ data: rows.slice(0, n), error: null }),
        maybeSingle: () => Promise.resolve({ data: table === "user_roles" ? { role: "owner" } : null, error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
        delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
      };
      chain.then = (res: any, rej: any) => Promise.resolve({ data: rows, error: null }).then(res, rej);
      return chain;
    },
    rpc: () => Promise.resolve({ data: [{ api_key: "ck_test_123" }], error: null }),
    auth: { getUser: () => Promise.resolve({ data: { user: { id: "u1" } } }) },
  };
  return { supabase };
});

import { Route as IntegrationsRoute } from "@/routes/integrations";

function makeAuth(): AuthContextValue {
  return {
    user: { id: "u1", email: "merchant@example.com" } as any,
    session: null,
    loading: false,
    storeLoaded: true,
    storeId: "store-1",
    storeName: "Test Store",
    storeWilaya: "16 - Alger",
    onboardingCompleted: true,
    onboardingStep: 5,
    signOut: async () => {},
    refreshStore: async () => {},
  };
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Page = IntegrationsRoute.options.component!;
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

describe("Integrations page tabs", () => {
  it("renders the manager view with API tab content by default", async () => {
    renderPage();

    expect(await screen.findByText("الربط")).toBeInTheDocument();
    expect(screen.getByText("مفاتيح API")).toBeInTheDocument();
    expect(screen.getByText("نقطة النهاية (Endpoint)")).toBeInTheDocument();
    expect(await screen.findByText("لا توجد مفاتيح")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "API" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shopify" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "WooCommerce" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "السجلات" })).toBeInTheDocument();
  });

  it("switches to the Shopify webhook tab", async () => {
    renderPage();

    await screen.findByText("لا توجد مفاتيح");

    fireEvent.click(screen.getByRole("button", { name: "Shopify" }));

    expect(await screen.findByText("عنوان الـ Webhook")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("الصق السر هنا")).toBeInTheDocument();
    expect(screen.getByText(/ingest-shopify/)).toBeInTheDocument();
  });

  it("switches to the logs tab", async () => {
    renderPage();

    await screen.findByText("لا توجد مفاتيح");

    fireEvent.click(screen.getByRole("button", { name: "السجلات" }));

    expect(await screen.findByText("سجلات الاستقبال")).toBeInTheDocument();
    expect(await screen.findByText("لا توجد سجلات")).toBeInTheDocument();
  });

  it("creates an API key from the create modal", async () => {
    renderPage();

    await screen.findByText("لا توجد مفاتيح");

    fireEvent.click(screen.getByRole("button", { name: "+ إنشاء مفتاح" }));

    expect(await screen.findByText("إنشاء مفتاح API")).toBeInTheDocument();

    const nameInput = screen.getByLabelText("اسم المفتاح");
    fireEvent.change(nameInput, { target: { value: "prod-key-1" } });

    fireEvent.click(screen.getByRole("button", { name: "إنشاء" }));

    expect(await screen.findByText("ck_test_123")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "إغلاق" }));

    await waitFor(() => expect(screen.queryByText("إنشاء مفتاح API")).not.toBeInTheDocument());
  });
});
