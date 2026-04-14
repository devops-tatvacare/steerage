import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProviderStore } from "@/stores/provider-store";
import { ProviderTable } from "./components/provider-table";
import { ProviderScorecard } from "./components/provider-scorecard";
import { TierManagement } from "./components/tier-management";
import { GapAnalysis } from "./components/gap-analysis";
import { Loader2 } from "lucide-react";

export function ProviderNetworkPage() {
  const { loadProviders, isLoading } = useProviderStore();
  useEffect(() => { loadProviders(); }, [loadProviders]);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Network" description="Manage provider panels and tiers" />
      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All Providers</TabsTrigger>
          <TabsTrigger value="tiers">Tier Management</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><ProviderTable /></TabsContent>
        <TabsContent value="tiers"><TierManagement /></TabsContent>
        <TabsContent value="gaps"><GapAnalysis /></TabsContent>
      </Tabs>
      <ProviderScorecard />
    </div>
  );
}
