import { DashboardCard } from "@/components/shared/dashboard-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { ClipboardCheck } from "lucide-react";
import type { PreauthTrigger } from "@/types";

export function PreauthTriggers() {
  const { preauthTriggers } = useRuleEngineStore();

  const columns: Column<PreauthTrigger>[] = [
    {
      key: "procedureCode",
      header: "Code",
      cell: (row) => <code className="rounded bg-bg-hover px-1.5 py-0.5 text-xs">{row.procedureCode}</code>,
      sortable: true,
      sortValue: (row) => row.procedureCode,
    },
    {
      key: "procedureName",
      header: "Procedure",
      cell: (row) => <span className="font-medium text-text-primary">{row.procedureName}</span>,
      sortable: true,
      sortValue: (row) => row.procedureName,
    },
    {
      key: "providerTier",
      header: "Tier Filter",
      cell: (row) =>
        row.providerTier != null ? (
          <Badge variant="outline">Tier {row.providerTier}</Badge>
        ) : (
          <span className="text-xs text-text-muted">Any</span>
        ),
    },
    {
      key: "autoApprove",
      header: "Auto-Approve",
      cell: (row) => (
        <Switch checked={row.autoApprove} disabled />
      ),
      className: "w-[100px]",
    },
    {
      key: "enabled",
      header: "Enabled",
      cell: (row) => (
        <Switch checked={row.enabled} disabled />
      ),
      className: "w-[80px]",
    },
  ];

  return (
    <DashboardCard
      icon={ClipboardCheck}
      title="Pre-Authorization Triggers"
      badge={<span>{preauthTriggers.length} rules</span>}
      description="Rules for automatic pre-authorization processing"
    >
      <DataTable
        columns={columns}
        data={preauthTriggers}
        emptyTitle="No pre-auth triggers"
        emptyDescription="Pre-authorization trigger rules will appear here."
      />
    </DashboardCard>
  );
}
