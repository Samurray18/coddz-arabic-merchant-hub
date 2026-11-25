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
  const { user, onboardingCompleted } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  useEffect(() => {
    if (user) navigate({ to: onboardingCompleted ? "/dashboard" : "/onboarding" });
  }, [user, onboardingCompleted, navigate]);

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
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
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
    setLoading(false);
    navigate({ to: completed ? "/dashboard" : "/onboarding" });
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
          <Button className="w-full" onClick={handleSignIn} disabled={loading}>
            {loading ? "..." : t.auth.signInBtn}
          </Button>
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
            <span className="material-symbols-outlined me-2 text-[18px]">login</span>
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