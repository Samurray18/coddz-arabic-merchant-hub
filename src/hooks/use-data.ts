import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { rowToProduct, rowToOrder, productToPayload, orderToPayload, type Product, type Order } from "@/lib/domain";

const DEMO_PRODUCTS_KEY = "coddz_demo_products";
const DEMO_ORDERS_KEY = "coddz_demo_orders";

function readDemo<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function writeDemo<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useProducts() {
  const { storeId, isDemo } = useAuth();
  return useQuery({
    queryKey: ["products", storeId, isDemo],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      let rows = (data ?? []).map(rowToProduct);
      if (isDemo || !storeId) {
        rows = rows.filter((p) => p.store_id === null);
        const demo = readDemo<Product>(DEMO_PRODUCTS_KEY);
        rows = [...demo, ...rows];
      } else {
        rows = rows.filter((p) => p.store_id === storeId);
      }
      return rows;
    },
  });
}

export function useOrders() {
  const { storeId, isDemo } = useAuth();
  return useQuery({
    queryKey: ["orders", storeId, isDemo],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      let rows = (data ?? []).map(rowToOrder);
      if (isDemo || !storeId) {
        rows = rows.filter((o) => o.store_id === null);
        const demo = readDemo<Order>(DEMO_ORDERS_KEY);
        rows = [...demo, ...rows];
      } else {
        rows = rows.filter((o) => o.store_id === storeId);
      }
      return rows;
    },
  });
}

export function useSaveProduct() {
  const { storeId, isDemo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<Product> & { id?: string }) => {
      if (isDemo || !storeId) {
        const list = readDemo<Product>(DEMO_PRODUCTS_KEY);
        if (product.id && list.some((p) => p.id === product.id)) {
          const next = list.map((p) => (p.id === product.id ? { ...p, ...product } : p));
          writeDemo(DEMO_PRODUCTS_KEY, next);
        } else {
          const newItem: Product = {
            id: product.id ?? `demo-${Date.now()}`,
            store_id: null,
            name: product.name ?? "",
            price: product.price ?? 0,
            cost: product.cost ?? 0,
            stock: product.stock ?? 0,
            category: product.category ?? "",
            sku: product.sku ?? "",
            created_at: new Date().toISOString(),
          };
          if (product.image) newItem.image = product.image;
          if (product.variants) newItem.variants = product.variants;
          writeDemo(DEMO_PRODUCTS_KEY, [newItem, ...list]);
        }
        return product;
      }
      const payload = productToPayload(product);
      if (product.id) {
        const { error } = await supabase
          .from("products")
          .update({ payload: payload as any, store_id: storeId })
          .eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert({ payload: payload as any, store_id: storeId });
        if (error) throw error;
      }
      return product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { storeId, isDemo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo || !storeId) {
        const list = readDemo<Product>(DEMO_PRODUCTS_KEY).filter((p) => p.id !== id);
        writeDemo(DEMO_PRODUCTS_KEY, list);
        return;
      }
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useSaveOrder() {
  const { storeId, isDemo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Partial<Order> & { id?: string }) => {
      if (isDemo || !storeId) {
        const list = readDemo<Order>(DEMO_ORDERS_KEY);
        if (order.id && list.some((o) => o.id === order.id)) {
          const next = list.map((o) => (o.id === order.id ? { ...o, ...order } : o));
          writeDemo(DEMO_ORDERS_KEY, next);
        } else {
          const newItem: Order = {
            id: order.id ?? `demo-${Date.now()}`,
            store_id: null,
            number: order.number ?? `DZ-${Math.floor(Math.random() * 9000 + 1000)}`,
            name: order.name ?? "",
            phone: order.phone ?? "",
            wilaya: order.wilaya ?? "",
            product: order.product ?? "",
            amount: order.amount ?? 0,
            status: order.status ?? "new",
            carrier: order.carrier ?? "Yalidine",
            date: order.date ?? new Date().toISOString().slice(0, 10),
            created_at: new Date().toISOString(),
          };
          if (order.notes) newItem.notes = order.notes;
          writeDemo(DEMO_ORDERS_KEY, [newItem, ...list]);
        }
        return order;
      }
      const payload = orderToPayload(order);
      if (order.id) {
        const { error } = await supabase
          .from("orders")
          .update({ payload: payload as any, store_id: storeId })
          .eq("id", order.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("orders")
          .insert({ payload: payload as any, store_id: storeId });
        if (error) throw error;
      }
      return order;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const { storeId, isDemo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      if (isDemo || !storeId) {
        const list = readDemo<Order>(DEMO_ORDERS_KEY);
        const target = list.find((o) => o.id === id);
        if (target) {
          writeDemo(DEMO_ORDERS_KEY, list.map((o) => (o.id === id ? { ...o, status } : o)));
        }
        // sample rows cannot be updated; ignore
        return;
      }
      // For real rows, fetch current payload then update status
      const { data, error } = await supabase.from("orders").select("payload").eq("id", id).single();
      if (error) throw error;
      const payload = { ...(data.payload as Record<string, unknown>), status };
      const { error: uerr } = await supabase.from("orders").update({ payload: payload as any }).eq("id", id);
      if (uerr) throw uerr;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}