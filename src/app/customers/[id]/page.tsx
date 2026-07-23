import type { Metadata } from "next";
import { CustomerDetailClient } from "@/components/customers/CustomerDetailClient";
import { customers, getCustomerById } from "@/data/customers";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;

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
      title: "Customer details | Continuum",
      description:
        "Customer success details from the current Continuum portfolio session.",
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
  await params;
  return <CustomerDetailClient />;
}
