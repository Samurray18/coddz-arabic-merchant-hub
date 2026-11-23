import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useProducts } from "@/hooks/use-data";
import { useOrders } from "@/hooks/use-data";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDA } from "@/lib/coddz";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — CODDZ" }] }),
});

function DashboardPage() {
  const { t } = useLanguage();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.date === today).length;
  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const confirmed = orders.filter((o) => o.status === "confirmed" || o.status === "shipped" || o.status === "delivered").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const returned = orders.filter((o) => o.status === "returned").length;
  const confirmRate = orders.length ? Math.round((confirmed / orders.length) * 100) : 0;
  const deliveryRate = orders.length ? Math.round((delivered / orders.length) * 100) : 0;
  const returnRate = orders.length ? Math.round((returned / orders.length) * 100) : 0;

  const topProducts = products
    .map((p) => ({ name: p.name, sold: Math.floor(Math.random() * 20) + 1 }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t.dashboard.title}</h1>
          <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t.dashboard.todayOrders}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{todayOrders}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t.dashboard.revenue}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{formatDA(revenue)}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t.dashboard.confirmRate}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{confirmRate}%</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t.dashboard.deliveryRate}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{deliveryRate}%</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t.dashboard.returnRate}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{returnRate}%</CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.topProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topProducts.map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{p.sold} {t.dashboard.unitsSold}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.recentOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {orders.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center justify-between text-sm">
                    <span>{o.number} — {o.name}</span>
                    <span className="text-muted-foreground">{formatDA(o.amount)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}