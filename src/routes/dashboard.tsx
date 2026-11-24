import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useOrders, useProducts, useUpdateOrderStatus } from "@/hooks/use-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";
import { buildWhatsAppLink, formatDA, STATUS_BADGE_CLASS, type OrderStatus } from "@/lib/coddz";
import { Check } from "lucide-react";
import type { Order } from "@/lib/domain";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Dashboard — COD YOU" }] }),
});

function KpiCard({
  label,
  value,
  icon,
  iconClass,
  hint,
}: {
  label: string;
  value: string;
  icon: string;
  iconClass: string;
  hint?: string;
}) {
  return (
    <article className="flex h-full flex-col justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm lg:p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-body text-label-md text-on-surface-variant">{label}</h2>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md lg:h-9 lg:w-9 ${iconClass}`}>
          <span className="material-symbols-outlined text-[18px] lg:text-[20px]">{icon}</span>
        </span>
      </header>
      <div className="flex flex-col gap-1">
        <p className="font-headline text-headline-md text-on-surface tabular-nums">{value}</p>
        {hint && <span className="font-body text-label-sm text-on-surface-variant">{hint}</span>}
      </div>
    </article>
  );
}

function PendingOrderCard({ order }: { order: Order }) {
  const { t } = useLanguage();
  const updateStatus = useUpdateOrderStatus();
  const message = t.orders.whatsappTemplate
    .replace("{name}", order.name)
    .replace("{number}", order.number)
    .replace("{product}", order.product)
    .replace("{amount}", formatDA(order.amount))
    .replace("{wilaya}", order.wilaya);

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm lg:p-5">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-mono-md text-on-surface tabular-nums">#{order.number || "—"}</span>
          <span className="font-body text-label-sm text-on-surface-variant">{order.date}</span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${STATUS_BADGE_CLASS[order.status]}`}>
          {t.status[order.status]}
        </span>
      </header>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-headline text-title-md text-on-surface">{order.name}</h3>
          <p className="font-body text-body-md text-on-surface-variant">
            {order.wilaya} • {order.product}
          </p>
        </div>
        <span className="shrink-0 font-headline text-title-md text-primary tabular-nums">{formatDA(order.amount)}</span>
      </div>
      <footer className="flex items-center gap-2 border-t border-outline-variant pt-2">
        <button
          type="button"
          onClick={() => updateStatus.mutate({ id: order.id, status: "shipped" })}
          disabled={updateStatus.isPending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 font-headline text-label-md text-on-primary transition-colors duration-state-change hover:bg-success disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          {t.orders.confirmAndSend}
        </button>
        <a
          href={order.phone ? buildWhatsAppLink(order.phone, message) : "#"}
          className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low px-3 py-2 font-headline text-label-md text-on-surface transition-colors duration-state-change hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[16px]">call</span>
          {t.orders.call}
        </a>
      </footer>
    </article>
  );
}

