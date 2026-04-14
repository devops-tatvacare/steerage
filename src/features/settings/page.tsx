import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSettingsStore } from "@/stores/settings-store";
import { ExclusionManagement } from "./components/exclusion-management";
import { OverrideRules } from "./components/override-rules";
import { NotificationConfig } from "./components/notification-config";
import { PlanConfig } from "./components/plan-config";
import { Loader2 } from "lucide-react";

export function SettingsPage() {
  const { loadSettings, isLoading } = useSettingsStore();
  useEffect(() => { loadSettings(); }, [loadSettings]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Exclusions, overrides, notifications, and plans" />
      <Tabs defaultValue="exclusions">
        <TabsList variant="line">
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          <TabsTrigger value="overrides">Override Rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="exclusions"><ExclusionManagement /></TabsContent>
        <TabsContent value="overrides"><OverrideRules /></TabsContent>
        <TabsContent value="notifications"><NotificationConfig /></TabsContent>
        <TabsContent value="plans"><PlanConfig /></TabsContent>
      </Tabs>
    </div>
  );
}
