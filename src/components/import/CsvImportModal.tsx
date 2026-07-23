"use client";

import { useEffect, useId, useState } from "react";
import { CsvDropzone } from "@/components/import/CsvDropzone";
import { CsvImportPreviewPanel } from "@/components/import/CsvImportPreview";
import { useCustomers } from "@/context/CustomerProvider";
import { analyzeCustomerCsv, SAMPLE_CSV_PATH } from "@/lib/csv/analyze";
import type { CsvImportPreview, CsvValidationIssue } from "@/lib/csv/types";

interface CsvImportModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "upload" | "preview";

export function CsvImportModal({ open, onClose }: CsvImportModalProps) {
  const titleId = useId();
  const { importCustomers } = useCustomers();
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [issues, setIssues] = useState<CsvValidationIssue[]>([]);
  const [preview, setPreview] = useState<CsvImportPreview | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleFileSelected(file: File) {
    setBusy(true);
    setFileError(null);
    setFileName(file.name);

    try {
      const result = await analyzeCustomerCsv(file);
      setIssues(result.issues);
      setPreview(result.preview);

      if (!result.preview) {
        setStep("upload");
        setFileError(
          result.issues[0]?.message ?? "Unable to analyze this CSV file.",
        );
        return;
      }

      setStep("preview");
    } catch {
      setPreview(null);
      setIssues([]);
      setFileError("Something went wrong while reading the CSV file.");
      setStep("upload");
    } finally {
      setBusy(false);
    }
  }

  function handleConfirmImport() {
    if (!preview?.canImport) return;
    importCustomers(preview.validCustomers);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close import dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text)]"
            >
              Import customers
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Upload a CSV, validate rows, preview results, then replace the
              current browser portfolio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text)]">CSV requirements</p>
            <p className="mt-1">
              Required columns: id, name, industry, csm, arr, healthScore,
              healthStatus, adoptionPercent, renewalDate, openTickets,
              expansionOpportunity.
            </p>
            <p className="mt-1">
              healthStatus: healthy | at_risk | critical · expansionOpportunity:
              high | medium | low | none · renewalDate: YYYY-MM-DD
            </p>
            <a
              href={SAMPLE_CSV_PATH}
              download
              className="mt-2 inline-flex text-sm font-medium text-[var(--accent-strong)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Download sample CSV template
            </a>
          </div>

          {step === "upload" ? (
            <CsvDropzone
              disabled={busy}
              onFileSelected={handleFileSelected}
              error={fileError}
            />
          ) : null}

          {busy ? (
            <p className="text-sm text-[var(--muted)]" role="status">
              Analyzing {fileName ?? "CSV"}…
            </p>
          ) : null}

          {step === "preview" && preview ? (
            <>
              <p className="text-sm text-[var(--text-secondary)]">
                File:{" "}
                <span className="font-medium text-[var(--text)]">{fileName}</span>
              </p>
              <CsvImportPreviewPanel preview={preview} issues={issues} />
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
          {step === "preview" ? (
            <button
              type="button"
              onClick={() => {
                setStep("upload");
                setPreview(null);
                setIssues([]);
                setFileError(null);
                setFileName(null);
              }}
              className="inline-flex h-10 items-center rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Choose another file
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={!preview?.canImport || busy}
            className="inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Import valid customers
          </button>
        </div>
      </div>
    </div>
  );
}
