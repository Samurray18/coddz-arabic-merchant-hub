import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { RequireAuth } from "@/components/require-auth";
import { ComingSoon } from "@/components/coming-soon";

function CheckoutPage() {
  const { t } = useLanguage();
  return <ComingSoon title={t.nav.checkout} />;
}

export const Route = createFileRoute("/checkout")({
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Checkout — COD YOU" }] }),
});
