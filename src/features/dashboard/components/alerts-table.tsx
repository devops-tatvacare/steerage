import { useState } from "react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Bell, Check, X } from "lucide-react";
import type { CtaAlert } from "@/types";
import { cn } from "@/lib/cn";

const severityColors: Record<string, string> = {
  critical: "border-status-error text-status-error bg-status-error-bg",
  high: "border-status-warning text-status-warning bg-status-warning-bg",
  medium: "border-status-info text-status-info bg-status-info-bg",
  low: "border-border-default text-text-muted",
};

const columns: Column<CtaAlert>[] = [
  {
    key: "severity",
    header: "Severity",
    cell: (row) => <Badge variant="outline" className={cn("text-[10px]", severityColors[row.severity])}>{row.severity}</Badge>,
  },
  { key: "title", header: "Alert", cell: (row) => <span className="text-sm font-medium text-text-primary">{row.title}</span> },
  { key: "kpiType", header: "KPI", cell: (row) => <span className="text-xs text-text-muted">{row.kpiType.replace(/_/g, " ")}</span> },
  { key: "action", header: "Action Required", cell: (row) => <span className="text-xs text-text-secondary line-clamp-1">{row.action}</span> },
  { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
  {
    key: "actions",
    header: "",
    cell: (row) => {
      const { actionAlert, dismissAlert } = useDashboardStore.getState();
      if (row.status !== "pending") return null;
      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); actionAlert(row.id); }}><Check className="h-3.5 w-3.5 text-status-success" /></Button>
          <Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); dismissAlert(row.id); }}><X className="h-3.5 w-3.5 text-status-error" /></Button>
        </div>
      );
    },
  },
];

export function AlertsTable() {
  const { alerts } = useDashboardStore();
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? alerts : alerts.filter((a) => a.status === tab);

  return (
    <DashboardCard icon={Bell} title="Active Alerts" badge={alerts.filter((a) => a.status === "pending").length}>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line">
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({alerts.filter((a) => a.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="actioned">Actioned ({alerts.filter((a) => a.status === "actioned").length})</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed ({alerts.filter((a) => a.status === "dismissed").length})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <DataTable columns={columns} data={filtered} emptyTitle="No alerts" emptyDescription="All clear" />
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
}
