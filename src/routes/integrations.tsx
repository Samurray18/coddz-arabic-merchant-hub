import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/integrations")({
  component: () => (
    <RequireAuth>
      <IntegrationsPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Integrations — COD YOU" }] }),
});

const CARRIERS = [
  { name: "Yalidine", api: "yld_live_••••94a2", connected: true },
  { name: "ZR Express", api: "zrx_live_••••31b8", connected: true },
  { name: "DHD", api: "dhd_live_••••77c1", connected: true },
  { name: "Noest", api: "nst_live_••••12f4", connected: true },
  { name: "Maystro", api: "mys_live_••••85e0", connected: true },
  { name: "Procolis", api: "", connected: false },
  { name: "Ecotrack", api: "eco_live_••••49d3", connected: true },
  { name: "Guepex", api: "", connected: false },
];

function IntegrationsPage() {
  const { storeId } = useAuth();
  const { data: connected = [] } = useQuery({
    queryKey: ["store_carriers", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("store_delivery_companies")
        .select("company")
        .eq("store_id", storeId!);
      if (error) throw error;
      return (data ?? []).map((row: any) => String(row.company));
    },
  });

  const isConnected = (name: string) => connected.includes(name.toLowerCase()) || connected.includes(name);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-title-lg text-on-surface">ربط شركات التوصيل (API)</h2>
            <span className="font-body text-label-md tabular-nums text-primary">
              {CARRIERS.filter((c) => isConnected(c.name)).length} شركات متصلة من أصل {CARRIERS.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-gutter-md items-stretch sm:grid-cols-3 lg:grid-cols-4">
            {CARRIERS.map((carrier) => {
              const live = isConnected(carrier.name);
              return (
                <article
                  key={carrier.name}
                  className="flex h-full flex-col justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-title-md text-on-surface">{carrier.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${
                        live
                          ? "bg-accent-container text-on-accent-container"
                          : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {live ? "متصل" : "غير متصل"}
                    </span>
                  </div>
                  <p className="font-mono text-label-sm text-on-surface-variant">
                    {live ? `API: ${carrier.api}` : "أضف رمز المتجر للتفعيل"}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      toast(live ? "تعديل المفتاح" : "ربط الحساب", {
                        description: carrier.name,
                      })
                    }
                    className={`w-full rounded-md py-2 font-headline text-label-md transition-colors duration-state-change ${
                      live
                        ? "border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container"
                        : "bg-primary text-on-primary hover:bg-success"
                    }`}
                  >
                    {live ? "تعديل المفتاح" : "ربط الحساب"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-on-surface">منصات المتاجر والتتبع</h2>
          <div className="grid grid-cols-1 gap-gutter-lg items-stretch lg:grid-cols-3">
            <article className="flex h-full items-center justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex items-center gap-gutter-md">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
                  <span className="material-symbols-outlined text-[20px]">store</span>
                </span>
                <div className="flex flex-col">
                  <span className="font-headline text-title-md text-on-surface">YouCan / Shopify</span>
                  <span className="font-body text-label-sm text-success">مزامنة تلقائية للطلبات</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast("إعداد", { description: "YouCan / Shopify" })}
                className="rounded-md border border-outline-variant bg-surface-container-low px-3 py-1.5 font-headline text-label-md text-on-surface"
              >
                إعداد
              </button>
            </article>

            <article className="flex h-full items-center justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex items-center gap-gutter-md">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined text-[20px]">table_chart</span>
                </span>
                <div className="flex flex-col">
                  <span className="font-headline text-title-md text-on-surface">Google Sheets</span>
                  <span className="font-body text-label-sm text-success">تصدير فوري كل 5 دقائق</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast("إعداد", { description: "Google Sheets" })}
                className="rounded-md border border-outline-variant bg-surface-container-low px-3 py-1.5 font-headline text-label-md text-on-surface"
              >
                إعداد
              </button>
            </article>

            <article className="flex h-full items-center justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex items-center gap-gutter-md">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">ads_click</span>
                </span>
                <div className="flex flex-col">
                  <span className="font-headline text-title-md text-on-surface">Meta &amp; TikTok Pixel</span>
                  <span className="font-body text-label-sm text-on-surface-variant">تتبع أحداث الشراء المؤكدة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast("تفعيل", { description: "Meta & TikTok Pixel" })}
                className="rounded-md bg-primary px-3 py-1.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success"
              >
                تفعيل
              </button>
            </article>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
