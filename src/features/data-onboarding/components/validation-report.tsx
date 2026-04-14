import { AlertTriangle, Download, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { DataImport } from "@/types";

interface ValidationError {
  row: number;
  field: string;
  issue: string;
  severity: "error" | "warning";
}

const MOCK_ERRORS: ValidationError[] = [
  {
    row: 1042,
    field: "Effective Date",
    issue: "Invalid date format",
    severity: "error",
  },
  {
    row: 3891,
    field: "Member ID",
    issue: "Missing required field",
    severity: "error",
  },
  {
    row: 5204,
    field: "Amount",
    issue: "Negative value not allowed",
    severity: "error",
  },
  {
    row: 782,
    field: "Gender",
    issue: "Unrecognised value 'X'",
    severity: "warning",
  },
  {
    row: 4100,
    field: "Plan Type",
    issue: "Value not in allowed list",
    severity: "warning",
  },
  {
    row: 8233,
    field: "Risk Tier",
    issue: "Empty optional field",
    severity: "warning",
  },
];

const errorColumns: Column<ValidationError>[] = [
  {
    key: "row",
    header: "Row",
    cell: (r) => <span className="font-mono text-xs">{r.row}</span>,
    sortable: true,
    sortValue: (r) => r.row,
    className: "w-20",
  },
  {
    key: "field",
    header: "Field",
    cell: (r) => <span className="text-sm">{r.field}</span>,
  },
  {
    key: "issue",
    header: "Issue",
    cell: (r) => <span className="text-sm text-text-muted">{r.issue}</span>,
  },
  {
    key: "severity",
    header: "Severity",
    cell: (r) => (
      <Badge
        variant={r.severity === "error" ? "destructive" : "outline"}
        className="text-[10px]"
      >
        {r.severity === "error" ? "Error" : "Warning"}
      </Badge>
    ),
  },
];

interface ValidationReportProps {
  currentImport: DataImport;
}

export function ValidationReport({ currentImport }: ValidationReportProps) {
  const advanceStatus = useOnboardingStore((s) => s.advanceStatus);

  const errorCount =
    currentImport.errorCount > 0
      ? currentImport.errorCount
      : MOCK_ERRORS.filter((e) => e.severity === "error").length;
  const warningCount =
    currentImport.warningCount > 0
      ? currentImport.warningCount
      : MOCK_ERRORS.filter((e) => e.severity === "warning").length;
  const validCount = currentImport.recordCount - errorCount;

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Total Records"
          value={currentImport.recordCount.toLocaleString()}
        />
        <SummaryCard
          label="Valid"
          value={validCount.toLocaleString()}
          className="text-status-success"
        />
        <SummaryCard
          label="Errors"
          value={errorCount.toLocaleString()}
          className="text-status-error"
          icon={<XCircle className="h-4 w-4" />}
        />
        <SummaryCard
          label="Warnings"
          value={warningCount.toLocaleString()}
          className="text-status-warning"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Error table */}
      {errorCount > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">
            Issues Found
          </h4>
          <div className="rounded-lg border border-border-default">
            <DataTable columns={errorColumns} data={MOCK_ERRORS} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" className="gap-1.5 text-text-muted">
          <Download className="h-3.5 w-3.5" />
          Download Error Report
        </Button>

        <Button
          size="sm"
          disabled={errorCount > 0}
          onClick={advanceStatus}
          className="gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approve &amp; Go Live
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  className,
  icon,
}: {
  label: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary px-4 py-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className={`mt-1 flex items-center gap-1.5 text-lg font-semibold ${className ?? "text-text-primary"}`}>
        {icon}
        {value}
      </p>
    </div>
  );
}
