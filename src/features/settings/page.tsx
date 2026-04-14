import { PageHeader } from "@/components/shared/page-header";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Exclusions, overrides, notifications, and plans" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Settings content loading...</div>
    </div>
  );
}
