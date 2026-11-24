import { useLanguage } from "@/hooks/use-language";
import { DashboardShell } from "@/components/dashboard-shell";

export function ComingSoon({ title }: { title: string }) {
  const { t } = useLanguage();
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-body text-label-sm text-on-surface-variant">
          قريبًا
        </span>
        <h1 className="font-headline text-headline-lg text-on-surface">{title}</h1>
        <p className="font-body text-body-md text-on-surface-variant max-w-prose">
          هذه الصفحة قيد التطوير. سنضيفها قريبًا.
        </p>
      </div>
    </DashboardShell>
  );
}