import type { OrderStatus } from "./coddz";

export interface Product {
  id: string;
  store_id: string | null;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  sku: string;
  image?: string;
  variants?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  store_id: string | null;
  number: string;
  name: string;
  phone: string;
  wilaya: string;
  product: string;
  amount: number;
  status: OrderStatus;
  carrier: string;
  date: string;
  notes?: string;
  created_at?: string;
}

export function rowToProduct(row: { id: string; store_id: string | null; payload: unknown; created_at: string }): Product {
  const p = (row.payload ?? {}) as Record<string, unknown>;
  const result: Product = {
    id: row.id,
    store_id: row.store_id,
    name: String(p["name"] ?? ""),
    price: Number(p["price"] ?? 0),
    cost: Number(p["cost"] ?? 0),
    stock: Number(p["stock"] ?? 0),
    category: String(p["category"] ?? ""),
    sku: String(p["sku"] ?? ""),
    created_at: row.created_at,
  };
  if (p["image"]) result.image = String(p["image"]);
  if (p["variants"]) result.variants = String(p["variants"]);
  return result;
}

export function rowToOrder(row: {
  id: string;
  store_id: string | null;
  payload: unknown;
  created_at: string;
  number?: string | null;
  customer_name?: string | null;
  total?: number | string | null;
  phone?: string | null;
  carrier?: string | null;
  status?: string | null;
  notes?: string | null;
}): Order {
  const p = (row.payload ?? {}) as Record<string, unknown>;
  const dateValue = row.created_at || String(p["date"] ?? "");
  const result: Order = {
    id: row.id,
    store_id: row.store_id,
    number: String(row.number ?? p["number"] ?? ""),
    name: String(row.customer_name ?? p["name"] ?? ""),
    phone: String(row.phone ?? p["phone"] ?? ""),
    wilaya: String(p["wilaya"] ?? ""),
    product: String(p["product"] ?? ""),
    amount: Number(row.total ?? p["amount"] ?? 0),
    status: (row.status as OrderStatus) ?? (p["status"] as OrderStatus) ?? "new",
    carrier: String(row.carrier ?? p["carrier"] ?? ""),
    date: String(p["date"] || dateValue.slice(0, 10) || new Date().toISOString().slice(0, 10)),
    created_at: row.created_at,
  };
  const notes = row.notes ?? p["notes"];
  if (notes) result.notes = String(notes);
  return result;
}

export function productToPayload(p: Partial<Product>): Record<string, unknown> {
  return {
    name: p.name,
    price: p.price,
    cost: p.cost,
    stock: p.stock,
    category: p.category,
    sku: p.sku,
    image: p.image,
    variants: p.variants,
  };
}

export function orderToPayload(o: Partial<Order>): Record<string, unknown> {
  return {
    number: o.number,
    name: o.name,
    phone: o.phone,
    wilaya: o.wilaya,
    product: o.product,
    amount: o.amount,
    status: o.status,
    carrier: o.carrier,
    date: o.date,
    notes: o.notes,
  };
}