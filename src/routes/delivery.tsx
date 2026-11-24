import { createFileRoute } from "@tanstack/react-router";
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

const RATES = [
  { name: "Yalidine", rate: 93, color: "bg-primary" },
  { name: "ZR Express", rate: 91, color: "bg-primary" },
  { name: "Noest", rate: 88, color: "bg-accent" },
  { name: "Maystro", rate: 90, color: "bg-accent" },
  { name: "DHD", rate: 86, color: "bg-accent" },
  { name: "Procolis", rate: 87, color: "bg-accent" },
  { name: "Ecotrack", rate: 89, color: "bg-accent" },
  { name: "Guepex", rate: 85, color: "bg-primary-container" },
];

const CARRIERS = [
  { name: "Yalidine", icon: "local_shipping", tone: "bg-accent-container text-on-accent-container", status: "متصل", statusClass: "bg-success-container text-on-success-container", sub: "184 شحنة نشطة • 58 ولاية" },
  { name: "ZR Express", icon: "bolt", tone: "bg-accent-container text-on-accent-container", status: "متصل", statusClass: "bg-success-container text-on-success-container", sub: "112 شحنة نشطة • 58 ولاية" },
  { name: "DHD", icon: "inventory", tone: "bg-primary-container text-on-primary-container", status: "متصل", statusClass: "bg-success-container text-on-success-container", sub: "46 شحنة نشطة • 48 ولاية" },
  { name: "Noest", icon: "route", tone: "bg-primary-container text-on-primary-container", status: "متصل", statusClass: "bg-success-container text-on-success-container", sub: "63 شحنة نشطة • 58 ولاية" },
  { name: "Maystro", icon: "two_wheeler", tone: "bg-accent-container text-on-accent-container", status: "متصل", statusClass: "bg-success-container text-on-success-container", sub: "39 شحنة نشطة • سريع" },
  { name: "Procolis", icon: "package_2", tone: "bg-primary-container text-on-primary-container", status: "جاهز للربط", statusClass: "bg-surface-container-low text-on-surface-variant", sub: "ربط بمفتاح API" },
  { name: "Ecotrack", icon: "hub", tone: "bg-accent-container text-on-accent-container", status: "متصل", statusClass: "bg-success-container text-on-success-container", sub: "54 شحنة نشطة • 58 ولاية" },
  { name: "Guepex", icon: "delivery_dining", tone: "bg-primary-container text-on-primary-container", status: "جاهز للربط", statusClass: "bg-surface-container-low text-on-surface-variant", sub: "ربط بمفتاح API" },
];

function DeliveryPage() {
  const avg = (RATES.reduce((s, r) => s + r.rate, 0) / RATES.length).toFixed(1);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="flex flex-col gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-title-lg text-on-surface">أداء التسليم حسب شركة التوصيل</h2>
              <p className="font-body text-label-md text-on-surface-variant">نسبة الطرود المسلمة بنجاح خلال آخر 30 يومًا</p>
            </div>
            <span className="rounded-full bg-accent-container px-3 py-1 font-headline text-label-md tabular-nums text-on-accent-container">
              متوسط {avg}%
            </span>
          </div>

          <div className="grid grid-cols-4 items-end gap-gutter-md pt-4 sm:grid-cols-8" style={{ height: "9rem" }}>
            {RATES.map((r) => (
              <div key={r.name} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="font-mono text-label-sm tabular-nums text-on-surface-variant">{r.rate}%</span>
                <div className={`w-full rounded-t-md ${r.color}`} style={{ height: `${r.rate}%` }} />
                <span className="font-mono text-label-sm text-on-surface">{r.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-gutter-lg sm:grid-cols-3 lg:grid-cols-4 items-stretch">
          {CARRIERS.map((c) => (
            <article
              key={c.name}
              className="flex h-full flex-col justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-9 w-9 items-center justify-center rounded-md ${c.tone}`}>
                  <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                </span>
                <span className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${c.statusClass}`}>{c.status}</span>
              </div>
              <div>
                <h3 className="font-headline text-title-md text-on-surface">{c.name}</h3>
                <p className="font-body text-label-sm tabular-nums text-on-surface-variant">{c.sub}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
