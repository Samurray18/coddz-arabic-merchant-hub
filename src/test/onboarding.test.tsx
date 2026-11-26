import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthContext } from "@/lib/auth-context";
import type { AuthContextValue } from "@/lib/auth-context";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => {
  const supabase: any = {
    from: () => ({
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => Promise.resolve({ error: null }),
      upsert: () => Promise.resolve({ error: null }),
    }),
    auth: { updateUser: () => Promise.resolve({ error: null }) },
    storage: { from: () => ({ upload: () => Promise.resolve({ error: null }), getPublicUrl: () => ({ data: { publicUrl: "" } }) }) },
  };
  return { supabase };
});

import { OnboardingWizard } from "@/components/onboarding-wizard";

function makeAuth(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: { id: "u1", email: "a@b.com" } as any,
    session: null,
    loading: false,
    storeLoaded: true,
    storeId: "s1",
    storeName: "My Shop",
    storeWilaya: "Alger",
    onboardingCompleted: false,
    onboardingStep: 0,
    signOut: async () => {},
    refreshStore: async () => {},
    ...overrides,
  };
}

describe("OnboardingWizard store-loaded timing", () => {
  it("a. loading false but storeLoaded false -> spinner, nothing decided", () => {
    const auth = makeAuth({ loading: false, storeLoaded: false, storeName: "متجري", storeWilaya: null });
    const { container } = render(
      <LanguageProvider>
        <AuthContext.Provider value={auth}>
          <OnboardingWizard />
        </AuthContext.Provider>
      </LanguageProvider>,
    );
    expect(container.textContent).toContain("جارٍ التحميل");
    expect(screen.queryByText("رقم الهاتف (WhatsApp)")).not.toBeInTheDocument();
    expect(screen.queryByText("اسم المتجر")).not.toBeInTheDocument();
  });

  it("b. store loads as 'My Shop' with wilaya 'Alger' -> 5 steps, phone/business type first", async () => {
    const auth = makeAuth({ loading: false, storeLoaded: true, storeName: "My Shop", storeWilaya: "Alger" });
    render(
      <LanguageProvider>
        <AuthContext.Provider value={auth}>
          <OnboardingWizard />
        </AuthContext.Provider>
      </LanguageProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("رقم الهاتف (WhatsApp)")).toBeInTheDocument();
    });
    // 5 steps: "5" present, "6" not
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  it("c. store loads as 'متجري' with no wilaya -> 6 steps, store-info first, name field empty", async () => {
    const auth = makeAuth({ loading: false, storeLoaded: true, storeName: "متجري", storeWilaya: null });
    render(
      <LanguageProvider>
        <AuthContext.Provider value={auth}>
          <OnboardingWizard />
        </AuthContext.Provider>
      </LanguageProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("اسم المتجر")).toBeInTheDocument();
    });
    const textboxes = screen.getAllByRole("textbox");
    expect((textboxes[0] as HTMLInputElement).value).toBe("");
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("d. after step 1 saves and context updates to real name/wilaya, still 6 steps and next is phone/business type", async () => {
    const auth = makeAuth({ loading: false, storeLoaded: true, storeName: "متجري", storeWilaya: null });
    const { rerender } = render(
      <LanguageProvider>
        <AuthContext.Provider value={auth}>
          <OnboardingWizard />
        </AuthContext.Provider>
      </LanguageProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("اسم المتجر")).toBeInTheDocument();
    });

    // fill store name
    const nameInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "متجر تجريبي" } });

    // select wilaya
    const wilayaInput = screen.getByPlaceholderText("ابحث عن ولاية...");
    fireEvent.focus(wilayaInput);
    const algiers = await screen.findByText("16 - Alger");
    fireEvent.click(algiers);

    // click next
    const nextBtn = screen.getByRole("button", { name: /التالي/ });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText("رقم الهاتف (WhatsApp)")).toBeInTheDocument();
    });

    // progress still 6 steps
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
