import { DashboardCard } from "@/components/shared/dashboard-card";
import { WeightSlider } from "@/components/shared/weight-slider";
import { Switch } from "@/components/ui/switch";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { Users } from "lucide-react";
import { cn } from "@/lib/cn";

export function PatientDimensions() {
  const { patientDimensions, updatePatientWeight, toggleDimension } = useRuleEngineStore();
  const total = patientDimensions.filter((d) => d.enabled).reduce((sum, d) => sum + d.weight, 0);

  return (
    <DashboardCard
      icon={Users}
      title="Patient Scoring Weights"
      badge={<span className={cn(total !== 100 && "text-status-warning")}>{total}%</span>}
      description="How patient context influences provider matching"
    >
      {total !== 100 && (
        <div className="mb-4 rounded-md border border-status-warning-border bg-status-warning-bg px-3 py-2 text-xs text-status-warning">
          Weights must sum to 100%. Currently: {total}%
        </div>
      )}
      <div className="space-y-5">
        {patientDimensions.map((dim) => (
          <div key={dim.id} className="flex items-start gap-3">
            <Switch
              checked={dim.enabled}
              onCheckedChange={() => toggleDimension("patient", dim.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <WeightSlider
                label={dim.name}
                description={dim.description}
                value={dim.weight}
                onChange={(v) => updatePatientWeight(dim.id, v)}
                className={cn(!dim.enabled && "opacity-40 pointer-events-none")}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
