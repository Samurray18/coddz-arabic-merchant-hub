import { BRAND_NAME, BRAND_NAME_AR } from "@/lib/coddz";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { WILAYAS, CARRIER_OPTIONS } from "@/lib/coddz";
import { isValidAlgerianPhone, normalizeAlgerianPhone } from "@/lib/coddz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, ChevronRight, Upload, Store, Users, Package, Megaphone, Globe } from "lucide-react";
import { toast } from "sonner";

const LOGO_EXT: Record<string, string> = {
  yalidine: "png",
  zrexpress: "svg",
  dhd: "png",
  noest: "png",
  maystro: "svg",
  ecotrack: "png",
};

const TOTAL_STEPS_BASE = 5;

const BUSINESS_TYPES = [
  { key: "retail", label: "تجزئة" },
  { key: "wholesale", label: "جملة" },
  { key: "dropshipping", label: "دروبشيبينغ" },
  { key: "services", label: "خدمات" },
  { key: "other", label: "أخرى" },
];

const SALES_CHANNELS = [
  { key: "facebook", label: "Facebook / Instagram", icon: "facebook" },
  { key: "tiktok", label: "TikTok", icon: "music_note" },
  { key: "website", label: "موقع إلكتروني", icon: "language" },
  { key: "shopify", label: "Shopify", icon: "storefront" },
  { key: "woocommerce", label: "WooCommerce", icon: "shopping_bag" },
  { key: "whatsapp", label: "WhatsApp / هاتف", icon: "chat" },
];

const MONTHLY_ORDERS = [
  { key: "lt50", label: "أقل من 50" },
  { key: "50-200", label: "50 - 200" },
  { key: "200-500", label: "200 - 500" },
  { key: "500-1000", label: "500 - 1000" },
  { key: "gt1000", label: "أكثر من 1000" },
];

