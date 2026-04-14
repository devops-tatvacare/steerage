import { PageHeader } from "@/components/shared/page-header";

export function ProviderNetworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Provider Network" description="Manage provider panels and tiers" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Provider network content loading...</div>
    </div>
  );
}
