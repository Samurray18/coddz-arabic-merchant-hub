import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useOrders, useShipments, useCreateShipment, useUpdateShipment } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA } from "@/lib/coddz";

export const Route = createFileRoute("/shipments")({
  component: () => (
    <RequireAuth>
      <ShipmentsPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Shipments — COD YOU" }] }),
});

const STATUS_LABEL: Record<string, string> = {
  pending: "قيد الانتظار",
  shipped: "تم الشحن",
  in_transit: "قيد التوصيل",
  delivered: "تم التسليم",
  returned: "مرتجع",
  canceled: "ملغى",
};
const STATUS_CLASS: Record<string, string> = {
  pending: "bg-warning-container text-on-warning-container",
  shipped: "bg-primary-container text-on-primary-container",
  in_transit: "bg-primary-container text-on-primary-container",
  delivered: "bg-accent-container text-on-accent-container",
  returned: "bg-error-container text-on-error-container",
  canceled: "bg-surface-container-low text-on-surface-variant",
};

function ShipmentsPage() {
  const { storeId } = useAuth();
  const { data: shipments = [], isLoading } = useShipments();
  const { data: orders = [] } = useOrders();
  const createShipment = useCreateShipment();
  const updateShipment = useUpdateShipment();

  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [carrier, setCarrier] = useState("Yalidine");
  const [tracking, setTracking] = useState("");
  const [cod, setCod] = useState("");

  const shippableOrders = orders.filter((o) => o.status === "confirmed" || o.status === "new");

  const handleCreate = async () => {
    if (!orderId) {
      toast.error("يرجى اختيار طلب");
      return;
    }
    try {
      await createShipment.mutateAsync({
        orderId,
        carrier,
        trackingNumber: tracking,
        codAmount: Number(cod) || 0,
      });
      toast.success("تم إنشاء الشحنة");
      setOpen(false);
      setOrderId("");
      setTracking("");
      setCod("");
    } catch (e: any) {
      toast.error(e?.message ?? "خطأ");
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div className="flex items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">الشحنات</h1>
            <p className="font-body text-body-md text-on-surface-variant">تتبع شحناتك وشركات التوصيل</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2.5 font-headline text-label-md text-on-primary transition-colors hover:bg-success"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            شحنة جديدة
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            جارٍ التحميل...
          </div>
        ) : shipments.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            لا توجد شحنات
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <table className="w-full border-collapse text-right">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  {["الطلب", "الناقل", "رقم التتبع", "COD", "الحالة", "إجراءات"].map((h) => (
                    <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {shipments.map((s: any) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3.5 font-mono text-mono-md tabular-nums text-on-surface">#{s.order_id?.slice(0, 8)}</td>
                    <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{s.carrier}</td>
                    <td className="px-4 py-3.5 font-mono text-mono-md text-on-surface-variant" dir="ltr">{s.tracking_number || "—"}</td>
                    <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface">{formatDA(Number(s.cod_amount))}</td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${STATUS_CLASS[s.status] ?? "bg-surface-container-low text-on-surface-variant"}`}>
                        {STATUS_LABEL[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-gutter-xs">
                        <button
                          type="button"
                          onClick={() => updateShipment.mutate({ id: s.id, status: "shipped" })}
                          className="rounded-md bg-primary px-2.5 py-1.5 font-headline text-label-sm text-on-primary"
                        >
                          شحن
                        </button>
                        <button
                          type="button"
                          onClick={() => updateShipment.mutate({ id: s.id, status: "delivered", collected: true })}
                          className="rounded-md bg-accent-container px-2.5 py-1.5 font-headline text-label-sm text-on-accent-container"
                        >
                          تسليم
                        </button>
                        <button
                          type="button"
                          onClick={() => updateShipment.mutate({ id: s.id, status: "returned" })}
                          className="rounded-md bg-error-container px-2.5 py-1.5 font-headline text-label-sm text-on-error-container"
                        >
                          إرجاع
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
              <h2 className="font-headline text-title-lg text-on-surface">شحنة جديدة</h2>
              <div className="mt-4 flex flex-col gap-gutter-md">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">الطلب</span>
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="">اختر طلبًا</option>
                    {shippableOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        #{o.number} — {o.name} ({formatDA(o.amount)})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">الناقل</span>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  >
                    {["Yalidine", "ZR Express", "DHD", "Noest", "Maystro", "Procolis", "Ecotrack", "Guepex"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">رقم التتبع</span>
                  <input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">مبلغ COD</span>
                  <input
                    type="number"
                    value={cod}
                    onChange={(e) => setCod(e.target.value)}
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                </label>
                <div className="flex gap-gutter-md">
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={createShipment.isPending}
                    className="flex-1 rounded-md bg-primary py-2 font-headline text-label-md text-on-primary disabled:opacity-60"
                  >
                    {createShipment.isPending ? "..." : "إنشاء"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
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
