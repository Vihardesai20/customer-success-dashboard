import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BackToPortfolioLink } from "@/components/customers/BackToPortfolioLink";
import { CustomerInsights } from "@/components/customers/CustomerInsights";
import { CustomerOverview } from "@/components/customers/CustomerOverview";
import { customers, getCustomerById } from "@/data/customers";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return customers.map((customer) => ({ id: customer.id }));
}

export async function generateMetadata({
  params,
}: CustomerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    return {
      title: "Customer not found | Continuum",
    };
  }

  return {
    title: `${customer.name} | Continuum`,
    description: `Customer success details for ${customer.name}`,
  };
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <AppShell
      title={customer.name}
      subtitle={`${customer.industry} · CSM ${customer.csmOwner}`}
    >
      <div className="mb-6">
        <BackToPortfolioLink />
      </div>
      <CustomerOverview customer={customer} />
      <CustomerInsights customer={customer} />
    </AppShell>
  );
}
