"use client";

import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { ExpansionBadge, HealthStatusBadge } from "@/components/dashboard/StatusBadges";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatScore,
} from "@/lib/format";
import {
  defaultPortfolioFilters,
  defaultPortfolioSort,
  filterAndSortCustomers,
  getUniqueIndustries,
  hasActiveFilters,
  healthStatusLabels,
  type PortfolioFilters,
  type PortfolioSort,
  type RenewalWindow,
  type SortDirection,
  type SortKey,
} from "@/lib/portfolio";
import type { Customer, HealthStatus } from "@/types/customer";

interface CustomerPortfolioTableProps {
  customers: Customer[];
}

const selectClassName =
  "h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

export function CustomerPortfolioTable({
  customers,
}: CustomerPortfolioTableProps) {
  const searchId = useId();
  const healthId = useId();
  const industryId = useId();
  const renewalId = useId();
  const resultsId = useId();

  const [filters, setFilters] = useState<PortfolioFilters>(
    defaultPortfolioFilters,
  );
  const [sort, setSort] = useState<PortfolioSort>(defaultPortfolioSort);
  const deferredSearch = useDeferredValue(filters.search);

  const industries = useMemo(
    () => getUniqueIndustries(customers),
    [customers],
  );

  const deferredFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [filters, deferredSearch],
  );

  const visibleCustomers = useMemo(
    () => filterAndSortCustomers(customers, deferredFilters, sort),
    [customers, deferredFilters, sort],
  );

  const filtersActive = hasActiveFilters(filters);

  function updateFilter<K extends keyof PortfolioFilters>(
    key: K,
    value: PortfolioFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters(defaultPortfolioFilters);
  }

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (current.key === key) {
        const nextDirection: SortDirection =
          current.direction === "asc" ? "desc" : "asc";
        return { key, direction: nextDirection };
      }

      return {
        key,
        direction: key === "renewalDate" ? "asc" : "desc",
      };
    });
  }

  return (
    <section
      aria-label="Customer portfolio"
      className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]">
              Customer portfolio
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Search, filter, and sort accounts across your book of business
            </p>
          </div>
          <p
            id={resultsId}
            className="text-sm font-medium text-[var(--text-secondary)]"
            aria-live="polite"
          >
            Showing {formatNumber(visibleCustomers.length)} of{" "}
            {formatNumber(customers.length)} customers
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <label
              htmlFor={searchId}
              className="mb-1.5 block text-xs font-medium text-[var(--muted)]"
            >
              Search customers
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--muted)]">
                <SearchIcon />
              </span>
              <input
                id={searchId}
                type="search"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Search by customer name"
                className={`${selectClassName} pl-9`}
                aria-controls={resultsId}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={healthId}
              className="mb-1.5 block text-xs font-medium text-[var(--muted)]"
            >
              Health status
            </label>
            <select
              id={healthId}
              value={filters.healthStatus}
              onChange={(event) =>
                updateFilter(
                  "healthStatus",
                  event.target.value as HealthStatus | "all",
                )
              }
              className={selectClassName}
            >
              <option value="all">All statuses</option>
              {(Object.keys(healthStatusLabels) as HealthStatus[]).map(
                (status) => (
                  <option key={status} value={status}>
                    {healthStatusLabels[status]}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor={industryId}
              className="mb-1.5 block text-xs font-medium text-[var(--muted)]"
            >
              Industry
            </label>
            <select
              id={industryId}
              value={filters.industry}
              onChange={(event) => updateFilter("industry", event.target.value)}
              className={selectClassName}
            >
              <option value="all">All industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={renewalId}
              className="mb-1.5 block text-xs font-medium text-[var(--muted)]"
            >
              Renewal window
            </label>
            <select
              id={renewalId}
              value={filters.renewalWindow === "all" ? "all" : String(filters.renewalWindow)}
              onChange={(event) => {
                const value = event.target.value;
                updateFilter(
                  "renewalWindow",
                  value === "all" ? "all" : (Number(value) as RenewalWindow),
                );
              }}
              className={selectClassName}
            >
              <option value="all">All renewals</option>
              <option value="30">Next 30 days</option>
              <option value="60">Next 60 days</option>
              <option value="90">Next 90 days</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            disabled={!filtersActive}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Clear filters
          </button>
          {filtersActive ? (
            <p className="text-xs text-[var(--muted)]">
              Filters are active. Sorting: {sortLabel(sort)}.
            </p>
          ) : (
            <p className="text-xs text-[var(--muted)]">
              Sorting: {sortLabel(sort)}.
            </p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <caption className="sr-only">
            Customer portfolio with searchable and filterable account metrics
          </caption>
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Customer
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Industry
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                CSM
              </th>
              <SortableHeader
                label="ARR"
                sortKey="arr"
                activeSort={sort}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Health Score"
                sortKey="healthScore"
                activeSort={sort}
                onSort={toggleSort}
              />
              <th scope="col" className="px-5 py-3 font-medium">
                Health Status
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Adoption %
              </th>
              <SortableHeader
                label="Renewal Date"
                sortKey="renewalDate"
                activeSort={sort}
                onSort={toggleSort}
              />
              <th scope="col" className="px-5 py-3 font-medium">
                Open Tickets
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Expansion Opportunity
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-5 py-16">
                  <EmptyState onClear={clearFilters} canClear={filtersActive} />
                </td>
              </tr>
            ) : (
              visibleCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-muted)]/70"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-[var(--accent-strong)] underline-offset-2 transition-colors hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                    {customer.industry}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                    {customer.csmOwner}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-[var(--text-secondary)]">
                    {formatCurrency(customer.arr)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-muted)]"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${customer.healthScore}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-[var(--text-secondary)]">
                        {formatScore(customer.healthScore)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <HealthStatusBadge status={customer.status} />
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-[var(--text-secondary)]">
                    {formatPercent(customer.adoptionPercent)}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                    {formatDate(customer.renewalDate)}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-[var(--text-secondary)]">
                    {formatNumber(customer.openTickets)}
                  </td>
                  <td className="px-5 py-3.5">
                    <ExpansionBadge
                      opportunity={customer.expansionOpportunity}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeSort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeSort: PortfolioSort;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSort.key === sortKey;
  const ariaSort = isActive
    ? activeSort.direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th scope="col" className="px-5 py-3 font-medium" aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium uppercase tracking-[0.06em] text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {label}
        <SortIcon
          direction={isActive ? activeSort.direction : undefined}
          active={isActive}
        />
        <span className="sr-only">
          {isActive
            ? `Sorted ${activeSort.direction === "asc" ? "ascending" : "descending"}. Activate to reverse.`
            : "Activate to sort"}
        </span>
      </button>
    </th>
  );
}

function EmptyState({
  onClear,
  canClear,
}: {
  onClear: () => void;
  canClear: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--muted)]">
        <EmptyIcon />
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--text)]">
        No customers match your filters
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Try a different search term, health status, industry, or renewal window.
      </p>
      {canClear ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex h-9 items-center rounded-lg bg-[var(--accent)] px-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

function sortLabel(sort: PortfolioSort): string {
  const labels: Record<SortKey, string> = {
    arr: "ARR",
    healthScore: "Health Score",
    renewalDate: "Renewal Date",
  };
  return `${labels[sort.key]} (${sort.direction === "asc" ? "asc" : "desc"})`;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10.5L13.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SortIcon({
  direction,
  active,
}: {
  direction?: SortDirection;
  active: boolean;
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={active ? "text-[var(--accent-strong)]" : "opacity-50"}
    >
      <path
        d="M6 2.5L8.5 5H3.5L6 2.5Z"
        fill="currentColor"
        className={direction === "asc" ? "opacity-100" : "opacity-35"}
      />
      <path
        d="M6 9.5L3.5 7H8.5L6 9.5Z"
        fill="currentColor"
        className={direction === "desc" ? "opacity-100" : "opacity-35"}
      />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="15"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3.5 9H18.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 13H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
