import { DashboardCard } from "@/components/shared/dashboard-card";
import { WeightSlider } from "@/components/shared/weight-slider";
import { Switch } from "@/components/ui/switch";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ProviderDimensions() {
  const { providerDimensions, updateProviderWeight, toggleDimension } = useRuleEngineStore();
  const total = providerDimensions.filter((d) => d.enabled).reduce((sum, d) => sum + d.weight, 0);

  return (
    <DashboardCard
      icon={Building2}
      title="Provider Scoring Weights"
      badge={<span className={cn(total !== 100 && "text-status-warning")}>{total}%</span>}
      description="How providers are scored for recommendations"
    >
      {total !== 100 && (
        <div className="mb-4 rounded-md border border-status-warning-border bg-status-warning-bg px-3 py-2 text-xs text-status-warning">
          Weights must sum to 100%. Currently: {total}%
        </div>
      )}
      <div className="space-y-5">
        {providerDimensions.map((dim) => (
          <div key={dim.id} className="flex items-start gap-3">
            <Switch
              checked={dim.enabled}
              onCheckedChange={() => toggleDimension("provider", dim.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <WeightSlider
                label={dim.name}
                description={dim.description}
                value={dim.weight}
                onChange={(v) => updateProviderWeight(dim.id, v)}
                className={cn(!dim.enabled && "opacity-40 pointer-events-none")}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
