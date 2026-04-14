import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useMemberStore } from "@/stores/member-store";
import { MemberFilters } from "./components/member-filters";
import { MemberTable } from "./components/member-table";
import { Loader2 } from "lucide-react";

export function MembersPage() {
  const { loadMembers, isLoading } = useMemberStore();
  useEffect(() => { loadMembers(); }, [loadMembers]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Members" description="Member steerage activity and profiles" />
      <MemberFilters />
      <MemberTable />
    </div>
  );
}
