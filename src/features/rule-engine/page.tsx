import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { ProviderDimensions } from "./components/provider-dimensions";
import { PatientDimensions } from "./components/patient-dimensions";
import { ConditionProtocols } from "./components/condition-protocols";
import { ThresholdConfig } from "./components/threshold-config";
import { OverrideLogic } from "./components/override-logic";
import { PreauthTriggers } from "./components/preauth-triggers";
import { AiRuleSuggestions } from "./components/ai-rule-suggestions";
import { Button } from "@/components/ui/button";
import { Loader2, SlidersHorizontal, FileText, AlertTriangle, Stamp, Sparkles, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  { id: "weights", label: "Scoring Weights", icon: SlidersHorizontal, description: "How providers and patients are scored" },
  { id: "protocols", label: "Condition Rules", icon: FileText, description: "Condition-specific overrides" },
  { id: "thresholds", label: "Thresholds & Behavior", icon: AlertTriangle, description: "Cost alerts and override logic" },
  { id: "preauth", label: "Pre-Authorisation", icon: Stamp, description: "Auto-GL trigger rules" },
  { id: "ai", label: "AI Optimisation", icon: Sparkles, description: "Gemini-powered suggestions" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function RuleEnginePage() {
  const { loadRuleEngine, isLoading, providerDimensions, patientDimensions, conditionProtocols, thresholds, overrideRules, preauthTriggers } = useRuleEngineStore();
  const [activeStep, setActiveStep] = useState<StepId>("weights");

  useEffect(() => { loadRuleEngine(); }, [loadRuleEngine]);

  const summary = useMemo(() => {
    const provTotal = providerDimensions.filter((d) => d.enabled).reduce((s, d) => s + d.weight, 0);
    const patTotal = patientDimensions.filter((d) => d.enabled).reduce((s, d) => s + d.weight, 0);
    return {
      provTotal,
      patTotal,
      provOk: provTotal === 100,
      patOk: patTotal === 100,
      protocols: conditionProtocols.filter((p) => p.enabled).length,
      thresholds: thresholds.filter((t) => t.enabled).length,
      overrides: overrideRules.filter((r) => r.enabled).length,
      triggers: preauthTriggers.filter((t) => t.enabled).length,
    };
  }, [providerDimensions, patientDimensions, conditionProtocols, thresholds, overrideRules, preauthTriggers]);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>;

  const activeIdx = STEPS.findIndex((s) => s.id === activeStep);
  const hasPrev = activeIdx > 0;
  const hasNext = activeIdx < STEPS.length - 1;

  // Check if a step has been "configured" (has active items)
  function stepComplete(id: StepId): boolean {
    switch (id) {
      case "weights": return summary.provOk && summary.patOk;
      case "protocols": return summary.protocols > 0;
      case "thresholds": return summary.thresholds > 0 || summary.overrides > 0;
      case "preauth": return summary.triggers > 0;
      case "ai": return false;
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Rule Engine" description="Configure how members are steered to providers" />

      {/* Stepper rail */}
      <Card variant="elevated" density="flush" className="overflow-hidden px-6 py-4">
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const isActive = step.id === activeStep;
            const isDone = stepComplete(step.id);
            const isPast = STEPS.findIndex((s) => s.id === activeStep) > i;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                {/* Step node */}
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={cn("group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors", isActive ? "bg-brand-primary-light" : "hover:bg-bg-hover")}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isActive ? "bg-brand-primary text-primary-foreground"
                      : isDone ? "bg-status-success text-white"
                      : "border border-border-default bg-bg-primary text-text-muted",
                  )}>
                    {isDone && !isActive ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <div className="hidden text-left lg:block">
                    <p className={cn("text-xs font-semibold", isActive ? "text-brand-primary" : "text-text-primary")}>{step.label}</p>
                    <p className="text-[10px] text-text-muted">{step.description}</p>
                  </div>
                </button>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className={cn("mx-1 h-px flex-1", isPast || isActive ? "bg-brand-primary" : "bg-border-default")} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step content */}
      <div>
        {activeStep === "weights" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ProviderDimensions />
            <PatientDimensions />
          </div>
        )}
        {activeStep === "protocols" && <ConditionProtocols />}
        {activeStep === "thresholds" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ThresholdConfig />
            <OverrideLogic />
          </div>
        )}
        {activeStep === "preauth" && <PreauthTriggers />}
        {activeStep === "ai" && <AiRuleSuggestions />}
      </div>

      {/* Prev / Next nav */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={!hasPrev} onClick={() => setActiveStep(STEPS[activeIdx - 1].id)}>
          <ChevronLeft className="h-4 w-4" />
          {hasPrev && STEPS[activeIdx - 1].label}
        </Button>
        <p className="text-xs text-text-muted">Step {activeIdx + 1} of {STEPS.length}</p>
        <Button variant={hasNext ? "default" : "outline"} size="sm" disabled={!hasNext} onClick={() => setActiveStep(STEPS[activeIdx + 1].id)}>
          {hasNext && STEPS[activeIdx + 1].label}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
