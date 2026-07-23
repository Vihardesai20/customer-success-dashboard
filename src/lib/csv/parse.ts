import Papa from "papaparse";
import {
  CSV_REQUIRED_COLUMNS,
  MAX_CSV_FILE_BYTES,
  type CsvParseResult,
  type CsvRawRow,
  type CsvValidationIssue,
} from "@/lib/csv/types";

function normalizeHeader(header: string): string {
  return header.trim();
}

export function validateCsvFile(file: File): CsvValidationIssue[] {
  const issues: CsvValidationIssue[] = [];

  if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
    issues.push({
      rowNumber: null,
      field: null,
      message: "Only .csv files are accepted.",
      severity: "error",
    });
  }

  if (file.size === 0) {
    issues.push({
      rowNumber: null,
      field: null,
      message: "The selected file is empty.",
      severity: "error",
    });
  }

  if (file.size > MAX_CSV_FILE_BYTES) {
    issues.push({
      rowNumber: null,
      field: null,
      message: "File exceeds the 5 MB size limit.",
      severity: "error",
    });
  }

  return issues;
}

export async function parseCustomerCsv(file: File): Promise<CsvParseResult> {
  const fileIssues = validateCsvFile(file);
  if (fileIssues.length > 0) {
    return {
      ok: false,
      headers: [],
      rows: [],
      issues: fileIssues,
    };
  }

  const text = await file.text();
  if (!text.trim()) {
    return {
      ok: false,
      headers: [],
      rows: [],
      issues: [
        {
          rowNumber: null,
          field: null,
          message: "The CSV file has no content.",
          severity: "error",
        },
      ],
    };
  }

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
  });

  const issues: CsvValidationIssue[] = [];

  if (parsed.errors.length > 0) {
    for (const error of parsed.errors) {
      issues.push({
        rowNumber: typeof error.row === "number" ? error.row + 2 : null,
        field: null,
        message: `Malformed CSV: ${error.message}`,
        severity: "error",
      });
    }
  }

  const headers = (parsed.meta.fields ?? []).map(normalizeHeader).filter(Boolean);
  const missingColumns = CSV_REQUIRED_COLUMNS.filter(
    (column) => !headers.includes(column),
  );

  if (missingColumns.length > 0) {
    issues.push({
      rowNumber: null,
      field: missingColumns.join(", "),
      message: `Missing required column(s): ${missingColumns.join(", ")}.`,
      severity: "error",
    });
  }

  if (headers.length === 0) {
    issues.push({
      rowNumber: null,
      field: null,
      message: "Could not read a header row from the CSV.",
      severity: "error",
    });
  }

  const rows: CsvRawRow[] = parsed.data.map((record, index) => {
    const values: Record<string, string> = {};
    for (const header of headers) {
      const raw = record[header];
      values[header] = raw == null ? "" : String(raw).trim();
    }

    return {
      rowNumber: index + 2,
      values,
    };
  });

  if (rows.length === 0 && issues.length === 0) {
    issues.push({
      rowNumber: null,
      field: null,
      message: "The CSV contains a header row but no customer data rows.",
      severity: "error",
    });
  }

  const blocking = issues.some((issue) => issue.severity === "error");

  return {
    ok: !blocking && missingColumns.length === 0,
    headers,
    rows,
    issues,
  };
}
