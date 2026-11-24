import { useLanguage } from "@/hooks/use-language";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";

export function ComingSoon({ title }: { title: string }) {
  const { t } = useLanguage();
  return (
    <DashboardShell>
      <EmptyState title={title} subtitle={t.nav.comingSoonSub} />
    </DashboardShell>
  );
}
