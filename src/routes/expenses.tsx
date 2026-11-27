import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useExpenses, useAdSpend, useAddExpense, useAddAdSpend } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { formatDA } from "@/lib/coddz";
import { Money } from "@/components/money";

export const Route = createFileRoute("/expenses")({
  component: () => (
    <RequireAuth>
      <ExpensesPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Expenses — COD YOU" }] }),
});

function ExpensesPage() {
  const { storeId } = useAuth();
  const { data: expenses = [], isLoading: expLoading } = useExpenses();
  const { data: adspend = [], isLoading: adLoading } = useAdSpend();
  const addExpense = useAddExpense();
  const addAdSpend = useAddAdSpend();

  const [tab, setTab] = useState<"expenses" | "ads">("expenses");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("general");
  const [note, setNote] = useState("");
  const [platform, setPlatform] = useState("Facebook");

  const totalExpenses = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const totalAds = adspend.reduce((s: number, a: any) => s + Number(a.amount), 0);

  const handleAddExpense = async () => {
    const a = Number(amount);
    if (!a || a <= 0) { toast.error("مبلغ غير صالح"); return; }
    try {
      await addExpense.mutateAsync({ amount: a, category, note });
      toast.success("تمت الإضافة");
      setAmount(""); setNote("");
    } catch (e: any) { toast.error(e?.message ?? "خطأ"); }
  };

  const handleAddAd = async () => {
    const a = Number(amount);
    if (!a || a <= 0) { toast.error("مبلغ غير صالح"); return; }
    try {
      await addAdSpend.mutateAsync({ amount: a, platform });
      toast.success("تمت الإضافة");
      setAmount("");
    } catch (e: any) { toast.error(e?.message ?? "خطأ"); }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">المصاريف والحملات</h1>
          <p className="font-body text-body-md text-on-surface-variant">تتبع المصاريف وإعلاناتك</p>
        </div>

        <div className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-2">
          <article className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">إجمالي المصاريف</span>
              <span className="font-headline text-headline-md tabular-nums text-error"><Money value={totalExpenses} /></span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-error-container text-on-error-container">
              <span className="material-symbols-outlined text-[20px]">receipt</span>
            </span>
          </article>
          <article className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">إجمالي الإعلانات</span>
              <span className="font-headline text-headline-md tabular-nums text-warning"><Money value={totalAds} /></span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-container text-on-warning-container">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
            </span>
          </article>
        </div>

        <div className="flex gap-gutter-sm border-b border-outline-variant">
          <button type="button" onClick={() => setTab("expenses")} className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${tab === "expenses" ? "bg-accent-container text-on-accent-container" : "text-on-surface-variant hover:bg-surface-container-low"}`}>المصاريف</button>
          <button type="button" onClick={() => setTab("ads")} className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${tab === "ads" ? "bg-accent-container text-on-accent-container" : "text-on-surface-variant hover:bg-surface-container-low"}`}>الإعلانات</button>
        </div>

        {tab === "expenses" && (
          <div className="flex flex-col gap-gutter-xl">
            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <h2 className="font-headline text-title-lg text-on-surface">إضافة مصروف</h2>
              <div className="mt-4 grid grid-cols-1 gap-gutter-md sm:grid-cols-3">
                <input type="number" placeholder="المبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none">
                  <option value="general">عام</option>
                  <option value="rent">إيجار</option>
                  <option value="salaries">رواتب</option>
                  <option value="shipping">شحن</option>
                  <option value="other">أخرى</option>
                </select>
                <input placeholder="ملاحظة" value={note} onChange={(e) => setNote(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none" />
              </div>
              <button type="button" onClick={handleAddExpense} disabled={addExpense.isPending} className="mt-3 rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary disabled:opacity-60">
                {addExpense.isPending ? "..." : "إضافة"}
              </button>
            </section>
            <section className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              {expLoading ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">جارٍ التحميل...</p> : expenses.length === 0 ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">لا توجد مصاريف</p> : (
                <table className="w-full border-collapse text-right">
                  <thead className="border-b border-outline-variant bg-surface-container-low">
                    <tr>
                      {["المبلغ", "التصنيف", "ملاحظة", "التاريخ"].map((h) => <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {expenses.map((e: any) => (
                      <tr key={e.id}>
                        <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface"><Money value={Number(e.amount)} /></td>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{e.category}</td>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface-variant">{e.note ?? "—"}</td>
                        <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant">{new Date(e.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}

        {tab === "ads" && (
          <div className="flex flex-col gap-gutter-xl">
            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <h2 className="font-headline text-title-lg text-on-surface">إضافة حملة إعلانية</h2>
              <div className="mt-4 grid grid-cols-1 gap-gutter-md sm:grid-cols-3">
                <input type="number" placeholder="المبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none" />
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none">
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Google">Google</option>
                  <option value="Instagram">Instagram</option>
                </select>
                <button type="button" onClick={handleAddAd} disabled={addAdSpend.isPending} className="rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary disabled:opacity-60">
                  {addAdSpend.isPending ? "..." : "إضافة"}
                </button>
              </div>
            </section>
            <section className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              {adLoading ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">جارٍ التحميل...</p> : adspend.length === 0 ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">لا توجد حملات</p> : (
                <table className="w-full border-collapse text-right">
                  <thead className="border-b border-outline-variant bg-surface-container-low">
                    <tr>
                      {["المبلغ", "المنصة", "التاريخ"].map((h) => <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {adspend.map((a: any) => (
                      <tr key={a.id}>
                        <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface"><Money value={Number(a.amount)} /></td>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{a.platform}</td>
                        <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant">{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
