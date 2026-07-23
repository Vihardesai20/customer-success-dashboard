import {
  ExpansionBadge,
  HealthStatusBadge,
} from "@/components/dashboard/StatusBadges";
import { DetailSummaryCard } from "@/components/customers/DetailSummaryCard";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatScore,
} from "@/lib/format";
import type { Customer } from "@/types/customer";

interface CustomerOverviewProps {
  customer: Customer;
}

export function CustomerOverview({ customer }: CustomerOverviewProps) {
  return (
    <section aria-labelledby="customer-overview-heading">
      <div className="mb-4">
        <h2
          id="customer-overview-heading"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]"
        >
          Customer overview
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Core account attributes for {customer.name}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <DetailSummaryCard label="Customer" value={customer.name} />
        <DetailSummaryCard label="Industry" value={customer.industry} />
        <DetailSummaryCard label="Assigned CSM" value={customer.csmOwner} />
        <DetailSummaryCard
          label="ARR"
          value={formatCurrency(customer.arr)}
          detail="Annual recurring revenue"
        />
        <DetailSummaryCard
          label="Renewal date"
          value={formatDate(customer.renewalDate)}
        />
        <DetailSummaryCard
          label="Health score"
          value={formatScore(customer.healthScore)}
          detail="Out of 100"
        />
        <DetailSummaryCard
          label="Health status"
          value={<HealthStatusBadge status={customer.status} />}
        />
        <DetailSummaryCard
          label="Adoption"
          value={formatPercent(customer.adoptionPercent)}
        />
        <DetailSummaryCard
          label="Open tickets"
          value={formatNumber(customer.openTickets)}
          detail="Active support tickets"
        />
        <DetailSummaryCard
          label="Expansion opportunity"
          value={
            <ExpansionBadge opportunity={customer.expansionOpportunity} />
          }
        />
      </div>
    </section>
  );
}
