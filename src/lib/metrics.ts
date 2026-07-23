import type { Customer } from "@/types/customer";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const UPCOMING_RENEWAL_DAYS = 60;
const AT_RISK_SCORE_THRESHOLD = 70;

export interface PortfolioMetrics {
  totalArr: number;
  arrAtRisk: number;
  upcomingRenewals: number;
  averageHealthScore: number;
  customerCount: number;
}

export function getPortfolioMetrics(
  customers: Customer[],
  now = new Date(),
): PortfolioMetrics {
  const totalArr = customers.reduce((sum, customer) => sum + customer.arr, 0);

  const arrAtRisk = customers
    .filter(
      (customer) =>
        customer.status === "at_risk" ||
        customer.status === "critical" ||
        customer.healthScore < AT_RISK_SCORE_THRESHOLD,
    )
    .reduce((sum, customer) => sum + customer.arr, 0);

  const upcomingRenewals = customers.filter((customer) => {
    const renewal = new Date(customer.renewalDate);
    const daysUntil =
      (renewal.getTime() - now.getTime()) / MS_PER_DAY;
    return daysUntil >= 0 && daysUntil <= UPCOMING_RENEWAL_DAYS;
  }).length;

  const averageHealthScore =
    customers.length === 0
      ? 0
      : customers.reduce((sum, customer) => sum + customer.healthScore, 0) /
        customers.length;

  return {
    totalArr,
    arrAtRisk,
    upcomingRenewals,
    averageHealthScore,
    customerCount: customers.length,
  };
}
