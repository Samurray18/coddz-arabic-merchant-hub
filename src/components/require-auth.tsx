import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-gutter-md">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
          <span className="font-body text-body-md text-on-surface-variant">جارٍ التحميل...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
