"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/charts/ChartCard";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { ArrByHealthPoint } from "@/lib/analytics";

interface ArrByHealthChartProps {
  data: ArrByHealthPoint[];
}

export function ArrByHealthChart({ data }: ArrByHealthChartProps) {
  return (
    <ChartCard
      title="ARR by Health Status"
      description="Total annual recurring revenue grouped by account health"
    >
      <div
        className="h-[260px] w-full"
        role="img"
        aria-label="ARR grouped by healthy, at risk, and critical accounts"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              width={56}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-muted)" }}
              formatter={(value) => [
                formatCurrency(typeof value === "number" ? value : Number(value)),
                "ARR",
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={tooltipStyle}
            />
            <Bar dataKey="arr" radius={[8, 8, 4, 4]} maxBarSize={56}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
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
