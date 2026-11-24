import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { rowToProduct, rowToOrder, productToPayload, orderToPayload, type Product, type Order } from "@/lib/domain";

export function useProducts() {
  const { storeId } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["products", storeId],
    enabled: !!storeId,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToProduct);
    },
  });

  useEffect(() => {
    if (!storeId) return;
    const channel = supabase
      .channel(`products-${storeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `store_id=eq.${storeId}` }, () => {
        qc.invalidateQueries({ queryKey: ["products", storeId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeId, qc]);

  return q;
}

export function useOrders() {
  const { storeId } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["orders", storeId],
    enabled: !!storeId,
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToOrder);
    },
  });

  useEffect(() => {
    if (!storeId) return;
    const channel = supabase
      .channel(`orders-${storeId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` }, (payload) => {
        qc.invalidateQueries({ queryKey: ["orders", storeId] });
        toast("طلب جديد");
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` }, () => {
        qc.invalidateQueries({ queryKey: ["orders", storeId] });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` }, () => {
        qc.invalidateQueries({ queryKey: ["orders", storeId] });
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          qc.invalidateQueries({ queryKey: ["orders", storeId] });
        }
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeId, qc]);

  return q;
}

export function useSaveProduct() {
  const { storeId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<Product> & { id?: string }) => {
      if (!storeId) throw new Error("No store");
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
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { storeId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!storeId) throw new Error("No store");
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useSaveOrder() {
  const { storeId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Partial<Order> & { id?: string }) => {
      if (!storeId) throw new Error("No store");
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
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const { storeId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      if (!storeId) throw new Error("No store");
      const { data, error } = await supabase.from("orders").select("payload").eq("id", id).single();
      if (error) throw error;
      const payload = { ...(data.payload as Record<string, unknown>), status };
      const { error: uerr } = await supabase.from("orders").update({ payload: payload as any }).eq("id", id);
      if (uerr) throw uerr;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}