"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BackToPortfolioLink } from "@/components/customers/BackToPortfolioLink";
import { CustomerInsights } from "@/components/customers/CustomerInsights";
import { CustomerOverview } from "@/components/customers/CustomerOverview";
import { useCustomers } from "@/context/CustomerProvider";

export function CustomerDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { getCustomerById, ready, source, resetToMock } = useCustomers();

  if (!ready) {
    return (
      <AppShell title="Loading customer" subtitle="Preparing portfolio data">
        <p className="text-sm text-[var(--muted)]" role="status">
          Loading customer portfolio…
        </p>
      </AppShell>
    );
  }

  const customer = getCustomerById(id);

  if (!customer) {
    return (
      <AppShell
        title="Customer not found"
        subtitle="This ID is not in the current browser portfolio"
        dataSource={source}
        onResetClick={source === "imported" ? resetToMock : undefined}
      >
        <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center shadow-[var(--shadow-sm)]">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text)]">
            No customer matches this ID
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Imported portfolios live in browser session storage. If you reset to
            mock data or cleared the session, imported-only customer links will
            no longer resolve.
          </p>
          <div className="mt-6 flex justify-center">
            <BackToPortfolioLink />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={customer.name}
      subtitle={`${customer.industry} · CSM ${customer.csmOwner}`}
      dataSource={source}
      onResetClick={source === "imported" ? resetToMock : undefined}
    >
      <div className="mb-6">
        <BackToPortfolioLink />
      </div>
      {source === "imported" ? (
        <p className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]">
          This account is part of your imported browser-session portfolio. Insight
          fields are empty unless included in future CSV columns.
        </p>
      ) : null}
      <CustomerOverview customer={customer} />
      <CustomerInsights customer={customer} />
    </AppShell>
  );
}
