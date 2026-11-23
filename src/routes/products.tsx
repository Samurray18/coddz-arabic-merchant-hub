import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useProducts, useSaveProduct, useDeleteProduct } from "@/hooks/use-data";
import { PRODUCT_IMAGES, formatDA } from "@/lib/coddz";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Product } from "@/lib/domain";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({ meta: [{ title: "Products — CODDZ" }] }),
});

function ProductsPage() {
  const { t } = useLanguage();
  const { data: products = [], isLoading } = useProducts();
  const saveProduct = useSaveProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    sku: "",
    image: "watch" as string,
    variants: "",
  });

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !`${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", price: "", cost: "", stock: "", category: "", sku: "", image: "watch", variants: "" });
    setEditOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      cost: String(p.cost),
      stock: String(p.stock),
      category: p.category,
      sku: p.sku,
      image: p.image ?? "watch",
      variants: p.variants ?? "",
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      id: editing?.id,
      name: form.name,
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      stock: Number(form.stock) || 0,
      category: form.category,
      sku: form.sku,
      image: form.image,
      variants: form.variants,
    };
    if (!payload.id) delete payload.id;
    await saveProduct.mutateAsync(payload);
    setEditOpen(false);
  };

  const margin = (price: number, cost: number) => (price ? Math.round(((price - cost) / price) * 100) : 0);

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t.products.title}</h1>
            <p className="text-sm text-muted-foreground">{t.products.subtitle}</p>
          </div>
          <Button onClick={openNew}>
            <Plus className="me-2 h-4 w-4" />
            {t.products.addProduct}
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="ps-9" placeholder={t.products.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.products.allCategories} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.products.allCategories}</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading && <div className="text-center text-muted-foreground">Loading...</div>}

        {!isLoading && filtered.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="font-semibold">{t.products.emptyTitle}</div>
              <div className="text-xs text-muted-foreground">{t.products.emptySub}</div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img
                  src={p.image && p.image in PRODUCT_IMAGES ? (PRODUCT_IMAGES as any)[p.image] : p.image || PRODUCT_IMAGES.watch}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sku} · {p.category}</div>
                  </div>
                  <Badge variant={p.stock < 10 ? "destructive" : "secondary"}>
                    {p.stock < 10 ? t.products.lowStock : t.products.inStock}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">{t.products.price}</div>
                    <div className="font-medium">{formatDA(p.price)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t.products.cost}</div>
                    <div className="font-medium">{formatDA(p.cost)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t.products.margin}</div>
                    <div className="font-medium">{margin(p.price, p.cost)}%</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.products.stock}: {p.stock}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                    <Pencil className="me-1 h-3 w-3" />
                    {t.products.edit}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteProduct.mutate(p.id)}>
                    <Trash2 className="me-1 h-3 w-3" />
                    {t.products.delete}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? t.products.editProduct : t.products.addProduct}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>{t.products.name}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.products.price}</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>{t.products.cost}</Label>
                  <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.products.stock}</Label>
                  <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div>
                  <Label>{t.products.sku}</Label>
                  <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>{t.products.category}</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label>{t.products.image}</Label>
                <Select value={form.image} onValueChange={(v) => setForm({ ...form, image: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PRODUCT_IMAGES).map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.products.variants}</Label>
                <Input value={form.variants} onChange={(e) => setForm({ ...form, variants: e.target.value })} />
              </div>
              <Button onClick={handleSave} disabled={saveProduct.isPending}>
                {t.products.save}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}