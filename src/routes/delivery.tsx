import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/delivery")({
  component: () => <ComingSoon title="التوصيل" />,
});