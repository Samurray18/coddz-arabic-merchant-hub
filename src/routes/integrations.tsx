import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { LocalDate } from "@/components/local-date";

export const Route = createFileRoute("/integrations")({
  component: () => (
    <RequireAuth>
      <IntegrationsPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Integrations — COD YOU" }] }),
});

const PROJECT_URL = "https://lxfgczdincyjtmfpyecm.supabase.co";
const ENDPOINTS = {
  api: `${PROJECT_URL}/functions/v1/ingest-order`,
  shopify: `${PROJECT_URL}/functions/v1/ingest-shopify`,
  woocommerce: `${PROJECT_URL}/functions/v1/ingest-woocommerce`,
};

const TABS = [
  { key: "api" },
  { key: "shopify" },
  { key: "woocommerce" },
  { key: "logs" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type T = ReturnType<typeof useLanguage>["t"];

function statusLabel(s: string, t: T) {
  if (s === "accepted") return t.integrations.accepted;
  if (s === "rejected") return t.integrations.rejected;
  if (s === "duplicate") return t.integrations.duplicate;
  return s;
}
function statusClass(s: string) {
  if (s === "accepted") return "bg-accent-container text-on-accent-container";
  if (s === "rejected") return "bg-error-container text-on-error-container";
  if (s === "duplicate") return "bg-warning-container text-on-warning-container";
  return "bg-surface-container-low text-on-surface-variant";
}

function copy(text: string, t: T) {
  navigator.clipboard?.writeText(text);
  toast.success(t.integrations.copied);
}

function IntegrationsPage() {
  const { t } = useLanguage();
  const { storeId, user } = useAuth();
  const { data: role } = useQuery({
    queryKey: ["user_role", storeId, user?.id],
    enabled: !!storeId && !!user?.id,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("store_id", storeId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as any)?.role ?? "agent";
    },
  });

  const isManager = role === "owner" || role === "manager";

  const [tab, setTab] = useState<TabKey>("api");

  if (!isManager) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <span className="rounded-full bg-error-container px-3 py-1 font-body text-label-sm text-on-error-container">
            {t.integrations.notAuthorized}
          </span>
          <h1 className="font-headline text-headline-lg text-on-surface">{t.integrations.notAuthorizedSub}</h1>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-on-surface lg:text-headline-lg">{t.integrations.title}</h1>
          <p className="font-body text-body-md text-on-surface-variant">{t.integrations.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-gutter-sm border-b border-outline-variant">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.key}
              type="button"
              onClick={() => setTab(tabItem.key)}
              className={`rounded-t-md px-4 py-2 font-headline text-label-md transition-colors ${
                tab === tabItem.key
                  ? "bg-accent-container text-on-accent-container"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {t.integrations[tabItem.key]}
            </button>
          ))}
        </div>

        {tab === "api" && <ApiTab storeId={storeId!} />}
        {tab === "shopify" && <WebhookTab storeId={storeId!} type="shopify" />}
        {tab === "woocommerce" && <WebhookTab storeId={storeId!} type="woocommerce" />}
        {tab === "logs" && <LogsTab storeId={storeId!} />}
      </div>
    </DashboardShell>
  );
}

// ---------- API TAB ----------
function ApiTab({ storeId }: { storeId: string }) {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["api_keys", storeId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("api_keys")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [showCreate, setShowCreate] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const createKey = async () => {
    if (!keyName.trim()) {
      toast.error(t.integrations.keyNameRequired);
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await (supabase as any).rpc("create_api_key", {
        p_store_id: storeId,
        p_name: keyName.trim(),
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      setNewKey(row?.api_key ?? row?.key ?? null);
      qc.invalidateQueries({ queryKey: ["api_keys", storeId] });
      toast.success(t.integrations.keyCreated);
    } catch (e: any) {
      toast.error(e?.message ?? t.integrations.error);
    } finally {
      setCreating(false);
    }
  };

  const revoke = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("api_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["api_keys", storeId] });
      toast.success(t.integrations.keyRevoked);
    } catch (e: any) {
      toast.error(e?.message ?? t.integrations.error);
    }
  };

  return (
    <div className="flex flex-col gap-gutter-xl">
      {/* endpoint + docs */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.endpoint}</h2>
        <div className="mt-3 flex items-center gap-gutter-sm">
          <code className="flex-1 rounded-md bg-surface-container-low px-3 py-2 font-mono text-mono-md text-on-surface" dir="ltr">
            {ENDPOINTS.api}
          </code>
          <button
            type="button"
            onClick={() => copy(ENDPOINTS.api, t)}
            className="rounded-md bg-primary px-3 py-2 font-headline text-label-md text-on-primary"
          >
            {t.integrations.copy}
          </button>
        </div>
      </section>

      {/* keys list */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.apiKeys}</h2>
          <button
            type="button"
            onClick={() => {
              setNewKey(null);
              setKeyName("");
              setShowCreate(true);
            }}
            className="rounded-md bg-primary px-3 py-2 font-headline text-label-md text-on-primary"
          >
            {`+ ${t.integrations.createKey}`}
          </button>
        </div>

        {isLoading ? (
          <p className="mt-4 text-center font-body text-body-md text-on-surface-variant">{t.common.loading}</p>
        ) : keys.length === 0 ? (
          <p className="mt-4 text-center font-body text-body-md text-on-surface-variant">{t.integrations.noKeys}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-right">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  {[
                    t.integrations.name,
                    t.integrations.prefix,
                    t.integrations.created,
                    t.integrations.lastUsed,
                    t.integrations.status,
                    t.integrations.actions,
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-body text-label-md text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {keys.map((k: any) => (
                  <tr key={k.id}>
                    <td className="px-4 py-3 font-body text-body-md text-on-surface">{k.name}</td>
                    <td className="px-4 py-3 font-mono text-mono-md text-on-surface-variant" dir="ltr">
                      {k.key_prefix}...
                    </td>
                    <td className="px-4 py-3 font-body text-label-sm text-on-surface-variant">
                      <LocalDate value={k.created_at} />
                    </td>
                    <td className="px-4 py-3 font-body text-label-sm text-on-surface-variant">
                      {k.last_used_at ? <LocalDate value={k.last_used_at} /> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${
                          k.revoked_at ? "bg-error-container text-on-error-container" : "bg-accent-container text-on-accent-container"
                        }`}
                      >
                        {k.revoked_at ? t.integrations.revoked : t.integrations.active}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!k.revoked_at && (
                        <button
                          type="button"
                          onClick={() => revoke(k.id)}
                          className="rounded-md bg-error-container px-3 py-1.5 font-headline text-label-sm text-on-error-container"
                        >
                          {t.integrations.revoke}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* docs */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.docs}</h2>
        <p className="mt-2 font-body text-body-md text-on-surface-variant">{t.integrations.docsIntro}</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-surface-container-low p-3 font-mono text-mono-md text-on-surface" dir="ltr">
{`curl -X POST ${ENDPOINTS.api} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"customer_name":"أحمد","phone":"0551234567","wilaya":"Alger","items":[{"name":"ساعة","quantity":1,"price":4500}]}'`}
        </pre>
        <pre className="mt-3 overflow-x-auto rounded-md bg-surface-container-low p-3 font-mono text-mono-md text-on-surface" dir="ltr">
{`fetch("${ENDPOINTS.api}", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": "YOUR_API_KEY" },
  body: JSON.stringify({ customer_name: "أحمد", phone: "0551234567", wilaya: "Alger", items: [{ name: "ساعة", quantity: 1, price: 4500 }] })
});`}
        </pre>
        <h3 className="mt-4 font-headline text-title-md text-on-surface">{t.integrations.fields}</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                {[t.integrations.field, t.integrations.type, t.integrations.required, t.integrations.description].map((h) => (
                  <th key={h} className="px-4 py-2 font-body text-label-md text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {[
                ["customer_name", "string", t.integrations.yes, t.integrations.customerName],
                ["phone", "string", t.integrations.yes, t.integrations.phoneDesc],
                ["wilaya", "string", t.integrations.yes, t.integrations.wilayaDesc],
                ["commune", "string", t.integrations.no, t.integrations.commune],
                ["address", "string", t.integrations.no, t.integrations.address],
                ["delivery_type", "home|desk", t.integrations.no, t.integrations.deliveryType],
                ["delivery_price", "number", t.integrations.no, t.integrations.deliveryPrice],
                ["notes", "string", t.integrations.no, t.integrations.notes],
                ["items", "array", t.integrations.yes, t.integrations.items],
                ["external_id", "string", t.integrations.no, t.integrations.externalId],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((c, i) => (
                    <td key={i} className="px-4 py-2 font-body text-body-md text-on-surface">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
            <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.createKeyTitle}</h2>
            {newKey ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-md bg-warning-container p-3 text-on-warning-container">
                  <p className="font-body text-body-md">{t.integrations.keyWarning}</p>
                </div>
                <code className="block break-all rounded-md bg-surface-container-low p-3 font-mono text-mono-md text-on-surface" dir="ltr">
                  {newKey}
                </code>
                <button
                  type="button"
                  onClick={() => copy(newKey, t)}
                  className="w-full rounded-md bg-primary py-2 font-headline text-label-md text-on-primary"
                >
                  {t.integrations.copy}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="w-full rounded-md bg-surface-container-low py-2 font-headline text-label-md text-on-surface"
                >
                  {t.integrations.close}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="flex flex-col gap-1">
                  <span className="font-body text-label-md text-on-surface-variant">{t.integrations.keyName}</span>
                  <input
                    className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                  />
                </label>
                <div className="flex gap-gutter-md">
                  <button
                    type="button"
                    onClick={createKey}
                    disabled={creating}
                    className="flex-1 rounded-md bg-primary py-2 font-headline text-label-md text-on-primary disabled:opacity-60"
                  >
                    {creating ? "..." : t.integrations.create}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="rounded-md bg-surface-container-low px-4 py-2 font-headline text-label-md text-on-surface"
                  >
                    {t.integrations.cancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- WEBHOOK TAB ----------
function WebhookTab({ storeId, type }: { storeId: string; type: "shopify" | "woocommerce" }) {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const isShopify = type === "shopify";
  const label = isShopify ? "Shopify" : "WooCommerce";

  const { data: integration } = useQuery({
    queryKey: ["integration", storeId, type],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("integrations")
        .select("*")
        .eq("store_id", storeId)
        .eq("type", type)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [secret, setSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const webhookUrl = `${ENDPOINTS[isShopify ? "shopify" : "woocommerce"]}?store=${storeId}`;

  const saveSecret = async () => {
    if (!secret.trim()) {
      toast.error(t.integrations.secretRequired);
      return;
    }
    setSaving(true);
    try {
      const { error } = await (supabase as any).rpc("set_integration_secret", {
        p_store_id: storeId,
        p_type: type,
        p_secret: secret.trim(),
      });
      if (error) throw error;
      // ensure integration row exists & active
      await (supabase as any)
        .from("integrations")
        .upsert({ store_id: storeId, type, status: "active" }, { onConflict: "store_id,type" });
      qc.invalidateQueries({ queryKey: ["integration", storeId, type] });
      toast.success(t.integrations.secretSaved);
      setSecret("");
    } catch (e: any) {
      toast.error(e?.message ?? t.integrations.error);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async () => {
    setToggling(true);
    try {
      const newStatus = integration?.status === "active" ? "paused" : "active";
      const { error: togErr } = await (supabase as any)
        .from("integrations")
        .upsert({ store_id: storeId, type, status: newStatus }, { onConflict: "store_id,type" });
      if (togErr) throw togErr;
      qc.invalidateQueries({ queryKey: ["integration", storeId, type] });
    } catch (e: any) {
      toast.error(e?.message ?? t.integrations.error);
    } finally {
      setToggling(false);
    }
  };

  const steps = isShopify
    ? [
        t.integrations.step1Shopify,
        t.integrations.step2Shopify,
        t.integrations.step3Shopify,
        t.integrations.step4Shopify,
      ]
    : [
        t.integrations.step1Woo,
        t.integrations.step2Woo,
        t.integrations.step3Woo,
        t.integrations.step4Woo,
      ];

  return (
    <div className="flex flex-col gap-gutter-xl">
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.webhookUrl}</h2>
        <div className="mt-3 flex items-center gap-gutter-sm">
          <code className="flex-1 rounded-md bg-surface-container-low px-3 py-2 font-mono text-mono-md text-on-surface" dir="ltr">
            {webhookUrl}
          </code>
          <button
            type="button"
            onClick={() => copy(webhookUrl, t)}
            className="rounded-md bg-primary px-3 py-2 font-headline text-label-md text-on-primary"
          >
            {t.integrations.copy}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.state}</h2>
          <button
            type="button"
            onClick={toggle}
            disabled={toggling}
            className={`rounded-full px-4 py-1.5 font-headline text-label-md ${
              integration?.status === "active"
                ? "bg-accent-container text-on-accent-container"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {integration?.status === "active" ? t.integrations.activeStatus : t.integrations.paused}
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-gutter-sm">
          <label className="flex flex-col gap-1">
            <span className="font-body text-label-md text-on-surface-variant">{t.integrations.signingSecret}</span>
            <input
              type="password"
              className="w-full rounded-md border border-outline-variant bg-surface px-3.5 py-2.5 font-mono text-mono-md text-on-surface focus:border-primary focus:outline-none"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder={t.integrations.pasteSecret}
            />
          </label>
          <button
            type="button"
            onClick={saveSecret}
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary disabled:opacity-60"
          >
            {saving ? "..." : t.integrations.saveSecret}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.setupSteps}</h2>
        <ol className="mt-3 list-decimal space-y-2 ps-5 font-body text-body-md text-on-surface">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// ---------- LOGS TAB ----------
function LogsTab({ storeId }: { storeId: string }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<any>(null);
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["intake_logs", storeId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("intake_logs")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="flex flex-col gap-gutter-xl">
      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.intakeLogs}</h2>
        {isLoading ? (
          <p className="mt-4 text-center font-body text-body-md text-on-surface-variant">{t.common.loading}</p>
        ) : logs.length === 0 ? (
          <p className="mt-4 text-center font-body text-body-md text-on-surface-variant">{t.integrations.noLogs}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-right">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  {[
                    t.integrations.source,
                    t.integrations.logStatus,
                    t.integrations.logError,
                    t.integrations.logTime,
                    t.integrations.details,
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-body text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {logs.map((l: any) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-body text-body-md text-on-surface">{l.source}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 font-body text-label-sm ${statusClass(l.status)}`}>
                        {statusLabel(l.status, t)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-label-sm text-on-surface-variant">{l.error ?? "—"}</td>
                    <td className="px-4 py-3 font-body text-label-sm text-on-surface-variant">
                      <LocalDate value={l.created_at} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(l)}
                        className="rounded-md bg-surface-container-low px-3 py-1.5 font-headline text-label-sm text-on-surface"
                      >
                        {t.common.view}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-on-surface">{t.integrations.payload}</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-surface-container-low p-3 font-mono text-mono-md text-on-surface" dir="ltr">
              {JSON.stringify(selected.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
