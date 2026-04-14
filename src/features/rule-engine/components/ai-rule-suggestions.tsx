import { useState } from "react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generateRuleSuggestions } from "@/lib/gemini";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { useDashboardStore } from "@/stores/dashboard-store";

const FALLBACK_SUGGESTIONS = [
  {
    id: "s1",
    text: "Increase Access & Turnaround weight from 15% to 25% for cardiology searches",
    impact: "Faster appointments for cardiac patients",
  },
  {
    id: "s2",
    text: "Reduce Network Tier weight from 5% to 3% and redistribute to Cost",
    impact: "Better cost optimization without losing network value",
  },
  {
    id: "s3",
    text: "Add condition-specific override: for DM+HTN comorbidity, force minimum Clinical Quality weight of 40%",
    impact: "Improved outcomes for high-risk comorbid patients",
  },
  {
    id: "s4",
    text: "Increase Patient Experience weight by 5% for dermatology",
    impact: "Higher satisfaction for elective-adjacent specialties",
  },
];

interface Suggestion {
  id: string;
  text: string;
  impact: string;
}

function parseSuggestionsFromLines(lines: string[]): Suggestion[] {
  return lines.map((line, i) => ({
    id: `ai-${i}`,
    text: line.replace(/^\d+[\.\)]\s*/, ""),
    impact: "AI-generated suggestion",
  }));
}

export function AiRuleSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(FALLBACK_SUGGESTIONS);
  const [loading, setLoading] = useState(false);
  const providerDimensions = useRuleEngineStore((s) => s.providerDimensions);
  const patientDimensions = useRuleEngineStore((s) => s.patientDimensions);
  const kpis = useDashboardStore((s) => s.kpis);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const allDimensions = [...providerDimensions, ...patientDimensions];
      const weightsStr = allDimensions
        .filter((d) => d.enabled)
        .map((d) => `${d.name} (${d.category}): ${d.weight}%`)
        .join("\n");

      const kpiTrendsStr = kpis
        .map((k) => `${k.kpiType}: ${k.value} (trend: ${k.trend > 0 ? "+" : ""}${k.trend}%)`)
        .join("\n");

      const lines = await generateRuleSuggestions(
        weightsStr || "No weight data available",
        kpiTrendsStr || "No KPI trend data available",
      );
      setSuggestions(parseSuggestionsFromLines(lines));
    } catch {
      setSuggestions(FALLBACK_SUGGESTIONS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard
      variant="ai"
      icon={Sparkles}
      title="AI-Generated Suggestions"
      description="Recommendations based on historical steerage patterns"
      actions={
        <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          )}
          Generate
        </Button>
      }
    >
      <div className="space-y-3">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between gap-3 rounded-md border border-ai-border bg-[color:var(--color-surface-ai)] px-3 py-3"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm text-text-primary">{s.text}</p>
              <p className="text-xs text-text-muted">Impact: {s.impact}</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0">
              Apply
            </Button>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
