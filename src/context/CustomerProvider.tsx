"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { customers as mockCustomers } from "@/data/customers";
import type { Customer } from "@/types/customer";

const STORAGE_KEY = "continuum.customer-portfolio.v1";

export type CustomerDataSource = "mock" | "imported";

interface PortfolioSnapshot {
  customers: Customer[];
  source: CustomerDataSource;
  ready: boolean;
  statusMessage: string | null;
  importedAt: string | null;
}

interface StoredPortfolio {
  source: CustomerDataSource;
  customers: Customer[];
  importedAt?: string;
}

type Listener = () => void;

const listeners = new Set<Listener>();

let snapshot: PortfolioSnapshot = {
  customers: mockCustomers,
  source: "mock",
  ready: false,
  statusMessage: null,
  importedAt: null,
};

let didHydrate = false;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function readStoredPortfolio(): StoredPortfolio | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPortfolio;
    if (!parsed || !Array.isArray(parsed.customers) || parsed.customers.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredPortfolio(value: StoredPortfolio | null) {
  try {
    if (!value || value.source === "mock") {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage failures; in-memory state still works for the session.
  }
}

function hydrateFromSession() {
  if (didHydrate) return;
  didHydrate = true;

  const stored = readStoredPortfolio();
  if (stored?.source === "imported") {
    snapshot = {
      customers: stored.customers,
      source: "imported",
      ready: true,
      statusMessage: null,
      importedAt: stored.importedAt ?? null,
    };
  } else {
    snapshot = {
      ...snapshot,
      ready: true,
    };
  }
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    queueMicrotask(() => {
      hydrateFromSession();
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot(): PortfolioSnapshot {
  return {
    customers: mockCustomers,
    source: "mock",
    ready: true,
    statusMessage: null,
    importedAt: null,
  };
}

function importCustomersIntoStore(nextCustomers: Customer[]) {
  const stamp = new Date().toISOString();
  snapshot = {
    customers: nextCustomers,
    source: "imported",
    ready: true,
    statusMessage: `Imported ${nextCustomers.length} customers. Dashboard KPIs, charts, and table now use browser session data.`,
    importedAt: stamp,
  };
  writeStoredPortfolio({
    source: "imported",
    customers: nextCustomers,
    importedAt: stamp,
  });
  emit();
}

function resetStoreToMock() {
  snapshot = {
    customers: mockCustomers,
    source: "mock",
    ready: true,
    statusMessage: "Restored the original mock customer portfolio.",
    importedAt: null,
  };
  writeStoredPortfolio(null);
  emit();
}

function clearStoreStatusMessage() {
  if (!snapshot.statusMessage) return;
  snapshot = {
    ...snapshot,
    statusMessage: null,
  };
  emit();
}

interface CustomerContextValue extends PortfolioSnapshot {
  getCustomerById: (id: string) => Customer | undefined;
  importCustomers: (customers: Customer[]) => void;
  resetToMock: () => void;
  clearStatusMessage: () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const getCustomerById = useCallback(
    (id: string) => current.customers.find((customer) => customer.id === id),
    [current.customers],
  );

  const value = useMemo<CustomerContextValue>(
    () => ({
      ...current,
      getCustomerById,
      importCustomers: importCustomersIntoStore,
      resetToMock: resetStoreToMock,
      clearStatusMessage: clearStoreStatusMessage,
    }),
    [current, getCustomerById],
  );

  return (
    <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
  );
}

export function useCustomers(): CustomerContextValue {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within CustomerProvider");
  }
  return context;
}
