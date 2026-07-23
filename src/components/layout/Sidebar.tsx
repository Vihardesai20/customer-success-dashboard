"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/", label: "Overview", icon: OverviewIcon },
  { href: "/customers", label: "Customers", icon: CustomersIcon, disabled: true },
  { href: "/renewals", label: "Renewals", icon: RenewalsIcon, disabled: true },
  { href: "/risk", label: "Risk", icon: RiskIcon, disabled: true },
  { href: "/reports", label: "Reports", icon: ReportsIcon, disabled: true },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const syncForViewport = () => {
      if (media.matches) {
        onClose();
      }
    };

    syncForViewport();
    media.addEventListener("change", syncForViewport);
    return () => media.removeEventListener("change", syncForViewport);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Primary"
        {...(open
          ? {
              role: "dialog",
              "aria-modal": true,
            }
          : {})}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b border-[var(--border)] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]">
              <BrandMark />
            </div>
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight text-[var(--text)]">
                Continuum
              </p>
              <p className="truncate text-xs text-[var(--muted)]">Customer Success</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] lg:hidden"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Workspace">
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            Workspace
          </p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const className = `group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              active
                ? "bg-[var(--accent-soft)] font-medium text-[var(--accent-strong)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            } ${"disabled" in item && item.disabled ? "cursor-not-allowed opacity-55 hover:bg-transparent hover:text-[var(--text-secondary)]" : ""}`;

            if ("disabled" in item && item.disabled) {
              return (
                <span key={item.href} className={className} aria-disabled="true">
                  <Icon active={false} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                    Soon
                  </span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={className}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
              >
                <Icon active={active} />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3">
            <p className="text-xs font-medium text-[var(--text)]">Phase 1 foundation</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              Portfolio KPIs and layout. Charts, search, and imports come next.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function BrandMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 11.5C5.5 11.5 6.5 4.5 8 4.5C9.5 4.5 10.5 11.5 13 11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function OverviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="2.5"
        width="5.5"
        height="5.5"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        className={active ? "opacity-100" : "opacity-80"}
      />
      <rect
        x="10"
        y="2.5"
        width="5.5"
        height="5.5"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        className={active ? "opacity-100" : "opacity-80"}
      />
      <rect
        x="2.5"
        y="10"
        width="5.5"
        height="5.5"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        className={active ? "opacity-100" : "opacity-80"}
      />
      <rect
        x="10"
        y="10"
        width="5.5"
        height="5.5"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        className={active ? "opacity-100" : "opacity-80"}
      />
    </svg>
  );
}

function CustomersIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={active ? "opacity-100" : "opacity-80"}>
      <circle cx="6.5" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.25" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.75 14.25C3.35 12.2 4.7 11.1 6.5 11.1C8.3 11.1 9.65 12.2 10.25 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.5 12C11.25 11.35 12.15 11 13.15 11C14.45 11 15.4 11.7 15.85 13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RenewalsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={active ? "opacity-100" : "opacity-80"}>
      <rect x="3" y="4" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7.5H15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 2.75V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 2.75V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RiskIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={active ? "opacity-100" : "opacity-80"}>
      <path
        d="M9 2.75L15.5 14.25H2.5L9 2.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 7.25V10.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="12.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ReportsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={active ? "opacity-100" : "opacity-80"}>
      <path d="M4 14.25V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14.25V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 14.25V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
