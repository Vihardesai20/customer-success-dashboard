import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <header className="mb-4">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </header>
      <div className="min-h-[260px] flex-1">{children}</div>
    </article>
  );
}
