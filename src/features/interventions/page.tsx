import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Intervention } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useInterventionStore } from "@/stores/intervention-store";
import { InterventionList } from "./components/intervention-list";
import { InterventionEditor } from "./components/intervention-editor";
import { PreviewPanel } from "./components/preview-panel";

export function InterventionsPage() {
  const { interventions, isLoading, loadInterventions } = useInterventionStore();
  const [selected, setSelected] = useState<Intervention | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  // Keep selected in sync with store updates
  const liveSelected = selected
    ? interventions.find((i) => i.id === selected.id) ?? null
    : null;

  function handleSelect(intervention: Intervention) {
    setSelected(intervention);
    setEditorOpen(true);
  }

  function handleEditorClose() {
    setEditorOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  const activeInterventions = interventions.filter((i) => i.type === "active");
  const passiveInterventions = interventions.filter((i) => i.type === "passive");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interventions"
        description="Configure member steering interventions"
      />

      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active Interventions</TabsTrigger>
          <TabsTrigger value="passive">Passive Interventions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InterventionList interventions={interventions} onSelect={handleSelect} />
            </div>
            <div className="hidden lg:block">
              <PreviewPanel intervention={liveSelected} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InterventionList interventions={activeInterventions} onSelect={handleSelect} />
            </div>
            <div className="hidden lg:block">
              <PreviewPanel intervention={liveSelected} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passive">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InterventionList interventions={passiveInterventions} onSelect={handleSelect} />
            </div>
            <div className="hidden lg:block">
              <PreviewPanel intervention={liveSelected} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {liveSelected && (
        <InterventionEditor
          intervention={liveSelected}
          open={editorOpen}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}