export function OnboardingWizard() {
  const { t, lang } = useLanguage();
  const { user, storeId, storeName, storeWilaya, onboardingCompleted, onboardingStep, refreshStore } = useAuth();
  const navigate = useNavigate();
  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  const needsStoreSetup = storeName === "متجري" || !storeWilaya;
  const TOTAL_STEPS = needsStoreSetup ? 6 : 5;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [finishing, setFinishing] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false]);

  const [form, setForm] = useState({
    phone: "",
    businessType: "",
    salesChannels: [] as string[],
    monthlyOrders: "",
    teamMode: "solo" as "solo" | "team",
    teamSize: 1,
    defaultDelivery: "home" as "home" | "desk",
    logoFile: null as File | null,
    logoUrl: "",
    storeName: storeName ?? "",
    wilaya: storeWilaya ?? "",
    carriers: [] as string[],
    wilayaSearch: "",
    showWilayaList: false,
  });

  // Resume from saved step
  useEffect(() => {
    if (onboardingCompleted) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    const resume = Math.min(TOTAL_STEPS, Math.max(1, (onboardingStep ?? 0) + 1));
    setStep(resume);
  }, [onboardingCompleted, onboardingStep, navigate]);

  const saveStep = async (patch: Record<string, unknown>, nextStep: number) => {
    if (!storeId) throw new Error("No store");
    setLoading(true);
    setError("");
    try {
      const { error: upErr } = await (supabase as any)
        .from("stores")
        .update({ ...patch, onboarding_step: nextStep })
        .eq("id", storeId);
      if (upErr) throw upErr;
      await refreshStore();
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ، حاول مرة أخرى");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const skipAll = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { error: upErr } = await (supabase as any)
        .from("stores")
        .update({ onboarding_completed: true, onboarding_step: TOTAL_STEPS })
        .eq("id", storeId);
      if (upErr) throw upErr;
      await refreshStore();
      await finish();
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    setFinishing(true);
    const items = [false, false, false, false];
    for (let i = 0; i < items.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      items[i] = true;
      setChecklist([...items]);
    }
    await new Promise((r) => setTimeout(r, 600));
    navigate({ to: "/dashboard", replace: true });
  };

  const next = async () => {
    setError("");
    // Step 1 (conditional): store info
    if (needsStoreSetup && step === 1) {
      if (!form.storeName.trim()) {
        setError("اسم المتجر مطلوب");
        return;
      }
      if (!form.wilaya) {
        setError("يرجى اختيار الولاية");
        return;
      }
      try {
        await saveStep({ name: form.storeName.trim(), wilaya: form.wilaya }, 1);
        if (form.carriers.length) {
          try {
            const { error: insErr } = await (supabase as any)
              .from("store_delivery_companies")
              .insert(form.carriers.map((c) => ({ store_id: storeId, company: c })));
            if (insErr) throw insErr;
          } catch (e: any) {
            setError(e?.message ?? "خطأ في حفظ شركات التوصيل");
            return;
          }
        }
        await refreshStore();
        setStep(2);
      } catch {}
      return;
    }

    const os = needsStoreSetup ? step - 1 : step; // original step 1-5

    if (os === 1) {
      if (form.phone && !isValidAlgerianPhone(form.phone)) {
        setError("رقم هاتف غير صالح");
        return;
      }
      if (!form.businessType) {
        setError("يرجى اختيار نوع النشاط");
        return;
      }
      try {
        await saveStep(
          {
            phone: form.phone ? normalizeAlgerianPhone(form.phone) : null,
            business_type: form.businessType,
          },
          step,
        );
        setStep(step + 1);
      } catch {}
      return;
    }
    if (os === 2) {
      try {
        await saveStep({ sales_channels: form.salesChannels }, step);
        setStep(step + 1);
      } catch {}
      return;
    }
    if (os === 3) {
      if (!form.monthlyOrders) {
        setError("يرجى اختيار حجم الطلبات");
        return;
      }
      try {
        await saveStep({ monthly_orders: MONTHLY_ORDERS.findIndex((m) => m.key === form.monthlyOrders) + 1 }, step);
        setStep(step + 1);
      } catch {}
      return;
    }
    if (os === 4) {
      try {
        await saveStep(
          {
            team_size: form.teamMode === "solo" ? 1 : Math.max(1, form.teamSize),
          },
          step,
        );
        setStep(step + 1);
      } catch {}
      return;
    }
    if (os === 5) {
      setLoading(true);
      setError("");
      try {
        // optional logo upload
        if (form.logoFile && user) {
          try {
            const ext = form.logoFile.name.split(".").pop();
            const path = `${user.id}/logo.${ext}`;
            const { error: upErr } = await supabase.storage
              .from("logos")
              .upload(path, form.logoFile, { upsert: true });
            if (!upErr) {
              const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
              form.logoUrl = pub.publicUrl;
              await supabase.auth.updateUser({ data: { logo_url: pub.publicUrl } });
            }
          } catch {}
        }
        // save default delivery type in user metadata
        await supabase.auth.updateUser({ data: { default_delivery: form.defaultDelivery } });
        const { error: upErr } = await (supabase as any)
          .from("stores")
          .update({ onboarding_completed: true, onboarding_step: TOTAL_STEPS })
          .eq("id", storeId);
        if (upErr) throw upErr;
        await refreshStore();
        await finish();
      } catch (e: any) {
        setError(e?.message ?? "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const toggleChannel = (key: string) => {
    setForm((f) => ({
      ...f,
      salesChannels: f.salesChannels.includes(key)
        ? f.salesChannels.filter((c) => c !== key)
        : [...f.salesChannels, key],
    }));
  };

  if (finishing) {
    const items = ["إعداد متجرك", "تجهيز المنتجات", "ربط التوصيل", "تخصيص لوحة التحكم"];
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-container text-on-accent-container flex items-center justify-center">
                <Store className="w-8 h-8" />
              </div>
              <h2 className="font-headline text-headline-md text-on-surface">جارٍ إعداد مساحة عملك</h2>
              <p className="font-body text-body-md text-on-surface-variant">يرجى الانتظار قليلاً...</p>
            </div>
            <ul className="space-y-2">
              {items.map((label, i) => (
                <li key={i} className="flex items-center gap-2 font-body text-body-md text-on-surface">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      checklist[i] ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    {checklist[i] ? <Check className="w-3 h-3" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-md lg:max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">monitoring</span>
            </div>
            <span className="font-headline text-title-lg text-on-surface">{brand}</span>
          </div>
          <CardTitle className="font-headline text-headline-md text-on-surface">إعداد متجرك</CardTitle>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
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
                {n < TOTAL_STEPS && <div className={`w-6 h-0.5 ${n < step ? "bg-primary" : "bg-outline-variant"}`} />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-error bg-error-container/40 rounded-md p-2">{error}</div>}

          {needsStoreSetup && step === 1 && (
            <div className="space-y-3">
              <div>
                <Label>اسم المتجر</Label>
                <Input
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                />
              </div>
              <div className="relative">
                <Label>الولاية</Label>
                <Input
                  value={form.wilaya ? form.wilaya : form.wilayaSearch}
                  onChange={(e) => {
                    setForm({ ...form, wilayaSearch: e.target.value, wilaya: "" });
                    setForm((f) => ({ ...f, showWilayaList: true }));
                  }}
                  onFocus={() => setForm((f) => ({ ...f, showWilayaList: true }))}
                  placeholder="ابحث عن ولاية..."
                />
                {form.showWilayaList && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-outline-variant bg-surface-container-lowest shadow-sm">
                    {WILAYAS.filter((w) =>
                      `${w.code} ${w.latin} ${w.ar}`.toLowerCase().includes(form.wilayaSearch.toLowerCase()),
                    ).map((w) => (
                      <button
                        key={w.code}
                        type="button"
                        className="block w-full px-3 py-2 text-start text-sm hover:bg-surface-container-low"
                        onClick={() => {
                          setForm((f) => ({ ...f, wilaya: `${w.code} - ${w.latin}`, wilayaSearch: "", showWilayaList: false }));
                        }}
                      >
                        {w.code} - {w.latin}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label>شركات التوصيل (اختياري)</Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {CARRIER_OPTIONS.map((c) => {
                    const ext = LOGO_EXT[c.key];
                    const selected = form.carriers.includes(c.key);
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            carriers: f.carriers.includes(c.key)
                              ? f.carriers.filter((x) => x !== c.key)
                              : [...f.carriers, c.key],
                          }))
                        }
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
                          <img src={`/images/carriers/${c.key}.${ext}`} alt={c.name} className="max-h-10 max-w-full object-contain" />
                        ) : (
                          <span className="font-headline text-label-md text-on-surface">{c.name}</span>
                        )}
                        <span className="font-body text-label-sm text-on-surface-variant">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {(needsStoreSetup ? step - 1 : step) === 1 && (
            <div className="space-y-3">
              <div>
                <Label>رقم الهاتف (WhatsApp)</Label>
                <Input
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0551 23 45 67"
                />
              </div>
              <div>
                <Label>نوع النشاط</Label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map((b) => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setForm({ ...form, businessType: b.key })}
                      className={`rounded-full border px-4 py-2 font-body text-label-md transition-colors ${
                        form.businessType === b.key
                          ? "border-primary bg-accent-container text-on-accent-container"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(needsStoreSetup ? step - 1 : step) === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-on-surface-variant">قنوات البيع (اختيار متعدد)</p>
              <div className="grid grid-cols-2 gap-3">
                {SALES_CHANNELS.map((c) => {
                  const selected = form.salesChannels.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => toggleChannel(c.key)}
                      className={`flex items-center gap-2 rounded-xl border p-3 transition-colors ${
                        selected ? "border-primary bg-accent-container" : "border-outline-variant bg-surface-container-lowest"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                      <span className="font-body text-body-md text-on-surface">{c.label}</span>
                      {selected && <Check className="ms-auto w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(needsStoreSetup ? step - 1 : step) === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-on-surface-variant">عدد الطلبات شهريًا</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {MONTHLY_ORDERS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setForm({ ...form, monthlyOrders: m.key })}
                    className={`rounded-xl border p-4 text-start transition-colors ${
                      form.monthlyOrders === m.key
                        ? "border-primary bg-accent-container"
                        : "border-outline-variant bg-surface-container-lowest"
                    }`}
                  >
                    <span className="font-headline text-title-md text-on-surface">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(needsStoreSetup ? step - 1 : step) === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-on-surface-variant">فريق العمل</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, teamMode: "solo" })}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    form.teamMode === "solo" ? "border-primary bg-accent-container" : "border-outline-variant bg-surface-container-lowest"
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="font-headline text-title-md text-on-surface">أنا فقط</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, teamMode: "team" })}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    form.teamMode === "team" ? "border-primary bg-accent-container" : "border-outline-variant bg-surface-container-lowest"
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="font-headline text-title-md text-on-surface">مع فريق</span>
                </button>
              </div>
              {form.teamMode === "team" && (
                <div>
                  <Label>عدد الموظفين</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.teamSize}
                    onChange={(e) => setForm({ ...form, teamSize: Number(e.target.value) || 1 })}
                  />
                </div>
              )}
            </div>
          )}

          {(needsStoreSetup ? step - 1 : step) === 5 && (
            <div className="space-y-3">
              <div>
                <Label>شعار المتجر (اختياري)</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-4">
                  <Upload className="w-5 h-5 text-on-surface-variant" />
                  <span className="font-body text-body-md text-on-surface-variant">
                    {form.logoFile ? form.logoFile.name : "اختر صورة"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setForm({ ...form, logoFile: e.target.files?.[0] ?? null })}
                  />
                </label>
              </div>
              <div>
                <Label>نوع التوصيل الافتراضي</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, defaultDelivery: "home" })}
                    className={`rounded-xl border p-3 transition-colors ${
                      form.defaultDelivery === "home" ? "border-primary bg-accent-container" : "border-outline-variant bg-surface-container-lowest"
                    }`}
                  >
                    <span className="font-headline text-title-md text-on-surface">توصيل للمنزل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, defaultDelivery: "desk" })}
                    className={`rounded-xl border p-3 transition-colors ${
                      form.defaultDelivery === "desk" ? "border-primary bg-accent-container" : "border-outline-variant bg-surface-container-lowest"
                    }`}
                  >
                    <span className="font-headline text-title-md text-on-surface">توصيل للمكتب</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={back} disabled={step === 1 || loading}>
                <ChevronRight className="w-4 h-4 ms-1" />
                رجوع
              </Button>
              <button
                type="button"
                onClick={skipAll}
                disabled={loading}
                className="text-xs text-on-surface-variant underline"
              >
                تخطي
              </button>
            </div>
            <Button onClick={next} disabled={loading}>
              {loading ? "..." : step < TOTAL_STEPS ? "التالي" : "إنهاء"}
              {step < TOTAL_STEPS && <ChevronLeft className="w-4 h-4 me-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
