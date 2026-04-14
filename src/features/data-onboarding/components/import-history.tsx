import { useMemo } from "react";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { DataImport } from "@/types";

function fmtDate(iso?: string): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const DATA_TYPE_LABEL: Record<DataImport["dataType"], string> = {
  members: "Members",
  providers: "Providers",
  claims: "Claims",
  panels: "Panels",
};

const columns: Column<DataImport>[] = [
  {
    key: "fileName",
    header: "File",
    cell: (r) => (
      <span className="text-sm font-medium text-text-primary">
        {r.fileName}
      </span>
    ),
  },
  {
    key: "dataType",
    header: "Type",
    cell: (r) => (
      <Badge variant="secondary" className="text-[10px]">
        {DATA_TYPE_LABEL[r.dataType]}
      </Badge>
    ),
  },
  {
    key: "recordCount",
    header: "Records",
    cell: (r) => (
      <span className="text-sm tabular-nums">
        {r.recordCount.toLocaleString()}
      </span>
    ),
    sortable: true,
    sortValue: (r) => r.recordCount,
    className: "text-right",
  },
  {
    key: "status",
    header: "Status",
    cell: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: "errorCount",
    header: "Errors",
    cell: (r) => (
      <span
        className={`text-sm tabular-nums ${r.errorCount > 0 ? "text-status-error" : "text-text-muted"}`}
      >
        {r.errorCount}
      </span>
    ),
    sortable: true,
    sortValue: (r) => r.errorCount,
    className: "text-right",
  },
  {
    key: "warningCount",
    header: "Warnings",
    cell: (r) => (
      <span
        className={`text-sm tabular-nums ${r.warningCount > 0 ? "text-status-warning" : "text-text-muted"}`}
      >
        {r.warningCount}
      </span>
    ),
    sortable: true,
    sortValue: (r) => r.warningCount,
    className: "text-right",
  },
  {
    key: "uploadedAt",
    header: "Uploaded",
    cell: (r) => (
      <span className="text-sm text-text-muted">{fmtDate(r.uploadedAt)}</span>
    ),
    sortable: true,
    sortValue: (r) => r.uploadedAt,
  },
  {
    key: "completedAt",
    header: "Completed",
    cell: (r) => (
      <span className="text-sm text-text-muted">
        {fmtDate(r.completedAt)}
      </span>
    ),
  },
];

export function ImportHistory() {
  const imports = useOnboardingStore((s) => s.imports);

  const sorted = useMemo(
    () =>
      [...imports].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      ),
    [imports],
  );

  return (
    <DashboardCard
      icon={History}
      title="Import History"
      badge={sorted.length > 0 ? sorted.length : undefined}
    >
      <DataTable
        columns={columns}
        data={sorted}
        emptyTitle="No imports yet"
        emptyDescription="Upload a file to get started"
      />
    </DashboardCard>
  );
}
