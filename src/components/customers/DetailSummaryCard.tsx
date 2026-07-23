import type { ReactNode } from "react";

interface DetailSummaryCardProps {
  label: string;
  value: ReactNode;
  detail?: string;
}

export function DetailSummaryCard({
  label,
  value,
  detail,
}: DetailSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--muted)]">
        {label}
      </p>
      <div className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text)]">
        {value}
      </div>
      {detail ? (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{detail}</p>
      ) : null}
    </article>
  );
}
