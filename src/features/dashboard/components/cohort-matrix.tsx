import { useMemo } from "react";
import { Grid3X3 } from "lucide-react";
import { DashboardCard } from "@/components/shared/dashboard-card";
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

interface Quadrant {
  label: string;
  description: string;
  memberCount: number;
  totalSpend: number;
  accent: "success" | "error" | "info" | "muted";
}

export function CohortMatrix() {
  const quadrants = useMemo(() => {
    const costThreshold = computeMedian(MOCK_MEMBERS.map((m) => m.annualSpend));

    const highCostEngaged: typeof MOCK_MEMBERS = [];
    const highCostNotEngaged: typeof MOCK_MEMBERS = [];
    const lowCostEngaged: typeof MOCK_MEMBERS = [];
    const lowCostNotEngaged: typeof MOCK_MEMBERS = [];

    for (const m of MOCK_MEMBERS) {
      const isHighCost = m.annualSpend >= costThreshold;
      if (isHighCost && m.appEngaged) highCostEngaged.push(m);
      else if (isHighCost && !m.appEngaged) highCostNotEngaged.push(m);
      else if (!isHighCost && m.appEngaged) lowCostEngaged.push(m);
      else lowCostNotEngaged.push(m);
    }

    const sum = (arr: typeof MOCK_MEMBERS) =>
      arr.reduce((s, m) => s + m.annualSpend, 0);

    return [
      {
        label: "High Cost + Engaged",
        description: "Primary steerage targets",
        memberCount: highCostEngaged.length,
        totalSpend: sum(highCostEngaged),
        accent: "success" as const,
      },
      {
        label: "High Cost + NOT Engaged",
        description: "Need engagement first",
        memberCount: highCostNotEngaged.length,
        totalSpend: sum(highCostNotEngaged),
        accent: "error" as const,
      },
      {
        label: "Low Cost + Engaged",
        description: "Monitor & maintain",
        memberCount: lowCostEngaged.length,
        totalSpend: sum(lowCostEngaged),
        accent: "info" as const,
      },
      {
        label: "Low Cost + NOT Engaged",
        description: "Low priority",
        memberCount: lowCostNotEngaged.length,
        totalSpend: sum(lowCostNotEngaged),
        accent: "muted" as const,
      },
    ] satisfies Quadrant[];
  }, []);

  const accentStyles: Record<Quadrant["accent"], string> = {
    success:
      "border-l-[3px] border-l-[color:var(--color-status-success)] bg-[color:var(--color-surface-subtle)]",
    error:
      "border-l-[3px] border-l-[color:var(--color-status-error)] bg-[color:var(--color-surface-subtle)]",
    info:
      "border-l-[3px] border-l-[color:var(--color-status-info)] bg-[color:var(--color-surface-subtle)]",
    muted:
      "border-l-[3px] border-l-[color:var(--color-surface-border)] bg-[color:var(--color-surface-subtle)]",
  };

  const labelStyles: Record<Quadrant["accent"], string> = {
    success: "text-status-success",
    error: "text-status-error",
    info: "text-status-info",
    muted: "text-text-muted",
  };

  return (
    <DashboardCard icon={Grid3X3} title="Steerage Cohort Segmentation" description="High-cost engaged members are primary steerage targets">
      <div className="grid grid-cols-2 gap-3">
        {quadrants.map((q) => (
          <div
            key={q.label}
            className={cn(
              "rounded-lg px-3 py-3",
              accentStyles[q.accent],
            )}
          >
            <p className={cn("text-[11px] font-semibold uppercase tracking-wide", labelStyles[q.accent])}>
              {q.description}
            </p>
            <p className="mt-1 text-xs text-text-muted">{q.label}</p>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-text-primary">
                {q.memberCount}
              </span>
              <span className="text-xs font-medium text-text-secondary">
                {formatRM(q.totalSpend)}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-text-muted">members</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
