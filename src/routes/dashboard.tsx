import { createFileRoute } from "@tanstack/react-router";
import { StitchDashboard } from "@/components/stitch-dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — CODDZ" }] }),
});

function DashboardPage() {
  return <StitchDashboard />;
}