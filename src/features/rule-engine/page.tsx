import { useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { ProviderDimensions } from "./components/provider-dimensions";
import { PatientDimensions } from "./components/patient-dimensions";
import { ConditionProtocols } from "./components/condition-protocols";
import { ThresholdConfig } from "./components/threshold-config";
import { OverrideLogic } from "./components/override-logic";
import { PreauthTriggers } from "./components/preauth-triggers";
import { AiRuleSuggestions } from "./components/ai-rule-suggestions";
import { Loader2, SlidersHorizontal, FileText, AlertTriangle, Stamp, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-muted)] text-text-muted">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
    </div>
  );
}

export function RuleEnginePage() {
  const { loadRuleEngine, isLoading, providerDimensions, patientDimensions, conditionProtocols, thresholds, overrideRules, preauthTriggers } = useRuleEngineStore();
  useEffect(() => { loadRuleEngine(); }, [loadRuleEngine]);

  const summary = useMemo(() => {
    const provTotal = providerDimensions.filter((d) => d.enabled).reduce((s, d) => s + d.weight, 0);
    const patTotal = patientDimensions.filter((d) => d.enabled).reduce((s, d) => s + d.weight, 0);
    const activeProtocols = conditionProtocols.filter((p) => p.enabled).length;
    const activeThresholds = thresholds.filter((t) => t.enabled).length;
    const activeOverrides = overrideRules.filter((r) => r.enabled).length;
    const activeTriggers = preauthTriggers.filter((t) => t.enabled).length;
    return { provTotal, patTotal, activeProtocols, activeThresholds, activeOverrides, activeTriggers };
  }, [providerDimensions, patientDimensions, conditionProtocols, thresholds, overrideRules, preauthTriggers]);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>;

  const provHealthy = summary.provTotal === 100;
  const patHealthy = summary.patTotal === 100;

  return (
    <div className="space-y-6">
      <PageHeader title="Rule Engine" description="Configure how members are steered to providers" />

      {/* Config summary strip */}
      <Card variant="elevated" density="flush" className="overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border-subtle sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Provider Weights", value: `${summary.provTotal}%`, ok: provHealthy },
            { label: "Patient Weights", value: `${summary.patTotal}%`, ok: patHealthy },
            { label: "Condition Protocols", value: String(summary.activeProtocols), ok: true },
            { label: "Thresholds", value: String(summary.activeThresholds), ok: true },
            { label: "Override Rules", value: String(summary.activeOverrides), ok: true },
            { label: "Pre-Auth Triggers", value: String(summary.activeTriggers), ok: true },
          ].map((item) => (
            <div key={item.label} className="px-4 py-3 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">{item.label}</p>
              <p className={cn("mt-1 text-lg font-bold", item.ok ? "text-text-primary" : "text-status-warning")}>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 1: Scoring weights */}
      <div className="space-y-4">
        <SectionHeader icon={SlidersHorizontal} title="Step 1: Scoring Weights" description="Define how providers and patients are scored to determine steerage recommendations" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ProviderDimensions />
          <PatientDimensions />
        </div>
      </div>

      <Separator />

      {/* Section 2: Condition protocols */}
      <div className="space-y-4">
        <SectionHeader icon={FileText} title="Step 2: Condition-Specific Rules" description="Override default scoring for specific medical conditions" />
        <ConditionProtocols />
      </div>

      <Separator />

      {/* Section 3: Thresholds & overrides */}
      <div className="space-y-4">
        <SectionHeader icon={AlertTriangle} title="Step 3: Thresholds & Behavioral Rules" description="Set cost alert thresholds and configure how the system responds to member behavior" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ThresholdConfig />
          <OverrideLogic />
        </div>
      </div>

      <Separator />

      {/* Section 4: Pre-auth triggers */}
      <div className="space-y-4">
        <SectionHeader icon={Stamp} title="Step 4: Pre-Authorisation Triggers" description="Auto-initiate guarantee letters when specific procedures or providers are selected" />
        <PreauthTriggers />
      </div>

      <Separator />

      {/* Section 5: AI suggestions */}
      <div className="space-y-4">
        <SectionHeader icon={Sparkles} title="AI-Powered Optimisation" description="Gemini analyses your KPI trends and suggests scoring weight adjustments" />
        <AiRuleSuggestions />
      </div>
    </div>
  );
}
