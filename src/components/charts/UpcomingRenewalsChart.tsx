"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/charts/ChartCard";
import { formatNumber } from "@/lib/format";
import type { RenewalMonthPoint } from "@/lib/analytics";

interface UpcomingRenewalsChartProps {
  data: RenewalMonthPoint[];
}

export function UpcomingRenewalsChart({ data }: UpcomingRenewalsChartProps) {
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <ChartCard
      title="Upcoming Renewals by Month"
      description="Customer renewals scheduled across the next six months"
    >
      <div
        className="h-[260px] w-full"
        role="img"
        aria-label={`Upcoming renewals by month totaling ${formatNumber(total)} renewals`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-muted)" }}
              formatter={(value) => [
                `${formatNumber(typeof value === "number" ? value : Number(value))} renewals`,
                "Count",
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={tooltipStyle}
            />
            <Bar
              dataKey="count"
              fill="var(--accent)"
              radius={[8, 8, 4, 4]}
              maxBarSize={48}
              name="Renewals"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

const tooltipStyle = {
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-md)",
  color: "var(--text)",
  fontSize: "12px",
};
