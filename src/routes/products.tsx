import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useProducts, useSaveProduct, useDeleteProduct } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";
import { formatDA, getProductImage, PRODUCT_IMAGES } from "@/lib/coddz";
import { Money } from "@/components/money";
import type { Product } from "@/lib/domain";

export const Route = createFileRoute("/products")({
  component: () => (
    <RequireAuth>
      <ProductsPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Products — COD YOU" }] }),
});

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none";

const emptyForm = {
  name: "",
  price: "",
  cost: "",
  stock: "",
  category: "إلكترونيات",
  sku: "",
  image: "watch",
  variants: "",
  lowStockThreshold: "",
};

function ProductsPage() {
  const { t } = useLanguage();
  const { data: productsData, isLoading } = useProducts();
  const products = productsData?.pages.flat() ?? [];
  const saveProduct = useSaveProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [codEnabled, setCodEnabled] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const exportCSV = () => {
    const rows = [
      ["اسم المنتج", "SKU", "التصنيف", "سعر البيع", "التكلفة", "المخزون"],
      ...products.map((p) => [
        p.name,
        p.sku,
        p.category,
        String(p.price),
        String(p.cost),
        String(p.stock),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );
  const filtered = products.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (search && !`${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setEditOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: String(product.price),
      cost: String(product.cost),
      stock: String(product.stock),
      category: product.category,
      sku: product.sku,
      image: product.image ?? "watch",
      variants: product.variants ?? "",
      lowStockThreshold:
        product.lowStockThreshold != null ? String(product.lowStockThreshold) : "",
    });
    setImagePreview(product.image ? getProductImage(product.image) : null);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error(t.products.name);
      return;
    }
    try {
      await saveProduct.mutateAsync({
        ...(editing ? { id: editing.id } : {}),
        name: form.name.trim(),
        price: Number(form.price) || 0,
        cost: Number(form.cost) || 0,
        stock: Number(form.stock) || 0,
        category: form.category || "إلكترونيات",
        sku: form.sku,
        image: form.image,
        variants: form.variants,
      });
      setEditOpen(false);
      toast.success(t.products.save);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const margin = (price: number, cost: number) =>
    price ? Math.round(((price - cost) / price) * 100) : 0;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-lg">
        <div className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">
              {t.products.title}
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">{t.products.subtitle}</p>
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
              onClick={openNew}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2.5 font-headline text-label-md text-on-primary transition-colors duration-state-change hover:bg-success"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              {t.products.addProduct}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-gutter-md">
          <label className="flex w-full flex-col gap-1.5 sm:w-64">
            <span className="sr-only font-body text-label-md">{t.products.searchPlaceholder}</span>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute right-3.5 flex items-center text-outline">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.products.searchPlaceholder}
                className={`${fieldClass} pr-10`}
              />
            </div>
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label={t.products.allCategories}
            className="rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="all">{t.products.allCategories}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            {t.common.loading}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={t.products.emptyTitle} subtitle={t.products.emptySub} />
        ) : (
          <div className="grid gap-gutter-lg sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm"
              >
                <div className="aspect-video bg-surface-container-low">
                  <img
                    src={getProductImage(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-gutter-md p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-headline text-title-md text-on-surface">
                        {product.name}
                      </h2>
                      <p className="font-body text-label-sm text-on-surface-variant">
                        {product.sku} · {product.category}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 font-body text-label-sm ${
                        product.stock < 10
                          ? "bg-error-container text-on-error-container"
                          : "bg-success-container text-on-success-container"
                      }`}
                    >
                      {product.stock < 10 ? t.products.lowStock : t.products.inStock}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="font-body text-label-sm text-on-surface-variant">
                        {t.products.price}
                      </p>
                      <p className="font-headline text-label-md tabular-nums text-on-surface">
                        <Money value={product.price} />
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-label-sm text-on-surface-variant">
                        {t.products.cost}
                      </p>
                      <p className="font-headline text-label-md tabular-nums text-on-surface">
                        <Money value={product.cost} />
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-label-sm text-on-surface-variant">
                        {t.products.margin}
                      </p>
                      <p className="font-headline text-label-md tabular-nums text-on-surface">
                        {margin(product.price, product.cost)}%
                      </p>
                    </div>
                  </div>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {t.products.stock}: {product.stock}
                  </p>
                  <div className="flex items-center gap-gutter-sm border-t border-outline-variant pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="inline-flex items-center gap-1 rounded-md border border-outline-variant px-3 py-1.5 font-headline text-label-md text-primary transition-colors hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      {t.products.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(t.products.delete)) deleteProduct.mutate(product.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-error-container px-3 py-1.5 font-headline text-label-md text-on-error-container transition-colors hover:bg-error-container/80"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      {t.products.delete}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-edit-title"
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
            {/* header */}
            <div className="flex items-center justify-between gap-gutter-md">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                aria-label="close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <div className="flex items-center gap-2">
                <div>
                  <h2 id="product-edit-title" className="font-headline text-title-lg text-on-surface">إضافة منتج جديد</h2>
                  <p className="font-body text-body-md text-on-surface-variant">
                    أضف تفاصيل المنتج وصورته ليظهر مباشرة في مخزون متجر النخيل
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
                  <span className="material-symbols-outlined text-[20px]">add_box</span>
                </span>
              </div>
            </div>

            {/* image upload dropzone */}
            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-body text-label-md text-on-surface">صورة المنتج</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-surface-container-low px-6 py-6 text-center">
                <span className="material-symbols-outlined text-[32px] text-primary">
                  cloud_upload
                </span>
                <p className="font-body text-body-md text-on-surface">اسحب وأفلت صورة المنتج هنا</p>
                <p className="font-body text-label-sm text-on-surface-variant">
                  PNG أو JPG بدقة عالية، الحد الأقصى 5 ميغابايت
                </p>
                <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary transition-colors hover:bg-success">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  رفع صورة
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setImagePreview(url);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="mt-3 flex gap-gutter-sm">
                <div className="relative aspect-square h-20 w-20 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
                  {imagePreview ? (
                    <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[24px]">image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-end justify-start p-1.5">
                    <div className="flex items-center gap-0.5 rounded-full bg-primary-container/20 px-2 py-0.5 font-body text-label-sm text-primary">
                      <span className="material-symbols-outlined text-[12px]">watch</span>
                      رئيسية
                    </div>
                  </div>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
              </div>
            </div>

            {/* 2-column form grid */}
            <div className="mt-5 grid grid-cols-1 gap-gutter-md sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">اسم المنتج</span>
                <input
                  className={fieldClass}
                  placeholder="مثال: ساعة ذكية رياضية X10"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">رمز SKU</span>
                <input
                  className={fieldClass}
                  dir="ltr"
                  placeholder="SKU-1048"
                  value={form.sku}
                  onChange={(event) => setForm({ ...form, sku: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">التصنيف</span>
                <select
                  className={fieldClass}
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  <option value="">إلكترونيات</option>
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="إكسسوارات">إكسسوارات</option>
                  <option value="أجهزة منزلية">أجهزة منزلية</option>
                  <option value="ملابس وأحذية">ملابس وأحذية</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">
                  سعر البيع (دج)
                </span>
                <input
                  type="number"
                  min="0"
                  className={fieldClass}
                  placeholder="4 800 دج"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">
                  الكمية المتوفرة
                </span>
                <input
                  type="number"
                  min="0"
                  className={fieldClass}
                  placeholder="50"
                  value={form.stock}
                  onChange={(event) => setForm({ ...form, stock: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-label-md text-on-surface-variant">
                  حد تنبيه النفاد
                </span>
                <input
                  type="number"
                  min="0"
                  className={fieldClass}
                  placeholder="10"
                  value={form.lowStockThreshold ?? ""}
                  onChange={(event) =>
                    setForm({ ...form, lowStockThreshold: event.target.value } as any)
                  }
                />
              </label>
            </div>

            {/* COD toggle row */}
            <div className="mt-5 flex items-center justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-low p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-primary">
                  check_circle
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-headline text-label-lg text-on-surface">
                    تفعيل الدفع عند الاستلام (COD)
                  </span>
                  <span className="font-body text-body-md text-on-surface-variant">
                    إظهار المنتج تلقائياً في روابط الطلب السريع لـ 58 ولاية
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
              />
            </div>

            {/* footer */}
            <div className="mt-5 flex items-center justify-between gap-gutter-md border-t border-outline-variant pt-4">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-md bg-surface-container-low px-4 py-2.5 font-headline text-label-md text-on-surface transition-colors hover:bg-surface-container"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saveProduct.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                حفظ وإضافة للمخزون
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
