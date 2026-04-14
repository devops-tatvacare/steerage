import { useMemo } from "react";
import { Target } from "lucide-react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { Progress } from "@/components/ui/progress";
import { MOCK_MEMBERS } from "@/mock-data/members";
import { cn } from "@/lib/cn";

function formatRM(value: number): string {
  return `RM ${value.toLocaleString("en-MY")}`;
}

function computeMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function SteerageReadiness() {
  const data = useMemo(() => {
    const members = MOCK_MEMBERS;
    const totalMembers = members.length;
    const costThreshold = computeMedian(members.map((m) => m.annualSpend));

    const engaged = members.filter((m) => m.appEngaged);
    const engagementRate =
      totalMembers > 0 ? (engaged.length / totalMembers) * 100 : 0;

    const highCost = members.filter((m) => m.annualSpend >= costThreshold);
    const highCostEngaged = highCost.filter((m) => m.appEngaged);
    const highCostEngagementRate =
      highCost.length > 0
        ? (highCostEngaged.length / highCost.length) * 100
        : 0;

    const steerageEligible = highCostEngaged.length;
    const steerageEligibleSpend = highCostEngaged.reduce(
      (s, m) => s + m.annualSpend,
      0,
    );

    const opportunityMembers = highCost.filter((m) => !m.appEngaged);
    const opportunitySpend = opportunityMembers.reduce(
      (s, m) => s + m.annualSpend,
      0,
    );

    return {
      totalMembers,
      engagementRate: Math.round(engagementRate * 10) / 10,
      highCostEngagementRate: Math.round(highCostEngagementRate * 10) / 10,
      steerageEligible,
      steerageEligibleSpend,
      opportunityCount: opportunityMembers.length,
      opportunitySpend,
    };
  }, []);

  const highCostCritical = data.highCostEngagementRate < 50;

  return (
    <DashboardCard icon={Target} title="Steerage Readiness" description="App engagement is a prerequisite to effective steerage">
      <div className="space-y-4">
        {/* Overall engagement */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-text-secondary">
              Overall engagement
            </span>
            <span className="text-lg font-bold text-text-primary">
              {data.engagementRate}%
            </span>
          </div>
          <Progress value={data.engagementRate} className="mt-1.5 h-2" />
        </div>

        {/* High-cost engagement */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-text-secondary">
              High-cost engagement
            </span>
            <span
              className={cn(
                "text-lg font-bold",
                highCostCritical ? "text-status-error" : "text-text-primary",
              )}
            >
              {data.highCostEngagementRate}%
            </span>
          </div>
          <Progress
            value={data.highCostEngagementRate}
            className={cn(
              "mt-1.5 h-2",
              highCostCritical && "[&>*]:bg-[color:var(--color-status-warning)]",
            )}
          />
          {highCostCritical && (
            <p className="mt-1 text-[10px] text-status-warning">
              Below 50% -- steerage impact limited
            </p>
          )}
        </div>

        {/* Steerage-eligible pool */}
        <div className="rounded-lg border border-border-subtle bg-[color:var(--color-surface-subtle)] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-status-success">
            Steerage-eligible pool
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-text-primary">
              {data.steerageEligible} members
            </span>
            <span className="text-xs font-medium text-text-secondary">
              {formatRM(data.steerageEligibleSpend)}
            </span>
          </div>
        </div>

        {/* Engagement opportunity */}
        <div className="rounded-lg border border-border-subtle bg-[color:var(--color-surface-subtle)] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-status-error">
            Engagement opportunity
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-text-primary">
              {data.opportunityCount} members
            </span>
            <span className="text-xs font-medium text-text-secondary">
              {formatRM(data.opportunitySpend)}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-text-muted">
            {formatRM(data.opportunitySpend)} annual spend unreachable without
            engagement
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
