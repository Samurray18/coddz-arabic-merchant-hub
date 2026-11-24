import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/require-auth";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export const Route = createFileRoute("/onboarding")({
  component: () => (
    <RequireAuth>
      <OnboardingPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Onboarding — COD YOU" }] }),
});

function OnboardingPage() {
  const { onboardingCompleted } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (onboardingCompleted) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [onboardingCompleted, navigate]);

  if (onboardingCompleted) return null;

  return <OnboardingWizard />;
}
