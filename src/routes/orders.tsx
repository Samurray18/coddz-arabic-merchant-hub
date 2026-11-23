import { createFileRoute } from "@tanstack/react-router";
import { StitchOrders } from "@/components/stitch-orders";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Orders — CODDZ" }] }),
});

function OrdersPage() {
  return <StitchOrders />;
}