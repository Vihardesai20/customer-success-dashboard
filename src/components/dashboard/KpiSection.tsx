import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatScore,
} from "@/lib/format";
import type { PortfolioMetrics } from "@/lib/metrics";

interface KpiSectionProps {
  metrics: PortfolioMetrics;
}

export function KpiSection({ metrics }: KpiSectionProps) {
  return (
    <section aria-label="Portfolio KPIs">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]">
            Portfolio snapshot
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Key health signals across {formatNumber(metrics.customerCount)} accounts
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          index={0}
          label="Total Portfolio ARR"
          value={formatCompactCurrency(metrics.totalArr)}
          detail={formatCurrency(metrics.totalArr)}
          accent="default"
          trend="up"
          trendLabel="+4.2%"
          icon={<ArrIcon />}
        />
        <KpiCard
          index={1}
          label="ARR at Risk"
          value={formatCompactCurrency(metrics.arrAtRisk)}
          detail={`${Math.round((metrics.arrAtRisk / Math.max(metrics.totalArr, 1)) * 100)}% of portfolio`}
          accent="danger"
          trend="down"
          trendLabel="Needs attention"
          icon={<RiskIcon />}
        />
        <KpiCard
          index={2}
          label="Upcoming Renewals"
          value={formatNumber(metrics.upcomingRenewals)}
          detail="Next 60 days"
          accent="warning"
          trend="neutral"
          trendLabel="Window"
          icon={<RenewalIcon />}
        />
        <KpiCard
          index={3}
          label="Average Health Score"
          value={formatScore(metrics.averageHealthScore)}
          detail="Out of 100"
          accent="success"
          trend="up"
          trendLabel="Stable"
          icon={<HealthIcon />}
        />
      </div>
    </section>
  );
}

function ArrIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 12.5L7 8.5L10 11L14.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 5.5H14.5V8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 3L15.25 14.25H2.75L9 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 7.5V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="12.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function RenewalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3" y="4.25" width="12" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 7.5H15" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 3V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11.5 3V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 9.5H6L7.5 5.5L10.5 13L12 9.5H15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
