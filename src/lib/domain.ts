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

export function rowToOrder(row: { id: string; store_id: string | null; payload: unknown; created_at: string }): Order {
  const p = (row.payload ?? {}) as Record<string, unknown>;
  const result: Order = {
    id: row.id,
    store_id: row.store_id,
    number: String(p["number"] ?? ""),
    name: String(p["name"] ?? ""),
    phone: String(p["phone"] ?? ""),
    wilaya: String(p["wilaya"] ?? ""),
    product: String(p["product"] ?? ""),
    amount: Number(p["amount"] ?? 0),
    status: (p["status"] as OrderStatus) ?? "new",
    carrier: String(p["carrier"] ?? ""),
    date: String(p["date"] ?? new Date().toISOString().slice(0, 10)),
    created_at: row.created_at,
  };
  if (p["notes"]) result.notes = String(p["notes"]);
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