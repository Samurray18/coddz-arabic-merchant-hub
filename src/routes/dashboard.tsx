import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useOrders, useProducts } from "@/hooks/use-data";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDA } from "@/lib/coddz";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — COD YOU" }] }),
});

function DashboardPage() {
  const { user, loading, storeId } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [] } = useOrders();
  const { data: products = [] } = useProducts();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-on-surface-variant">جارٍ التحميل...</div>
      </div>
    );
  }

  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const awaiting = orders.filter((o) => o.status === "new").length;
  const inDelivery = orders.filter((o) => o.status === "shipped").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const returned = orders.filter((o) => o.status === "returned" || o.status === "canceled").length;
  const deliveryRate = orders.length ? Math.round((delivered / orders.length) * 100) : 0;
  const returnRate = orders.length ? Math.round((returned / orders.length) * 100) : 0;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">لوحة التحكم</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-on-surface-variant">المبيعات</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatDA(revenue)}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-on-surface-variant">بانتظار التأكيد</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{awaiting}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-on-surface-variant">قيد التوصيل</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{inDelivery}</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-on-surface-variant">نسبة التوصيل</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{deliveryRate}%</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-on-surface-variant">نسبة المرتجعات</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{returnRate}%</CardContent></Card>
        </div>
        {orders.length === 0 && products.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-on-surface-variant">
              لا توجد بيانات بعد. أضف طلبًا أو منتجًا للبدء.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}