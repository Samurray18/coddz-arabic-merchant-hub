const fs = require("fs");
const lines = fs.readFileSync("src/lib/domain.ts", "utf8").split("\n");
let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("export function rowToOrder")) start = i;
  if (start >= 0 && lines[i].trim() === "}" && i > start + 5) { end = i; break; }
}
console.log("start", start + 1, "end", end + 1);
const newFn = [
"export function rowToOrder(row: {",
"  id: string;",
"  store_id: string | null;",
"  payload: unknown;",
"  created_at: string;",
"  number?: string | null;",
"  customer_name?: string | null;",
"  total?: number | string | null;",
"  phone?: string | null;",
"  carrier?: string | null;",
"  status?: string | null;",
"  notes?: string | null;",
"  source?: string | null;",
"  flags?: unknown;",
"  wilaya?: string | null;",
"  commune?: string | null;",
"  address?: string | null;",
"  delivery_type?: string | null;",
"  delivery_price?: number | string | null;",
"  order_items?: Array<{ name: string; quantity: number; price: number }> | null;",
"}): Order {",
"  const p = (row.payload ?? {}) as Record<string, unknown>;",
"  const dateValue = row.created_at || String(p[\"date\"] ?? \"\");",
"  let product = String(p[\"product\"] ?? \"\");",
"  const items = row.order_items;",
"  if (Array.isArray(items) && items.length) {",
"    product = items[0].name;",
"    if (items.length > 1) product = product + \" +\" + (items.length - 1);",
"  }",
"  const wilaya = row.wilaya && String(row.wilaya).trim() ? String(row.wilaya) : String(p[\"wilaya\"] ?? \"\");",
"  const result: Order = {",
"    id: row.id,",
"    store_id: row.store_id,",
"    number: String(row.number ?? p[\"number\"] ?? \"\"),",
"    name: String(row.customer_name ?? p[\"name\"] ?? \"\"),",
"    phone: String(row.phone ?? p[\"phone\"] ?? \"\"),",
"    wilaya,",
"    commune: row.commune ?? (p[\"commune\"] as string) ?? null,",
"    address: row.address ?? (p[\"address\"] as string) ?? null,",
"    delivery_type: row.delivery_type ?? (p[\"delivery_type\"] as string) ?? null,",
"    delivery_price: row.delivery_price != null ? Number(row.delivery_price) : (p[\"delivery_price\"] != null ? Number(p[\"delivery_price\"]) : null),",
"    product,",
"    amount: Number(row.total ?? p[\"amount\"] ?? 0),",
"    status: (row.status as OrderStatus) ?? (p[\"status\"] as OrderStatus) ?? \"new\",",
"    carrier: String(row.carrier ?? p[\"carrier\"] ?? \"\"),",
"    date: String(p[\"date\"] || dateValue.slice(0, 10) || new Date().toISOString().slice(0, 10)),",
"    source: row.source ?? String(p[\"source\"] ?? \"manual\"),",
"    flags: (row.flags as any) ?? (p[\"flags\"] as any) ?? null,",
"    created_at: row.created_at,",
"  };",
"  const notes = row.notes ?? p[\"notes\"];",
"  if (notes) result.notes = String(notes);",
"  return result;",
"}",
];
const out = [...lines.slice(0, start), ...newFn, ...lines.slice(end + 1)];
fs.writeFileSync("src/lib/domain.ts", out.join("\n"));
console.log("done");
"