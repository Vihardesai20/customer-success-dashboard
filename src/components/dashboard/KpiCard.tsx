import type { ReactNode } from "react";

type Trend = "up" | "down" | "neutral";

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  accent?: "default" | "warning" | "danger" | "success";
  trend?: Trend;
  trendLabel?: string;
  icon?: ReactNode;
  index?: number;
}

const accentStyles = {
  default: {
    icon: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
    bar: "bg-[var(--accent)]",
  },
  warning: {
    icon: "bg-[var(--warning-soft)] text-[var(--warning)]",
    bar: "bg-[var(--warning)]",
  },
  danger: {
    icon: "bg-[var(--danger-soft)] text-[var(--danger)]",
    bar: "bg-[var(--danger)]",
  },
  success: {
    icon: "bg-[var(--success-soft)] text-[var(--success)]",
    bar: "bg-[var(--success)]",
  },
} as const;

export function KpiCard({
  label,
  value,
  detail,
  accent = "default",
  trend = "neutral",
  trendLabel,
  icon,
  index = 0,
}: KpiCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={`absolute inset-x-0 top-0 h-0.5 ${styles.bar} opacity-80`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] font-semibold tracking-tight text-[var(--text)] sm:text-[2rem]">
            {value}
          </p>
        </div>
        {icon ? (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon} transition-transform duration-300 group-hover:scale-105`}
          >
            {icon}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">{detail}</p>
        {trendLabel ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              trend === "up"
                ? "text-[var(--success)]"
                : trend === "down"
                  ? "text-[var(--danger)]"
                  : "text-[var(--muted)]"
            }`}
          >
            <TrendGlyph trend={trend} />
            {trendLabel}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function TrendGlyph({ trend }: { trend: Trend }) {
  if (trend === "neutral") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={trend === "down" ? "rotate-180" : undefined}
    >
      <path
        d="M6 9.25V2.75M6 2.75L3.25 5.5M6 2.75L8.75 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
