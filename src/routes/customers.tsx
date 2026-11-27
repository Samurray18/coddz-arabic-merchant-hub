import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useCustomers, useOrders } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";
import { Money } from "@/components/money";
import { LocalDate } from "@/components/local-date";
import { wilayaLabel } from "@/lib/coddz";
import { buildWhatsAppLink } from "@/lib/coddz";
import { initials, customerSegment, segmentToneClass, segmentLabel } from "@/lib/avatar";
import { formatDA } from "@/lib/coddz";
import { downloadCsv } from "@/lib/csv";

export const Route = createFileRoute("/customers")({
  component: () => (
    <RequireAuth>
      <CustomersPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Customers — COD YOU" }] }),
});

type FilterKey = "all" | "repeat" | "new" | "risk" | "blacklisted";

function CustomersPage() {
  const { t, lang } = useLanguage();
  const { storeId } = useAuth();
  const { data: customers = [], isLoading } = useCustomers();
  const { data: ordersData } = useOrders();
  const allOrders = ordersData?.pages.flat() ?? [];

  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhone(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [blacklistReason, setBlacklistReason] = useState("");
  const [showBlacklist, setShowBlacklist] = useState(false);

  const filtered = customers.filter((c) => {
    const seg = customerSegment(c);
    if (filter === "repeat" && seg !== "repeat") return false;
    if (filter === "new" && seg !== "new") return false;
    if (filter === "risk" && seg !== "risk") return false;
    if (filter === "blacklisted" && seg !== "blacklisted") return false;
    if (search) {
      const hay = `${c.name} ${c.phone} ${c.wilaya}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => customerSegment(c) === "repeat").length;
  const riskCustomers = customers.filter((c) => customerSegment(c) === "risk").length;
  const blacklistedCustomers = customers.filter((c) => c.blacklisted).length;
  const newCustomers = customers.filter((c) => customerSegment(c) === "new").length;

  const selectedCustomer = customers.find((c) => c.phone === selectedPhone) ?? null;
  const customerOrders = allOrders.filter((o) => o.phone === selectedPhone);

  const handleBlacklist = async () => {
    if (!selectedCustomer) return;
    try {
      const { error } = await (supabase as any).from("blacklist").insert({
        store_id: storeId,
        phone: selectedCustomer.phone,
        reason: blacklistReason || null,
      });
      if (error) throw error;
      toast.success("تمت الإضافة إلى القائمة السوداء");
      setShowBlacklist(false);
      setBlacklistReason("");
    } catch (e: any) {
      toast.error(e?.message ?? "خطأ");
    }
  };

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "الكل", count: totalCustomers },
    { key: "repeat", label: "متكررون", count: repeatCustomers },
    { key: "new", label: "جدد", count: newCustomers },
    { key: "risk", label: "مرتجعات مرتفعة", count: riskCustomers },
    { key: "blacklisted", label: "محظورون", count: blacklistedCustomers },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">الزبائن</h1>
          <p className="font-body text-body-md text-on-surface-variant">قائمة زبائنك وطلباتهم</p>
        </div>

        {/* filters + export */}
        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <div className="flex flex-wrap items-center gap-gutter-sm">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-4 py-2 font-headline text-label-md transition-colors duration-state-change ${
                  filter === f.key
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              const rows = [
                ["الاسم", "الهاتف", "الولاية", "الطلبات", "المبيعات", "التسليم", "المرتجعات", "آخر طلب"],
                ...customers.map((c) => [c.name, c.phone, c.wilaya, String(c.orders), String(c.total), String(c.delivered), String(c.returned), c.lastDate]),
              ];
              downloadCsv("customers.csv", rows);
            }}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            تصدير CSV
          </button>
        </div>

        {/* search */}
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

        <p className="font-body text-label-md text-on-surface-variant">{filtered.length} زبون</p>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-gutter-lg lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-outline-variant bg-surface-container-lowest" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="لا توجد زبائن" subtitle="ستظهر الزبائن هنا بعد استقبال طلبات." illustration="customers-empty" />
        ) : (
          <div className="grid grid-cols-1 gap-gutter-lg lg:grid-cols-2">
            {filtered.map((c) => {
              const seg = customerSegment(c);
              return (
                <button
                  key={c.phone}
                  type="button"
                  onClick={() => setSelectedPhone(c.phone)}
                  className="flex flex-col gap-gutter-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-start shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="flex items-center justify-between gap-gutter-md">
                    <div className="flex min-w-0 items-center gap-gutter-md">
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-headline text-title-md ${segmentToneClass(seg)}`}>
                        {initials(c.name)}
                      </span>
                      <div className="min-w-0 flex flex-col gap-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <h3 className="truncate font-headline text-title-md text-on-surface">{c.name || c.phone}</h3>
                          <span className="shrink-0 rounded-full bg-surface-container-low px-2 py-0.5 font-body text-label-sm text-on-surface-variant">
                            {wilayaLabel(c.wilaya, lang as any)}
                          </span>
                        </div>
                        <span className="truncate font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">
                          {c.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${seg === "blacklisted" ? "bg-error-container text-on-error-container" : seg === "risk" ? "bg-warning-container text-on-warning-container" : seg === "repeat" ? "bg-accent-container text-on-accent-container" : "bg-surface-container-low text-on-surface-variant"}`}>
                        {segmentLabel(seg)}
                      </span>
                      <Money value={c.total} className="font-headline text-title-md text-primary" />
                      <span className="font-body text-label-sm text-on-surface-variant">{c.orders} طلبات</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-outline-variant pt-2 text-on-surface-variant">
                    <span className="font-body text-label-sm">تسليم {c.delivered} • مرتجع {c.returned}</span>
                    <LocalDate value={c.lastDate} className="font-body text-label-sm" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal="true" aria-labelledby="customer-detail-title">
            <div className="h-full w-full max-w-md overflow-y-auto bg-surface-container-lowest p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 id="customer-detail-title" className="font-headline text-title-lg text-on-surface">{selectedCustomer.name || selectedCustomer.phone}</h2>
                <button type="button" onClick={() => { setSelectedPhone(null); setShowBlacklist(false); }} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="mt-4 flex gap-gutter-sm">
                {selectedCustomer.phone && (
                  <a href={`tel:${selectedCustomer.phone}`} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-headline text-label-md text-on-primary">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    اتصال
                  </a>
                )}
                {selectedCustomer.phone && (
                  <a
                    href={buildWhatsAppLink(selectedCustomer.phone, "")}
                    className="inline-flex items-center gap-1 rounded-md bg-accent-container px-3 py-1.5 font-headline text-label-md text-on-accent-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp
                  </a>
                )}
              </div>

              {selectedCustomer.blacklisted ? (
                <p className="mt-3 rounded-md bg-error-container px-3 py-2 font-body text-body-md text-on-error-container">محظور</p>
              ) : (
                <div className="mt-3">
                  {!showBlacklist ? (
                    <button type="button" onClick={() => setShowBlacklist(true)} className="rounded-md bg-error-container px-3 py-1.5 font-headline text-label-md text-on-error-container">
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
                          onClick={handleBlacklist}
                          className="rounded-md bg-error px-3 py-1.5 font-headline text-label-md text-on-error"
                        >
                          تأكيد
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBlacklist(false)}
                          className="rounded-md bg-surface-container-low px-3 py-1.5 font-headline text-label-md text-on-surface"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <section className="mt-4">
                <h3 className="font-headline text-title-md text-on-surface">الطلبات</h3>
                <ul className="mt-2 flex flex-col gap-gutter-sm">
                  {customerOrders.map((o) => (
                    <li key={o.id} className="rounded-md border border-outline-variant bg-surface p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-mono-md tabular-nums text-on-surface">#{o.number}</span>
                        <Money value={o.amount} className="font-headline text-label-md text-primary" />
                      </div>
                      <div className="mt-1 flex items-center justify-between font-body text-label-sm text-on-surface-variant">
                        <span>{o.status}</span>
                        <LocalDate value={o.date} />
                      </div>
                    </li>
                  ))}
                  {customerOrders.length === 0 && (
                    <p className="font-body text-body-md text-on-surface-variant">لا توجد طلبات</p>
                  )}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
