import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/require-auth";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/checkout")({
  component: () => (
    <RequireAuth>
      <ComingSoon title="نموذج الدفع" />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Checkout — COD YOU" }] }),
});
