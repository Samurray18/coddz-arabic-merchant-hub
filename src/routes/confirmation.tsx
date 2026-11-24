import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA } from "@/lib/coddz";
import { toast } from "sonner";

export const Route = createFileRoute("/confirmation")({
  component: () => (
    <RequireAuth>
      <ConfirmationPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Confirmation — COD YOU" }] }),
});

function ConfirmationPage() {
  const { t } = useLanguage();
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const pending = orders.filter((o) => o.status === "new" || o.status === "confirmed");
  const confirmedToday = orders.filter((o) => o.status === "confirmed").length;
  const rate = orders.length ? Math.round((confirmedToday / Math.max(orders.length, 1)) * 1000) / 10 : 0;

  const handleConfirm = (id: string) => {
    updateStatus.mutate(
      { id, status: "confirmed" },
      { onSuccess: () => toast.success("تم تأكيد الطلب") },
    );
  };
  const handleCancel = (id: string) => {
    updateStatus.mutate(
      { id, status: "canceled" },
      { onSuccess: () => toast("تم إلغاء الطلب") },
    );
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-3 items-stretch">
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">بانتظار الاتصال</span>
              <span className="font-headline text-headline-md tabular-nums text-on-surface">{pending.length} طلبًا</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-container text-on-warning-container">
              <span className="material-symbols-outlined text-[20px]">phone_callback</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">مؤكدة اليوم</span>
              <span className="font-headline text-headline-md tabular-nums text-primary">{confirmedToday} طلبًا</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">معدل التأكيد</span>
              <span className="font-headline text-headline-md tabular-nums text-on-surface">{rate}%</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </span>
          </article>
        </section>

        {isLoading ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            جارٍ التحميل...
          </div>
        ) : pending.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            لا توجد طلبات بانتظار التأكيد
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-gutter-lg lg:grid-cols-2">
            {pending.map((order) => (
              <article
                key={order.id}
                className="flex h-full flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
              >
                <header className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-mono-md text-on-surface">#{order.number || "—"}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${
                        order.status === "new"
                          ? "bg-accent-container text-on-accent-container"
                          : "bg-warning-container text-on-warning-container"
                      }`}
                    >
                      {order.status === "new" ? "طلب جديد" : "المحاولة 1"}
                    </span>
                  </div>
                  <span className="font-headline text-title-md tabular-nums text-primary">{formatDA(order.amount)}</span>
                </header>
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-headline text-title-md text-on-surface">{order.name}</h2>
                  <p className="font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">{order.phone}</p>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {order.wilaya} • عبر {order.carrier || "Yalidine"}
                  </p>
                </div>
                <footer className="flex items-center gap-2 border-t border-outline-variant pt-3">
                  <button
                    type="button"
                    onClick={() => handleConfirm(order.id)}
                    disabled={updateStatus.isPending}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 px-3 font-headline text-label-md text-on-primary transition-colors hover:bg-success disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    تأكيد الطلب
                  </button>
                  <button
                    type="button"
                    onClick={() => toast("تم التأجيل", { description: order.number })}
                    className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low px-3 py-2.5 font-body text-label-md text-on-surface transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    تأجيل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel(order.id)}
                    disabled={updateStatus.isPending}
                    className="inline-flex items-center justify-center gap-1 rounded-md bg-error-container px-3 py-2.5 font-body text-label-md text-on-error-container disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    إلغاء
                  </button>
                </footer>
              </article>
            ))}
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