function WelcomeChecklist() {
  const { storeId } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: carriers = [] } = useQuery({
    queryKey: ["store_carriers", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("store_delivery_companies")
        .select("company")
        .eq("store_id", storeId!);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["user_roles", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("id")
        .eq("store_id", storeId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("welcome_checklist_dismissed") === "1";
    } catch {
      return false;
    }
  });

  const tasks = [
    { key: "product", label: "أضف منتجك الأول", done: products.length > 0, to: "/products" },
    { key: "carrier", label: "ربط شركة توصيل", done: carriers.length > 0, to: "/integrations" },
    { key: "order", label: "أنشئ طلبك الأول", done: orders.length > 0, to: "/orders" },
    { key: "team", label: "دعوة فريقك", done: (roles as any[]).length > 1, to: "/team" },
  ];
  const doneCount = tasks.filter((t) => t.done).length;
  const allDone = doneCount === tasks.length;

  if (dismissed || allDone) return null;

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-center justify-between gap-gutter-md">
        <div>
          <h2 className="font-headline text-title-lg text-on-surface">قائمة الترحيب</h2>
          <p className="font-body text-body-md text-on-surface-variant">
            أكمل هذه المهام للبدء ({doneCount}/{tasks.length})
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("welcome_checklist_dismissed", "1");
            } catch {}
          }}
          className="text-on-surface-variant hover:text-on-surface"
          aria-label="إغلاق"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${(doneCount / tasks.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 flex flex-col gap-gutter-sm">
        {tasks.map((task) => (
          <li key={task.key} className="flex items-center justify-between gap-gutter-md">
            <div className="flex items-center gap-gutter-sm">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  task.done ? "bg-accent-container text-on-accent-container" : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {task.done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
              </span>
              <span className={`font-body text-body-md ${task.done ? "text-on-surface-variant line-through" : "text-on-surface"}`}>
                {task.label}
              </span>
            </div>
            {!task.done && (
              <Link
                to={task.to}
                className="rounded-md bg-primary px-3 py-1.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success"
              >
                ابدأ
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DashboardPage() {
  const { t } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();
  const { data: products = [] } = useProducts();

  const revenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const awaiting = orders.filter((order) => order.status === "new" || order.status === "confirmed").length;
  const inDelivery = orders.filter((order) => order.status === "shipped").length;
  const delivered = orders.filter((order) => order.status === "delivered");
  const returned = orders.filter((order) => order.status === "returned" || order.status === "canceled").length;
  const deliveryRate = orders.length ? Math.round((delivered.length / orders.length) * 100) : 0;
  const returnRate = orders.length ? Math.round((returned / orders.length) * 100) : 0;
  const deliveredAmount = delivered.reduce((sum, order) => sum + order.amount, 0);
  const collectionPercent = revenue ? Math.round((deliveredAmount / revenue) * 100) : 0;
  const pendingOrders = orders.filter((order) => order.status === "new" || order.status === "confirmed");

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <WelcomeChecklist />
        <div className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">
              {t.dashboard.title}
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">{t.dashboard.subtitle}</p>
          </div>
          <Link
            to="/orders"
            hash="new-order"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2.5 font-headline text-label-md text-on-primary transition-colors duration-state-change hover:bg-success"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            {t.orders.newOrder}
          </Link>
        </div>

        <section className="grid grid-cols-2 gap-gutter-md lg:grid-cols-5">
          <KpiCard label={t.dashboard.revenue} value={formatDA(revenue)} icon="payments" iconClass="bg-accent-container text-on-accent-container" />
          <KpiCard label={t.dashboard.awaitingConfirmation} value={`${awaiting}`} icon="call" iconClass="bg-warning-container text-on-warning-container" hint={t.dashboard.todayOrders} />
          <KpiCard label={t.dashboard.inDelivery} value={`${inDelivery}`} icon="local_shipping" iconClass="bg-primary-container text-on-primary-container" />
          <KpiCard label={t.dashboard.deliveryRate} value={`${deliveryRate}%`} icon="task_alt" iconClass="bg-success-container text-on-success-container" />
          <KpiCard label={t.dashboard.returnRate} value={`${returnRate}%`} icon="keyboard_return" iconClass="bg-error-container text-on-error-container" />
        </section>

        <section className="grid items-start gap-gutter-xl lg:grid-cols-12">
          <div className="flex flex-col gap-gutter-md lg:col-span-7">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-on-surface">{t.dashboard.awaitingConfirmation}</h2>
              <Link to="/orders" className="font-headline text-label-md text-primary">
                {t.dashboard.viewAll}
              </Link>
            </div>
            {isLoading ? (
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
                {t.dashboard.title}...
              </div>
            ) : pendingOrders.length === 0 ? (
              <EmptyState title={t.orders.emptyTitle} subtitle={t.orders.emptySub} />
            ) : (
              pendingOrders.slice(0, 3).map((order) => <PendingOrderCard key={order.id} order={order} />)
            )}
          </div>

          <div className="flex flex-col gap-gutter-md lg:col-span-5">
            <h2 className="font-headline text-title-lg text-on-surface">{t.dashboard.revenue}</h2>
            <section className="flex flex-col gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm lg:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-title-md text-on-surface">{t.dashboard.revenue}</h3>
                  <p className="font-body text-label-md text-on-surface-variant">{t.dashboard.deliveryRate}</p>
                </div>
                <span className="shrink-0 font-headline text-headline-md text-primary tabular-nums">
                  {formatDA(deliveredAmount)}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-low">
                <div className="h-full rounded-full bg-accent" style={{ width: `${collectionPercent}%` }} />
              </div>
              <div className="flex items-center justify-between font-body text-label-sm text-on-surface-variant">
                <span>{delivered.length} {t.dashboard.unitsSold}</span>
                <span className="tabular-nums">{collectionPercent}% {t.dashboard.deliveryRate}</span>
              </div>
            </section>
          </div>
        </section>

        {!isLoading && orders.length === 0 && products.length === 0 && (
          <EmptyState title={t.products.emptyTitle} subtitle={t.dashboard.noData} />
        )}
      </div>
    </DashboardShell>
  );
}
