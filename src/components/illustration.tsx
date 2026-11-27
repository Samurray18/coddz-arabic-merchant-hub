import { OrdersEmpty } from "./illustrations/OrdersEmpty";
import { ProductsEmpty } from "./illustrations/ProductsEmpty";
import { InventoryEmpty } from "./illustrations/InventoryEmpty";
import { ShipmentsEmpty } from "./illustrations/ShipmentsEmpty";
import { ConfirmationEmpty } from "./illustrations/ConfirmationEmpty";
import { ExpensesEmpty } from "./illustrations/ExpensesEmpty";
import { CustomersEmpty } from "./illustrations/CustomersEmpty";
import { TeamEmpty } from "./illustrations/TeamEmpty";
import { IntegrationsEmpty } from "./illustrations/IntegrationsEmpty";
import { AnalyticsEmpty } from "./illustrations/AnalyticsEmpty";
import { ErrorScene } from "./illustrations/ErrorScene";
import { SuccessScene } from "./illustrations/SuccessScene";

export type IllustrationName =
  | "orders-empty"
  | "products-empty"
  | "inventory-empty"
  | "shipments-empty"
  | "confirmation-empty"
  | "expenses-empty"
  | "customers-empty"
  | "team-empty"
  | "integrations-empty"
  | "analytics-empty"
  | "error"
  | "success";

const MAP: Record<IllustrationName, React.ComponentType<{ className?: string; title?: string }>> = {
  "orders-empty": OrdersEmpty,
  "products-empty": ProductsEmpty,
  "inventory-empty": InventoryEmpty,
  "shipments-empty": ShipmentsEmpty,
  "confirmation-empty": ConfirmationEmpty,
  "expenses-empty": ExpensesEmpty,
  "customers-empty": CustomersEmpty,
  "team-empty": TeamEmpty,
  "integrations-empty": IntegrationsEmpty,
  "analytics-empty": AnalyticsEmpty,
  error: ErrorScene,
  success: SuccessScene,
};

export function Illustration({ name, className, title }: { name: IllustrationName; className?: string; title?: string }) {
  const C = MAP[name];
  const props: { className?: string; title?: string } = {};
  if (className) props.className = className;
  if (title) props.title = title;
  return <C {...props} />;
}
