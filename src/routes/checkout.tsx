import { BRAND_NAME } from "@/lib/coddz";
import { createFileRoute } from "@tanstack/react-router";
import { StitchCheckout } from "@/components/stitch-checkout";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: `Checkout — ${BRAND_NAME}` }] }),
});

function CheckoutPage() {
  return <StitchCheckout />;
}