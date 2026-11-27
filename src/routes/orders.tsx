import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useOrders, useSaveOrder, useUpdateOrderStatus, useRecordReturn } from "@/hooks/use-data";
import { Money } from "@/components/money";
import { LocalDate } from "@/components/local-date";
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
  wilayaLabel,
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
  const { storeId, user } = useAuth();
  const {
    data: ordersData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrders();
  const orders = ordersData?.pages.flat() ?? [];
  const saveOrder = useSaveOrder();
  const updateStatus = useUpdateOrderStatus();
  const recordReturn = useRecordReturn();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const exportCSV = () => {
    const rows = [
      [
        "رقم الطلب",
        "الزبون",
        "الهاتف",
        "الولاية",
        "المنتج",
        "المبلغ",
        "الحالة",
        "الناقل",
        "التاريخ",
      ],
      ...orders.map((o) => [
        o.number,
        o.name,
        o.phone,
        o.wilaya,
        o.product,
        String(o.amount),
        o.status,
        o.carrier,
        o.date,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const [notesDraft, setNotesDraft] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [restock, setRestock] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("confirmed");

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null;

  const { data: events = [] } = useQuery({
    queryKey: ["order_events", selectedId],
    enabled: !!selectedId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", selectedId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const userIds = Array.from(new Set(events.map((e) => e.user_id).filter(Boolean))) as string[];
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles", userIds.join(",")],
    enabled: userIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);
      if (error) throw error;
      return data ?? [];
    },
  });
  const profileMap = new Map(profiles.map((p) => [p.id, p.display_name]));

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
      const haystack =
        `${order.number} ${order.name} ${order.phone} ${order.product} ${order.wilaya}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const selectedCount = selectedIds.size;
  const canBulkConfirm =
    selectedCount > 0 &&
    filtered.some((o) => selectedIds.has(o.id) && (o.status === "new" || o.status === "confirmed"));
  const canBulkShip =
    selectedCount > 0 &&
    filtered.some((o) => selectedIds.has(o.id) && (o.status === "new" || o.status === "confirmed"));

  const toggleSelectAll = () => {
    if (selectedCount === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((o) => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const bulkUpdateStatus = async (status: OrderStatus) => {
    const ids = Array.from(selectedIds).filter((id) => {
      const order = filtered.find((o) => o.id === id);
      return order && (order.status === "new" || order.status === "confirmed");
    });
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) => updateStatus.mutateAsync({ id, status })));
      toast.success(`${ids.length} ${t.orders.confirmAndSend}`);
      setSelectedIds(new Set());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const bulkExportCSV = () => {
    const selectedOrders = filtered.filter((o) => selectedIds.has(o.id));
    if (!selectedOrders.length) return;
    const rows = [
      [
        "رقم الطلب",
        "الزبون",
        "الهاتف",
        "الولاية",
        "المنتج",
        "المبلغ",
        "الحالة",
        "الناقل",
        "التاريخ",
      ],
      ...selectedOrders.map((o) => [
        o.number,
        o.name,
        o.phone,
        o.wilaya,
        o.product,
        String(o.amount),
        o.status,
        o.carrier,
        o.date,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${selectedOrders.length}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const whatsappMessage = (
    name: string,
    number: string,
    product: string,
    amount: number,
    wilaya: string,
  ) =>
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
          <div className="flex shrink-0 items-center gap-gutter-sm">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              تصدير CSV
            </button>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2.5 font-headline text-label-md text-on-primary transition-colors duration-state-change hover:bg-success"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              {t.orders.newOrder}
            </button>
          </div>
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
          <div
            className="flex flex-wrap items-center gap-gutter-xs"
            role="tablist"
            aria-label={t.orders.statusCol}
          >
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
            {t.common.loading}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={t.orders.emptyTitle} subtitle={t.orders.emptySub} />
        ) : (
          <>
            {selectedCount > 0 && (
              <div className="flex items-center justify-between gap-gutter-md rounded-xl border border-accent bg-accent-container px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-body text-body-md text-on-accent-container">
                    {selectedCount} {t.orders.selected}
                  </span>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
                    className="rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-body text-label-md text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="confirmed">{t.status.confirmed}</option>
                    <option value="shipped">{t.status.shipped}</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => bulkUpdateStatus(bulkStatus)}
                    disabled={updateStatus.isPending || !canBulkConfirm}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {t.orders.confirmAndSend}
                  </button>
                  <button
                    type="button"
                    onClick={bulkExportCSV}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    {t.orders.exportSelected}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-on-accent-container hover:text-on-surface"
                  aria-label="Clear selection"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            )}
            <div className="w-full overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <table className="w-full border-collapse text-right">
                <thead className="border-b border-outline-variant bg-surface-container-low">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3.5 font-body text-label-md text-on-surface-variant w-12"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCount === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                        aria-label="Select all"
                      />
                    </th>
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
                      <th
                        key={header}
                        scope="col"
                        className="px-4 py-3.5 font-body text-label-md text-on-surface-variant"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors duration-state-change hover:bg-surface-container-low"
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                          aria-label={`Select order ${order.number}`}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-mono-md tabular-nums text-on-surface">
                            #{order.number || "—"}
                          </span>
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
                      <td className="px-4 py-3.5 font-body text-body-md text-on-surface">
                        {order.name}
                      </td>
                      <td
                        className="px-4 py-3.5 font-mono text-mono-md tabular-nums text-on-surface-variant"
                        dir="ltr"
                      >
                        {order.phone}
                      </td>
                      <td className="px-4 py-3.5 font-body text-body-md text-on-surface">
                        {wilayaLabel(order.wilaya, lang as any)}
                      </td>
                      <td className="px-4 py-3.5 font-body text-body-md text-on-surface">
                        {order.product}
                      </td>
                      <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface">
                        <Money value={order.amount} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 font-body text-label-sm ${STATUS_BADGE_CLASS[order.status]}`}
                        >
                          {t.status[order.status as OrderStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-gutter-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedId(order.id);
                              setNotesDraft(order.notes ?? "");
                            }}
                            className="rounded-md bg-surface-container-low px-2.5 py-1.5 font-body text-label-sm text-on-surface transition-colors hover:bg-surface-container"
                          >
                            {t.common.view}
                          </button>
                          {(order.status === "new" || order.status === "confirmed") && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus.mutate({ id: order.id, status: "shipped" })
                              }
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
                                whatsappMessage(
                                  order.name,
                                  order.number,
                                  order.product,
                                  order.amount,
                                  order.wilaya,
                                ),
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
            {hasNextPage && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-md bg-surface-container-low px-4 py-2 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container disabled:opacity-60"
                >
                  {isFetchingNextPage ? t.common.loading : t.common.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-gutter-md">
              <div>
                <h2 className="font-headline text-title-lg text-on-surface">{t.orders.newOrder}</h2>
                <p className="font-body text-label-md text-on-surface-variant">
                  {t.orders.subtitle}
                </p>
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
                <span className="font-body text-label-md text-on-surface-variant">
                  {t.orders.customer}
                </span>
                <input
                  className={fieldClass}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">
                  {t.orders.phone}
                </span>
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
                {phoneError && (
                  <span className="font-body text-label-sm text-error">{phoneError}</span>
                )}
              </label>
              <div className="grid grid-cols-1 gap-gutter-md sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">
                    {t.orders.wilaya}
                  </span>
                  <select
                    className={fieldClass}
                    value={form.wilaya}
                    onChange={(event) => setForm({ ...form, wilaya: event.target.value })}
                  >
                    <option value="">{t.orders.allWilayas}</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya.code} value={wilaya.latin}>
                        {wilaya.code} - {lang === "ar" ? wilaya.ar : wilaya.latin}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">
                    {t.orders.carrier}
                  </span>
                  <select
                    className={fieldClass}
                    value={form.carrier}
                    onChange={(event) => setForm({ ...form, carrier: event.target.value })}
                  >
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
                  <span className="font-body text-label-md text-on-surface-variant">
                    {t.orders.product}
                  </span>
                  <input
                    className={fieldClass}
                    value={form.product}
                    onChange={(event) => setForm({ ...form, product: event.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">
                    {t.orders.amount}
                  </span>
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
                <span className="font-body text-label-md text-on-surface-variant">
                  {t.orders.notes}
                </span>
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

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="h-full w-full max-w-md overflow-y-auto bg-surface-container-lowest p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-on-surface">
                تفاصيل الطلب #{selectedOrder.number}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* customer card */}
            <section className="mt-4 rounded-xl border border-outline-variant bg-surface p-4">
              <h3 className="font-headline text-title-md text-on-surface">{selectedOrder.name}</h3>
              <p className="font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">
                {selectedOrder.phone}
              </p>
              <p className="font-body text-body-md text-on-surface-variant">
                {wilayaLabel(selectedOrder.wilaya, lang as any)}
                {selectedOrder.commune ? ` • ${selectedOrder.commune}` : ""}
              </p>
              {selectedOrder.address && (
                <p className="font-body text-body-md text-on-surface-variant">
                  {selectedOrder.address}
                </p>
              )}
              <div className="mt-3 flex gap-gutter-sm">
                {selectedOrder.phone && (
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-headline text-label-md text-on-primary"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    اتصال
                  </a>
                )}
                {selectedOrder.phone && (
                  <a
                    href={buildWhatsAppLink(
                      selectedOrder.phone,
                      whatsappMessage(
                        selectedOrder.name,
                        selectedOrder.number,
                        selectedOrder.product,
                        selectedOrder.amount,
                        selectedOrder.wilaya,
                      ),
                    )}
                    className="inline-flex items-center gap-1 rounded-md bg-accent-container px-3 py-1.5 font-headline text-label-md text-on-accent-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp
                  </a>
                )}
              </div>
            </section>

            {/* items */}
            <section className="mt-4">
              <h3 className="font-headline text-title-md text-on-surface">المنتجات</h3>
              <p className="mt-1 font-body text-body-md text-on-surface-variant">
                {selectedOrder.product}
              </p>
            </section>

            {/* price breakdown */}
            <section className="mt-4 rounded-xl border border-outline-variant bg-surface p-4">
              <div className="flex justify-between font-body text-body-md text-on-surface">
                <span>المجموع</span>
                <span className="tabular-nums">{formatDA(selectedOrder.amount)}</span>
              </div>
              {selectedOrder.delivery_price != null && (
                <div className="flex justify-between font-body text-body-md text-on-surface-variant">
                  <span>التوصيل</span>
                  <span className="tabular-nums">
                    <Money value={selectedOrder.delivery_price ?? 0} />
                  </span>
                </div>
              )}
            </section>

            {/* flags */}
            {selectedOrder.flags && (
              <div className="mt-4 flex flex-wrap gap-1">
                {selectedOrder.flags.duplicate && (
                  <span className="rounded-full bg-warning-container px-2 py-0.5 font-body text-label-sm text-on-warning-container">
                    مكرر
                  </span>
                )}
                {selectedOrder.flags.blacklisted && (
                  <span className="rounded-full bg-error-container px-2 py-0.5 font-body text-label-sm text-on-error-container">
                    قائمة سوداء
                  </span>
                )}
                {(selectedOrder.flags.previous_returns ?? 0) > 0 && (
                  <span className="rounded-full bg-warning-container px-2 py-0.5 font-body text-label-sm text-on-warning-container">
                    مرتجعات سابقة
                  </span>
                )}
              </div>
            )}

            {/* notes editable */}
            <section className="mt-4">
              <h3 className="font-headline text-title-md text-on-surface">ملاحظات</h3>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="mt-2 w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { error } = await (supabase as any)
                      .from("orders")
                      .update({ notes: notesDraft, payload: { ...{}, notes: notesDraft } })
                      .eq("id", selectedOrder.id)
                      .eq("store_id", storeId);
                    if (error) throw error;
                    // update payload notes too
                    const { data: cur } = await (supabase as any)
                      .from("orders")
                      .select("payload")
                      .eq("id", selectedOrder.id)
                      .single();
                    const pl = { ...((cur?.payload as any) ?? {}), notes: notesDraft };
                    const { error: noteErr } = await (supabase as any)
                      .from("orders")
                      .update({ payload: pl, notes: notesDraft })
                      .eq("id", selectedOrder.id);
                    if (noteErr) throw noteErr;
                    qc.invalidateQueries({ queryKey: ["orders", storeId] });
                    toast.success("تم حفظ الملاحظات");
                  } catch (e: any) {
                    toast.error(e?.message ?? "خطأ");
                  }
                }}
                className="mt-2 rounded-md bg-primary px-3 py-1.5 font-headline text-label-md text-on-primary"
              >
                {t.common.save}
              </button>
            </section>

            {/* status actions */}
            <section className="mt-4 flex flex-wrap gap-gutter-sm">
              {(["confirmed", "shipped", "delivered", "canceled"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus.mutate({ id: selectedOrder.id, status: s })}
                  disabled={updateStatus.isPending}
                  className="rounded-md bg-surface-container-low px-3 py-1.5 font-headline text-label-sm text-on-surface transition-colors hover:bg-surface-container disabled:opacity-60"
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowReturn(true)}
                className="rounded-md bg-error-container px-3 py-1.5 font-headline text-label-sm text-on-error-container"
              >
                مرتجع
              </button>
            </section>

            {showReturn && (
              <section className="mt-4 rounded-xl border border-outline-variant bg-surface p-4">
                <h3 className="font-headline text-title-md text-on-surface">تسجيل مرتجع</h3>
                <textarea
                  rows={2}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="السبب"
                  className="mt-2 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                />
                {selectedOrder.status === "shipped" || selectedOrder.status === "delivered" ? (
                  <label className="mt-2 flex items-center gap-2 font-body text-body-md text-on-surface">
                    <input
                      type="checkbox"
                      checked={restock}
                      onChange={(e) => setRestock(e.target.checked)}
                      className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    إعادة للمخزون
                  </label>
                ) : (
                  <p className="mt-2 font-body text-body-md text-on-surface-variant">
                    لم يتم خصم هذا الطلب من المخزون
                  </p>
                )}
                <div className="mt-3 flex gap-gutter-sm">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const canRestock =
                          selectedOrder.status === "shipped" ||
                          selectedOrder.status === "delivered";
                        await recordReturn.mutateAsync({
                          id: selectedOrder.id,
                          reason: returnReason,
                          restock: canRestock ? restock : false,
                        });
                        toast.success("تم تسجيل المرتجع");
                        setShowReturn(false);
                        setReturnReason("");
                      } catch (e: any) {
                        toast.error(e?.message ?? "خطأ");
                      }
                    }}
                    disabled={recordReturn.isPending}
                    className="rounded-md bg-error px-3 py-1.5 font-headline text-label-md text-on-error disabled:opacity-60"
                  >
                    {recordReturn.isPending ? "..." : "تأكيد"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReturn(false)}
                    className="rounded-md bg-surface-container-low px-3 py-1.5 font-headline text-label-md text-on-surface"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              </section>
            )}

            {/* blacklist */}
            <section className="mt-4">
              {!showBlacklist ? (
                <button
                  type="button"
                  onClick={() => setShowBlacklist(true)}
                  className="rounded-md bg-error-container px-3 py-1.5 font-headline text-label-md text-on-error-container"
                >
                  إضافة إلى القائمة السوداء
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                    placeholder="السبب (اختياري)"
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                  <div className="flex gap-gutter-sm">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const { error } = await (supabase as any).from("blacklist").insert({
                            store_id: storeId,
                            phone: selectedOrder.phone,
                            reason: blacklistReason || null,
                          });
                          if (error) throw error;
                          toast.success("تمت الإضافة إلى القائمة السوداء");
                          setShowBlacklist(false);
                          setBlacklistReason("");
                        } catch (e: any) {
                          toast.error(e?.message ?? "خطأ");
                        }
                      }}
                      className="rounded-md bg-error px-3 py-1.5 font-headline text-label-md text-on-error"
                    >
                      تأكيد
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBlacklist(false)}
                      className="rounded-md bg-surface-container-low px-3 py-1.5 font-headline text-label-md text-on-surface"
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* timeline */}
            <section className="mt-4">
              <h3 className="font-headline text-title-md text-on-surface">الجدول الزمني</h3>
              <ul className="mt-2 flex flex-col gap-gutter-sm">
                {(events as any[]).map((ev) => (
                  <li
                    key={ev.id}
                    className="rounded-md border border-outline-variant bg-surface p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-headline text-label-md text-on-surface">{ev.type}</span>
                      <span className="font-body text-label-sm text-on-surface-variant">
                        {new Date(ev.created_at).toLocaleString()}
                      </span>
                    </div>
                    {(ev.from_status || ev.to_status) && (
                      <p className="font-body text-body-md text-on-surface-variant">
                        {ev.from_status ?? "—"} → {ev.to_status ?? "—"}
                      </p>
                    )}
                    {ev.note && (
                      <p className="font-body text-body-md text-on-surface-variant">{ev.note}</p>
                    )}
                    {ev.user_id && (
                      <p className="font-body text-label-sm text-on-surface-variant">
                        {profileMap.get(ev.user_id) ?? ev.user_id}
                      </p>
                    )}
                  </li>
                ))}
                {events.length === 0 && (
                  <p className="font-body text-body-md text-on-surface-variant">لا توجد أحداث</p>
                )}
              </ul>
            </section>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
