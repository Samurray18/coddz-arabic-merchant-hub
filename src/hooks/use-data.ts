import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { rowToProduct, rowToOrder, productToPayload, orderToPayload, type Product, type Order } from "@/lib/domain";

const ownOrderIds = new Set<string>();

export function markOwnOrder(id: string) {
  ownOrderIds.add(id);
  if (ownOrderIds.size > 200) {
    const oldest = ownOrderIds.values().next().value;
    if (oldest) ownOrderIds.delete(oldest);
  }
}

export function isOwnOrder(id: string) {
  return ownOrderIds.has(id);
}

export function useProducts() {
  const { storeId } = useAuth();
  return useQuery({
    queryKey: ["products", storeId],
    enabled: !!storeId,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => rowToProduct(row as any));
    },
  });
}

export function useOrders() {
  const { storeId } = useAuth();
  return useQuery({
    queryKey: ["orders", storeId],
    enabled: !!storeId,
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => rowToOrder(row as any));
    },
  });
}

export function useSaveProduct() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<Product> & { id?: string }) => {
      if (!storeId) throw new Error("No store");
      const payload = productToPayload(product);
      if (product.id) {
        const { error } = await supabase
          .from("products")
          .update({ payload: payload as any })
          .eq("id", product.id)
          .eq("store_id", storeId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert({ payload: payload as any, store_id: storeId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", storeId] });
    },
  });
}

export function useDeleteProduct() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!storeId) throw new Error("No store");
      const { error } = await supabase.from("products").delete().eq("id", id).eq("store_id", storeId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products", storeId] }),
  });
}

export function useSaveOrder() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: Partial<Order> & { id?: string }) => {
      if (!storeId) throw new Error("No store");
      const payload = orderToPayload(order);
      const columns = {
        status: order.status ?? "new",
        phone: order.phone ?? null,
        customer_name: order.name ?? null,
        wilaya: order.wilaya ?? null,
        total: Number(order.amount) || 0,
        carrier: order.carrier ?? null,
        notes: order.notes ?? null,
        source: "manual",
      };
      if (order.id) {
        const { error } = await (supabase as any)
          .from("orders")
          .update({ payload: payload as any, ...columns })
          .eq("id", order.id)
          .eq("store_id", storeId);
        if (error) throw error;
        return;
      }
      const { data, error } = await (supabase as any)
        .from("orders")
        .insert({ payload: payload as any, store_id: storeId, ...columns })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) markOwnOrder(String(data.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      if (!storeId) throw new Error("No store");
      const { data, error } = await supabase
        .from("orders")
        .select("payload")
        .eq("id", id)
        .eq("store_id", storeId)
        .single();
      if (error) throw error;
      const payload = { ...((data.payload as Record<string, unknown>) ?? {}), status };
      const { error: updateError } = await (supabase as any)
        .from("orders")
        .update({ payload: payload as any, status })
        .eq("id", id)
        .eq("store_id", storeId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    },
  });
}
