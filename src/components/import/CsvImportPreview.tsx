import { formatCurrency, formatDate, formatNumber, formatPercent, formatScore } from "@/lib/format";
import type { CsvImportPreview, CsvValidationIssue } from "@/lib/csv/types";
import { ExpansionBadge, HealthStatusBadge } from "@/components/dashboard/StatusBadges";

interface CsvImportPreviewProps {
  preview: CsvImportPreview;
  issues: CsvValidationIssue[];
}

export function CsvImportPreviewPanel({ preview, issues }: CsvImportPreviewProps) {
  const previewRows = preview.validCustomers.slice(0, 10);
  const errors = issues.filter((issue) => issue.severity === "error");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Total data rows" value={formatNumber(preview.totalDataRows)} />
        <Stat label="Valid rows" value={formatNumber(preview.validRowCount)} />
        <Stat label="Invalid rows" value={formatNumber(preview.invalidRowCount)} />
      </div>

      {errors.length > 0 ? (
        <div
          className="rounded-xl border border-[var(--danger-soft)] bg-[var(--danger-soft)]/40 px-4 py-3"
          role="alert"
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            {formatNumber(errors.length)} validation error
            {errors.length === 1 ? "" : "s"} must be fixed before import
          </p>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-sm text-[var(--danger)]">
            {errors.slice(0, 30).map((issue, index) => (
              <li key={`${issue.rowNumber}-${issue.field}-${index}`}>
                {issue.rowNumber != null ? `Row ${issue.rowNumber}` : "File"}
                {issue.field ? ` · ${issue.field}` : ""}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-[var(--success)]" role="status">
          Validation passed. Review the preview, then confirm import.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2">
          <p className="text-sm font-medium text-[var(--text)]">
            Preview of first {formatNumber(previewRows.length)} valid row
            {previewRows.length === 1 ? "" : "s"}
          </p>
        </div>
        {previewRows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[var(--muted)]">
            No valid rows available to preview.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">ARR</th>
                  <th className="px-3 py-2 font-medium">Health</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Adoption</th>
                  <th className="px-3 py-2 font-medium">Renewal</th>
                  <th className="px-3 py-2 font-medium">Expansion</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((customer) => (
                  <tr key={customer.id} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2 text-[var(--muted)]">{customer.id}</td>
                    <td className="px-3 py-2 font-medium text-[var(--text)]">
                      {customer.name}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-[var(--text-secondary)]">
                      {formatCurrency(customer.arr)}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-[var(--text-secondary)]">
                      {formatScore(customer.healthScore)}
                    </td>
                    <td className="px-3 py-2">
                      <HealthStatusBadge status={customer.status} />
                    </td>
                    <td className="px-3 py-2 tabular-nums text-[var(--text-secondary)]">
                      {formatPercent(customer.adoptionPercent)}
                    </td>
                    <td className="px-3 py-2 text-[var(--text-secondary)]">
                      {formatDate(customer.renewalDate)}
                    </td>
                    <td className="px-3 py-2">
                      <ExpansionBadge opportunity={customer.expansionOpportunity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}
