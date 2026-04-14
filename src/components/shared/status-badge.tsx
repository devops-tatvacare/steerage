import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "border-status-success text-status-success bg-status-success-bg" },
  published: { label: "Published", className: "border-status-success text-status-success bg-status-success-bg" },
  live: { label: "Live", className: "border-status-success text-status-success bg-status-success-bg" },
  approved: { label: "Approved", className: "border-status-success text-status-success bg-status-success-bg" },
  draft: { label: "Draft", className: "border-border-default text-text-muted" },
  pending: { label: "Pending", className: "border-status-warning text-status-warning bg-status-warning-bg" },
  review: { label: "Review", className: "border-status-warning text-status-warning bg-status-warning-bg" },
  mapping: { label: "Mapping", className: "border-status-info text-status-info bg-status-info-bg" },
  validating: { label: "Validating", className: "border-status-info text-status-info bg-status-info-bg" },
  uploading: { label: "Uploading", className: "border-status-info text-status-info bg-status-info-bg" },
  paused: { label: "Paused", className: "border-status-warning text-status-warning bg-status-warning-bg" },
  suspended: { label: "Suspended", className: "border-status-error text-status-error bg-status-error-bg" },
  failed: { label: "Failed", className: "border-status-error text-status-error bg-status-error-bg" },
  dismissed: { label: "Dismissed", className: "border-border-default text-text-muted" },
  actioned: { label: "Actioned", className: "border-status-success text-status-success bg-status-success-bg" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, className: "border-border-default text-text-muted" };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
