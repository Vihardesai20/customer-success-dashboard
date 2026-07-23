import { AppShell } from "@/components/layout/AppShell";
import { BackToPortfolioLink } from "@/components/customers/BackToPortfolioLink";

export default function CustomerNotFoundPage() {
  return (
    <AppShell
      title="Customer not found"
      subtitle="We could not find that account in the portfolio"
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center shadow-[var(--shadow-sm)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--muted)]">
          <NotFoundIcon />
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text)]">
          No customer matches this ID
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The link may be outdated, or the customer ID is not part of the mock
          portfolio dataset.
        </p>
        <div className="mt-6 flex justify-center">
          <BackToPortfolioLink />
        </div>
      </div>
    </AppShell>
  );
}

function NotFoundIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.5 8.5L13.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.5 8.5L8.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
