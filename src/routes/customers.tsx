import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useOrders } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA, wilayaLabel } from "@/lib/coddz";
import { Money } from "@/components/money";
import { LocalDate } from "@/components/local-date";

export const Route = createFileRoute("/customers")({
  component: () => (
    <RequireAuth>
      <CustomersPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Customers — COD YOU" }] }),
});

interface Customer {
  phone: string;
  name: string;
  wilaya: string;
  orders: number;
  total: number;
  lastDate: string;
  delivered: number;
  returned: number;
}

function CustomersPage() {
  const { t, lang } = useLanguage();
  const { data: ordersData, isLoading } = useOrders();
  const orders = ordersData?.pages.flat() ?? [];
  const [search, setSearch] = useState("");

  const map = new Map<string, Customer>();
  for (const o of orders) {
    const key = o.phone || o.id;
    const cur = map.get(key);
    if (!cur) {
      map.set(key, {
        phone: o.phone,
        name: o.name,
        wilaya: o.wilaya,
        orders: 1,
        total: o.amount,
        lastDate: o.date,
        delivered: o.status === "delivered" ? 1 : 0,
        returned: o.status === "returned" ? 1 : 0,
      });
    } else {
      cur.orders += 1;
      cur.total += o.amount;
      if (o.date > cur.lastDate) cur.lastDate = o.date;
      if (o.status === "delivered") cur.delivered += 1;
      if (o.status === "returned") cur.returned += 1;
      if (!cur.name && o.name) cur.name = o.name;
      if (!cur.wilaya && o.wilaya) cur.wilaya = o.wilaya;
    }
  }
  const customers = [...map.values()].sort((a, b) => b.total - a.total);

  const exportCSV = () => {
    const rows = [
      ["الاسم", "الهاتف", "الولاية", "الطلبات", "المبيعات", "التسليم", "المرتجعات", "آخر طلب"],
      ...customers.map((c) => [c.name, c.phone, c.wilaya, String(c.orders), String(c.total), String(c.delivered), String(c.returned), c.lastDate]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const hay = `${c.name} ${c.phone} ${c.wilaya}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.total, 0);
  const repeatCustomers = customers.filter((c) => c.orders > 1).length;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">الزبائن</h1>
            <p className="font-body text-body-md text-on-surface-variant">قائمة زبائنك وطلباتهم</p>
          </div>
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            تصدير CSV
          </button>
        </div>

        <section className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-3 items-stretch">
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">إجمالي الزبائن</span>
              <span className="font-headline text-headline-md tabular-nums text-on-surface">{totalCustomers}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">زبائن متكررون</span>
              <span className="font-headline text-headline-md tabular-nums text-primary">{repeatCustomers}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
              <span className="material-symbols-outlined text-[20px]">repeat</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">إجمالي المبيعات</span>
              <span className="font-headline text-headline-md tabular-nums text-primary"><Money value={totalRevenue} /></span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </span>
          </article>
        </section>

        <div className="relative max-w-md">
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            placeholder="ابحث بالاسم أو الهاتف أو الولاية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-3 pr-10 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-primary"
          />
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            {t.common.loading}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            {t.common.empty}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <table className="w-full border-collapse text-right">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  {["الاسم", "الهاتف", "الولاية", "الطلبات", "المبيعات", "التسليم", "المرتجعات", "آخر طلب"].map((h) => (
                    <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((c) => (
                  <tr key={c.phone} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{c.name}</td>
                    <td className="px-4 py-3.5 font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">{c.phone}</td>
                    <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{wilayaLabel(c.wilaya, lang as any)}</td>
                    <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface">{c.orders}</td>
                    <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-primary"><Money value={c.total} /></td>
                    <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant">{c.delivered}</td>
                    <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant">{c.returned}</td>
                    <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant"><LocalDate value={c.lastDate} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
