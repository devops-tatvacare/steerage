import { PageHeader } from "@/components/shared/page-header";

export function MemberDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Member Detail" description="Individual member steerage profile" />
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">Member detail loading...</div>
    </div>
  );
}
