import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { WILAYAS } from "@/lib/coddz";

export const Route = createFileRoute("/settings")({
  component: () => (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Settings — COD YOU" }] }),
});

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none";

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (value: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-surface-container-low p-3.5">
      <div className="flex flex-col gap-0.5">
        <span className="font-headline text-label-lg text-on-surface">{label}</span>
        <span className="font-body text-body-md text-on-surface-variant">{hint}</span>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
      />
    </label>
  );
}

function SettingsPage() {
  const { t, lang } = useLanguage();
  const { storeId, storeName, storeWilaya, user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState(storeName ?? "");
  const [wilaya, setWilaya] = useState(storeWilaya ?? "");
  const [phone, setPhone] = useState("");
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [smsOnDelivery, setSmsOnDelivery] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [saving, setSaving] = useState(false);

  const displayName = name || storeName || t.nav.yourStore;
  const displayPhone = phone || "0551 23 45 67";
  const wilayaLabel = wilaya
    ? WILAYAS.find((item) => item.latin === wilaya || item.ar === wilaya)?.code
      ? `${WILAYAS.find((item) => item.latin === wilaya || item.ar === wilaya)?.code} - ${lang === "ar" ? WILAYAS.find((item) => item.latin === wilaya || item.ar === wilaya)?.ar : wilaya}`
      : wilaya
    : "16 - الجزائر";

  const handleSave = async () => {
    if (!storeId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("stores")
        .update({ name: name.trim() || storeName, wilaya: wilaya || storeWilaya } as any)
        .eq("id", storeId);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["store", storeId] });
      toast.success(t.orders.save);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <header className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg text-on-surface">إعدادات المتجر</h1>
            <p className="font-body text-body-md text-on-surface-variant">
              تخصيص بيانات {displayName} وتفضيلات التأكيد والشحن
            </p>
          </div>
          <button
            type="button"
            aria-label="الإشعارات"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </header>

        <section className="flex items-center justify-between gap-gutter-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center gap-gutter-md">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
              <span className="material-symbols-outlined text-[28px]">store</span>
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-headline-md text-on-surface">{displayName}</h2>
                <span className="rounded-full bg-accent-container px-2.5 py-0.5 font-body text-label-sm text-on-accent-container">
                  حساب موثق
                </span>
              </div>
              <p className="font-body text-body-md text-on-surface-variant">
                {wilayaLabel} • {displayPhone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success disabled:opacity-60"
          >
            حفظ التغييرات
          </button>
        </section>

        <section className="grid grid-cols-1 gap-gutter-lg items-stretch lg:grid-cols-2">
          <article className="flex h-full flex-col gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h3 className="font-headline text-title-lg text-on-surface">البيانات الأساسية</h3>

            <label className="flex flex-col gap-1.5">
              <span className="font-headline text-label-md text-on-surface">اسم المتجر</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-headline text-label-md text-on-surface">ولاية الانطلاق الافتراضية</span>
              <select value={wilaya} onChange={(event) => setWilaya(event.target.value)} className={fieldClass}>
                <option value="">16 - الجزائر</option>
                {WILAYAS.map((item) => (
                  <option key={item.code} value={item.latin}>
                    {item.code} - {lang === "ar" ? item.ar : item.latin}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-headline text-label-md text-on-surface">رقم هاتف الدعم</span>
              <input
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0551 23 45 67"
                className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-mono text-mono-md tabular-nums text-on-surface focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </label>
          </article>

          <article className="flex h-full flex-col gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h3 className="font-headline text-title-lg text-on-surface">تفضيلات التأكيد والتوصيل</h3>

            <Toggle
              checked={autoConfirm}
              onChange={setAutoConfirm}
              label="تأكيد تلقائي للعملاء الموثوقين"
              hint="تجاوز الاتصال الهاتفي للعملاء بنسبة استلام 100%"
            />
            <Toggle
              checked={smsOnDelivery}
              onChange={setSmsOnDelivery}
              label="إشعار SMS عند تسليم الطرد للناقل"
              hint="إرسال رقم التتبع تلقائيًا عبر الرسائل القصيرة"
            />
            <Toggle
              checked={lowStockAlert}
              onChange={setLowStockAlert}
              label="تنبيه انخفاض المخزون"
              hint="إرسال إشعار عند وصول الكمية إلى أقل من 10 قطع"
            />
          </article>
        </section>

        <section className="flex items-center justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-headline text-title-md text-error">إدارة الحساب والبيانات</h3>
            <p className="font-body text-body-md text-on-surface-variant">تعطيل استقبال الطلبات مؤقتًا أو إغلاق المتجر</p>
          </div>
          <button
            type="button"
            onClick={() => toast("إيقاف المتجر مؤقتًا", { description: "سيتم إيقاف استقبال الطلبات." })}
            className="rounded-md bg-error-container px-4 py-2 font-headline text-label-md text-on-error-container transition-colors duration-state-change hover:bg-error hover:text-on-error"
          >
            إيقاف المتجر مؤقتًا
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}
