import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/delivery")({
  component: () => (
    <RequireAuth>
      <DeliveryPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Delivery — COD YOU" }] }),
});

const CARRIERS = [
  { name: "Yalidine", icon: "local_shipping", tone: "bg-accent-container text-on-accent-container" },
  { name: "ZR Express", icon: "bolt", tone: "bg-accent-container text-on-accent-container" },
  { name: "DHD", icon: "inventory", tone: "bg-primary-container text-on-primary-container" },
  { name: "Noest", icon: "route", tone: "bg-primary-container text-on-primary-container" },
  { name: "Maystro", icon: "two_wheeler", tone: "bg-accent-container text-on-accent-container" },
  { name: "Procolis", icon: "package_2", tone: "bg-primary-container text-on-primary-container" },
  { name: "Ecotrack", icon: "hub", tone: "bg-accent-container text-on-accent-container" },
  { name: "Guepex", icon: "delivery_dining", tone: "bg-primary-container text-on-primary-container" },
];

function DeliveryPage() {
  const { t } = useLanguage();
  const { storeId } = useAuth();
  const { data: shipments = [] } = useQuery({
    queryKey: ["shipments", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shipments")
        .select("*")
        .eq("store_id", storeId!);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: connected = [] } = useQuery({
    queryKey: ["store_carriers", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("store_delivery_companies")
        .select("company")
        .eq("store_id", storeId!);
      if (error) throw error;
      return (data ?? []).map((r: any) => String(r.company).toLowerCase());
    },
  });

  const isConnected = (name: string) => connected.includes(name.toLowerCase());

  const statsFor = (name: string) => {
    const rows = (shipments as any[]).filter((s) => String(s.carrier).toLowerCase() === name.toLowerCase());
    const total = rows.length;
    const delivered = rows.filter((s) => s.status === "delivered" || s.collected === true).length;
    const rate = total ? Math.round((delivered / total) * 100) : 0;
    return { total, rate };
  };

  const rates = CARRIERS.map((c) => ({ ...c, ...statsFor(c.name) }));
  const activeRates = rates.filter((r) => r.total > 0);
  const avgRate = activeRates.length
    ? (activeRates.reduce((s, r) => s + r.rate, 0) / activeRates.length).toFixed(1)
    : "0.0";

  const hasData = (shipments as any[]).length > 0;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="flex flex-col gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-title-lg text-on-surface">أداء التسليم حسب شركة التوصيل</h2>
              <p className="font-body text-label-md text-on-surface-variant">نسبة الطرود المسلمة بنجاح</p>
            </div>
            <span className="rounded-full bg-accent-container px-3 py-1 font-headline text-label-md tabular-nums text-on-accent-container">
              متوسط {avgRate}%
            </span>
          </div>

          {!hasData ? (
            <p className="py-6 text-center font-body text-body-md text-on-surface-variant">
              لا توجد شحنات بعد. أرسل طلباتك لشركات التوصيل لتظهر الإحصائيات.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid min-w-[640px] grid-cols-8 items-end gap-gutter-md pt-4" style={{ height: "9rem" }}>
                {rates.map((r) => (
                  <div key={r.name} className="flex h-full flex-col items-center justify-end gap-2">
                    <span className="font-mono text-label-sm tabular-nums text-on-surface-variant">
                      {r.total ? `${r.rate}%` : "—"}
                    </span>
                    <div
                      className={`w-full rounded-t-md ${r.total ? "bg-primary" : "bg-surface-container-low"}`}
                      style={{ height: r.total ? `${Math.max(r.rate, 4)}%` : "4%" }}
                    />
                    <span className="font-mono text-label-sm text-on-surface">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-2 gap-gutter-lg sm:grid-cols-3 lg:grid-cols-4 items-stretch">
          {CARRIERS.map((c) => {
            const { total, rate } = statsFor(c.name);
            const live = isConnected(c.name);
            return (
              <article
                key={c.name}
                className="flex h-full flex-col justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-md ${c.tone}`}>
                    <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${
                      live ? "bg-success-container text-on-success-container" : "bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    {live ? "متصل" : "جاهز للربط"}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline text-title-md text-on-surface">{c.name}</h3>
                  <p className="font-body text-label-sm tabular-nums text-on-surface-variant">
                    {total > 0 ? `${total} شحنة • ${rate}% تسليم` : "لا توجد شحنات"}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </DashboardShell>
  );
}
