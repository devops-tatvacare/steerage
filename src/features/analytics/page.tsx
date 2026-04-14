import { PageHeader } from "@/components/shared/page-header";

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="KPI deep dives and feedback loops" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Analytics content loading...</div>
    </div>
  );
}
