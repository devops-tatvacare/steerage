import { useState } from "react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { generateInsights } from "@/lib/gemini";
import { useDashboardStore } from "@/stores/dashboard-store";

const FALLBACK_INSIGHTS = [
  "Acceptance rate for cardiology has increased 12% since adjusting Access weight from 15% to 30%",
  "Leakage in Petaling Jaya is driven by 3 GP clinics routing to non-panel cardiologists",
  "Virtual-first prompt is underperforming at 18% engagement -- consider testing pre-search placement",
  "67% of fragmented chronic care members carry both DM and HTN -- consolidated programme opportunity",
];

export function AiInsightsPanel() {
  const [insights, setInsights] = useState(FALLBACK_INSIGHTS);
  const [loading, setLoading] = useState(false);
  const kpis = useDashboardStore((s) => s.kpis);

  const refresh = async () => {
    setLoading(true);
    try {
      const serialized = kpis
        .map((k) => `${k.kpiType}: ${k.value} (target: ${k.target}, trend: ${k.trend > 0 ? "+" : ""}${k.trend}%)`)
        .join("\n");
      const results = await generateInsights(serialized || "No KPI data available");
      setInsights(results);
    } catch {
      setInsights(FALLBACK_INSIGHTS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard
      icon={Sparkles}
      title="AI Insights"
      description="Gemini-powered analysis of steerage patterns"
      variant="ai"
      actions={
        <Button variant="ghost" size="icon-xs" onClick={refresh} disabled={loading}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        </Button>
      }
    >
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-2.5 text-xs text-text-secondary leading-relaxed">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[9px] font-bold text-primary-foreground">{i + 1}</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
