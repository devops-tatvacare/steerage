import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { ProviderDimensions } from "./components/provider-dimensions";
import { PatientDimensions } from "./components/patient-dimensions";
import { ConditionProtocols } from "./components/condition-protocols";
import { ThresholdConfig } from "./components/threshold-config";
import { OverrideLogic } from "./components/override-logic";
import { PreauthTriggers } from "./components/preauth-triggers";
import { AiRuleSuggestions } from "./components/ai-rule-suggestions";
import { Loader2 } from "lucide-react";

export function RuleEnginePage() {
  const { loadRuleEngine, isLoading } = useRuleEngineStore();
  useEffect(() => { loadRuleEngine(); }, [loadRuleEngine]);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Rule Engine" description="Configure steerage scoring and protocols" />
      <Tabs defaultValue="weights">
        <TabsList variant="line">
          <TabsTrigger value="weights">Scoring Weights</TabsTrigger>
          <TabsTrigger value="protocols">Condition Protocols</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds & Overrides</TabsTrigger>
          <TabsTrigger value="preauth">Pre-Auth</TabsTrigger>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="weights">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ProviderDimensions />
            <PatientDimensions />
          </div>
        </TabsContent>
        <TabsContent value="protocols"><ConditionProtocols /></TabsContent>
        <TabsContent value="thresholds">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ThresholdConfig />
            <OverrideLogic />
          </div>
        </TabsContent>
        <TabsContent value="preauth"><PreauthTriggers /></TabsContent>
        <TabsContent value="ai"><AiRuleSuggestions /></TabsContent>
      </Tabs>
    </div>
  );
}
