import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Phone, MessageCircle, Search } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useOrders, useSaveOrder, useUpdateOrderStatus } from "@/hooks/use-data";
import { WILAYAS, CARRIERS, ORDER_STATUSES, STATUS_BADGE_CLASS, isValidAlgerianPhone, normalizeAlgerianPhone, buildWhatsAppLink, formatDA } from "@/lib/coddz";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Orders — CODDZ" }] }),
});

function OrdersPage() {
  const { t } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();
  const saveOrder = useSaveOrder();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [wilayaFilter, setWilayaFilter] = useState<string>("all");
  const [carrierFilter, setCarrierFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<(typeof orders)[number] | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "",
    product: "",
    amount: "",
    carrier: "Yalidine",
    status: "new" as string,
    notes: "",
  });

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (wilayaFilter !== "all" && o.wilaya !== wilayaFilter) return false;
    if (carrierFilter !== "all" && o.carrier !== carrierFilter) return false;
    if (search && !`${o.name} ${o.phone} ${o.number} ${o.product}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleCreate = async () => {
    if (!isValidAlgerianPhone(form.phone)) {
      alert(t.orders.invalidPhone);
      return;
    }
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
            <h1 className="text-2xl font-bold">{t.orders.title}</h1>
            <p className="text-sm text-muted-foreground">{t.orders.subtitle}</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="me-2 h-4 w-4" />
                {t.orders.newOrder}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t.orders.newOrder}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div>
                  <Label>{t.orders.customer}</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>{t.orders.phone}</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label>{t.orders.wilaya}</Label>
                  <Select value={form.wilaya} onValueChange={(v) => setForm({ ...form, wilaya: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.orders.allWilayas} />
                    </SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map((w) => (
                        <SelectItem key={w.code} value={w.latin}>
                          {w.latin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.orders.product}</Label>
                  <Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t.orders.amount}</Label>
                    <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.orders.carrier}</Label>
                    <Select value={form.carrier} onValueChange={(v) => setForm({ ...form, carrier: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CARRIERS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>{t.orders.notes}</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t.orders.notesPlaceholder} />
                </div>
                <Button onClick={handleCreate} disabled={saveOrder.isPending}>
                  {t.orders.save}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="ps-9"
                  placeholder={t.orders.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t.orders.allStatuses} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.orders.allStatuses}</SelectItem>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t.status[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={wilayaFilter} onValueChange={setWilayaFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.orders.allWilayas} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.orders.allWilayas}</SelectItem>
                  {WILAYAS.map((w) => (
                    <SelectItem key={w.code} value={w.latin}>
                      {w.latin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t.orders.allCarriers} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.orders.allCarriers}</SelectItem>
                  {CARRIERS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="p-3 text-start">{t.orders.customer}</th>
                    <th className="p-3 text-start">{t.orders.phone}</th>
                    <th className="p-3 text-start">{t.orders.wilaya}</th>
                    <th className="p-3 text-start">{t.orders.product}</th>
                    <th className="p-3 text-start">{t.orders.amount}</th>
                    <th className="p-3 text-start">{t.orders.carrier}</th>
                    <th className="p-3 text-start">{t.orders.statusCol}</th>
                    <th className="p-3 text-start">{t.orders.date}</th>
                    <th className="p-3 text-start">{t.orders.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!isLoading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-muted-foreground">
                        <div className="font-semibold">{t.orders.emptyTitle}</div>
                        <div className="text-xs">{t.orders.emptySub}</div>
                      </td>
                    </tr>
                  )}
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b hover:bg-muted/20">
                      <td className="p-3">{o.name}</td>
                      <td className="p-3">{o.phone}</td>
                      <td className="p-3">{o.wilaya}</td>
                      <td className="p-3">{o.product}</td>
                      <td className="p-3">{formatDA(o.amount)}</td>
                      <td className="p-3">{o.carrier}</td>
                      <td className="p-3">
                        <Badge className={STATUS_BADGE_CLASS[o.status]} variant="outline">
                          {t.status[o.status]}
                        </Badge>
                      </td>
                      <td className="p-3">{o.date}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setDetailOrder(o)}>
                            {t.orders.details}
                          </Button>
                          <a href={`tel:${o.phone}`}>
                            <Button size="sm" variant="ghost">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </a>
                          <a href={buildWhatsAppLink(o.phone, t.orders.whatsappTemplate.replace("{name}", o.name).replace("{number}", o.number).replace("{product}", o.product).replace("{amount}", formatDA(o.amount)).replace("{wilaya}", o.wilaya))} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="ghost">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail dialog */}
        <Dialog open={!!detailOrder} onOpenChange={(o) => !o && setDetailOrder(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{detailOrder?.number}</DialogTitle>
            </DialogHeader>
            {detailOrder && (
              <div className="space-y-3 text-sm">
                <div><strong>{t.orders.customer}:</strong> {detailOrder.name}</div>
                <div><strong>{t.orders.phone}:</strong> {detailOrder.phone}</div>
                <div><strong>{t.orders.wilaya}:</strong> {detailOrder.wilaya}</div>
                <div><strong>{t.orders.product}:</strong> {detailOrder.product}</div>
                <div><strong>{t.orders.amount}:</strong> {formatDA(detailOrder.amount)}</div>
                <div><strong>{t.orders.carrier}:</strong> {detailOrder.carrier}</div>
                <div>
                  <Label>{t.orders.statusCol}</Label>
                  <Select
                    value={detailOrder.status}
                    onValueChange={(v) => {
                      updateStatus.mutate({ id: detailOrder.id, status: v as any });
                      setDetailOrder({ ...detailOrder, status: v as any });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {t.status[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.orders.notes}</Label>
                  <Textarea
                    value={detailOrder.notes ?? ""}
                    onChange={(e) => setDetailOrder({ ...detailOrder, notes: e.target.value })}
                  />
                </div>
                <Button
                  onClick={async () => {
                    await saveOrder.mutateAsync({ ...detailOrder, id: detailOrder.id });
                    setDetailOrder(null);
                  }}
                >
                  {t.orders.save}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}