import type { ExpansionOpportunity, HealthStatus } from "@/types/customer";

export const CSV_REQUIRED_COLUMNS = [
  "id",
  "name",
  "industry",
  "csm",
  "arr",
  "healthScore",
  "healthStatus",
  "adoptionPercent",
  "renewalDate",
  "openTickets",
  "expansionOpportunity",
] as const;

export type CsvColumn = (typeof CSV_REQUIRED_COLUMNS)[number];

export const ALLOWED_HEALTH_STATUSES: HealthStatus[] = [
  "healthy",
  "at_risk",
  "critical",
];

export const ALLOWED_EXPANSION_OPPORTUNITIES: ExpansionOpportunity[] = [
  "high",
  "medium",
  "low",
  "none",
];

export const MAX_CSV_FILE_BYTES = 5 * 1024 * 1024;

export interface CsvRawRow {
  rowNumber: number;
  values: Record<string, string>;
}

export interface CsvValidationIssue {
  rowNumber: number | null;
  field: string | null;
  message: string;
  severity: "error" | "warning";
}

export interface CsvParseResult {
  ok: boolean;
  headers: string[];
  rows: CsvRawRow[];
  issues: CsvValidationIssue[];
}

export interface CsvImportPreview {
  validCustomers: import("@/types/customer").Customer[];
  issues: CsvValidationIssue[];
  totalDataRows: number;
  validRowCount: number;
  invalidRowCount: number;
  canImport: boolean;
}
