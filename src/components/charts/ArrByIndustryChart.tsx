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
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { ArrByIndustryPoint } from "@/lib/analytics";

interface ArrByIndustryChartProps {
  data: ArrByIndustryPoint[];
}

export function ArrByIndustryChart({ data }: ArrByIndustryChartProps) {
  return (
    <ChartCard
      title="ARR by Industry"
      description="Portfolio ARR ranked from highest to lowest industry contribution"
    >
      <div
        className="h-[260px] w-full"
        role="img"
        aria-label="Annual recurring revenue by industry ranked highest to lowest"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
            />
            <YAxis
              type="category"
              dataKey="industry"
              width={92}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
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
            <Bar
              dataKey="arr"
              fill="var(--accent-strong)"
              radius={[0, 8, 8, 0]}
              maxBarSize={22}
              name="ARR"
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
