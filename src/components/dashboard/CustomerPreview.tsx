import { formatCurrency, formatDate, formatScore } from "@/lib/format";
import type { Customer, HealthStatus } from "@/types/customer";

interface CustomerPreviewProps {
  customers: Customer[];
}

const statusStyles: Record<HealthStatus, string> = {
  healthy: "bg-[var(--success-soft)] text-[var(--success)]",
  at_risk: "bg-[var(--warning-soft)] text-[var(--warning)]",
  critical: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

const statusLabels: Record<HealthStatus, string> = {
  healthy: "Healthy",
  at_risk: "At risk",
  critical: "Critical",
};

export function CustomerPreview({ customers }: CustomerPreviewProps) {
  const preview = [...customers]
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 6);

  return (
    <section
      aria-label="Customer preview"
      className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]">
            Accounts needing attention
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Lowest health scores from mock portfolio data
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Customer
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                ARR
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Health
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Renewal
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                CSM
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {preview.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-muted)]/70"
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium text-[var(--text)]">{customer.name}</div>
                  <div className="text-xs text-[var(--muted)]">{customer.industry}</div>
                </td>
                <td className="px-5 py-3.5 tabular-nums text-[var(--text-secondary)]">
                  {formatCurrency(customer.arr)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${customer.healthScore}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-[var(--text-secondary)]">
                      {formatScore(customer.healthScore)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                  {formatDate(customer.renewalDate)}
                </td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                  {customer.csmOwner}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${statusStyles[customer.status]}`}
                  >
                    {statusLabels[customer.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
