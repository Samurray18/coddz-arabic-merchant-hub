import { BRAND_NAME } from "@/lib/coddz";
import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "{BRAND_NAME} — منصة COD للتجار" },
      { name: "description", content: "توصيل الطلبات والدفع عند الاستلام للتجار في الجزائر" },
    ],
  }),
});

function Index() {
  return <LandingPage />;
}