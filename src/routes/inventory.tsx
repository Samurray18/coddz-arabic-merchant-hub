import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useProducts } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA } from "@/lib/coddz";

export const Route = createFileRoute("/inventory")({
  component: () => (
    <RequireAuth>
      <InventoryPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Inventory — COD YOU" }] }),
});

function statusFor(stock: number) {
  if (stock <= 0) return { label: "نفذت الكمية", className: "bg-error-container text-on-error-container", icon: "backpack", color: "text-error" };
  if (stock < 10) return { label: "مخزون منخفض", className: "bg-warning-container text-on-warning-container", icon: "headphones", color: "text-warning" };
  return { label: "متوفر", className: "bg-accent-container text-on-accent-container", icon: "watch", color: "text-on-surface" };
}

function InventoryPage() {
  const { t } = useLanguage();
  const { data: products = [], isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const total = products.length;
  const low = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const filtered = products.filter((p) => {
    if (filter === "low" && !(p.stock > 0 && p.stock < 10)) return false;
    if (filter === "out" && p.stock !== 0) return false;
    if (search && !`${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const ICONS = ["watch", "headphones", "blender", "backpack", "lightbulb"];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-3 items-stretch">
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">إجمالي المنتجات</span>
              <span className="font-headline text-headline-md tabular-nums text-on-surface">{total} منتجًا</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">مخزون منخفض</span>
              <span className="font-headline text-headline-md tabular-nums text-warning">{low} منتجات</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-container text-on-warning-container">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">قيمة المخزون الحالية</span>
              <span className="font-headline text-headline-md tabular-nums text-primary">{formatDA(stockValue)}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </span>
          </article>
        </section>

        <section className="flex items-center justify-between gap-gutter-md">
          <div className="relative max-w-md flex-1">
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              search
            </span>
            <input
              type="search"
              aria-label="بحث في المخزون"
              placeholder="ابحث باسم المنتج أو رمز SKU..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-3 pr-10 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-gutter-sm">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 font-headline text-label-md transition-colors duration-state-change ${
                filter === "all"
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              الكل ({total})
            </button>
            <button
              type="button"
              onClick={() => setFilter("low")}
              className={`rounded-full px-4 py-2 font-body text-label-md transition-colors duration-state-change ${
                filter === "low"
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              منخفض ({low})
            </button>
            <button
              type="button"
              onClick={() => setFilter("out")}
              className={`rounded-full px-4 py-2 font-body text-label-md transition-colors duration-state-change ${
                filter === "out"
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              نفذت الكمية ({products.filter((p) => p.stock === 0).length})
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary transition-colors hover:bg-success"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              إضافة منتج
            </Link>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            جارٍ التحميل...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            لا توجد منتجات
          </div>
        ) : (
          <section className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <table className="min-w-[720px] w-full table-fixed border-collapse text-right">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">رمز SKU</th>
                  <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">المنتج</th>
                  <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">التصنيف</th>
                  <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">المتوفر</th>
                  <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">سعر البيع</th>
                  <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((product, index) => {
                  const status = statusFor(product.stock);
                  return (
                    <tr key={product.id} className="transition-colors duration-state-change hover:bg-surface-container-low">
                      <td className="px-5 py-4 font-mono text-mono-md text-on-surface-variant">{product.sku || `SKU-${product.id.slice(0, 4)}`}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-gutter-sm">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                              product.stock <= 0
                                ? "bg-surface-container-low text-on-surface-variant"
                                : product.stock < 10
                                  ? "bg-primary-container text-on-primary-container"
                                  : "bg-accent-container text-on-accent-container"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{ICONS[index % ICONS.length]}</span>
                          </span>
                          <span className="font-headline text-title-md text-on-surface">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-body text-body-md text-on-surface-variant">{product.category}</td>
                      <td className={`px-5 py-4 font-headline text-label-lg tabular-nums ${status.color}`}>{product.stock} قطعة</td>
                      <td className="px-5 py-4 font-headline text-label-lg tabular-nums text-primary">{formatDA(product.price)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-body text-label-sm ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
