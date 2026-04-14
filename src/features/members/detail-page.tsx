import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMemberStore } from "@/stores/member-store";
import { MemberDetailHeader } from "./components/member-detail-header";
import { SteerageTimeline } from "./components/steerage-timeline";
import { OverrideLog } from "./components/override-log";
import { ArrowLeft, Loader2 } from "lucide-react";

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { members, loadMembers, isLoading, getMemberEvents, getMemberExclusions } = useMemberStore();

  useEffect(() => {
    if (members.length === 0) loadMembers();
  }, [members.length, loadMembers]);

  const member = members.find((m) => m.id === id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  if (!member) {
    return <div className="p-8 text-center text-text-muted">Member not found</div>;
  }

  const events = getMemberEvents(member.id);
  const exclusions = getMemberExclusions(member.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/members">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={member.name}
          description={`${member.planType} | ${member.careJourneyStage.replace(/_/g, " ")}`}
        />
      </div>

      <MemberDetailHeader member={member} />

      <Tabs defaultValue="timeline">
        <TabsList variant="line">
          <TabsTrigger value="timeline">Steerage Timeline ({events.length})</TabsTrigger>
          <TabsTrigger value="overrides">
            Override Log ({events.filter((e) => e.type === "override").length})
          </TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions ({exclusions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <SteerageTimeline events={events} />
        </TabsContent>

        <TabsContent value="overrides">
          <OverrideLog events={events.filter((e) => e.type === "override")} />
        </TabsContent>

        <TabsContent value="exclusions">
          <div className="space-y-2">
            {exclusions.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">No exclusions</p>
            ) : (
              exclusions.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between rounded-lg border border-border-default bg-bg-primary px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {ex.providerName || ex.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-text-muted">{ex.reason}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px]">
                      {ex.type.replace(/_/g, " ")}
                    </Badge>
                    {ex.expiresAt && (
                      <p className="mt-1 text-[10px] text-text-muted">
                        Expires: {new Date(ex.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
