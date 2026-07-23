import type { Customer, HealthStatus } from "@/types/customer";
import { healthStatusLabels } from "@/lib/portfolio";

export const healthStatusColors: Record<HealthStatus, string> = {
  healthy: "#047857",
  at_risk: "#b45309",
  critical: "#b91c1c",
};

export const HEALTH_STATUS_ORDER: HealthStatus[] = [
  "healthy",
  "at_risk",
  "critical",
];

export interface HealthDistributionPoint {
  status: HealthStatus;
  label: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface ArrByHealthPoint {
  status: HealthStatus;
  label: string;
  arr: number;
  fill: string;
}

export interface RenewalMonthPoint {
  key: string;
  label: string;
  count: number;
}

export interface ArrByIndustryPoint {
  industry: string;
  arr: number;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getHealthDistribution(
  customers: Customer[],
): HealthDistributionPoint[] {
  const total = customers.length;

  return HEALTH_STATUS_ORDER.map((status) => {
    const count = customers.filter((customer) => customer.status === status)
      .length;

    return {
      status,
      label: healthStatusLabels[status],
      count,
      percentage: total === 0 ? 0 : (count / total) * 100,
      fill: healthStatusColors[status],
    };
  });
}

export function getArrByHealthStatus(
  customers: Customer[],
): ArrByHealthPoint[] {
  return HEALTH_STATUS_ORDER.map((status) => {
    const arr = customers
      .filter((customer) => customer.status === status)
      .reduce((sum, customer) => sum + customer.arr, 0);

    return {
      status,
      label: healthStatusLabels[status],
      arr,
      fill: healthStatusColors[status],
    };
  });
}

export function getUpcomingRenewalsByMonth(
  customers: Customer[],
  now = new Date(),
  months = 6,
): RenewalMonthPoint[] {
  const start = startOfMonth(now);
  const points: RenewalMonthPoint[] = [];

  for (let offset = 0; offset < months; offset += 1) {
    const monthDate = new Date(
      start.getFullYear(),
      start.getMonth() + offset,
      1,
    );
    points.push({
      key: monthKey(monthDate),
      label: monthLabel(monthDate),
      count: 0,
    });
  }

  const end = new Date(
    start.getFullYear(),
    start.getMonth() + months,
    1,
  );

  for (const customer of customers) {
    const renewal = new Date(customer.renewalDate);
    if (renewal < start || renewal >= end) {
      continue;
    }

    const key = monthKey(renewal);
    const point = points.find((entry) => entry.key === key);
    if (point) {
      point.count += 1;
    }
  }

  return points;
}

export function getArrByIndustry(
  customers: Customer[],
): ArrByIndustryPoint[] {
  const totals = new Map<string, number>();

  for (const customer of customers) {
    totals.set(
      customer.industry,
      (totals.get(customer.industry) ?? 0) + customer.arr,
    );
  }

  return [...totals.entries()]
    .map(([industry, arr]) => ({ industry, arr }))
    .sort((a, b) => b.arr - a.arr);
}
