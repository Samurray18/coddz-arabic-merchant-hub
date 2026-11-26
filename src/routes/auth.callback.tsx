import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
  head: () => ({ meta: [{ title: "Auth — COD YOU" }] }),
});

function AuthCallback() {
  const navigate = useNavigate();
  const { user, onboardingCompleted, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timedOut) return;
    if (!loading && user) {
      navigate({ to: onboardingCompleted ? "/dashboard" : "/onboarding", replace: true });
    }
  }, [loading, user, onboardingCompleted, timedOut, navigate]);

  if (timedOut && !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-gutter-md text-center">
          <span className="material-symbols-outlined text-[48px] text-error">error</span>
          <h1 className="font-headline text-headline-md text-on-surface">فشل تسجيل الدخول</h1>
          <p className="font-body text-body-md text-on-surface-variant">لم يتم تأكيد الجلسة. حاول مرة أخرى.</p>
          <Link to="/auth" className="rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-gutter-md">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
        <span className="font-body text-body-md text-on-surface-variant">جارٍ تسجيل الدخول...</span>
      </div>
    </div>
  );
}
