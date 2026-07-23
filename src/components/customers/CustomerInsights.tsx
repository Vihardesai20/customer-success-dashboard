import { InsightListCard } from "@/components/customers/InsightListCard";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types/customer";

interface CustomerInsightsProps {
  customer: Customer;
}

export function CustomerInsights({ customer }: CustomerInsightsProps) {
  return (
    <section aria-labelledby="account-insights-heading" className="mt-8">
      <div className="mb-4">
        <h2
          id="account-insights-heading"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text)]"
        >
          Account insights
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Risks, recent activity, goals, and recommended next steps
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightListCard
          title="Key risks"
          description="Issues that could impact renewal or expansion"
        >
          <ul className="space-y-2">
            {customer.keyRisks.map((risk) => (
              <li
                key={risk}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5 text-sm text-[var(--text-secondary)]"
              >
                {risk}
              </li>
            ))}
          </ul>
        </InsightListCard>

        <InsightListCard
          title="Recent activity"
          description="Latest account touchpoints and updates"
        >
          <ul className="space-y-3">
            {customer.recentActivities.map((activity) => (
              <li key={`${activity.date}-${activity.summary}`} className="flex gap-3">
                <time
                  dateTime={activity.date}
                  className="w-24 shrink-0 text-xs font-medium uppercase tracking-[0.04em] text-[var(--muted)]"
                >
                  {formatDate(activity.date)}
                </time>
                <p className="text-sm text-[var(--text-secondary)]">
                  {activity.summary}
                </p>
              </li>
            ))}
          </ul>
        </InsightListCard>

        <InsightListCard
          title="Success goals"
          description="Outcomes the CSM and customer are driving toward"
        >
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
            {customer.successGoals.map((goal) => (
              <li key={goal} className="pl-1">
                {goal}
              </li>
            ))}
          </ol>
        </InsightListCard>

        <InsightListCard
          title="Next recommended actions"
          description="Concrete follow-ups for the customer success team"
        >
          <ul className="space-y-2">
            {customer.nextActions.map((action, index) => (
              <li
                key={action}
                className="flex gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text-secondary)]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                  {index + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </InsightListCard>
      </div>
    </section>
  );
}
