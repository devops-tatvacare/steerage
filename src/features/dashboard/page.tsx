import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/stores/dashboard-store";
import { KpiStrip } from "./components/kpi-strip";
import { AlertsTable } from "./components/alerts-table";
import { AiInsightsPanel } from "./components/ai-insights-panel";
import { ActivityFeed } from "./components/activity-feed";
import { SteerageTrends } from "./components/steerage-trends";
import { RoiSummary } from "./components/roi-summary";
import { CohortMatrix } from "./components/cohort-matrix";
import { SteerageReadiness } from "./components/steerage-readiness";
import { Loader2 } from "lucide-react";

export function DashboardPage() {
  const { loadDashboard, kpis, isLoading, period, setPeriod } = useDashboardStore();

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Command Center"
        description="Steerage performance overview"
        actions={
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "30d" | "60d" | "90d")}>
            <TabsList>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="60d">60d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {/* Row 1: KPIs */}
      <KpiStrip kpis={kpis} />

      {/* Row 2: Expert concepts -- 3 equal columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RoiSummary />
        <CohortMatrix />
        <SteerageReadiness />
      </div>

      {/* Row 3: Trends + AI insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SteerageTrends kpis={kpis} />
        </div>
        <div className="lg:col-span-2">
          <AiInsightsPanel />
        </div>
      </div>

      {/* Row 4: Alerts + Activity -- equal columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AlertsTable />
        <ActivityFeed />
      </div>
    </div>
  );
}
