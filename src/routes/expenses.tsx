import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useExpenses, useAdSpend, useAddExpense, useAddAdSpend } from "@/hooks/use-data";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { Money } from "@/components/money";
import { LocalDate } from "@/components/local-date";

export const Route = createFileRoute("/expenses")({
  component: () => (
    <RequireAuth>
      <ExpensesPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Expenses — COD YOU" }] }),
});

function ExpensesPage() {
  const { t } = useLanguage();
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
    if (!a || a <= 0) { toast.error(t.expenses.invalidAmount); return; }
    try {
      await addExpense.mutateAsync({ amount: a, category, note });
      toast.success(t.expenses.added);
      setAmount(""); setNote("");
    } catch (e: any) { toast.error(e?.message ?? t.common.error); }
  };

  const handleAddAd = async () => {
    const a = Number(amount);
    if (!a || a <= 0) { toast.error(t.expenses.invalidAmount); return; }
    try {
      await addAdSpend.mutateAsync({ amount: a, platform });
      toast.success(t.expenses.added);
      setAmount("");
    } catch (e: any) { toast.error(e?.message ?? t.common.error); }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">{t.expenses.title}</h1>
          <p className="font-body text-body-md text-on-surface-variant">{t.expenses.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-2">
          <article className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">{t.expenses.totalExpenses}</span>
              <span className="font-headline text-headline-md tabular-nums text-error"><Money value={totalExpenses} /></span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-error-container text-on-error-container">
              <span className="material-symbols-outlined text-[20px]">receipt</span>
            </span>
          </article>
          <article className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">{t.expenses.totalAds}</span>
              <span className="font-headline text-headline-md tabular-nums text-warning"><Money value={totalAds} /></span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-container text-on-warning-container">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
            </span>
          </article>
        </div>

        <div className="flex gap-gutter-sm border-b border-outline-variant">
          <button type="button" onClick={() => setTab("expenses")} className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${tab === "expenses" ? "bg-accent-container text-on-accent-container" : "text-on-surface-variant hover:bg-surface-container-low"}`}>{t.nav.expenses}</button>
          <button type="button" onClick={() => setTab("ads")} className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${tab === "ads" ? "bg-accent-container text-on-accent-container" : "text-on-surface-variant hover:bg-surface-container-low"}`}>{t.expenses.adsTab}</button>
        </div>

        {tab === "expenses" && (
          <div className="flex flex-col gap-gutter-xl">
            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <h2 className="font-headline text-title-lg text-on-surface">{t.expenses.addExpense}</h2>
              <div className="mt-4 grid grid-cols-1 gap-gutter-md sm:grid-cols-3">
                <input type="number" placeholder={t.expenses.amount} value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none">
                  <option value="general">{t.expenses.categoryGeneral}</option>
                  <option value="rent">{t.expenses.categoryRent}</option>
                  <option value="salaries">{t.expenses.categorySalaries}</option>
                  <option value="shipping">{t.expenses.categoryShipping}</option>
                  <option value="other">{t.expenses.categoryOther}</option>
                </select>
                <input placeholder={t.expenses.note} value={note} onChange={(e) => setNote(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none" />
              </div>
              <button type="button" onClick={handleAddExpense} disabled={addExpense.isPending} className="mt-3 rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary disabled:opacity-60">
                {addExpense.isPending ? "..." : t.expenses.add}
              </button>
            </section>
            <section className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              {expLoading ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">{t.common.loading}</p> : expenses.length === 0 ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">{t.expenses.noExpenses}</p> : (
                <table className="w-full border-collapse text-right">
                  <thead className="border-b border-outline-variant bg-surface-container-low">
                    <tr>
                      {[t.expenses.amount, t.expenses.category, t.expenses.note, t.expenses.date].map((h) => <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {expenses.map((e: any) => (
                      <tr key={e.id}>
                        <td className="px-4 py-3.5 font-headline text-label-lg tabular-nums text-on-surface"><Money value={Number(e.amount)} /></td>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface">{e.category}</td>
                        <td className="px-4 py-3.5 font-body text-body-md text-on-surface-variant">{e.note ?? "—"}</td>
                        <td className="px-4 py-3.5 font-body text-label-sm text-on-surface-variant"><LocalDate value={e.created_at} /></td>
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
              <h2 className="font-headline text-title-lg text-on-surface">{t.expenses.addCampaign}</h2>
              <div className="mt-4 grid grid-cols-1 gap-gutter-md sm:grid-cols-3">
                <input type="number" placeholder={t.expenses.amount} value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none" />
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none">
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Google">Google</option>
                  <option value="Instagram">Instagram</option>
                </select>
                <button type="button" onClick={handleAddAd} disabled={addAdSpend.isPending} className="rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary disabled:opacity-60">
                  {addAdSpend.isPending ? "..." : t.expenses.add}
                </button>
              </div>
            </section>
            <section className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              {adLoading ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">{t.common.loading}</p> : adspend.length === 0 ? <p className="p-6 text-center font-body text-body-md text-on-surface-variant">{t.expenses.noCampaigns}</p> : (
                <table className="w-full border-collapse text-right">
                  <thead className="border-b border-outline-variant bg-surface-container-low">
                    <tr>
                      {[t.expenses.amount, t.expenses.platform, t.expenses.date].map((h) => <th key={h} className="px-4 py-3.5 font-body text-label-md text-on-surface-variant">{h}</th>)}
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
