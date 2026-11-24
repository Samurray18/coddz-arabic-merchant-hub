import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useOrders, useSaveOrder, useUpdateOrderStatus } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";
import {
  buildWhatsAppLink,
  CARRIERS,
  formatDA,
  isValidAlgerianPhone,
  normalizeAlgerianPhone,
  ORDER_STATUSES,
  STATUS_BADGE_CLASS,
  WILAYAS,
  type OrderStatus,
} from "@/lib/coddz";

export const Route = createFileRoute("/orders")({
  component: () => (
    <RequireAuth>
      <OrdersPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Orders — COD YOU" }] }),
});

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none";

const emptyForm = {
  name: "",
  phone: "",
  wilaya: "",
  product: "",
  amount: "",
  carrier: "Yalidine",
  notes: "",
};

function OrdersPage() {
  const { t, lang } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();
  const saveOrder = useSaveOrder();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (window.location.hash === "#new-order") setCreateOpen(true);
  }, []);

  const counts = ORDER_STATUSES.reduce(
    (acc, status) => {
      acc[status] = orders.filter((order) => order.status === status).length;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  const filtered = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (search) {
      const haystack = `${order.number} ${order.name} ${order.phone} ${order.product} ${order.wilaya}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error(t.products.name);
      return;
    }
    const phone = normalizeAlgerianPhone(form.phone);
    if (!phone) {
      setPhoneError(t.orders.invalidPhone);
      return;
    }
    setPhoneError("");
    try {
      await saveOrder.mutateAsync({
        name: form.name.trim(),
        phone,
        wilaya: form.wilaya,
        product: form.product,
        amount: Number(form.amount) || 0,
        carrier: form.carrier,
        status: "new",
        notes: form.notes,
        date: new Date().toISOString().slice(0, 10),
      });
      setCreateOpen(false);
      setForm({ ...emptyForm });
      toast.success(t.orders.newOrder);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const whatsappMessage = (name: string, number: string, product: string, amount: number, wilaya: string) =>
    t.orders.whatsappTemplate
      .replace("{name}", name)
      .replace("{number}", number)
      .replace("{product}", product)
      .replace("{amount}", formatDA(amount))
      .replace("{wilaya}", wilaya);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-lg">
        <div className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">
              {t.orders.title}
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">{t.orders.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2.5 font-headline text-label-md text-on-primary transition-colors duration-state-change hover:bg-success"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            {t.orders.newOrder}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <label className="flex w-full flex-col gap-1.5 sm:w-64">
            <span className="sr-only font-body text-label-md">{t.orders.searchPlaceholder}</span>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute right-3.5 flex items-center text-outline">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.orders.searchPlaceholder}
                className={`${fieldClass} pr-10`}
              />
            </div>
          </label>
          <div className="flex flex-wrap items-center gap-gutter-xs" role="tablist" aria-label={t.orders.statusCol}>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              aria-pressed={statusFilter === "all"}
              className={`rounded-full border px-3 py-1.5 font-body text-label-md transition-colors duration-state-change ${
                statusFilter === "all"
                  ? "border-accent bg-accent-container text-on-accent-container"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {t.orders.allStatuses} ({orders.length})
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={`rounded-full border px-3 py-1.5 font-body text-label-md transition-colors duration-state-change ${
                  statusFilter === status
                    ? "border-accent bg-accent-container text-on-accent-container"
                    : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {t.status[status]} ({counts[status]})
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            {t.orders.title}...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={t.orders.emptyTitle} subtitle={t.orders.emptySub} />
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <table className="w-full border-collapse text-right">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  {[
                    t.orders.statusCol,
                    t.orders.customer,
                    t.orders.phone,
                    t.orders.wilaya,
                    t.orders.product,
                    t.orders.amount,
                    t.orders.carrier,
                    t.orders.actions,
                  ].map((header) => (
                    <th key={header} scope="col" className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((order) => (
                  <tr key={order.id} className="transition-colors duration-state-change hover:bg-surface-container-low">
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-mono-md tabular-nums text-on-surface">#{order.number || "—"}</span>
                        <div className="flex flex-wrap gap-1">
                          {order.source && order.source !== "manual" && (
                            <span className="rounded-full bg-primary-container px-2 py-0.5 font-body text-label-sm text-on-primary-container">
                              {order.source === "api"
                                ? "API"
                                : order.source === "shopify"
                                ? "Shopify"
                                : order.source === "woocommerce"
                                ? "WooCommerce"
                                : order.source}
                            </span>
                          )}
                          {order.flags?.duplicate && (
                            <span className="rounded-full bg-warning-container px-2 py-0.5 font-body text-label-sm text-on-warning-container">
                              مكرر
                            </span>
                          )}
                          {order.flags?.blacklisted && (
                            <span className="rounded-full bg-error-container px-2 py-0.5 font-body text-label-sm text-on-error-container">
                              قائمة سوداء
                            </span>
                          )}
                          {(order.flags?.previous_returns ?? 0) > 0 && (
                            <span className="rounded-full bg-warning-container px-2 py-0.5 font-body text-label-sm text-on-warning-container">
                              مرتجعات سابقة
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{order.name}</td>
                    <td className="px-4 py-3.5 font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">
                      {order.phone}
                    </td>
                    <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{order.wilaya}</td>
                    <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{order.product}</td>
                    <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface">{formatDA(order.amount)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 font-body text-label-sm ${STATUS_BADGE_CLASS[order.status]}`}>
                        {t.status[order.status as OrderStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-gutter-xs">
                        {(order.status === "new" || order.status === "confirmed") && (
                          <button
                            type="button"
                            onClick={() => updateStatus.mutate({ id: order.id, status: "shipped" })}
                            disabled={updateStatus.isPending}
                            className="rounded-md bg-primary px-2.5 py-1.5 font-headline text-label-sm text-on-primary transition-colors hover:bg-success disabled:opacity-60"
                          >
                            {t.orders.confirmAndSend}
                          </button>
                        )}
                        {order.phone && (
                          <a
                            href={buildWhatsAppLink(
                              order.phone,
                              whatsappMessage(order.name, order.number, order.product, order.amount, order.wilaya),
                            )}
                            className="inline-flex items-center gap-1 rounded-md bg-surface-container-low px-2.5 py-1.5 font-body text-label-sm text-on-surface transition-colors hover:bg-surface-container"
                          >
                            <span className="material-symbols-outlined text-[16px]">call</span>
                            {t.orders.call}
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-gutter-md">
              <div>
                <h2 className="font-headline text-title-lg text-on-surface">{t.orders.newOrder}</h2>
                <p className="font-body text-label-md text-on-surface-variant">{t.orders.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                aria-label="close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="grid gap-gutter-md">
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">{t.orders.customer}</span>
                <input className={fieldClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">{t.orders.phone}</span>
                <input
                  className={fieldClass}
                  dir="ltr"
                  value={form.phone}
                  onChange={(event) => {
                    setForm({ ...form, phone: event.target.value });
                    setPhoneError("");
                  }}
                  placeholder="0551 23 45 67"
                />
                {phoneError && <span className="font-body text-label-sm text-error">{phoneError}</span>}
              </label>
              <div className="grid grid-cols-1 gap-gutter-md sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">{t.orders.wilaya}</span>
                  <select className={fieldClass} value={form.wilaya} onChange={(event) => setForm({ ...form, wilaya: event.target.value })}>
                    <option value="">{t.orders.allWilayas}</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya.code} value={wilaya.latin}>
                        {wilaya.code} - {lang === "ar" ? wilaya.ar : wilaya.latin}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">{t.orders.carrier}</span>
                  <select className={fieldClass} value={form.carrier} onChange={(event) => setForm({ ...form, carrier: event.target.value })}>
                    {CARRIERS.map((carrier) => (
                      <option key={carrier} value={carrier}>
                        {carrier}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-1 gap-gutter-md sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">{t.orders.product}</span>
                  <input className={fieldClass} value={form.product} onChange={(event) => setForm({ ...form, product: event.target.value })} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">{t.orders.amount}</span>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={form.amount}
                    onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">{t.orders.notes}</span>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                />
              </label>
              <div className="flex items-center gap-gutter-md border-t border-outline-variant pt-3">
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={saveOrder.isPending}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {t.orders.save}
                </button>
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-md bg-surface-container-low px-4 py-2.5 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container"
                >
                  {t.orders.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
