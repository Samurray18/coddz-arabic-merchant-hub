import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { BRAND_NAME, BRAND_NAME_AR } from "@/lib/coddz";
import { BrandMark } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: `Reset password — ${BRAND_NAME}` }] }),
});

function ResetPasswordPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: d }) => {
      if (d.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage(t.auth.passwordUpdated);
    setTimeout(() => navigate({ to: "/auth" }), 1200);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center text-sm text-on-surface-variant">
            {t.auth.recoveryMissing}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BrandMark size={40} />
            <span className="font-display text-title-lg text-on-surface" style={{ fontWeight: 800 }}>{brand}</span>
          </div>
          <CardTitle className="font-headline text-headline-md text-on-surface">{t.auth.resetTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t.auth.newPassword}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-error bg-error-container/40 rounded-md p-2">{error}</div>}
          {message && <div className="text-sm text-primary">{message}</div>}
          <Button className="w-full" onClick={handleUpdate} disabled={loading}>
            {loading ? "..." : t.auth.updatePasswordBtn}
          </Button>
          <Link to="/auth" className="block text-center text-xs text-on-surface-variant underline">
            {t.auth.backToSignIn}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}