import { createFileRoute } from "@tanstack/react-router";
import { StitchCheckout } from "@/components/stitch-checkout";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — CODDZ" }] }),
});

function CheckoutPage() {
  return <StitchCheckout />;
}