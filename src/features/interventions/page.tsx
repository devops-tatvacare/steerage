import { PageHeader } from "@/components/shared/page-header";

export function InterventionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Interventions" description="Configure member steering interventions" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Interventions content loading...</div>
    </div>
  );
}
