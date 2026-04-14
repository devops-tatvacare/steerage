import { DashboardCard } from "@/components/shared/dashboard-card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
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

export function AiRuleSuggestions() {
  return (
    <DashboardCard
      variant="ai"
      icon={Sparkles}
      title="AI-Generated Suggestions"
      description="Recommendations based on historical steerage patterns (Gemini wiring pending)"
    >
      <div className="space-y-3">
        {SUGGESTIONS.map((s) => (
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
