import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useOrders, useSaveOrder, useUpdateOrderStatus } from "@/hooks/use-data";
import { WILAYAS, CARRIERS, ORDER_STATUSES, STATUS_BADGE_CLASS, isValidAlgerianPhone, normalizeAlgerianPhone, formatDA } from "@/lib/coddz";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Orders — COD YOU" }] }),
});

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();
  const saveOrder = useSaveOrder();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", product: "", amount: "", carrier: "Yalidine", status: "new", notes: "" });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-on-surface-variant">جارٍ التحميل...</div></div>;
  }

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !`${o.name} ${o.phone} ${o.number} ${o.product}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async () => {
    if (!isValidAlgerianPhone(form.phone)) return;
    await saveOrder.mutateAsync({
      name: form.name,
      phone: normalizeAlgerianPhone(form.phone)!,
      wilaya: form.wilaya,
      product: form.product,
      amount: Number(form.amount) || 0,
      carrier: form.carrier,
      status: form.status as any,
      notes: form.notes,
      date: new Date().toISOString().slice(0, 10),
    });
    setCreateOpen(false);
    setForm({ name: "", phone: "", wilaya: "", product: "", amount: "", carrier: "Yalidine", status: "new", notes: "" });
  };

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">الطلبات</h1>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="me-2 h-4 w-4" />طلب جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>طلب جديد</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div><Label>العميل</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>الهاتف</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>الولاية</Label>
                  <Select value={form.wilaya} onValueChange={(v) => setForm({ ...form, wilaya: v })}>
                    <SelectTrigger><SelectValue placeholder="كل الولايات" /></SelectTrigger>
                    <SelectContent>{WILAYAS.map((w) => <SelectItem key={w.code} value={w.latin}>{w.latin}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>المنتج</Label><Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>المبلغ</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                  <div><Label>شركة التوصيل</Label>
                    <Select value={form.carrier} onValueChange={(v) => setForm({ ...form, carrier: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CARRIERS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
              </div>
                <div><Label>ملاحظات</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <Button onClick={handleCreate} disabled={saveOrder.isPending}>حفظ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <Input className="ps-9" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="كل الحالات" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-outline-variant bg-surface-container-low">
                  <tr>
                    <th className="p-3 text-start">العميل</th>
                    <th className="p-3 text-start">الهاتف</th>
                    <th className="p-3 text-start">الولاية</th>
                    <th className="p-3 text-start">المنتج</th>
                    <th className="p-3 text-start">المبلغ</th>
                    <th className="p-3 text-start">الناقل</th>
                    <th className="p-3 text-start">الحالة</th>
                    <th className="p-3 text-start">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <tr><td colSpan={8} className="p-6 text-center">جارٍ التحميل...</td></tr>}
                  {!isLoading && filtered.length === 0 && (
                    <tr><td colSpan={8} className="p-6 text-center text-on-surface-variant">لا توجد طلبات. أضف طلبًا جديدًا.</td></tr>
                  )}
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b border-outline-variant hover:bg-surface-container-low">
                      <td className="p-3">{o.name}</td>
                      <td className="p-3">{o.phone}</td>
                      <td className="p-3">{o.wilaya}</td>
                      <td className="p-3">{o.product}</td>
                      <td className="p-3">{formatDA(o.amount)}</td>
                      <td className="p-3">{o.carrier}</td>
                      <td className="p-3">
                        <Badge className={STATUS_BADGE_CLASS[o.status]} variant="outline">{o.status}</Badge>
                      </td>
                      <td className="p-3">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}