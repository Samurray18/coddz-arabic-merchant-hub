import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext, type AuthContextValue } from "@/lib/auth-context";
import { LanguageProvider } from "@/hooks/use-language";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ children, to, activeProps: _activeProps, ...rest }: any) => (
      <a href={typeof to === "string" ? to : "/"} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock("@/integrations/supabase/client", () => {
  const chain: any = {
    select: () => chain,
    eq: () => chain,
    order: () => chain,
    range: () => Promise.resolve({ data: [], error: null }),
    limit: () => chain,
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return {
    supabase: {
      from: () => chain,
      rpc: () =>
        Promise.resolve({
          data: [
            {
              total_orders: 10,
              revenue: 45000,
              net_profit: 12000,
              orders_by_status: { new: 2, confirmed: 1, shipped: 2, delivered: 4, returned: 1, canceled: 0 },
            },
          ],
          error: null,
        }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      },
    },
  };
});

import { Route as DashboardRoute } from "@/routes/dashboard";
import { Route as AuthRoute } from "@/routes/auth";
import { SignupWizard } from "@/components/signup-wizard";

function makeAuth(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
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
    ...overrides,
  };
}

function renderWithProviders(ui: React.ReactNode, auth: AuthContextValue) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <AuthContext.Provider value={auth}>{ui}</AuthContext.Provider>
      </LanguageProvider>
    </QueryClientProvider>,
  );
}

describe("Auth redirect and dashboard render smoke tests", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("renders /dashboard for a signed-in merchant without throwing", async () => {
    const DashboardComponent = DashboardRoute.options.component!;
    const { container } = renderWithProviders(<DashboardComponent />, makeAuth());
    await waitFor(() => {
      expect(container.textContent).toContain("45");
    });
  });

  it("redirects signed-in onboarded user from /auth directly to /dashboard once store loads", async () => {
    const AuthComponent = AuthRoute.options.component!;
    renderWithProviders(<AuthComponent />, makeAuth({ storeLoaded: true, onboardingCompleted: true }));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: "/dashboard", replace: true });
    });
  });

  it("waits for storeLoaded before redirecting from /auth", () => {
    const AuthComponent = AuthRoute.options.component!;
    renderWithProviders(<AuthComponent />, makeAuth({ storeLoaded: false, onboardingCompleted: false }));
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirects signed-in onboarded user from /signup directly to /dashboard once store loads", async () => {
    renderWithProviders(<SignupWizard />, makeAuth({ storeLoaded: true, onboardingCompleted: true }));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: "/dashboard", replace: true });
    });
  });
});