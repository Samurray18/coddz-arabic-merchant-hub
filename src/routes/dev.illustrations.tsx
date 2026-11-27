import { createFileRoute } from "@tanstack/react-router";
import { Illustration, type IllustrationName } from "@/components/illustration";

export const Route = createFileRoute("/dev/illustrations")({
  component: DevIllustrations,
});

const NAMES: IllustrationName[] = [
  "orders-empty", "products-empty", "inventory-empty", "shipments-empty",
  "confirmation-empty", "expenses-empty", "customers-empty", "team-empty",
  "integrations-empty", "analytics-empty", "error", "success",
];

function DevIllustrations() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <h1 className="font-headline text-headline-lg text-on-surface">Illustrations</h1>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {NAMES.map((n) => (
          <div key={n} className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <Illustration name={n} className="h-40 w-56" />
            <span className="font-body text-label-md text-on-surface-variant">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
