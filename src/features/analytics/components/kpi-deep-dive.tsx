import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { getKpiDefinition, getKpiStatus } from "@/config/kpi-definitions";
import type { KpiSnapshot } from "@/types";

interface KpiDeepDiveProps {
  kpi: KpiSnapshot;
}

const STATUS_COLORS = {
  good: {
    stroke: "var(--color-status-success)",
    gradientStart: "var(--color-status-success)",
  },
  warning: {
    stroke: "var(--color-status-warning)",
    gradientStart: "var(--color-status-warning)",
  },
  critical: {
    stroke: "var(--color-status-error)",
    gradientStart: "var(--color-status-error)",
  },
} as const;

function formatValue(value: number, unit: string): string {
  if (unit === "currency") return `RM ${value.toLocaleString()}`;
  if (unit === "%") return `${value}%`;
  return String(value);
}

export function KpiDeepDive({ kpi }: KpiDeepDiveProps) {
  const def = getKpiDefinition(kpi.kpiType);
  const status = getKpiStatus(kpi.kpiType, kpi.value);
  const colors = STATUS_COLORS[status];
  const gradientId = `deepDive-${kpi.kpiType}`;

  const chartData = kpi.timeSeries.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "short",
    }),
    value: point.value,
  }));

  return (
    <div className="space-y-6">
      {/* Top summary row */}
      <Card variant="elevated" className="px-6 py-5">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs font-medium text-text-muted">{def.name}</p>
            <p className="mt-1 text-3xl font-bold text-text-primary">
              {formatValue(kpi.value, def.unit)}
            </p>
          </div>
          <TrendIndicator
            value={kpi.trend}
            suffix={def.unit === "currency" ? "" : "%"}
            invertColor={!def.higherIsBetter}
          />
          <div className="text-sm text-text-muted">
            Target: <span className="font-medium text-text-primary">{formatValue(kpi.target, def.unit)}</span>
          </div>
          <StatusBadge status={status} />
        </div>
        <p className="mt-2 text-xs text-text-muted">{def.description}</p>
      </Card>

      {/* Time series chart */}
      <Card variant="elevated" className="p-6">
        <p className="mb-4 text-[13px] font-semibold text-text-primary">
          {kpi.period === "30d" ? "30-Day" : kpi.period === "60d" ? "60-Day" : "90-Day"} Trend
        </p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.gradientStart}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.gradientStart}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-subtle)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                unit={def.unit === "%" ? "%" : ""}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine
                y={kpi.target}
                stroke="var(--color-text-muted)"
                strokeDasharray="6 4"
                label={{
                  value: `Target: ${formatValue(kpi.target, def.unit)}`,
                  position: "insideTopRight",
                  fill: "var(--color-text-muted)",
                  fontSize: 10,
                }}
              />
              <Area
                name={def.shortName}
                type="monotone"
                dataKey="value"
                stroke={colors.stroke}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
