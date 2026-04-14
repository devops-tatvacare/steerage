import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { KPI_DEFINITIONS } from "@/config/kpi-definitions";
import { KpiDeepDive } from "./components/kpi-deep-dive";
import { CtaTriggerLog } from "./components/cta-trigger-log";
import { FeedbackLoopViz } from "./components/feedback-loop-viz";
import { Loader2 } from "lucide-react";

export function AnalyticsPage() {
  const { loadAnalytics, kpis, isLoading } = useAnalyticsStore();
  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="KPI deep dives and feedback loops" />
      <Tabs defaultValue="acceptance_rate">
        <TabsList variant="line">
          {KPI_DEFINITIONS.map((def) => (
            <TabsTrigger key={def.type} value={def.type}>{def.shortName}</TabsTrigger>
          ))}
          <TabsTrigger value="cta_log">CTA Log</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Loop</TabsTrigger>
        </TabsList>
        {KPI_DEFINITIONS.map((def) => {
          const kpi = kpis.find((k) => k.kpiType === def.type);
          return (
            <TabsContent key={def.type} value={def.type}>
              {kpi ? <KpiDeepDive kpi={kpi} /> : <p className="text-sm text-text-muted">No data</p>}
            </TabsContent>
          );
        })}
        <TabsContent value="cta_log"><CtaTriggerLog /></TabsContent>
        <TabsContent value="feedback"><FeedbackLoopViz /></TabsContent>
      </Tabs>
    </div>
  );
}
