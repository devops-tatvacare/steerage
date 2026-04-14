import { PageHeader } from "@/components/shared/page-header";

export function DataOnboardingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Data Onboarding" description="Import member, provider, and claims data" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Data onboarding content loading...</div>
    </div>
  );
}
