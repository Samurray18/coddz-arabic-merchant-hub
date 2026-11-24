import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/integrations")({
  component: () => <ComingSoon title="الربط" />,
});