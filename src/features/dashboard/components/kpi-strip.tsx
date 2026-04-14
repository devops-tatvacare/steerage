import { KpiCard } from "@/components/shared/kpi-card";
import { Sparkline } from "@/components/shared/sparkline";
import { KPI_DEFINITIONS, getKpiStatus } from "@/config/kpi-definitions";
import type { KpiSnapshot } from "@/types";
import { CheckCircle2, AlertTriangle, TrendingDown, FileCheck, Unlink, Gift } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCircle2, AlertTriangle, TrendingDown, FileCheck, Unlink, Gift,
};

interface KpiStripProps { kpis: KpiSnapshot[] }

export function KpiStrip({ kpis }: KpiStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => {
        const def = KPI_DEFINITIONS.find((d) => d.type === kpi.kpiType);
        if (!def) return null;
        const Icon = ICON_MAP[def.icon];
        const status = getKpiStatus(kpi.kpiType, kpi.value);
        const trendPositive = def.higherIsBetter ? kpi.trend > 0 : kpi.trend < 0;
        const formatted = def.unit === "currency" ? `RM ${kpi.value}` : `${kpi.value}%`;
        return (
          <KpiCard
            key={kpi.kpiType}
            label={def.shortName}
            value={formatted}
            trend={{ direction: kpi.trend >= 0 ? "up" : "down", value: `${Math.abs(kpi.trend)}%`, positive: trendPositive }}
            icon={Icon}
          >
            <Sparkline data={kpi.timeSeries.map((t) => t.value)} color={status === "good" ? "var(--color-status-success)" : status === "warning" ? "var(--color-status-warning)" : "var(--color-status-error)"} />
          </KpiCard>
        );
      })}
    </div>
  );
}
