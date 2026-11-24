import { BRAND_NAME } from "@/lib/coddz";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: `Reset password — ${BRAND_NAME}` }] }),
});

function ResetPasswordPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // If already in recovery session
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
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            {t.auth.recoveryMissing}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline">{t.auth.resetTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t.auth.newPassword}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          {message && <div className="text-sm text-primary">{message}</div>}
          <Button className="w-full" onClick={handleUpdate} disabled={loading}>
            {t.auth.updatePasswordBtn}
          </Button>
          <button className="w-full text-xs text-muted-foreground underline" onClick={() => navigate({ to: "/auth" })}>
            {t.auth.backToSignIn}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}