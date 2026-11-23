import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Auth — CODDZ" }] }),
});

function AuthPage() {
  const { t } = useLanguage();
  const { isDemo } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, store_name: storeName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage(t.auth.checkEmail);
  };

  const handleForgot = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage(t.auth.resetSent);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline">{mode === "signin" ? t.auth.signInTitle : t.auth.signUpTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDemo && (
            <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-900">
              {t.nav.demoMode}
            </div>
          )}
          {mode === "signup" && (
            <>
              <div>
                <Label>{t.auth.displayName}</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <Label>{t.auth.storeName}</Label>
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
            </>
          )}
          <div>
            <Label>{t.auth.email}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>{t.auth.password}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          {message && <div className="text-sm text-primary">{message}</div>}
          {mode === "signin" ? (
            <>
              <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                {t.auth.signInBtn}
              </Button>
              <button className="text-xs text-muted-foreground underline" onClick={handleForgot}>
                {t.auth.forgotLink}
              </button>
            </>
          ) : (
            <Button className="w-full" onClick={handleSignUp} disabled={loading}>
              {t.auth.signUpBtn}
            </Button>
          )}
          <button
            className="w-full text-xs text-muted-foreground underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? t.auth.noAccount : t.auth.hasAccount}
          </button>
          {mode === "signin" && (
            <button
              className="w-full text-xs text-muted-foreground underline"
              onClick={() => navigate({ to: "/reset-password" })}
            >
              {t.auth.forgotTitle}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}