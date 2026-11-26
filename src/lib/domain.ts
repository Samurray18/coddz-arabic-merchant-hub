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
  commune?: string | null;
  address?: string | null;
  delivery_type?: string | null;
  delivery_price?: number | null;
  product: string;
  amount: number;
  status: OrderStatus;
  confirmation_status?: string | null;
  carrier: string;
  date: string;
  notes?: string;
  source?: string;
  flags?: { blacklisted?: boolean; duplicate?: boolean; previous_returns?: number } | null;
  created_at?: string;
}

export function rowToProduct(row: {
  id: string;
  store_id: string | null;
  payload: unknown;
  created_at: string;
  name?: string | null;
  sku?: string | null;
  category?: string | null;
  price?: number | string | null;
  cost?: number | string | null;
  stock?: number | null;
}): Product {
  const p = (row.payload ?? {}) as Record<string, unknown>;
  const name = row.name && String(row.name).trim() ? String(row.name) : String(p["name"] ?? "");
  const sku = row.sku && String(row.sku).trim() ? String(row.sku) : String(p["sku"] ?? "");
  const category = row.category && String(row.category).trim() ? String(row.category) : String(p["category"] ?? "");
  const price = row.price != null && row.price !== "" ? Number(row.price) : Number(p["price"] ?? 0);
  const cost = row.cost != null && row.cost !== "" ? Number(row.cost) : Number(p["cost"] ?? 0);
  const stock = row.stock != null ? Number(row.stock) : Number(p["stock"] ?? 0);
  const result: Product = {
    id: row.id,
    store_id: row.store_id,
    name,
    price,
    cost,
    stock,
    category,
    sku,
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
  confirmation_status?: string | null;
  notes?: string | null;
  source?: string | null;
  flags?: unknown;
  wilaya?: string | null;
  commune?: string | null;
  address?: string | null;
  delivery_type?: string | null;
  delivery_price?: number | string | null;
  order_items?: Array<{ name: string; quantity: number; price: number }> | null;
}): Order {
  const p = (row.payload ?? {}) as Record<string, unknown>;
  const dateValue = row.created_at || String(p["date"] ?? "");
  let product = String(p["product"] ?? "");
  const items = row.order_items;
  if (Array.isArray(items) && items.length) {
    product = items[0]?.name ?? "";
    if (items.length > 1) product = product + " +" + (items.length - 1);
  }
  const wilaya = row.wilaya && String(row.wilaya).trim() ? String(row.wilaya) : String(p["wilaya"] ?? "");
  const result: Order = {
    id: row.id,
    store_id: row.store_id,
    number: String(row.number ?? p["number"] ?? ""),
    name: String(row.customer_name ?? p["name"] ?? ""),
    phone: String(row.phone ?? p["phone"] ?? ""),
    wilaya,
    commune: row.commune ?? (p["commune"] as string) ?? null,
    address: row.address ?? (p["address"] as string) ?? null,
    delivery_type: row.delivery_type ?? (p["delivery_type"] as string) ?? null,
    delivery_price: row.delivery_price != null ? Number(row.delivery_price) : (p["delivery_price"] != null ? Number(p["delivery_price"]) : null),
    product,
    amount: Number(row.total ?? p["amount"] ?? 0),
    status: (row.status as OrderStatus) ?? (p["status"] as OrderStatus) ?? "new",
    confirmation_status: row.confirmation_status ?? (p["confirmation_status"] as string) ?? "pending",
    carrier: String(row.carrier ?? p["carrier"] ?? ""),
    date: String(p["date"] || dateValue.slice(0, 10) || new Date().toISOString().slice(0, 10)),
    source: row.source ?? String(p["source"] ?? "manual"),
    flags: (row.flags as any) ?? (p["flags"] as any) ?? null,
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