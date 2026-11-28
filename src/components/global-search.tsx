import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useOrders, useProducts, useCustomers } from "@/hooks/use-data";
import { Money } from "@/components/money";

export function GlobalSearch() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: ordersData } = useOrders();
  const orders = ordersData?.pages.flat() ?? [];
  const { data: productsData } = useProducts();
  const products = productsData?.pages.flat() ?? [];
  const { data: customers = [] } = useCustomers();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = query.trim().toLowerCase();

  const orderResults = useMemo(() => {
    if (!q) return [];
    return orders.filter((o) =>
      `${o.number} ${o.name} ${o.phone} ${o.product} ${o.wilaya}`.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [orders, q]);

  const productResults = useMemo(() => {
    if (!q) return [];
    return products.filter((p) =>
      `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [products, q]);

  const customerResults = useMemo(() => {
    if (!q) return [];
    return customers.filter((c) =>
      `${c.name} ${c.phone} ${c.wilaya}`.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [customers, q]);

  const hasResults = orderResults.length || productResults.length || customerResults.length;

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t.search.placeholder}
          className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-3 pr-10 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-primary"
        />
      </div>
      {open && q && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg">
          {!hasResults && (
            <p className="p-4 text-center font-body text-body-md text-on-surface-variant">{t.search.noResults}</p>
          )}
          {orderResults.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 font-body text-label-sm text-on-surface-variant">{t.search.orders}</p>
              {orderResults.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { setOpen(false); setQuery(""); navigate({ to: "/orders" }); }}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-start hover:bg-surface-container-low"
                >
                  <span className="font-body text-body-md text-on-surface">#{o.number} — {o.name}</span>
                  <span className="font-mono text-mono-md tabular-nums text-on-surface-variant"><Money value={o.amount} /></span>
                </button>
              ))}
            </div>
          )}
          {productResults.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 font-body text-label-sm text-on-surface-variant">{t.search.products}</p>
              {productResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setOpen(false); setQuery(""); navigate({ to: "/products" }); }}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-start hover:bg-surface-container-low"
                >
                  <span className="font-body text-body-md text-on-surface">{p.name}</span>
                  <span className="font-mono text-mono-md tabular-nums text-on-surface-variant">{p.sku}</span>
                </button>
              ))}
            </div>
          )}
          {customerResults.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 font-body text-label-sm text-on-surface-variant">{t.search.customers}</p>
              {customerResults.map((c) => (
                <button
                  key={c.phone}
                  type="button"
                  onClick={() => { setOpen(false); setQuery(""); navigate({ to: "/customers" }); }}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-start hover:bg-surface-container-low"
                >
                  <span className="font-body text-body-md text-on-surface">{c.name || c.phone}</span>
                  <span className="font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">{c.phone}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
