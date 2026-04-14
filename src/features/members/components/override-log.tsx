import type { SteerageEvent } from "@/types";
import { DataTable, type Column } from "@/components/shared/data-table";
import { AlertTriangle } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}

const columns: Column<SteerageEvent>[] = [
  {
    key: "date",
    header: "Date",
    cell: (e) => <span className="text-xs">{formatDate(e.timestamp)}</span>,
  },
  {
    key: "recommended",
    header: "Recommended",
    cell: (e) => <span className="text-xs">{e.providerRecommended ?? "--"}</span>,
  },
  {
    key: "chosen",
    header: "Chosen",
    cell: (e) => <span className="text-xs">{e.providerChosen ?? "--"}</span>,
  },
  {
    key: "cost",
    header: "Cost Diff",
    cell: (e) => (
      <span className="text-xs tabular-nums">
        {e.costDifferential != null ? `RM ${e.costDifferential.toLocaleString()}` : "--"}
      </span>
    ),
    className: "text-right",
  },
  {
    key: "intervention",
    header: "Intervention",
    cell: (e) => <span className="text-xs capitalize">{e.interventionType?.replace(/_/g, " ") ?? "--"}</span>,
  },
  {
    key: "notes",
    header: "Notes",
    cell: (e) => <span className="text-xs text-text-muted">{e.notes ?? "--"}</span>,
  },
];

interface OverrideLogProps {
  events: SteerageEvent[];
}

export function OverrideLog({ events }: OverrideLogProps) {
  return (
    <DataTable<SteerageEvent>
      columns={columns}
      data={events}
      emptyIcon={AlertTriangle}
      emptyTitle="No overrides"
      emptyDescription="This member has no override events"
    />
  );
}
