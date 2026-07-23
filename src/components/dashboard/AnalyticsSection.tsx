import { ArrByHealthChart } from "@/components/charts/ArrByHealthChart";
import { ArrByIndustryChart } from "@/components/charts/ArrByIndustryChart";
import { HealthDistributionChart } from "@/components/charts/HealthDistributionChart";
import { UpcomingRenewalsChart } from "@/components/charts/UpcomingRenewalsChart";
import {
  getArrByHealthStatus,
  getArrByIndustry,
  getHealthDistribution,
  getUpcomingRenewalsByMonth,
} from "@/lib/analytics";
import type { Customer } from "@/types/customer";

interface AnalyticsSectionProps {
  customers: Customer[];
}

export function AnalyticsSection({ customers }: AnalyticsSectionProps) {
  const healthDistribution = getHealthDistribution(customers);
  const arrByHealth = getArrByHealthStatus(customers);
  const renewalsByMonth = getUpcomingRenewalsByMonth(customers);
  const arrByIndustry = getArrByIndustry(customers);

  return (
    <section aria-label="Portfolio analytics" className="mt-8">
      <div className="mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]">
          Portfolio analytics
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Charts derived from the current mock customer portfolio
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HealthDistributionChart data={healthDistribution} />
        <ArrByHealthChart data={arrByHealth} />
        <UpcomingRenewalsChart data={renewalsByMonth} />
        <ArrByIndustryChart data={arrByIndustry} />
      </div>
    </section>
  );
}
