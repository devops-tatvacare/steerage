import { useMemo } from "react";
import { Calculator } from "lucide-react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { MetricTooltip } from "@/components/shared/metric-tooltip";
import { MOCK_STEERAGE_EVENTS } from "@/mock-data/members";

function formatRM(value: number): string {
  return `RM ${Math.abs(value).toLocaleString("en-MY")}`;
}

export function RoiSummary() {
  const metrics = useMemo(() => {
    const events = MOCK_STEERAGE_EVENTS;

    const totalSteered = events.filter((e) => e.type === "recommendation").length;
    const acceptedEvents = events.filter((e) => e.type === "acceptance");
    const overrideEvents = events.filter((e) => e.type === "override");

    const acceptanceRate =
      totalSteered > 0
        ? (acceptedEvents.length / totalSteered) * 100
        : 0;

    // costDifferential on overrides is negative (cost lost), on acceptance it's 0 or positive (saved).
    // Savings = sum of absolute costDifferential on acceptance events where differential indicates a savings scenario.
    // Actually for acceptance events costDifferential is 0 (they accepted the recommended provider).
    // The "savings" is the cost avoided by NOT going to the more expensive provider.
    // We need to estimate savings differently: for each acceptance, the savings is the average override cost differential.
    // Better approach: sum the absolute value of costDifferential on overrides = money lost.
    // Total potential = if those overrides had been accepted, that money would be saved.
    const lostSavings = overrideEvents.reduce(
      (sum, e) => sum + Math.abs(e.costDifferential || 0),
      0,
    );

    // Savings generated: acceptance events accepted the recommended (lower-cost) provider.
    // The cost differential on acceptance is 0 because they chose the recommended provider.
    // The *real* savings is: for every acceptance, the member avoided the override cost.
    // Use the average override differential as a proxy for savings per accepted recommendation.
    const avgOverrideCost =
      overrideEvents.length > 0
        ? lostSavings / overrideEvents.length
        : 0;
    const totalSavings = Math.round(acceptedEvents.length * avgOverrideCost);

    return {
      totalSteered,
      acceptedCount: acceptedEvents.length,
      acceptanceRate: Math.round(acceptanceRate * 10) / 10,
      totalSavings,
      lostSavings,
    };
  }, []);

  const savingsTotal = metrics.totalSavings + metrics.lostSavings;
  const capturedPct = savingsTotal > 0 ? (metrics.totalSavings / savingsTotal) * 100 : 0;
  const lostPct = savingsTotal > 0 ? (metrics.lostSavings / savingsTotal) * 100 : 0;

  return (
    <DashboardCard icon={Calculator} title="ROI Summary" description="Savings generated from steered transactions">
      <div className="grid grid-cols-3 gap-4">
        {/* Transactions Steered */}
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">
            {metrics.totalSteered}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-muted">
            rules applied
            <MetricTooltip title="Transactions Steered" description="Number of member transactions where the steerage rule engine applied a provider recommendation." formula="COUNT(events WHERE type = recommendation)" />
          </p>
        </div>

        {/* Acceptance Rate */}
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">
            {metrics.acceptanceRate}%
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-muted">
            {metrics.acceptedCount} of {metrics.totalSteered} accepted
            <MetricTooltip title="Steerage Acceptance Rate" description="Proportion of steered transactions where the member followed the recommendation and booked the suggested provider." formula="Accepted / Total steered x 100" target=">= 60%" />
          </p>
        </div>

        {/* Savings Generated */}
        <div className="text-center">
          <p className="text-2xl font-bold text-status-success">
            {formatRM(metrics.totalSavings)}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-muted">
            potential {formatRM(metrics.lostSavings)} lost
            <MetricTooltip title="Savings Generated" description="Estimated cost avoided by members choosing the recommended lower-cost provider instead of their initial preference." formula="SUM(cost differential x acceptance events)" />
          </p>
        </div>
      </div>

      {/* Savings bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-1 overflow-hidden rounded-md" style={{ height: 20 }}>
          {capturedPct > 0 && (
            <div
              className="flex h-full items-center justify-center rounded-l-md bg-[color:var(--color-status-success)] px-2 text-[10px] font-semibold text-white"
              style={{ width: `${capturedPct}%`, minWidth: "fit-content" }}
            >
              {formatRM(metrics.totalSavings)}
            </div>
          )}
          {lostPct > 0 && (
            <div
              className="flex h-full items-center justify-center rounded-r-md bg-[color:var(--color-status-error)] px-2 text-[10px] font-semibold text-white"
              style={{ width: `${lostPct}%`, minWidth: "fit-content" }}
            >
              {formatRM(metrics.lostSavings)}
            </div>
          )}
        </div>
        <div className="flex justify-between text-[10px] text-text-muted">
          <span>Savings captured</span>
          <span>Savings lost to overrides</span>
        </div>
      </div>
    </DashboardCard>
  );
}
