import { describe, it, expect } from "vitest";
import { rowToOrder, rowToProduct } from "@/lib/domain";

describe("rowToProduct", () => {
  it("UI-created row reads real columns", () => {
    const row: any = {
      id: "p1",
      store_id: "s1",
      payload: { name: "old", price: 1, cost: 2, stock: 3, sku: "OLD", category: "oldcat" },
      created_at: "2026-01-01",
      name: "Widget",
      sku: "W-1",
      category: "Electronics",
      price: 5000,
      cost: 3000,
      stock: 10,
    };
    const p = rowToProduct(row);
    expect(p.name).toBe("Widget");
    expect(p.sku).toBe("W-1");
    expect(p.category).toBe("Electronics");
    expect(p.price).toBe(5000);
    expect(p.cost).toBe(3000);
    expect(p.stock).toBe(10);
  });

  it("old row with only payload falls back", () => {
    const row: any = {
      id: "p2",
      store_id: "s1",
      payload: { name: "Legacy", price: 100, cost: 50, stock: 5, sku: "L-1", category: "cat" },
      created_at: "2026-01-01",
    };
    const p = rowToProduct(row);
    expect(p.name).toBe("Legacy");
    expect(p.price).toBe(100);
    expect(p.stock).toBe(5);
  });
});

describe("rowToOrder", () => {
  it("UI-created row reads real columns and items", () => {
    const row: any = {
      id: "o1",
      store_id: "s1",
      payload: { name: "أحمد", phone: "0551234567", wilaya: "Alger", amount: 4500, status: "new" },
      created_at: "2026-01-01",
      number: "DZ-1001",
      customer_name: "أحمد",
      total: 5000,
      phone: "0551234567",
      carrier: "Yalidine",
      status: "confirmed",
      wilaya: "Alger",
      commune: "باب الزوار",
      address: "شارع 1",
      delivery_type: "home",
      delivery_price: 500,
      source: "manual",
      flags: { blacklisted: false, duplicate: false, previous_returns: 0 },
      order_items: [{ name: "ساعة", quantity: 1, price: 4500 }],
    };
    const o = rowToOrder(row);
    expect(o.wilaya).toBe("Alger");
    expect(o.commune).toBe("باب الزوار");
    expect(o.amount).toBe(5000);
    expect(o.product).toBe("ساعة");
    expect(o.status).toBe("confirmed");
    expect(o.source).toBe("manual");
  });

  it("intake row: payload raw body, columns set", () => {
    const raw = { customer_name: "سارة", phone: "0662345678", wilaya: "Oran" };
    const row: any = {
      id: "o2",
      store_id: "s1",
      payload: raw,
      created_at: "2026-01-02",
      number: "DZ-1002",
      customer_name: "سارة",
      total: 3200,
      phone: "0662345678",
      wilaya: "Oran",
      source: "api",
      status: "new",
      flags: { blacklisted: false, duplicate: true, previous_returns: 0 },
      order_items: [{ name: "هاتف", quantity: 2, price: 1600 }, { name: "كابل", quantity: 1, price: 200 }],
    };
    const o = rowToOrder(row);
    expect(o.wilaya).toBe("Oran");
    expect(o.product).toBe("هاتف +1");
    expect(o.amount).toBe(3200);
    expect(o.flags?.duplicate).toBe(true);
  });

  it("old row with only payload", () => {
    const row: any = {
      id: "o3",
      store_id: "s1",
      payload: { name: "محمد", phone: "0773456789", wilaya: "Constantine", product: "سماعة", amount: 3800, status: "shipped", source: "manual" },
      created_at: "2026-01-03",
    };
    const o = rowToOrder(row);
    expect(o.wilaya).toBe("Constantine");
    expect(o.product).toBe("سماعة");
    expect(o.amount).toBe(3800);
    expect(o.status).toBe("shipped");
  });
});
