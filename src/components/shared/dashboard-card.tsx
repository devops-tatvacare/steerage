import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

interface DashboardCardProps {
  icon?: React.ElementType;
  title: string;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "ai";
  showSeparator?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function DashboardCard({ icon: Icon, title, description, badge, actions, variant = "default", showSeparator = true, className, contentClassName, children }: DashboardCardProps) {
  const isAi = variant === "ai";
  return (
    <Card variant={isAi ? "ai" : "elevated"} density="flush" className={cn("overflow-hidden", className)}>
      <CardHeader className="px-[var(--space-panel-padding)] py-[var(--space-panel-padding)]">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", isAi ? "border-ai-border bg-[color:var(--color-surface-ai)] text-ai-primary" : "border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-muted)] text-text-muted")}>
              <Icon className="h-4 w-4 shrink-0" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-[13px] font-semibold tracking-[0.01em] text-text-primary">{title}</CardTitle>
            {description && <p className="text-xs text-text-muted">{description}</p>}
          </div>
          {(badge != null || actions) && (
            <div className="flex shrink-0 items-center gap-2">
              {badge != null && <Badge variant="secondary" className="text-[11px]">{badge}</Badge>}
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      {showSeparator && <Separator />}
      <CardContent className={cn("px-[var(--space-panel-padding)] py-[var(--space-panel-padding)]", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
