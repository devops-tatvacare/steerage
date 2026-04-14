import { DashboardCard } from "@/components/shared/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { MOCK_STEERAGE_EVENTS } from "@/mock-data/members";
import { cn } from "@/lib/cn";

const typeColors: Record<string, string> = {
  recommendation: "border-status-info text-status-info bg-status-info-bg",
  acceptance: "border-status-success text-status-success bg-status-success-bg",
  override: "border-status-error text-status-error bg-status-error-bg",
  dismissal: "border-status-warning text-status-warning bg-status-warning-bg",
  escalation: "border-status-error text-status-error bg-status-error-bg",
  navigator_call: "border-brand-primary text-brand-primary bg-brand-primary-light",
};

export function ActivityFeed() {
  const events = [...MOCK_STEERAGE_EVENTS]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10);

  return (
    <DashboardCard icon={Activity} title="Recent Activity" description="Latest steerage interactions" badge={events.length}>
      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 shrink-0 text-text-placeholder">{new Date(e.timestamp).toLocaleDateString("en-MY", { day: "2-digit", month: "short" })}</span>
            <Badge variant="outline" className={cn("shrink-0 text-[9px]", typeColors[e.type])}>{e.type.replace("_", " ")}</Badge>
            <span className="truncate text-text-secondary">
              {e.providerRecommended && `Rec: ${e.providerRecommended}`}
              {e.providerChosen && ` / Chose: ${e.providerChosen}`}
              {e.costDifferential && ` (RM ${e.costDifferential})`}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
