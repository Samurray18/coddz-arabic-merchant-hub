import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    storeId: "s1",
    storeName: "متجري",
    storeWilaya: null,
    onboardingCompleted: false,
    onboardingStep: 0,
    signOut: async () => {},
    refreshStore: async () => {},
    ...overrides,
  };
}

describe("OnboardingWizard store setup step", () => {
  it("shows store info step first and advances to phone/business type with 6 steps", async () => {
    render(
      <LanguageProvider>
        <AuthContext.Provider value={makeAuth()}>
          <OnboardingWizard />
        </AuthContext.Provider>
      </LanguageProvider>,
    );

    // progress shows 6 steps
    expect(screen.getAllByText(/[1-6]/).length).toBeGreaterThan(0);
    // store name input present (default value "متجري")
    const nameInput = screen.getByDisplayValue("متجري");
    expect(nameInput).toBeInTheDocument();

    // fill store name
    fireEvent.change(nameInput, { target: { value: "متجر تجريبي" } });

    // select a wilaya
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

    // progress still 6 steps: check "6" appears in progress
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
