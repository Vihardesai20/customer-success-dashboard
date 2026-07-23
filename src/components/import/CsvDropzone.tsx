"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { MAX_CSV_FILE_BYTES } from "@/lib/csv/types";

interface CsvDropzoneProps {
  disabled?: boolean;
  onFileSelected: (file: File) => void;
  error?: string | null;
}

export function CsvDropzone({
  disabled = false,
  onFileSelected,
  error,
}: CsvDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function acceptFile(file: File | undefined | null) {
    if (!file || disabled) return;
    onFileSelected(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    acceptFile(file);
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={`${inputId}-help`}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={onDrop}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        className={`rounded-2xl border border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
          dragging
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--border-strong)] bg-[var(--surface-muted)]"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[var(--accent)]"}`}
      >
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--text)]">
          Drag and drop a CSV file here
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">or click to choose a file</p>
        <p id={`${inputId}-help`} className="mt-3 text-xs text-[var(--muted)]">
          Accepted type: .csv · Max size: {(MAX_CSV_FILE_BYTES / (1024 * 1024)).toFixed(0)} MB
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            acceptFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
