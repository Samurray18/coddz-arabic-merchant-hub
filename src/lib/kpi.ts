export interface DashboardKpis {
  revenue: number;
  totalOrders: number;
  awaiting: number;
  inDelivery: number;
  deliveredCount: number;
  returnedCount: number;
  deliveryRate: number;
  returnRate: number;
  netProfit: number;
}

export function computeDashboardKpis(stats: any): DashboardKpis {
  const statusCounts = (stats?.orders_by_status ?? {}) as Record<string, number>;
  const totalOrders = Number(stats?.total_orders ?? 0);
  const revenue = Number(stats?.revenue ?? 0);
  const deliveredCount = statusCounts["delivered"] ?? 0;
  const returnedCount = (statusCounts["returned"] ?? 0) + (statusCounts["canceled"] ?? 0);
  const awaiting = (statusCounts["new"] ?? 0) + (statusCounts["confirmed"] ?? 0);
  const inDelivery = statusCounts["shipped"] ?? 0;
  const deliveryRate = totalOrders ? Math.round((deliveredCount / totalOrders) * 100) : 0;
  const returnRate = totalOrders ? Math.round((returnedCount / totalOrders) * 100) : 0;
  const netProfit = Number(stats?.net_profit ?? 0);
  return { revenue, totalOrders, awaiting, inDelivery, deliveredCount, returnedCount, deliveryRate, returnRate, netProfit };
}
