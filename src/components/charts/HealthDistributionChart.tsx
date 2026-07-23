"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartCard } from "@/components/charts/ChartCard";
import { formatNumber, formatPercent } from "@/lib/format";
import type { HealthDistributionPoint } from "@/lib/analytics";

interface HealthDistributionChartProps {
  data: HealthDistributionPoint[];
}

export function HealthDistributionChart({
  data,
}: HealthDistributionChartProps) {
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <ChartCard
      title="Customer Health Distribution"
      description="Share of accounts by health status across the portfolio"
    >
      <div
        className="h-[260px] w-full"
        role="img"
        aria-label={`Customer health distribution for ${formatNumber(total)} accounts`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="46%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              stroke="var(--surface)"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => {
                const point = item?.payload as HealthDistributionPoint | undefined;
                const count = typeof value === "number" ? value : Number(value);
                return [
                  `${formatNumber(count)} customers (${formatPercent(point?.percentage ?? 0)})`,
                  point?.label ?? "Status",
                ];
              }}
              contentStyle={tooltipStyle}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => {
                const point = entry.payload as HealthDistributionPoint | undefined;
                if (!point) return value;
                return `${point.label}: ${formatNumber(point.count)} (${formatPercent(point.percentage)})`;
              }}
            />
          </PieChart>
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
