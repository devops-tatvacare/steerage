import { KpiCard } from "@/components/shared/kpi-card";
import { Sparkline } from "@/components/shared/sparkline";
import { MetricTooltip } from "@/components/shared/metric-tooltip";
import { KPI_DEFINITIONS, getKpiStatus } from "@/config/kpi-definitions";
import type { KpiSnapshot } from "@/types";
import { CheckCircle2, AlertTriangle, TrendingDown, FileCheck, Unlink, Gift } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCircle2, AlertTriangle, TrendingDown, FileCheck, Unlink, Gift,
};

const FORMULAS: Record<string, string> = {
  acceptance_rate: "Accepted / Total Recommended x 100",
  leakage_rate: "Out-of-panel claims / Total claims x 100",
  cost_avoidance: "SUM(expected cost - actual cost) per accepted steerage",
  referral_compliance: "Panel referrals / Total referrals x 100",
  fragmentation_rate: "Members with 3+ providers same condition / Total chronic x 100",
  benefits_utilisation: "Members with >= 1 benefit claim / Total eligible x 100",
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
            label={
              <span className="inline-flex items-center gap-1">
                {def.shortName}
                <MetricTooltip
                  title={def.name}
                  description={def.description}
                  formula={FORMULAS[kpi.kpiType]}
                  target={def.unit === "currency" ? `RM ${def.thresholds.good}+` : `${def.higherIsBetter ? ">=" : "<="} ${def.thresholds.good}%`}
                />
              </span>
            }
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
