import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/require-auth";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/team")({
  component: () => <RequireAuth><ComingSoon title="الفريق" /></RequireAuth>,
});