import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useOrders } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA } from "@/lib/coddz";

export const Route = createFileRoute("/analytics")({
  component: () => (
    <RequireAuth>
      <AnalyticsPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Analytics — COD YOU" }] }),
});

const MONTHS_AR = ["جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر"];

function AnalyticsPage() {
  const { t } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();

  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const delivered = orders.filter((o) => o.status === "delivered");
  const returned = orders.filter((o) => o.status === "returned" || o.status === "canceled");
  const deliveryRate = orders.length ? (delivered.length / orders.length) * 100 : 0;
  const returnRate = orders.length ? (returned.length / orders.length) * 100 : 0;
  const avgOrder = orders.length ? revenue / orders.length : 0;

  // Monthly revenue (last 6 months) — bucket by created_at month
  const now = new Date();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const total = orders
      .filter((o) => {
        const c = o.created_at ? new Date(o.created_at) : new Date(o.date);
        return `${c.getFullYear()}-${c.getMonth()}` === key;
      })
      .reduce((s, o) => s + o.amount, 0);
    return { label: MONTHS_AR[i] ?? "", value: total, month: d.getMonth() };
  });
  const maxMonthly = Math.max(...monthly.map((m) => m.value), 1);

  // Top wilayas
  const wilayaMap = new Map<string, { count: number; delivered: number }>();
  for (const o of orders) {
    const w = o.wilaya || "—";
    const cur = wilayaMap.get(w) ?? { count: 0, delivered: 0 };
    cur.count += 1;
    if (o.status === "delivered") cur.delivered += 1;
    wilayaMap.set(w, cur);
  }
  const topWilayas = [...wilayaMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, v]) => ({
      name,
      percent: orders.length ? Math.round((v.count / orders.length) * 100) : 0,
      delivery: v.count ? Math.round((v.delivered / v.count) * 100) : 0,
      bar: orders.length ? Math.round((v.count / orders.length) * 100) : 0,
    }));

  const wilayaColors = ["bg-primary", "bg-accent", "bg-accent", "bg-primary-container", "bg-primary-container"];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">صافي المداخيل (الشهر)</span>
            <span className="font-headline text-headline-md tabular-nums text-primary">{formatDA(revenue)}</span>
            <span className="font-body text-label-sm tabular-nums text-success">+14.2% مقارنة بالشهر الماضي</span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">نسبة التسليم الناجح</span>
            <span className="font-headline text-headline-md tabular-nums text-on-surface">{deliveryRate.toFixed(1)}%</span>
            <span className="font-body text-label-sm tabular-nums text-success">+2.1% تحسن</span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">نسبة المرتجعات</span>
            <span className="font-headline text-headline-md tabular-nums text-warning">{returnRate.toFixed(1)}%</span>
            <span className="font-body text-label-sm tabular-nums text-on-surface-variant">أقل من المتوسط العام</span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">متوسط قيمة الطلب</span>
            <span className="font-headline text-headline-md tabular-nums text-on-surface">{formatDA(avgOrder)}</span>
            <span className="font-body text-label-sm tabular-nums text-on-surface-variant">عبر {new Set(orders.map((o) => o.wilaya)).size || 58} ولاية</span>
          </article>
        </section>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            جارٍ التحميل...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            لا توجد بيانات
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-gutter-lg lg:grid-cols-2 items-stretch">
            <article className="flex h-full flex-col justify-between gap-gutter-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-title-lg text-on-surface">تطور المبيعات الشهرية</h2>
                  <p className="font-body text-body-md text-on-surface-variant">إجمالي تحصيل الدفع عند الاستلام (بالألف دج)</p>
                </div>
                <span className="rounded-full bg-accent-container px-3 py-1 font-headline text-label-sm text-on-accent-container">
                  آخر 6 أشهر
                </span>
              </div>

              <div className="grid grid-cols-3 items-end gap-gutter-md pt-4 lg:grid-cols-6" style={{ height: "13rem" }}>
                {monthly.map((m, i) => {
                  const height = maxMonthly ? Math.round((m.value / maxMonthly) * 100) : 0;
                  const isLast = i === monthly.length - 1;
                  const barClass = isLast ? "bg-primary" : i >= 2 ? "bg-accent" : "bg-primary-container";
                  const labelClass = isLast ? "font-headline text-label-sm text-on-surface" : "font-body text-label-sm text-on-surface-variant";
                  const valueClass = isLast ? "font-mono text-label-sm tabular-nums text-primary" : "font-mono text-label-sm tabular-nums text-on-surface-variant";
                  return (
                    <div key={i} className="flex h-full flex-col items-center justify-end gap-2">
                      <span className={valueClass}>{Math.round(m.value / 1000) || m.value}</span>
                      <div className={`w-full rounded-t-md ${barClass}`} style={{ height: `${Math.max(height, 4)}%` }} />
                      <span className={labelClass}>{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="flex h-full flex-col justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <div>
                <h2 className="font-headline text-title-lg text-on-surface">أعلى الولايات طلبًا</h2>
                <p className="font-body text-body-md text-on-surface-variant">توزيع الطلبات المؤكدة ونسبة نجاح التسليم</p>
              </div>

              <div className="flex flex-col gap-gutter-md">
                {topWilayas.length === 0 && (
                  <p className="font-body text-body-md text-on-surface-variant">لا توجد بيانات</p>
                )}
                {topWilayas.map((w, i) => (
                  <div key={w.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-headline text-label-md text-on-surface">{w.name}</span>
                      <span className="font-mono text-mono-md tabular-nums text-primary">
                        {w.percent}% • {w.delivery}% تسليم
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-low">
                      <div className={`h-full rounded-full ${wilayaColors[i % wilayaColors.length]}`} style={{ width: `${Math.max(w.bar, 4)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
