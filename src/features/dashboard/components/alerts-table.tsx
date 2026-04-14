import { DashboardCard } from "@/components/shared/dashboard-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Bell, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CtaAlert } from "@/types";

const severityColors: Record<string, string> = {
  critical: "border-status-error text-status-error bg-status-error-bg",
  high: "border-status-warning text-status-warning bg-status-warning-bg",
  medium: "border-status-info text-status-info bg-status-info-bg",
  low: "border-border-default text-text-muted",
};

function AlertRow({ alert }: { alert: CtaAlert }) {
  const { actionAlert, dismissAlert } = useDashboardStore();
  return (
    <div className="flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors hover:bg-bg-hover">
      <Badge variant="outline" className={cn("shrink-0 text-[9px]", severityColors[alert.severity])}>
        {alert.severity}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-text-primary">{alert.title}</p>
        <p className="truncate text-[10px] text-text-muted">{alert.action}</p>
      </div>
      <StatusBadge status={alert.status} />
      {alert.status === "pending" && (
        <div className="flex shrink-0 items-center gap-0.5">
          <Button variant="ghost" size="icon-xs" onClick={() => actionAlert(alert.id)}>
            <Check className="h-3 w-3 text-status-success" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => dismissAlert(alert.id)}>
            <X className="h-3 w-3 text-status-error" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function AlertsTable() {
  const { alerts } = useDashboardStore();
  const pending = alerts.filter((a) => a.status === "pending");
  const display = pending.length > 0 ? pending.slice(0, 6) : alerts.slice(0, 6);

  return (
    <DashboardCard
      icon={Bell}
      title="Active Alerts"
      description="CTA actions triggered by KPI thresholds"
      badge={pending.length}
    >
      <div className="space-y-0.5">
        {display.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </div>
      {alerts.length > 6 && (
        <p className="mt-2 text-center text-[10px] text-text-muted">
          {alerts.length - 6} more alerts in Analytics
        </p>
      )}
    </DashboardCard>
  );
}
