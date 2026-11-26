import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { isOwnOrder } from "@/hooks/use-data";

export type RealtimeStatus = "offline" | "connecting" | "live" | "reconnecting";

interface RealtimeContextValue {
  status: RealtimeStatus;
}

const RealtimeContext = createContext<RealtimeContextValue>({ status: "offline" });

export function useRealtime() {
  return useContext(RealtimeContext);
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RealtimeStatus>("offline");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!storeId) {
      setStatus("offline");
      return;
    }

    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    setStatus(attempt === 0 ? "connecting" : "reconnecting");

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
      queryClient.invalidateQueries({ queryKey: ["products", storeId] });
    };

    const channel = supabase.channel(`store-${storeId}`);

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` },
      (payload) => {
        invalidate();
        const row = payload.new as Record<string, unknown>;
        const id = typeof row["id"] === "string" ? row["id"] : "";
        if (!isOwnOrder(id)) {
          toast("طلب جديد", { description: "تم استلام طلب جديد في متجرك." });
        }
      },
    );

    for (const event of ["UPDATE", "DELETE"] as const) {
      channel.on(
        "postgres_changes",
        { event, schema: "public", table: "orders", filter: `store_id=eq.${storeId}` },
        invalidate,
      );
    }

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "order_events", filter: `store_id=eq.${storeId}` },
      invalidate,
    );

    for (const event of ["INSERT", "UPDATE", "DELETE"] as const) {
      channel.on(
        "postgres_changes",
        { event, schema: "public", table: "products", filter: `store_id=eq.${storeId}` },
        invalidate,
      );
    }

    channel.subscribe((channelStatus) => {
      if (disposed) return;
      if (channelStatus === "SUBSCRIBED") {
        setStatus("live");
        return;
      }
      if (
        channelStatus === "CHANNEL_ERROR" ||
        channelStatus === "TIMED_OUT" ||
        channelStatus === "CLOSED"
      ) {
        setStatus("reconnecting");
        invalidate();
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = setTimeout(() => {
          if (!disposed) setAttempt((value) => value + 1);
        }, 1500);
      }
    });

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      void supabase.removeChannel(channel);
    };
  }, [storeId, queryClient, attempt]);

  return <RealtimeContext.Provider value={{ status }}>{children}</RealtimeContext.Provider>;
}
