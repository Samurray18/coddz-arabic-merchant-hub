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
        .select("*, order_items(name, quantity, price)")
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
  const { storeId, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: (Partial<Order> & { id?: string; productId?: string | null; quantity?: number; delivery_type?: string; delivery_price?: number; commune?: string; address?: string }) ) => {
      if (!storeId) throw new Error("No store");
      const payload = orderToPayload(order);
      const status = order.status ?? "new";
      const total = Number(order.amount) || 0;
      const deliveryPrice = Number(order.delivery_price ?? 0);
      const deliveryType = order.delivery_type ?? "home";

      if (order.id) {
        const { error } = await (supabase as any)
          .from("orders")
          .update({
            payload: payload as any,
            status,
            phone: order.phone ?? null,
            customer_name: order.name ?? null,
            wilaya: order.wilaya ?? null,
            commune: order.commune ?? null,
            address: order.address ?? null,
            delivery_type: deliveryType,
            delivery_price: deliveryPrice,
            total,
            carrier: order.carrier ?? null,
            notes: order.notes ?? null,
          })
          .eq("id", order.id)
          .eq("store_id", storeId);
        if (error) throw error;
        // status change event
        try {
          await (supabase as any).from("order_events").insert({
            order_id: order.id,
            store_id: storeId,
            type: "status_change",
            from_status: null,
            to_status: status,
            user_id: user?.id ?? null,
          });
        } catch {}
        return;
      }

      // create
      const { data, error } = await (supabase as any)
        .from("orders")
        .insert({
          payload: payload as any,
          store_id: storeId,
          status,
          phone: order.phone ?? null,
          customer_name: order.name ?? null,
          wilaya: order.wilaya ?? null,
          commune: order.commune ?? null,
          address: order.address ?? null,
          delivery_type: deliveryType,
          delivery_price: deliveryPrice,
          total,
          carrier: order.carrier ?? null,
          notes: order.notes ?? null,
          source: "manual",
          external_order_id: null,
          confirmation_status: "pending",
        })
        .select("id, number, status")
        .single();
      if (error) throw error;
      const orderId = data.id;
      markOwnOrder(String(orderId));

      // fetch product cost if productId
      let productCost = 0;
      if (order.productId) {
        const { data: prod } = await (supabase as any)
          .from("products")
          .select("cost, name")
          .eq("id", order.productId)
          .eq("store_id", storeId)
          .maybeSingle();
        if (prod) productCost = Number(prod.cost ?? 0);
      }

      const qty = Number(order.quantity ?? 1) || 1;
      const price = Number(order.amount ?? total) || 0;
      // insert order_items
      const itemRow = {
        order_id: orderId,
        store_id: storeId,
        product_id: order.productId ?? null,
        name: order.product ?? order.name ?? "",
        quantity: qty,
        price,
        cost: productCost,
      };
      const { error: itemErr } = await (supabase as any).from("order_items").insert(itemRow);
      if (itemErr) {
        await (supabase as any).from("orders").delete().eq("id", orderId).eq("store_id", storeId);
        throw itemErr;
      }

      // order_events created
      try {
        await (supabase as any).from("order_events").insert({
          order_id: orderId,
          store_id: storeId,
          type: "created",
          to_status: "new",
          user_id: user?.id ?? null,
        });
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    },
  });
}

export function useRecordConfirmation() {
  const { storeId, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, result }: { id: string; result: string }) => {
      if (!storeId) throw new Error("No store");
      const { error } = await (supabase as any)
        .from("orders")
        .update({ confirmation_status: result })
        .eq("id", id)
        .eq("store_id", storeId);
      if (error) throw error;
      try {
        await (supabase as any).from("order_events").insert({
          order_id: id,
          store_id: storeId,
          type: "confirmation",
          note: result,
          user_id: user?.id ?? null,
        });
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    },
  });
}

export function useShipments() {
  const { storeId } = useAuth();
  return useQuery({
    queryKey: ["shipments", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shipments")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateShipment() {
  const { storeId, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      orderId: string;
      carrier: string;
      trackingNumber?: string;
      codAmount?: number;
    }) => {
      if (!storeId) throw new Error("No store");
      const { data, error } = await (supabase as any)
        .from("shipments")
        .insert({
          store_id: storeId,
          order_id: input.orderId,
          carrier: input.carrier,
          tracking_number: input.trackingNumber || null,
          cod_amount: input.codAmount ?? 0,
          status: "pending",
        })
        .select("*")
        .single();
      if (error) throw error;
      // update order carrier/status to shipped? keep status change separate
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments", storeId] });
    },
  });
}

