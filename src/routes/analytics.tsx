import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/hooks/use-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA } from "@/lib/coddz";
import { computeDashboardKpis } from "@/lib/kpi";
import { Money } from "@/components/money";
import { LocalDate } from "@/components/local-date";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

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
  const { t, lang } = useLanguage();
  const { storeId } = useAuth();
  const { data: ordersData, isLoading } = useOrders();
  const orders = ordersData?.pages.flat() ?? [];
  const { data: returnEvents = [] } = useQuery({
    queryKey: ["return_events", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("store_id", storeId!)
        .eq("type", "return")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: stats } = useQuery({
    queryKey: ["dashboard_stats", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_dashboard_stats", {
        _store_id: storeId!,
      });
      if (error) throw error;
      return Array.isArray(data) ? data[0] : data;
    },
  });

  const kpis = computeDashboardKpis(stats);
  const revenue = kpis.revenue || orders.reduce((s, o) => s + o.amount, 0);
  const totalOrders = kpis.totalOrders || orders.length;
  const deliveredCount = kpis.deliveredCount;
  const returnedCount = kpis.returnedCount;
  const deliveryRate = kpis.deliveryRate;
  const returnRate = kpis.returnRate;
  const avgOrder = totalOrders ? revenue / totalOrders : 0;

  // Real month-over-month changes
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = `${prevMonthDate.getFullYear()}-${prevMonthDate.getMonth()}`;
  const inMonth = (o: { created_at?: string; date: string }, key: string) => {
    const c = o.created_at ? new Date(o.created_at) : new Date(o.date);
    return `${c.getFullYear()}-${c.getMonth()}` === key;
  };
  const thisMonthOrders = orders.filter((o) => inMonth(o, thisMonthKey));
  const prevMonthOrders = orders.filter((o) => inMonth(o, prevMonthKey));
  const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + o.amount, 0);
  const prevMonthRevenue = prevMonthOrders.reduce((s, o) => s + o.amount, 0);
  const revenueChange =
    prevMonthRevenue > 0 ? ((thisMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;
  const thisMonthDelivery = thisMonthOrders.length
    ? (thisMonthOrders.filter((o) => o.status === "delivered").length / thisMonthOrders.length) *
      100
    : 0;
  const prevMonthDelivery = prevMonthOrders.length
    ? (prevMonthOrders.filter((o) => o.status === "delivered").length / prevMonthOrders.length) *
      100
    : 0;
  const deliveryChange = thisMonthDelivery - prevMonthDelivery;
  const wilayaCount = new Set(orders.map((o) => o.wilaya).filter(Boolean)).size;

  // Monthly revenue (last 6 months) — bucket by created_at month
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

  const wilayaColors = [
    "bg-primary",
    "bg-accent",
    "bg-accent",
    "bg-primary-container",
    "bg-primary-container",
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-2 lg:grid-cols-5 items-stretch">
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">
              صافي المداخيل (الشهر)
            </span>
            <span className="font-headline text-headline-md tabular-nums text-primary">
              <Money value={thisMonthRevenue || revenue} />
            </span>
            <span
              className={`font-body text-label-sm tabular-nums ${revenueChange >= 0 ? "text-success" : "text-error"}`}
            >
              {revenueChange >= 0 ? "+" : ""}
              {revenueChange.toFixed(1)}% مقارنة بالشهر الماضي
            </span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">
              نسبة التسليم الناجح
            </span>
            <span className="font-headline text-headline-md tabular-nums text-on-surface">
              {deliveryRate.toFixed(1)}%
            </span>
            <span
              className={`font-body text-label-sm tabular-nums ${deliveryChange >= 0 ? "text-success" : "text-error"}`}
            >
              {deliveryChange >= 0 ? "+" : ""}
              {deliveryChange.toFixed(1)}% تحسن
            </span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">نسبة المرتجعات</span>
            <span className="font-headline text-headline-md tabular-nums text-warning">
              {returnRate.toFixed(1)}%
            </span>
            <span className="font-body text-label-sm tabular-nums text-on-surface-variant">
              أقل من المتوسط العام
            </span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">
              متوسط قيمة الطلب
            </span>
            <span className="font-headline text-headline-md tabular-nums text-on-surface">
              <Money value={avgOrder} />
            </span>
            <span className="font-body text-label-sm tabular-nums text-on-surface-variant">
              عبر {wilayaCount || 0} ولاية
            </span>
          </article>
          <article className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <span className="font-body text-label-md text-on-surface-variant">صافي الربح</span>
            <span className="font-headline text-headline-md tabular-nums text-primary">
              <Money value={kpis.netProfit} />
            </span>
            <span className="font-body text-label-sm tabular-nums text-on-surface-variant">
              إيرادات <Money value={Number(stats?.revenue ?? revenue)} /> • مصاريف{" "}
              <Money value={Number(stats?.expenses ?? 0) + Number(stats?.ad_spend ?? 0)} />
            </span>
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
                  <h2 className="font-headline text-title-lg text-on-surface">
                    تطور المبيعات الشهرية
                  </h2>
                  <p className="font-body text-body-md text-on-surface-variant">
                    إجمالي تحصيل الدفع عند الاستلام (بالألف دج)
                  </p>
                </div>
                <span className="rounded-full bg-accent-container px-3 py-1 font-headline text-label-sm text-on-accent-container">
                  آخر 6 أشهر
                </span>
              </div>

              <div className="pt-4" style={{ height: "16rem" }}>
                <ChartContainer
                  config={{
                    value: {
                      label: "المبيعات (دج)",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-full w-full"
                >
                  <AreaChart data={monthly} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2c6e49" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2c6e49" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#707971"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#707971"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(val) => formatDA(Number(val), lang)} />}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2c6e49"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueColor)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </article>

            <article className="flex h-full flex-col justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <div>
                <h2 className="font-headline text-title-lg text-on-surface">أعلى الولايات طلبًا</h2>
                <p className="font-body text-body-md text-on-surface-variant">
                  توزيع الطلبات المؤكدة ونسبة نجاح التسليم
                </p>
              </div>

              <div className="pt-4" style={{ height: "16rem" }}>
                <ChartContainer
                  config={{
                    count: {
                      label: "الطلبات",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-full w-full"
                >
                  <BarChart
                    data={topWilayas}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="#707971"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#707971"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bar" fill="#52b788" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </article>
          </section>
        )}

        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="font-headline text-title-lg text-on-surface">المرتجعات</h2>
          <p className="font-body text-body-md text-on-surface-variant">
            عدد المرتجعات: {orders.filter((o) => o.status === "returned").length}
          </p>
          {returnEvents.length === 0 ? (
            <p className="mt-3 font-body text-body-md text-on-surface-variant">لا توجد مرتجعات</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-gutter-sm">
              {returnEvents.map((ev: Database["public"]["Tables"]["order_events"]["Row"]) => (
                <li key={ev.id} className="rounded-md border border-outline-variant bg-surface p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-body-md text-on-surface">{ev.note}</span>
                    <span className="font-body text-label-sm text-on-surface-variant">
                      <LocalDate value={ev.created_at} />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
