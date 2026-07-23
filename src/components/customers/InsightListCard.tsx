import type { ReactNode } from "react";

interface InsightListCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function InsightListCard({
  title,
  description,
  children,
}: InsightListCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <header className="mb-4">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </header>
      {children}
    </section>
  );
}
