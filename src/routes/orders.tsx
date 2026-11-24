import { BRAND_NAME } from "@/lib/coddz";
import { createFileRoute } from "@tanstack/react-router";
import { StitchOrders } from "@/components/stitch-orders";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: `Orders — ${BRAND_NAME}` }] }),
});

function OrdersPage() {
  return <StitchOrders />;
}