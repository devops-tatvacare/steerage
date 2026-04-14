import type { KpiType } from "@/types";

export interface KpiDefinition {
  type: KpiType;
  name: string;
  shortName: string;
  description: string;
  unit: "%" | "currency" | "count" | "rate";
  higherIsBetter: boolean;
  thresholds: { good: number; warning: number; critical: number };
  icon: string;
}

export const KPI_DEFINITIONS: KpiDefinition[] = [
  { type: "acceptance_rate", name: "Steerage Acceptance Rate", shortName: "Acceptance", description: "Proportion of recommendations members follow through on", unit: "%", higherIsBetter: true, thresholds: { good: 60, warning: 40, critical: 25 }, icon: "CheckCircle2" },
  { type: "leakage_rate", name: "Out-of-Panel Leakage Rate", shortName: "Leakage", description: "Care episodes where member went out-of-panel", unit: "%", higherIsBetter: false, thresholds: { good: 15, warning: 25, critical: 40 }, icon: "AlertTriangle" },
  { type: "cost_avoidance", name: "Cost Avoidance per Interaction", shortName: "Cost Saved", description: "Estimated savings per accepted steerage interaction", unit: "currency", higherIsBetter: true, thresholds: { good: 200, warning: 100, critical: 50 }, icon: "TrendingDown" },
  { type: "referral_compliance", name: "Referral Compliance Rate", shortName: "Referral Comp.", description: "GP/specialist referrals landing on panel providers", unit: "%", higherIsBetter: true, thresholds: { good: 70, warning: 50, critical: 35 }, icon: "FileCheck" },
  { type: "fragmentation_rate", name: "Chronic Care Fragmentation", shortName: "Fragmentation", description: "Chronic members receiving uncoordinated multi-provider care", unit: "%", higherIsBetter: false, thresholds: { good: 10, warning: 20, critical: 35 }, icon: "Unlink" },
  { type: "benefits_utilisation", name: "Benefits Utilisation Rate", shortName: "Benefits Used", description: "Members who have used at least one entitled benefit", unit: "%", higherIsBetter: true, thresholds: { good: 70, warning: 50, critical: 30 }, icon: "Gift" },
];

export function getKpiDefinition(type: KpiType): KpiDefinition {
  return KPI_DEFINITIONS.find((k) => k.type === type)!;
}

export function getKpiStatus(type: KpiType, value: number): "good" | "warning" | "critical" {
  const def = getKpiDefinition(type);
  if (def.higherIsBetter) {
    if (value >= def.thresholds.good) return "good";
    if (value >= def.thresholds.warning) return "warning";
    return "critical";
  }
  if (value <= def.thresholds.good) return "good";
  if (value <= def.thresholds.warning) return "warning";
  return "critical";
}
