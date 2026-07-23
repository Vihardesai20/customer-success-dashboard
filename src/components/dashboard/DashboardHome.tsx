"use client";

import { useState } from "react";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { CustomerPortfolioTable } from "@/components/dashboard/CustomerPortfolioTable";
import { KpiSection } from "@/components/dashboard/KpiSection";
import { CsvImportModal } from "@/components/import/CsvImportModal";
import { AppShell } from "@/components/layout/AppShell";
import { useCustomers } from "@/context/CustomerProvider";
import { getPortfolioMetrics } from "@/lib/metrics";

export function DashboardHome() {
  const {
    customers,
    source,
    statusMessage,
    clearStatusMessage,
    resetToMock,
  } = useCustomers();
  const [importOpen, setImportOpen] = useState(false);
  const metrics = getPortfolioMetrics(customers);

  return (
    <AppShell
      title="Overview"
      subtitle="Portfolio health across your book of business"
      dataSource={source}
      onImportClick={() => setImportOpen(true)}
      onResetClick={source === "imported" ? resetToMock : undefined}
    >
      {statusMessage ? (
        <div
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <p className="text-sm text-[var(--accent-strong)]">{statusMessage}</p>
          <button
            type="button"
            onClick={clearStatusMessage}
            className="inline-flex h-8 items-center self-start rounded-lg px-2 text-sm font-medium text-[var(--accent-strong)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <KpiSection metrics={metrics} />
      <AnalyticsSection customers={customers} />
      <CustomerPortfolioTable
        customers={customers}
        onImportClick={() => setImportOpen(true)}
      />

      {importOpen ? (
        <CsvImportModal open onClose={() => setImportOpen(false)} />
      ) : null}
    </AppShell>
  );
}
