import { PageHeader } from "@/components/shared/page-header";

export function RuleEnginePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Rule Engine" description="Configure steerage scoring and protocols" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Rule engine content loading...</div>
    </div>
  );
}
