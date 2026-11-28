import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { getStoredT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "COD YOU" },
      { name: "description", content: getStoredT().landing.metaDescription },
    ],
  }),
});

function Index() {
  return <LandingPage />;
}