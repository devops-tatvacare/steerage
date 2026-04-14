import { useNavigate } from "react-router-dom";
import { useMemberStore } from "@/stores/member-store";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { Users } from "lucide-react";
import type { Member } from "@/types";

const RISK_COLORS: Record<Member["riskTier"], string> = {
  low: "border-status-success text-status-success bg-status-success-bg",
  moderate: "border-status-info text-status-info bg-status-info-bg",
  high: "border-status-warning text-status-warning bg-status-warning-bg",
  critical: "border-status-error text-status-error bg-status-error-bg",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}

const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    sortValue: (m) => m.name,
    cell: (m) => <span className="font-medium text-text-primary">{m.name}</span>,
  },
  {
    key: "age",
    header: "Age",
    sortable: true,
    sortValue: (m) => m.age,
    cell: (m) => m.age,
    className: "w-16",
  },
  {
    key: "riskTier",
    header: "Risk",
    sortable: true,
    sortValue: (m) => ({ low: 0, moderate: 1, high: 2, critical: 3 })[m.riskTier],
    cell: (m) => (
      <Badge variant="outline" className={cn("text-[10px] capitalize", RISK_COLORS[m.riskTier])}>
        {m.riskTier}
      </Badge>
    ),
    className: "w-24",
  },
  {
    key: "planType",
    header: "Plan",
    cell: (m) => <span className="text-xs text-text-secondary">{m.planType}</span>,
  },
  {
    key: "conditions",
    header: "Conditions",
    cell: (m) => {
      if (m.conditions.length === 0) return <span className="text-xs text-text-muted">--</span>;
      const shown = m.conditions.slice(0, 2);
      const extra = m.conditions.length - 2;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {shown.map((c) => (
            <Badge key={c} variant="ghost" className="text-[10px] capitalize">
              {c}
            </Badge>
          ))}
          {extra > 0 && <span className="text-[10px] text-text-muted">+{extra}</span>}
        </div>
      );
    },
  },
  {
    key: "careStage",
    header: "Stage",
    cell: (m) => <span className="text-xs capitalize text-text-secondary">{m.careJourneyStage.replace(/_/g, " ")}</span>,
  },
  {
    key: "steerageScore",
    header: "Score",
    sortable: true,
    sortValue: (m) => m.steerageScore,
    cell: (m) => <span className="tabular-nums">{m.steerageScore}</span>,
    className: "w-16 text-right",
  },
  {
    key: "overrideCount",
    header: "Overrides",
    sortable: true,
    sortValue: (m) => m.overrideCount,
    cell: (m) => <span className={cn("tabular-nums", m.overrideCount > 0 && "text-status-error")}>{m.overrideCount}</span>,
    className: "w-20 text-right",
  },
  {
    key: "lastActivity",
    header: "Last Activity",
    cell: (m) => <span className="text-xs text-text-muted">{formatDate(m.lastActivity)}</span>,
  },
];

export function MemberTable() {
  const navigate = useNavigate();
  const getFilteredMembers = useMemberStore((s) => s.getFilteredMembers);
  const data = getFilteredMembers();

  return (
    <DataTable<Member>
      columns={columns}
      data={data}
      onRowClick={(m) => navigate(`/members/${m.id}`)}
      emptyIcon={Users}
      emptyTitle="No members found"
      emptyDescription="Try adjusting your filters"
    />
  );
}
