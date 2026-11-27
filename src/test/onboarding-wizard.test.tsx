import { describe, it, expect, vi } from "vitest";
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
    auth: { updateUser: () => Promise.resolve({ error: null }), getUser: () => Promise.resolve({ data: { user: { id: "u1" } } }) },
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
    storeName: "متجري",
    storeWilaya: null,
    onboardingCompleted: false,
    onboardingStep: 0,
    signOut: async () => {},
    refreshStore: async () => {},
    ...overrides,
  };
}

function renderWizard(auth: AuthContextValue) {
  return render(
    <LanguageProvider>
      <AuthContext.Provider value={auth}>
        <OnboardingWizard />
      </AuthContext.Provider>
    </LanguageProvider>,
  );
}

function nextButton() {
  return screen.getByRole("button", { name: /التالي/ });
}

describe("OnboardingWizard step flows", () => {
  it("first store-info step requires a store name and explains why", async () => {
    renderWizard(makeAuth({ loading: false, storeLoaded: true, storeName: "متجري", storeWilaya: null, onboardingStep: 0 }));

    // 6 steps in play (store setup adds the store-info step)
    await waitFor(() => expect(screen.getByText("اسم المتجر")).toBeInTheDocument());
    expect(screen.getByText("6")).toBeInTheDocument();

    fireEvent.click(nextButton());

    // validation error surfaced, wizard stays on the store-info step
    expect(await screen.findByText("اسم المتجر مطلوب")).toBeInTheDocument();
    expect(screen.getByText("اسم المتجر")).toBeInTheDocument();
  });

  it("requires wilaya selection before saving store info", async () => {
    renderWizard(makeAuth({ loading: false, storeLoaded: true, storeName: "متجري", storeWilaya: null, onboardingStep: 0 }));

    await waitFor(() => expect(screen.getByText("اسم المتجر")).toBeInTheDocument());

    const nameInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "متجر جديد" } });

    fireEvent.click(nextButton());

    expect(await screen.findByText("يرجى اختيار الولاية")).toBeInTheDocument();
  });

  it("saves store info and advances to the phone / business type step", async () => {
    renderWizard(makeAuth({ loading: false, storeLoaded: true, storeName: "متجري", storeWilaya: null, onboardingStep: 0 }));

    await waitFor(() => expect(screen.getByText("اسم المتجر")).toBeInTheDocument());

    const nameInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "متجر تجريبي" } });

    const wilayaInput = screen.getByPlaceholderText("ابحث عن ولاية...");
    fireEvent.focus(wilayaInput);
    const algiers = await screen.findByText("16 - Alger");
    fireEvent.click(algiers);

    fireEvent.click(nextButton());

    // after saving store info the next step is phone + business type
    await waitFor(() => expect(screen.getByText("رقم الهاتف (WhatsApp)")).toBeInTheDocument());
    expect(screen.getByText("نوع النشاط")).toBeInTheDocument();
  });
});
