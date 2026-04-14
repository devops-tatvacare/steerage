import { useMemo } from "react";
import { Calculator } from "lucide-react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { MetricTooltip } from "@/components/shared/metric-tooltip";
import { MOCK_STEERAGE_EVENTS } from "@/mock-data/members";
import { cn } from "@/lib/cn";

function formatRM(value: number): string {
  return `RM ${Math.abs(value).toLocaleString("en-MY")}`;
}

export function RoiSummary() {
  const metrics = useMemo(() => {
    const events = MOCK_STEERAGE_EVENTS;

    const recommendations = events.filter((e) => e.type === "recommendation");
    const acceptedEvents = events.filter((e) => e.type === "acceptance");
    const overrideEvents = events.filter((e) => e.type === "override");
    const dismissalEvents = events.filter((e) => e.type === "dismissal");

    const totalSteered = recommendations.length;
    const acceptanceRate = totalSteered > 0 ? (acceptedEvents.length / totalSteered) * 100 : 0;

    const lostSavings = overrideEvents.reduce((sum, e) => sum + Math.abs(e.costDifferential || 0), 0);
    const avgOverrideCost = overrideEvents.length > 0 ? lostSavings / overrideEvents.length : 0;
    const totalSavings = Math.round(acceptedEvents.length * avgOverrideCost);
    const avgSavingsPerAccept = acceptedEvents.length > 0 ? Math.round(totalSavings / acceptedEvents.length) : 0;

    return {
      totalSteered,
      acceptedCount: acceptedEvents.length,
      overrideCount: overrideEvents.length,
      dismissalCount: dismissalEvents.length,
      acceptanceRate: Math.round(acceptanceRate * 10) / 10,
      totalSavings,
      lostSavings,
      avgSavingsPerAccept,
    };
  }, []);

  const savingsTotal = metrics.totalSavings + metrics.lostSavings;
  const capturedPct = savingsTotal > 0 ? (metrics.totalSavings / savingsTotal) * 100 : 0;
  const lostPct = savingsTotal > 0 ? (metrics.lostSavings / savingsTotal) * 100 : 0;

  return (
    <DashboardCard icon={Calculator} title="ROI Summary" description="Savings generated from steered transactions" contentClassName="flex flex-col">
      <div className="flex flex-1 flex-col justify-between gap-4">
        {/* Hero: total savings */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-3xl font-bold text-status-success">{formatRM(metrics.totalSavings)}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-muted">
              total savings captured
              <MetricTooltip title="Savings Generated" description="Estimated cost avoided by members choosing the recommended lower-cost provider." formula="SUM(avg override cost x accepted count)" />
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-status-error">{formatRM(metrics.lostSavings)}</p>
            <p className="text-[10px] text-text-muted">lost to overrides</p>
          </div>
        </div>

        {/* Savings bar */}
        <div className="space-y-1">
          <div className="flex items-center gap-0.5 overflow-hidden rounded-md" style={{ height: 14 }}>
            {capturedPct > 0 && (
              <div className="h-full rounded-l-md bg-[color:var(--color-status-success)]" style={{ width: `${capturedPct}%` }} />
            )}
            {lostPct > 0 && (
              <div className="h-full rounded-r-md bg-[color:var(--color-status-error)] opacity-40" style={{ width: `${lostPct}%` }} />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>Captured ({Math.round(capturedPct)}%)</span>
            <span>Lost ({Math.round(lostPct)}%)</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <p className="text-lg font-bold text-text-primary">{metrics.totalSteered}</p>
            <p className="inline-flex items-center gap-1 text-[10px] text-text-muted">
              transactions steered
              <MetricTooltip title="Transactions Steered" description="Total recommendations surfaced to members by the rule engine." formula="COUNT(recommendation events)" />
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{metrics.acceptanceRate}%</p>
            <p className="inline-flex items-center gap-1 text-[10px] text-text-muted">
              acceptance rate
              <MetricTooltip title="Acceptance Rate" description="Proportion of steered transactions where the member booked the recommended provider." formula="Accepted / Steered x 100" target=">= 60%" />
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{formatRM(metrics.avgSavingsPerAccept)}</p>
            <p className="text-[10px] text-text-muted">avg savings per accept</p>
          </div>
          <div>
            <p className={cn("text-lg font-bold", metrics.overrideCount > metrics.acceptedCount ? "text-status-error" : "text-text-primary")}>
              {metrics.acceptedCount} / {metrics.overrideCount}
            </p>
            <p className="text-[10px] text-text-muted">accepted / overridden</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
