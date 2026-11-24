export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-gutter-md rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-12 text-center shadow-sm">
      <img src="/images/empty-state.svg" alt="" className="h-32 w-44 object-contain" />
      <h3 className="font-headline text-title-lg text-on-surface">{title}</h3>
      {subtitle && <p className="font-body text-body-md text-on-surface-variant max-w-prose">{subtitle}</p>}
    </div>
  );
}
