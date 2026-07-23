interface HeaderProps {
  title: string;
  subtitle?: string;
  menuOpen: boolean;
  onMenuClick: () => void;
}

export function Header({ title, subtitle, menuOpen, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] lg:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
        >
          <MenuIcon />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-sm text-[var(--muted)]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-secondary)] sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
          Live mock data
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-1 pr-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(145deg,#1f2937,#0f766e)] text-xs font-semibold text-white"
            aria-hidden="true"
          >
            AC
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-[var(--text)]">Ava Chen</p>
            <p className="text-xs text-[var(--muted)]">CS Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3.5 5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 9H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 13H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
