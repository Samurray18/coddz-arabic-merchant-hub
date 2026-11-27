import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { BRAND_NAME, BRAND_NAME_AR } from "@/lib/coddz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: `Sign in — ${BRAND_NAME}` }] }),
});

function AuthPage() {
  const { t, lang } = useLanguage();
  const { user, onboardingCompleted, storeLoaded } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  useEffect(() => {
    if (user && storeLoaded) {
      navigate({ to: onboardingCompleted ? "/dashboard" : "/onboarding", replace: true });
    }
  }, [user, storeLoaded, onboardingCompleted, navigate]);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("invalid")) setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        else if (msg.includes("email not confirmed")) setError("يرجى تأكيد بريدك الإلكتروني أولاً");
        else if (msg.includes("too many")) setError("محاولات كثيرة، حاول لاحقًا");
        else setError(error.message);
        return;
      }
      // refresh store to get onboarding status
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      let completed = false;
      if (userId) {
        const { data: store } = await supabase
          .from("stores")
          .select("onboarding_completed")
          .eq("owner_id", userId)
          .limit(1)
          .maybeSingle();
        completed = (store as any)?.onboarding_completed ?? false;
      }
      navigate({ to: completed ? "/dashboard" : "/onboarding", replace: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      setError(msg || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">monitoring</span>
            </div>
            <span className="font-display text-title-lg text-on-surface" style={{ fontWeight: 800 }}>{brand}</span>
          </div>
          <CardTitle className="font-headline text-headline-md text-on-surface">{t.auth.signInTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSignIn();
            }}
          >
            <div>
              <Label>{t.auth.email}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>{t.auth.password}</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-error bg-error-container/40 rounded-md p-2">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : t.auth.signInBtn}
            </Button>
          </form>
          <div className="relative flex items-center gap-2">
            <span className="h-px flex-1 bg-outline-variant" />
            <span className="font-body text-label-sm text-on-surface-variant">أو</span>
            <span className="h-px flex-1 bg-outline-variant" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            <svg className="me-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? "..." : t.auth.continueWithGoogle}
          </Button>
          <div className="flex items-center justify-between text-xs">
            <Link to="/reset-password" className="text-on-surface-variant underline">
              {t.auth.forgotLink}
            </Link>
            <Link to="/signup" className="text-primary underline">
              {t.auth.noAccount}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}