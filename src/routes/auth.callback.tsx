import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
  head: () => ({ meta: [{ title: "Auth — COD YOU" }] }),
});

function AuthCallback() {
  const navigate = useNavigate();
  const { onboardingCompleted, loading, user } = useAuth();
  const [status, setStatus] = useState("جارٍ تسجيل الدخول...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          setStatus("فشل تسجيل الدخول");
          setTimeout(() => navigate({ to: "/auth", replace: true }), 1500);
          return;
        }
        const userId = data.session?.user?.id;
        if (userId) {
          supabase
            .from("stores")
            .select("onboarding_completed")
            .eq("owner_id", userId)
            .limit(1)
            .maybeSingle()
            .then(({ data: store }) => {
              navigate(
                { to: (store as any)?.onboarding_completed ? "/dashboard" : "/onboarding", replace: true },
              );
            });
        } else {
          navigate({ to: "/dashboard", replace: true });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fallback for implicit/hash flow or no code
  useEffect(() => {
    if (!loading && user && !new URLSearchParams(window.location.search).get("code")) {
      navigate({ to: onboardingCompleted ? "/dashboard" : "/onboarding", replace: true });
    }
  }, [loading, user, onboardingCompleted, navigate]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-gutter-md">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        <span className="font-body text-body-md text-on-surface-variant">{status}</span>
      </div>
    </div>
  );
}
