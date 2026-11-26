import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useProducts, useStockMovements, useAdjustStock } from "@/hooks/use-data";
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
  if (stock <= 0) return { label: "نفذت الكمية", className: "bg-error-container text-on-error-container", color: "text-error" };
  if (stock < 10) return { label: "مخزون منخفض", className: "bg-warning-container text-on-warning-container", color: "text-warning" };
  return { label: "متوفر", className: "bg-accent-container text-on-accent-container", color: "text-on-surface" };
}

function InventoryPage() {
  const { storeId } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: movements = [], isLoading: movementsLoading } = useStockMovements();
  const adjustStock = useAdjustStock();

  const [tab, setTab] = useState<"products" | "movements">("products");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<any>(null);
  const [adjustDelta, setAdjustDelta] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const total = products.length;
  const low = products.filter((p: any) => p.stock > 0 && p.stock < 10).length;
  const stockValue = products.reduce((sum: number, p: any) => sum + p.price * p.stock, 0);

  const filtered = products.filter((p: any) => {
    if (filter === "low" && !(p.stock > 0 && p.stock < 10)) return false;
    if (filter === "out" && p.stock !== 0) return false;
    if (search && !`${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const ICONS = ["watch", "headphones", "blender", "backpack", "lightbulb"];

  const handleAdjust = async () => {
    if (!adjustProduct) return;
    const delta = Number(adjustDelta);
    if (!Number.isFinite(delta) || delta === 0) {
      toast.error("أدخل كمية صحيحة");
      return;
    }
    try {
      await adjustStock.mutateAsync({ productId: adjustProduct.id, delta, reason: adjustReason });
      toast.success("تم تعديل المخزون");
      setAdjustOpen(false);
      setAdjustDelta("");
      setAdjustReason("");
      setAdjustProduct(null);
    } catch (e: any) {
      toast.error(e?.message ?? "خطأ");
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">المخزون</h1>
            <p className="font-body text-body-md text-on-surface-variant">أدر المخزون والحركات</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary transition-colors hover:bg-success"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            إضافة منتج
          </Link>
        </div>

        {/* tabs */}
        <div className="flex gap-gutter-sm border-b border-outline-variant">
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${
              tab === "products" ? "bg-accent-container text-on-accent-container" : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            المنتجات
          </button>
          <button
            type="button"
            onClick={() => setTab("movements")}
            className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${
              tab === "movements" ? "bg-accent-container text-on-accent-container" : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            الحركات
          </button>
        </div>

        {tab === "products" && (
          <>
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-3 pr-10 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-gutter-sm">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-4 py-2 font-headline text-label-md transition-colors duration-state-change ${
                    filter === "all" ? "bg-primary text-on-primary" : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  الكل ({total})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("low")}
                  className={`rounded-full px-4 py-2 font-body text-label-md transition-colors duration-state-change ${
                    filter === "low" ? "bg-primary text-on-primary" : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  منخفض ({low})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("out")}
                  className={`rounded-full px-4 py-2 font-body text-label-md transition-colors duration-state-change ${
                    filter === "out" ? "bg-primary text-on-primary" : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  نفذت الكمية ({products.filter((p: any) => p.stock === 0).length})
                </button>
              </div>
            </section>

            {productsLoading ? (
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
                      <th className="px-5 py-3.5 font-headline text-label-md text-on-surface-variant">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtered.map((product: any, index: number) => {
                      const status = statusFor(product.stock);
                      const ICONS_LOCAL = ["watch", "headphones", "blender", "backpack", "lightbulb"];
                      return (
                        <tr key={product.id} className="transition-colors duration-state-change hover:bg-surface-container-low">
                          <td className="px-5 py-4 font-mono text-mono-md text-on-surface-variant">{product.sku || `SKU-${product.id.slice(0, 4)}`}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-gutter-sm">
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${product.stock <= 0 ? "bg-surface-container-low text-on-surface-variant" : product.stock < 10 ? "bg-primary-container text-on-primary-container" : "bg-accent-container text-on-accent-container"}`}>
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
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => { setAdjustProduct(product); setAdjustOpen(true); }}
                              className="rounded-md bg-surface-container-low px-3 py-1.5 font-headline text-label-sm text-on-surface transition-colors hover:bg-surface-container"
                            >
                              تعديل المخزون
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}

        {tab === "movements" && (
          movementsLoading ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
              جارٍ التحميل...
            </div>
          ) : movements.length === 0 ? (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
              لا توجد حركات
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <table className="w-full border-collapse text-right">
                <thead className="border-b border-outline-variant bg-surface-container-low">
                  <tr>
                    {["المنتج", "التغيير", "السبب", "الوقت"].map((h) => (
                      <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {movements.map((m: any) => {
                    const prod = products.find((p: any) => p.id === m.product_id);
                    return (
                      <tr key={m.id}>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{prod?.name ?? m.product_id}</td>
                        <td className={`px-4 py-3.5 font-headline text-label-lg tabular-nums ${m.change >= 0 ? "text-success" : "text-error"}`}>
                          {m.change >= 0 ? `+${m.change}` : m.change}
                        </td>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface-variant">{m.reason}</td>
                        <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant">{new Date(m.created_at).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {adjustOpen && adjustProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
              <h2 className="font-headline text-title-lg text-on-surface">تعديل المخزون — {adjustProduct.name}</h2>
              <div className="mt-4 flex flex-col gap-gutter-md">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">التغيير (موجب/سالب)</span>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(e.target.value)}
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">السبب</span>
                  <input
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                </label>
                <div className="flex gap-gutter-md">
                  <button
                    type="button"
                    onClick={handleAdjust}
                    disabled={adjustStock.isPending}
                    className="flex-1 rounded-md bg-primary py-2 font-headline text-label-md text-on-primary disabled:opacity-60"
                  >
                    {adjustStock.isPending ? "..." : "حفظ"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdjustOpen(false); setAdjustProduct(null); }}
                    className="rounded-md bg-surface-container-low px-4 py-2 font-headline text-label-md text-on-surface"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
