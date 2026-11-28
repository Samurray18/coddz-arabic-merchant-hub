import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/require-auth";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/team")({
  component: () => (
    <RequireAuth>
      <TeamPage />
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Team — COD YOU" }] }),
});

interface Member {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: "active" | "pending";
  tone: "primary" | "accent" | "warning" | "primary-container";
  metric?: string | undefined;
}

function initials(name: string, fallback: string) {
  return (name.trim()[0] ?? fallback).toUpperCase();
}

function TeamPage() {
  const { t } = useLanguage();
  const { storeId, user } = useAuth();

  const ROLE_LABEL: Record<string, string> = {
    owner: t.team.storeManager,
    manager: t.team.manager,
    agent: t.team.agent,
    stock_keeper: t.team.stockKeeper,
  };
  const { data: invites = [] } = useQuery({
    queryKey: ["team_invites", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("team_invites")
        .select("*")
        .eq("store_id", storeId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", storeId],
    enabled: !!storeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("orders")
        .select("assigned_to, status")
        .eq("store_id", storeId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const confirmationsByUser = new Map<string, number>();
  for (const o of orders as any[]) {
    if (o.assigned_to && (o.status === "confirmed" || o.status === "shipped" || o.status === "delivered")) {
      confirmationsByUser.set(o.assigned_to, (confirmationsByUser.get(o.assigned_to) ?? 0) + 1);
    }
  }

  const members: Member[] = [];
  const ownerConfirmations = user?.id ? (confirmationsByUser.get(user.id) ?? 0) : 0;
  members.push({
    id: "owner",
    name: user?.email?.split("@")[0] ?? t.team.ownerName,
    role: t.team.storeManager,
    phone: user?.email ?? "",
    status: "active",
    tone: "primary",
    metric: ownerConfirmations > 0 ? t.team.confirmationsCount.replace("{count}", String(ownerConfirmations)) : undefined,
  });
  for (const invite of invites as any[]) {
    members.push({
      id: String(invite.id),
      name: String(invite.email).split("@")[0] ?? "",
      role: ROLE_LABEL[String(invite.role)] ?? String(invite.role),
      phone: String(invite.email),
      status: invite.status === "accepted" ? "active" : "pending",
      tone: invite.status === "accepted" ? "accent" : "warning",
    });
  }

  const total = members.length;
  const activeAgents = members.filter((m) => m.role === t.team.agent && m.status === "active").length;
  const pending = members.filter((m) => m.status === "pending").length;

  const toneClass = (tone: Member["tone"]) =>
    tone === "primary"
      ? "bg-primary text-on-primary"
      : tone === "accent"
        ? "bg-accent-container text-on-accent-container"
        : tone === "warning"
          ? "bg-warning-container text-on-warning-container"
          : "bg-primary-container text-on-primary-container";

  const statusBadge = (m: Member) => {
    if (m.status === "pending") return "bg-warning-container text-on-warning-container";
    if (m.role === t.team.storeManager) return "bg-accent-container text-on-accent-container";
    return "bg-accent-container text-on-accent-container";
  };
  const statusLabel = (m: Member) => {
    if (m.status === "pending") return t.team.pending;
    if (m.role === t.team.storeManager) return t.team.active;
    return t.team.active;
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-gutter-xl">
        <section className="grid grid-cols-1 gap-gutter-lg sm:grid-cols-3 items-stretch">
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">{t.team.totalMembers}</span>
              <span className="font-headline text-headline-md tabular-nums text-on-surface">{t.team.membersCount.replace("{count}", String(total))}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">{t.team.activeAgents}</span>
              <span className="font-headline text-headline-md tabular-nums text-primary">{t.team.activeAgentsCount.replace("{count}", String(activeAgents))}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-container text-on-accent-container">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </span>
          </article>
          <article className="flex h-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-body text-label-md text-on-surface-variant">{t.team.pendingInvites}</span>
              <span className="font-headline text-headline-md tabular-nums text-warning">
                {pending === 1 ? t.team.oneInvite : t.team.invitesCount.replace("{count}", String(pending))}
              </span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-container text-on-warning-container">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </span>
          </article>
        </section>

        <section className="flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-sm">
            <button type="button" className="rounded-full bg-primary px-4 py-2 font-headline text-label-md text-on-primary">{t.team.all}</button>
            <button type="button" className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body text-label-md text-on-surface-variant hover:bg-surface-container-low">{t.team.phone}</button>
            <button type="button" className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body text-label-md text-on-surface-variant hover:bg-surface-container-low">{t.team.shipping}</button>
          </div>
          <button
            type="button"
            onClick={() => toast(t.team.inviteMember, { description: t.team.inviteSent })}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-headline text-label-md text-on-primary transition-colors hover:bg-success"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            {t.team.invite}
          </button>
        </section>

        <section className="grid grid-cols-1 gap-gutter-lg lg:grid-cols-2">
          {members.map((m) => (
            <article
              key={m.id}
              className="flex h-full items-center justify-between gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
            >
              <div className="flex items-center gap-gutter-md">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-headline text-title-md ${toneClass(m.tone)}`}>
                  {initials(m.name, t.team.initialFallback)}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-title-md text-on-surface">{m.name}</h2>
                    <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 font-body text-label-sm text-on-surface-variant">
                      {m.role}
                    </span>
                    {m.role === t.team.storeManager && (
                      <span className="rounded-full bg-primary-container px-2.5 py-0.5 font-body text-label-sm text-on-primary-container">
                        {t.team.storeManager}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-mono-md tabular-nums text-on-surface-variant" dir="ltr">{m.phone}</span>
                </div>
              </div>
              {m.metric ? (
                <span className="font-headline text-label-md tabular-nums text-primary">{m.metric} {t.team.today}</span>
              ) : (
                <span className={`rounded-full px-3 py-1 font-body text-label-sm ${statusBadge(m)}`}>{statusLabel(m)}</span>
              )}
            </article>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
