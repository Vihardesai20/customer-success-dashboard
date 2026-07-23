import { AppShell } from "@/components/layout/AppShell";
import { CustomerPreview } from "@/components/dashboard/CustomerPreview";
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
      <CustomerPreview customers={customers} />
    </AppShell>
  );
}
