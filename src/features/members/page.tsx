import { PageHeader } from "@/components/shared/page-header";

export function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Members" description="Member steerage activity and profiles" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Members content loading...</div>
    </div>
  );
}
