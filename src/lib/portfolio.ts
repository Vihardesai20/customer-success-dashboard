import type {
  Customer,
  ExpansionOpportunity,
  HealthStatus,
} from "@/types/customer";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type RenewalWindow = 30 | 60 | 90;
export type SortKey = "arr" | "healthScore" | "renewalDate";
export type SortDirection = "asc" | "desc";

export interface PortfolioFilters {
  search: string;
  healthStatus: HealthStatus | "all";
  industry: string | "all";
  renewalWindow: RenewalWindow | "all";
}

export interface PortfolioSort {
  key: SortKey;
  direction: SortDirection;
}

export const healthStatusLabels: Record<HealthStatus, string> = {
  healthy: "Healthy",
  at_risk: "At risk",
  critical: "Critical",
};

export const expansionLabels: Record<ExpansionOpportunity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "None",
};

export function getUniqueIndustries(customers: Customer[]): string[] {
  return [...new Set(customers.map((customer) => customer.industry))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function daysUntilRenewal(renewalDate: string, now = new Date()): number {
  const renewal = new Date(renewalDate);
  return (renewal.getTime() - now.getTime()) / MS_PER_DAY;
}

export function filterCustomers(
  customers: Customer[],
  filters: PortfolioFilters,
  now = new Date(),
): Customer[] {
  const query = filters.search.trim().toLowerCase();

  return customers.filter((customer) => {
    if (query && !customer.name.toLowerCase().includes(query)) {
      return false;
    }

    if (
      filters.healthStatus !== "all" &&
      customer.status !== filters.healthStatus
    ) {
      return false;
    }

    if (filters.industry !== "all" && customer.industry !== filters.industry) {
      return false;
    }

    if (filters.renewalWindow !== "all") {
      const days = daysUntilRenewal(customer.renewalDate, now);
      if (days < 0 || days > filters.renewalWindow) {
        return false;
      }
    }

    return true;
  });
}

export function sortCustomers(
  customers: Customer[],
  sort: PortfolioSort,
): Customer[] {
  const sorted = [...customers];
  const direction = sort.direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    if (sort.key === "arr") {
      return (a.arr - b.arr) * direction;
    }

    if (sort.key === "healthScore") {
      return (a.healthScore - b.healthScore) * direction;
    }

    return (
      (new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()) *
      direction
    );
  });

  return sorted;
}

export function filterAndSortCustomers(
  customers: Customer[],
  filters: PortfolioFilters,
  sort: PortfolioSort,
  now = new Date(),
): Customer[] {
  return sortCustomers(filterCustomers(customers, filters, now), sort);
}

export function hasActiveFilters(filters: PortfolioFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.healthStatus !== "all" ||
    filters.industry !== "all" ||
    filters.renewalWindow !== "all"
  );
}

export const defaultPortfolioFilters: PortfolioFilters = {
  search: "",
  healthStatus: "all",
  industry: "all",
  renewalWindow: "all",
};

export const defaultPortfolioSort: PortfolioSort = {
  key: "arr",
  direction: "desc",
};
