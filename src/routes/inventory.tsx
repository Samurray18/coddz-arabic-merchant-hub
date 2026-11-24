import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/inventory")({
  component: () => <ComingSoon title="المخزون" />,
});