import { parseCustomerCsv } from "@/lib/csv/parse";
import type { CsvImportPreview, CsvValidationIssue } from "@/lib/csv/types";
import { validateCsvRows } from "@/lib/csv/validate";

export async function analyzeCustomerCsv(file: File): Promise<{
  preview: CsvImportPreview | null;
  issues: CsvValidationIssue[];
}> {
  const parsed = await parseCustomerCsv(file);

  if (!parsed.ok) {
    return {
      preview: null,
      issues: parsed.issues,
    };
  }

  const preview = validateCsvRows(parsed.rows);
  return {
    preview,
    issues: [...parsed.issues, ...preview.issues],
  };
}

export const SAMPLE_CSV_PATH = "/sample-customers.csv";