export function useUpdateShipment() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; status?: string; tracking_number?: string; collected?: boolean }) => {
      if (!storeId) throw new Error("No store");
      const patch: any = {};
      if (input.status) patch.status = input.status;
      if (input.tracking_number !== undefined) patch.tracking_number = input.tracking_number;
      if (input.collected !== undefined) {
        patch.collected = input.collected;
        if (input.collected) patch.collected_at = new Date().toISOString();
      }
      const { error } = await (supabase as any)
        .from("shipments")
        .update(patch)
        .eq("id", input.id)
        .eq("store_id", storeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments", storeId] });
    },
  });
}

export function useStockMovements() {
  const { storeId } = useAuth();
  return useQuery({
    queryKey: ["stock_movements", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("stock_movements")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAdjustStock() {
  const { storeId, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { productId: string; delta: number; reason: string }) => {
      if (!storeId) throw new Error("No store");
      const { error } = await (supabase as any).rpc("adjust_stock", {
        p_product_id: input.productId,
        p_delta: input.delta,
      });
      if (error) throw error;
      try {
        await (supabase as any).from("stock_movements").insert({
          store_id: storeId,
          product_id: input.productId,
          change: input.delta,
          reason: input.reason || "adjustment",
          created_by: user?.id ?? null,
        });
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", storeId] });
      queryClient.invalidateQueries({ queryKey: ["stock_movements", storeId] });
    },
  });
}

export function useExpenses() {
  const { storeId } = useAuth();
  return useQuery({
    queryKey: ["expenses", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("expenses")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAdSpend() {
  const { storeId } = useAuth();
  return useQuery({
    queryKey: ["ad_spend", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("ad_spend")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAddExpense() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { amount: number; category: string; note?: string }) => {
      if (!storeId) throw new Error("No store");
      const { error } = await (supabase as any).from("expenses").insert({
        store_id: storeId,
        amount: input.amount,
        category: input.category,
        note: input.note ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", storeId] });
    },
  });
}

export function useAddAdSpend() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { amount: number; platform: string; date?: string }) => {
      if (!storeId) throw new Error("No store");
      const { error } = await (supabase as any).from("ad_spend").insert({
        store_id: storeId,
        amount: input.amount,
        platform: input.platform,
        date: input.date ?? new Date().toISOString().slice(0, 10),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad_spend", storeId] });
    },
  });
}

export function useRecordReturn() {
  const { storeId, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; reason: string; restock: boolean }) => {
      if (!storeId) throw new Error("No store");
      // update order status to returned
      const { data: current } = await (supabase as any)
        .from("orders")
        .select("status, payload")
        .eq("id", input.id)
        .eq("store_id", storeId)
        .single();
      const fromStatus = current?.status ?? null;
      const payload = { ...((current?.payload as Record<string, unknown>) ?? {}), status: "returned" };
      const { error: upErr } = await (supabase as any)
        .from("orders")
        .update({ payload: payload as any, status: "returned", notes: input.reason || null })
        .eq("id", input.id)
        .eq("store_id", storeId);
      if (upErr) throw upErr;
      // order_events: status_change + return
      try {
        await (supabase as any).from("order_events").insert({
          order_id: input.id,
          store_id: storeId,
          type: "status_change",
          from_status: fromStatus,
          to_status: "returned",
          user_id: user?.id ?? null,
        });
      } catch {}
      try {
        await (supabase as any).from("order_events").insert({
          order_id: input.id,
          store_id: storeId,
          type: "return",
          note: `${input.reason || "مرتجع"}${input.restock ? " (إعادة للمخزون)" : " (بدون إعادة)"}`,
          to_status: "returned",
          user_id: user?.id ?? null,
        });
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { storeId, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      if (!storeId) throw new Error("No store");
      const { data: current } = await (supabase as any)
        .from("orders")
        .select("status, payload")
        .eq("id", id)
        .eq("store_id", storeId)
        .single();
      const fromStatus = current?.status ?? null;
      const payload = { ...((current?.payload as Record<string, unknown>) ?? {}), status };
      const { error: updateError } = await (supabase as any)
        .from("orders")
        .update({ payload: payload as any, status })
        .eq("id", id)
        .eq("store_id", storeId);
      if (updateError) throw updateError;
      try {
        await (supabase as any).from("order_events").insert({
          order_id: id,
          store_id: storeId,
          type: "status_change",
          from_status: fromStatus,
          to_status: status,
          user_id: user?.id ?? null,
        });
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    },
  });
}
