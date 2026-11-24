import { BRAND_NAME } from "@/lib/coddz";
import { createFileRoute } from "@tanstack/react-router";
import { StitchDashboard } from "@/components/stitch-dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: `Dashboard — ${BRAND_NAME}` }] }),
});

function DashboardPage() {
  return <StitchDashboard />;
}