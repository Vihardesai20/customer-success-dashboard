import { AppShell } from "@/components/layout/AppShell";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { CustomerPortfolioTable } from "@/components/dashboard/CustomerPortfolioTable";
import { KpiSection } from "@/components/dashboard/KpiSection";
import { customers } from "@/data/customers";
import { getPortfolioMetrics } from "@/lib/metrics";

export default function HomePage() {
  const metrics = getPortfolioMetrics(customers);

  return (
    <AppShell
      title="Overview"
      subtitle="Portfolio health across your book of business"
    >
      <KpiSection metrics={metrics} />
      <AnalyticsSection customers={customers} />
      <CustomerPortfolioTable customers={customers} />
    </AppShell>
  );
}
