import type { ExpansionOpportunity, HealthStatus } from "@/types/customer";
import {
  expansionLabels,
  healthStatusLabels,
} from "@/lib/portfolio";

const statusStyles: Record<HealthStatus, string> = {
  healthy: "bg-[var(--success-soft)] text-[var(--success)]",
  at_risk: "bg-[var(--warning-soft)] text-[var(--warning)]",
  critical: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

const expansionStyles: Record<ExpansionOpportunity, string> = {
  high: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  medium: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
  low: "bg-[var(--warning-soft)] text-[var(--warning)]",
  none: "bg-[var(--surface-muted)] text-[var(--muted)]",
};

export function HealthStatusBadge({ status }: { status: HealthStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {healthStatusLabels[status]}
    </span>
  );
}

export function ExpansionBadge({
  opportunity,
}: {
  opportunity: ExpansionOpportunity;
}) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${expansionStyles[opportunity]}`}
    >
      {expansionLabels[opportunity]}
    </span>
  );
}
