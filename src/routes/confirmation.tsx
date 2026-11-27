import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useOrders, useUpdateOrderStatus, useRecordConfirmation } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { Money } from "@/components/money";
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

const CONFIRMATION_LABEL: Record<string, string> = {
  pending: "بانتظار الاتصال",
  answered: "تم التأكيد",
  no_answer: "لا يرد",
  postponed: "مؤجل",
  refused: "مرفوض",
};

function ConfirmationPage() {
  const { t } = useLanguage();
  const { data: ordersData, isLoading } = useOrders();
  const orders = ordersData?.pages.flat() ?? [];
  const updateStatus = useUpdateOrderStatus();
  const recordConfirmation = useRecordConfirmation();

  const pending = orders.filter((o) => o.status === "new" || o.status === "confirmed");
  const confirmedToday = orders.filter((o) => o.confirmation_status === "answered" || o.status === "confirmed").length;
  const rate = orders.length ? Math.round((confirmedToday / Math.max(orders.length, 1)) * 1000) / 10 : 0;

  const handleConfirm = (id: string) => {
    recordConfirmation.mutate(
      { id, result: "answered" },
      { onSuccess: () => toast.success("تم تأكيد الطلب") },
    );
    updateStatus.mutate({ id, status: "confirmed" });
  };
  const handlePostpone = (id: string) => {
    recordConfirmation.mutate(
      { id, result: "postponed" },
      { onSuccess: () => toast("تم التأجيل") },
    );
  };
  const handleNoAnswer = (id: string) => {
    recordConfirmation.mutate(
      { id, result: "no_answer" },
      { onSuccess: () => toast("تم تسجيل: لا يرد") },
    );
  };
  const handleRefuse = (id: string) => {
    recordConfirmation.mutate(
      { id, result: "refused" },
      { onSuccess: () => toast("تم رفض الطلب") },
    );
    updateStatus.mutate({ id, status: "canceled" });
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
            {t.common.loading}
          </div>
        ) : pending.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center font-body text-body-md text-on-surface-variant">
            {t.common.empty}
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
                    <span className="rounded-full bg-warning-container px-2.5 py-0.5 font-body text-label-sm text-on-warning-container">
                      {CONFIRMATION_LABEL[order.confirmation_status ?? "pending"] ?? "بانتظار الاتصال"}
                    </span>
                  </div>
                  <span className="font-headline text-title-md tabular-nums text-primary"><Money value={order.amount} /></span>
                </header>
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-headline text-title-md text-on-surface">{order.name}</h2>
                  <p className="font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">{order.phone}</p>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {order.wilaya} • عبر {order.carrier || "Yalidine"}
                  </p>
                </div>
                <footer className="flex flex-wrap items-center gap-2 border-t border-outline-variant pt-3">
                  <button
                    type="button"
                    onClick={() => handleConfirm(order.id)}
                    disabled={recordConfirmation.isPending || updateStatus.isPending}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 px-3 font-headline text-label-md text-on-primary transition-colors hover:bg-success disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    تأكيد الطلب
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePostpone(order.id)}
                    disabled={recordConfirmation.isPending}
                    className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low px-3 py-2.5 font-body text-label-md text-on-surface transition-colors hover:bg-surface-container disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    تأجيل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNoAnswer(order.id)}
                    disabled={recordConfirmation.isPending}
                    className="inline-flex items-center justify-center gap-1 rounded-md bg-warning-container px-3 py-2.5 font-body text-label-md text-on-warning-container disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">phone_missed</span>
                    لا يرد
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRefuse(order.id)}
                    disabled={recordConfirmation.isPending || updateStatus.isPending}
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
