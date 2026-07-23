import {
  ALLOWED_EXPANSION_OPPORTUNITIES,
  ALLOWED_HEALTH_STATUSES,
  CSV_REQUIRED_COLUMNS,
  type CsvImportPreview,
  type CsvRawRow,
  type CsvValidationIssue,
} from "@/lib/csv/types";
import type {
  Customer,
  ExpansionOpportunity,
  HealthStatus,
} from "@/types/customer";

function isBlank(value: string | undefined): boolean {
  return value == null || value.trim() === "";
}

function parseNonNegativeNumber(
  value: string,
  field: string,
  rowNumber: number,
  issues: CsvValidationIssue[],
): number | null {
  const normalized = value.replace(/[$,\s]/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    issues.push({
      rowNumber,
      field,
      message: `${field} must be a valid number.`,
      severity: "error",
    });
    return null;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    issues.push({
      rowNumber,
      field,
      message: `${field} must be a non-negative number.`,
      severity: "error",
    });
    return null;
  }

  return parsed;
}

function parseInteger(
  value: string,
  field: string,
  rowNumber: number,
  issues: CsvValidationIssue[],
): number | null {
  const normalized = value.replace(/[,\s]/g, "");
  if (!/^\d+$/.test(normalized)) {
    issues.push({
      rowNumber,
      field,
      message: `${field} must be a non-negative integer.`,
      severity: "error",
    });
    return null;
  }

  return Number(normalized);
}

function parsePercent(
  value: string,
  field: string,
  rowNumber: number,
  issues: CsvValidationIssue[],
): number | null {
  const parsed = parseNonNegativeNumber(value.replace(/%/g, ""), field, rowNumber, issues);
  if (parsed == null) return null;

  if (parsed < 0 || parsed > 100) {
    issues.push({
      rowNumber,
      field,
      message: `${field} must be between 0 and 100.`,
      severity: "error",
    });
    return null;
  }

  return parsed;
}

function parseRenewalDate(
  value: string,
  rowNumber: number,
  issues: CsvValidationIssue[],
): string | null {
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(value);

  if (!isoMatch || Number.isNaN(date.getTime())) {
    issues.push({
      rowNumber,
      field: "renewalDate",
      message: "renewalDate must be a valid date in YYYY-MM-DD format.",
      severity: "error",
    });
    return null;
  }

  return value;
}

function parseHealthStatus(
  value: string,
  rowNumber: number,
  issues: CsvValidationIssue[],
): HealthStatus | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (!ALLOWED_HEALTH_STATUSES.includes(normalized as HealthStatus)) {
    issues.push({
      rowNumber,
      field: "healthStatus",
      message: `healthStatus must be one of: ${ALLOWED_HEALTH_STATUSES.join(", ")}.`,
      severity: "error",
    });
    return null;
  }

  return normalized as HealthStatus;
}

function parseExpansion(
  value: string,
  rowNumber: number,
  issues: CsvValidationIssue[],
): ExpansionOpportunity | null {
  const normalized = value.trim().toLowerCase();
  if (
    !ALLOWED_EXPANSION_OPPORTUNITIES.includes(
      normalized as ExpansionOpportunity,
    )
  ) {
    issues.push({
      rowNumber,
      field: "expansionOpportunity",
      message: `expansionOpportunity must be one of: ${ALLOWED_EXPANSION_OPPORTUNITIES.join(", ")}.`,
      severity: "error",
    });
    return null;
  }

  return normalized as ExpansionOpportunity;
}

function mapRowToCustomer(
  row: CsvRawRow,
  issues: CsvValidationIssue[],
): Customer | null {
  const { values, rowNumber } = row;

  for (const column of CSV_REQUIRED_COLUMNS) {
    if (isBlank(values[column])) {
      issues.push({
        rowNumber,
        field: column,
        message: `${column} is required and cannot be blank.`,
        severity: "error",
      });
    }
  }

  const arr = isBlank(values.arr)
    ? null
    : parseNonNegativeNumber(values.arr, "arr", rowNumber, issues);
  const healthScore = isBlank(values.healthScore)
    ? null
    : parsePercent(values.healthScore, "healthScore", rowNumber, issues);
  const adoptionPercent = isBlank(values.adoptionPercent)
    ? null
    : parsePercent(
        values.adoptionPercent,
        "adoptionPercent",
        rowNumber,
        issues,
      );
  const openTickets = isBlank(values.openTickets)
    ? null
    : parseInteger(values.openTickets, "openTickets", rowNumber, issues);
  const renewalDate = isBlank(values.renewalDate)
    ? null
    : parseRenewalDate(values.renewalDate, rowNumber, issues);
  const status = isBlank(values.healthStatus)
    ? null
    : parseHealthStatus(values.healthStatus, rowNumber, issues);
  const expansionOpportunity = isBlank(values.expansionOpportunity)
    ? null
    : parseExpansion(values.expansionOpportunity, rowNumber, issues);

  if (
    isBlank(values.id) ||
    isBlank(values.name) ||
    isBlank(values.industry) ||
    isBlank(values.csm) ||
    arr == null ||
    healthScore == null ||
    adoptionPercent == null ||
    openTickets == null ||
    renewalDate == null ||
    status == null ||
    expansionOpportunity == null
  ) {
    return null;
  }

  return {
    id: values.id.trim(),
    name: values.name.trim(),
    industry: values.industry.trim(),
    csmOwner: values.csm.trim(),
    arr,
    healthScore,
    status,
    adoptionPercent,
    renewalDate,
    openTickets,
    expansionOpportunity,
    keyRisks: [],
    recentActivities: [],
    successGoals: [],
    nextActions: [],
  };
}

export function validateCsvRows(rows: CsvRawRow[]): CsvImportPreview {
  const issues: CsvValidationIssue[] = [];
  const validCustomers: Customer[] = [];
  const seenIds = new Map<string, number>();

  for (const row of rows) {
    const rawId = row.values.id?.trim();
    if (rawId) {
      const previousRow = seenIds.get(rawId);
      if (previousRow != null) {
        issues.push({
          rowNumber: row.rowNumber,
          field: "id",
          message: `Duplicate customer id "${rawId}" (also used on row ${previousRow}).`,
          severity: "error",
        });
      } else {
        seenIds.set(rawId, row.rowNumber);
      }
    }

    const customer = mapRowToCustomer(row, issues);
    if (!customer) {
      continue;
    }

    if (
      issues.some(
        (issue) =>
          issue.rowNumber === row.rowNumber &&
          issue.field === "id" &&
          issue.message.includes("Duplicate"),
      )
    ) {
      continue;
    }

    validCustomers.push(customer);
  }

  const invalidRowCount = rows.length - validCustomers.length;
  const hasBlockingErrors = issues.some((issue) => issue.severity === "error");

  return {
    validCustomers,
    issues,
    totalDataRows: rows.length,
    validRowCount: validCustomers.length,
    invalidRowCount,
    canImport: !hasBlockingErrors && validCustomers.length > 0,
  };
}
