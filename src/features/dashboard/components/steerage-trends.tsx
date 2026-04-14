import { DashboardCard } from "@/components/shared/dashboard-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import type { KpiSnapshot } from "@/types";

interface SteerageTrendsProps { kpis: KpiSnapshot[] }

export function SteerageTrends({ kpis }: SteerageTrendsProps) {
  const acceptance = kpis.find((k) => k.kpiType === "acceptance_rate");
  const leakage = kpis.find((k) => k.kpiType === "leakage_rate");

  if (!acceptance || !leakage) return null;

  const data = acceptance.timeSeries.map((point, i) => ({
    date: new Date(point.date).toLocaleDateString("en-MY", { day: "2-digit", month: "short" }),
    acceptance: point.value,
    leakage: leakage.timeSeries[i]?.value ?? 0,
  }));

  return (
    <DashboardCard icon={TrendingUp} title="Steerage Trends" description="Acceptance rate vs leakage over time">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="acceptFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-status-success)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-status-success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="leakFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-status-error)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-status-error)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} interval={6} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip contentStyle={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border-default)", borderRadius: "6px", fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Area name="Acceptance Rate" type="monotone" dataKey="acceptance" stroke="var(--color-status-success)" fill="url(#acceptFill)" strokeWidth={2} dot={false} />
            <Area name="Leakage Rate" type="monotone" dataKey="leakage" stroke="var(--color-status-error)" fill="url(#leakFill)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
