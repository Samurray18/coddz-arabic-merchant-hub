import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "COD YOU" },
      { name: "description", content: "COD YOU: منصة جزائرية لإدارة طلبات الدفع عند الاستلام، تأكيد الطلبات، الربط مع شركات التوصيل وحساب الأرباح." },
    ],
  }),
});

function Index() {
  return <LandingPage />;
}