import { BRAND_NAME } from "@/lib/coddz";
import { BrandMark } from "@/components/brand-logo";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { WILAYAS, CARRIER_OPTIONS } from "@/lib/coddz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

const LOGO_EXT: Record<string, string> = {
  yalidine: "png",
  zrexpress: "svg",
  dhd: "png",
  noest: "png",
  maystro: "svg",
  ecotrack: "png",
};

export function SignupWizard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, onboardingCompleted, storeLoaded, refreshStore } = useAuth();

  useEffect(() => {
    if (user && storeLoaded) {
      navigate({ to: onboardingCompleted ? "/dashboard" : "/onboarding", replace: true });
    }
  }, [user, storeLoaded, onboardingCompleted, navigate]);
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [wilayaSearch, setWilayaSearch] = useState("");
  const [showWilayaList, setShowWilayaList] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    storeName: "",
    wilaya: "",
    carriers: [] as string[],
  });

  const filteredWilayas = WILAYAS.filter((w) =>
    `${w.code} ${w.latin} ${w.ar}`.toLowerCase().includes(wilayaSearch.toLowerCase())
  );

  const pwStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const validate = () => {
    setError("");
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email) {
        setError("يرجى ملء جميع الحقول");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError("بريد إلكتروني غير صالح");
        return false;
      }
    }
    if (step === 2) {
      if (form.password.length < 8) {
        setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
        return false;
      }
      if (form.password !== form.confirm) {
        setError("كلمتا المرور غير متطابقتين");
        return false;
      }
    }
    if (step === 3) {
      if (!form.storeName || !form.wilaya) {
        setError("يرجى إدخال اسم المتجر واختيار الولاية");
        return false;
      }
    }
    return true;
  };

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

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const toggleCarrier = (key: string) => {
    setForm((f) => ({
      ...f,
      carriers: f.carriers.includes(key)
        ? f.carriers.filter((c) => c !== key)
        : [...f.carriers, key],
    }));
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: se } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            display_name: `${form.firstName} ${form.lastName}`,
            store_name: form.storeName,
            wilaya: form.wilaya,
            carriers: form.carriers,
          },
        },
      });
      if (se) throw se;
      const user = data.user;
      if (!user) throw new Error("فشل إنشاء الحساب");
      if (!data.session) {
        setDone(true);
        setLoading(false);
        return;
      }
      // update store created by trigger
      const { data: store, error: storeErr } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();
      if (storeErr) throw storeErr;
      if (store) {
        const { error: upErr } = await supabase
          .from("stores")
          .update({ name: form.storeName, wilaya: form.wilaya } as any)
          .eq("id", (store as any).id);
        if (upErr) throw upErr;
        if (form.carriers.length) {
          const { error: insErr } = await (supabase as any)
            .from("store_delivery_companies")
            .insert(form.carriers.map((c) => ({ store_id: (store as any).id, company: c })));
          if (insErr) throw insErr;
        }
      }
      await refreshStore();
      navigate({ to: "/onboarding" });
    } catch (e: any) {
      const msg = e?.message ?? "";
      if (msg.toLowerCase().includes("already")) setError("هذا البريد الإلكتروني مستخدم بالفعل");
      else if (msg.toLowerCase().includes("network")) setError("خطأ في الاتصال بالشبكة");
      else setError(msg || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent-container text-on-accent-container flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="font-headline text-headline-md text-on-surface">تحقق من بريدك الإلكتروني</h2>
            <p className="font-body text-body-md text-on-surface-variant">
              لقد أرسلنا رابط تأكيد إلى {form.email}. يرجى تأكيد حسابك قبل تسجيل الدخول.
            </p>
            <Button onClick={() => navigate({ to: "/auth" })} className="w-full">العودة لتسجيل الدخول</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md lg:max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BrandMark size={40} />
            <span className="font-headline text-title-lg text-on-surface">{BRAND_NAME}</span>
          </div>
          <CardTitle className="font-headline text-headline-md text-on-surface">إنشاء متجرك</CardTitle>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                    n < step
                      ? "bg-primary text-on-primary border-primary"
                      : n === step
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
                  }`}
                >
                  {n < step ? <Check className="w-4 h-4" /> : n}
                </div>
                {n < 4 && <div className={`w-6 h-0.5 ${n < step ? "bg-primary" : "bg-outline-variant"}`} />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
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
              <p className="text-center text-xs text-on-surface-variant">ستكمل بقية المعلومات بعد تسجيل الدخول</p>
              <div className="relative flex items-center gap-2">
                <span className="h-px flex-1 bg-outline-variant" />
                <span className="font-body text-label-sm text-on-surface-variant">أو</span>
                <span className="h-px flex-1 bg-outline-variant" />
              </div>
            </>
          )}
          {error && <div className="text-sm text-error bg-error-container/40 rounded-md p-2">{error}</div>}

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <Label>الاسم</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <Label>اللقب</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <Label>كلمة المرور</Label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-surface-container-low overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(pwStrength(form.password) / 4) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <Label>تأكيد كلمة المرور</Label>
                <Input
                  type={showPw ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <Label>اسم المتجر</Label>
                <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
              </div>
              <div className="relative">
                <Label>الولاية</Label>
                <Input
                  value={form.wilaya ? form.wilaya : wilayaSearch}
                  onChange={(e) => {
                    setWilayaSearch(e.target.value);
                    setForm({ ...form, wilaya: "" });
                    setShowWilayaList(true);
                  }}
                  onFocus={() => setShowWilayaList(true)}
                  placeholder="ابحث عن ولاية..."
                />
                {showWilayaList && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-outline-variant bg-surface-container-lowest shadow-sm">
                    {filteredWilayas.map((w) => (
                      <button
                        key={w.code}
                        type="button"
                        className="block w-full px-3 py-2 text-start text-sm hover:bg-surface-container-low"
                        onClick={() => {
                          setForm({ ...form, wilaya: `${w.code} - ${w.latin}` });
                          setWilayaSearch("");
                          setShowWilayaList(false);
                        }}
                      >
                        {w.code} - {w.latin}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-on-surface-variant">اختر شركات التوصيل (اختياري)</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {CARRIER_OPTIONS.map((c) => {
                  const ext = LOGO_EXT[c.key];
                  const selected = form.carriers.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => toggleCarrier(c.key)}
                      className={`relative h-24 rounded-xl border p-4 bg-surface-container-lowest flex flex-col items-center justify-center gap-1 transition-colors ${
                        selected ? "border-primary bg-accent-container" : "border-outline-variant"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-1 end-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                      {ext ? (
                        <img
                          src={`/images/carriers/${c.key}.${ext}`}
                          alt={c.name}
                          className="max-h-10 max-w-full object-contain"
                        />
                      ) : (
                        <span className="font-headline text-label-md text-on-surface">{c.name}</span>
                      )}
                      <span className="font-body text-label-sm text-on-surface-variant">{c.name}</span>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => setForm({ ...form, carriers: [] })} className="text-xs text-on-surface-variant underline">
                تخطي الآن
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={back} disabled={step === 1}>
              <ChevronRight className="w-4 h-4 ms-1" />
              رجوع
            </Button>
            {step < 4 ? (
              <Button onClick={next}>
                التالي
                <ChevronLeft className="w-4 h-4 me-1" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={loading}>
                {loading ? "جارٍ الإنشاء..." : "إنشاء متجرك"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-on-surface-variant mt-4">
        {t.auth.hasAccount}{" "}
        <Link to="/auth" className="text-primary underline">{t.nav.signIn}</Link>
      </p>
    </div>
  );
}