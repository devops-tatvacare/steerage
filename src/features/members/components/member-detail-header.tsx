import type { Member } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

const RISK_COLORS: Record<Member["riskTier"], string> = {
  low: "border-status-success text-status-success bg-status-success-bg",
  moderate: "border-status-info text-status-info bg-status-info-bg",
  high: "border-status-warning text-status-warning bg-status-warning-bg",
  critical: "border-status-error text-status-error bg-status-error-bg",
};

interface MemberDetailHeaderProps {
  member: Member;
}

function MiniKpi({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("px-4 py-3", className)}>
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-text-primary">{value}</p>
    </Card>
  );
}

export function MemberDetailHeader({ member }: MemberDetailHeaderProps) {
  const benefitsPct = member.benefitsTotal > 0 ? Math.round((member.benefitsUsed / member.benefitsTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Identity row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xl font-bold text-text-primary">{member.name}</span>
        <span className="text-sm text-text-muted">
          {member.age}y, {member.gender}
        </span>
        <Badge variant="outline" className="text-[10px]">
          {member.planType}
        </Badge>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKpi
          label="Risk Tier"
          value={
            <Badge variant="outline" className={cn("text-xs capitalize", RISK_COLORS[member.riskTier])}>
              {member.riskTier}
            </Badge>
          }
        />
        <MiniKpi label="Steerage Score" value={member.steerageScore} />
        <MiniKpi
          label="Overrides"
          value={<span className={cn(member.overrideCount > 0 && "text-status-error")}>{member.overrideCount}</span>}
        />
        <MiniKpi label="Fragmentation" value={member.fragmentationScore.toFixed(2)} />
      </div>

      {/* Conditions + care stage */}
      <div className="flex flex-wrap items-center gap-2">
        {member.conditions.map((c) => (
          <Badge key={c} variant="secondary" className="text-[10px] capitalize">
            {c}
          </Badge>
        ))}
        <Badge variant="outline" className="text-[10px] capitalize">
          {member.careJourneyStage.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Benefits usage */}
      <div className="max-w-xs space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Benefits usage</span>
          <span className="font-medium text-text-primary">
            {member.benefitsUsed} of {member.benefitsTotal} used
          </span>
        </div>
        <Progress value={benefitsPct} className="h-1.5" />
      </div>
    </div>
  );
}
