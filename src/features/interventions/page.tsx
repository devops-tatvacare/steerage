import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Intervention } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useInterventionStore } from "@/stores/intervention-store";
import { InterventionList } from "./components/intervention-list";
import { InterventionEditor } from "./components/intervention-editor";

export function InterventionsPage() {
  const { interventions, isLoading, loadInterventions } = useInterventionStore();
  const [selected, setSelected] = useState<Intervention | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => { loadInterventions(); }, [loadInterventions]);

  const liveSelected = selected ? interventions.find((i) => i.id === selected.id) ?? null : null;

  function handleSelect(intervention: Intervention) {
    setSelected(intervention);
    setEditorOpen(true);
  }

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Interventions" description="Configure member steering interventions" />

      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All ({interventions.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({interventions.filter((i) => i.type === "active").length})</TabsTrigger>
          <TabsTrigger value="passive">Passive ({interventions.filter((i) => i.type === "passive").length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><InterventionList interventions={interventions} onSelect={handleSelect} /></TabsContent>
        <TabsContent value="active"><InterventionList interventions={interventions.filter((i) => i.type === "active")} onSelect={handleSelect} /></TabsContent>
        <TabsContent value="passive"><InterventionList interventions={interventions.filter((i) => i.type === "passive")} onSelect={handleSelect} /></TabsContent>
      </Tabs>

      {liveSelected && (
        <InterventionEditor intervention={liveSelected} open={editorOpen} onClose={() => setEditorOpen(false)} />
      )}
    </div>
  );
}
