import { DashboardCard } from "@/components/shared/dashboard-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Bell,
  CheckCircle2,
  Settings2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const LOOP_STEPS = [
  {
    icon: Activity,
    label: "KPI Signal",
    description: "A metric crosses its threshold, triggering the feedback loop",
  },
  {
    icon: Bell,
    label: "CTA Fired",
    description: "The engine generates a call-to-action with a recommended intervention",
  },
  {
    icon: CheckCircle2,
    label: "Action Taken",
    description: "Ops team or automated rule executes the recommended action",
  },
  {
    icon: Settings2,
    label: "Rule Adjusted",
    description: "Steerage engine updates weights and rules based on outcome",
  },
] as const;

const EXAMPLES = [
  {
    description:
      "Access weight increased for cardiology (CTA #14) -- Acceptance rate +12% in Petaling Jaya",
    outcome: "+12% acceptance",
  },
  {
    description:
      "3 GP clinics flagged for panel education (CTA #8) -- Leakage -6% in cardiology referrals",
    outcome: "-6% leakage",
  },
  {
    description:
      "Follow-up push notification timing changed (CTA #11) -- Cost avoidance recovery rate +18%",
    outcome: "+18% recovery",
  },
] as const;

export function FeedbackLoopViz() {
  return (
    <DashboardCard
      icon={Settings2}
      title="Closed Feedback Loop"
      description="How KPI signals drive actions and self-adjust the steerage engine"
    >
      {/* Flow diagram */}
      <div className="flex flex-wrap items-stretch justify-center gap-0 py-4">
        {LOOP_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-stretch">
              <div className="flex w-[180px] flex-col items-center rounded-lg border border-border-default bg-bg-secondary p-4 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-primary/10">
                  <Icon className="h-5 w-5 text-brand-primary" />
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {step.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-text-muted">
                  {step.description}
                </p>
              </div>
              {i < LOOP_STEPS.length - 1 && (
                <div className="flex items-center px-2">
                  <ArrowRight className="h-5 w-5 text-text-muted" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Examples */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium text-text-muted">
          Recent loop outcomes
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <Card
              key={ex.outcome}
              variant="subtle"
              className="flex flex-col gap-2 p-4"
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                <p className="text-xs leading-relaxed text-text-primary">
                  {ex.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className="mt-auto w-fit border-status-success text-[10px] font-medium text-status-success bg-status-success-bg"
              >
                {ex.outcome}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
