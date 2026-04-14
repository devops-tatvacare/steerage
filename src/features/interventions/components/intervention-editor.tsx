import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Intervention, TriggerCondition } from "@/types";
import { INTERVENTION_TYPES } from "@/config/intervention-types";
import { useInterventionStore } from "@/stores/intervention-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PreviewPanel } from "./preview-panel";

const ALL_CHANNELS = ["push", "sms", "in_app", "email"] as const;
const CHANNEL_LABELS: Record<string, string> = { push: "Push", sms: "SMS", in_app: "In-App", email: "Email" };
const OPERATOR_OPTIONS: { value: TriggerCondition["operator"]; label: string }[] = [
  { value: "eq", label: "=" },
  { value: "neq", label: "!=" },
  { value: "gt", label: ">" },
  { value: "lt", label: "<" },
  { value: "gte", label: ">=" },
  { value: "lte", label: "<=" },
  { value: "contains", label: "contains" },
];

interface InterventionEditorProps {
  intervention: Intervention;
  open: boolean;
  onClose: () => void;
}

export function InterventionEditor({ intervention, open, onClose }: InterventionEditorProps) {
  const updateIntervention = useInterventionStore((s) => s.updateIntervention);
  const toggleAbTest = useInterventionStore((s) => s.toggleAbTest);
  const toggleIntervention = useInterventionStore((s) => s.toggleIntervention);

  const [channels, setChannels] = useState<Intervention["channels"]>(intervention.channels);
  const [conditions, setConditions] = useState<TriggerCondition[]>(intervention.triggerConditions);
  const [template, setTemplate] = useState(intervention.template);
  const [abEnabled, setAbEnabled] = useState(intervention.abTestEnabled);
  const [variantA, setVariantA] = useState(intervention.template);
  const [variantB, setVariantB] = useState("");

  const typeConfig = INTERVENTION_TYPES.find((t) => t.key === intervention.subtype);

  function handleChannelToggle(ch: (typeof ALL_CHANNELS)[number]) {
    setChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]);
  }
  function handleAddCondition() {
    setConditions((prev) => [...prev, { field: "", operator: "eq", value: "" }]);
  }
  function handleRemoveCondition(idx: number) {
    setConditions((prev) => prev.filter((_, i) => i !== idx));
  }
  function handleConditionChange(idx: number, patch: Partial<TriggerCondition>) {
    setConditions((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }
  function handleSave() {
    updateIntervention(intervention.id, { channels, triggerConditions: conditions, template });
    if (abEnabled !== intervention.abTestEnabled) toggleAbTest(intervention.id);
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="shrink-0 border-b border-border-default px-6 py-4">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base">{intervention.name}</SheetTitle>
            <Badge variant="outline" className={intervention.type === "active" ? "border-status-info text-status-info" : "border-status-success text-status-success"}>
              {intervention.type}
            </Badge>
          </div>
          {typeConfig && <SheetDescription>{typeConfig.description}</SheetDescription>}
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto lg:flex-row">
          {/* Left: config */}
          <div className="flex-1 space-y-4 p-6">
            <div className="flex items-center justify-between">
              <Label>Enabled</Label>
              <Switch checked={intervention.enabled} onCheckedChange={() => toggleIntervention(intervention.id)} />
            </div>
            <Separator />

            <div className="space-y-2">
              <Label>Channels</Label>
              <div className="flex flex-wrap gap-4">
                {ALL_CHANNELS.map((ch) => (
                  <label key={ch} className="flex items-center gap-2 text-sm text-text-primary">
                    <Checkbox checked={channels.includes(ch)} onCheckedChange={() => handleChannelToggle(ch)} />
                    {CHANNEL_LABELS[ch]}
                  </label>
                ))}
              </div>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label>Trigger Conditions</Label>
              <div className="space-y-2">
                {conditions.map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input placeholder="Field" className="flex-1" value={cond.field} onChange={(e) => handleConditionChange(idx, { field: e.target.value })} />
                    <Select value={cond.operator} onValueChange={(v) => handleConditionChange(idx, { operator: v as TriggerCondition["operator"] })}>
                      <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OPERATOR_OPTIONS.map((op) => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Value" className="flex-1" value={String(cond.value)} onChange={(e) => handleConditionChange(idx, { value: e.target.value })} />
                    <Button variant="ghost" size="icon-xs" onClick={() => handleRemoveCondition(idx)}><Trash2 className="h-3.5 w-3.5 text-text-muted" /></Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleAddCondition}><Plus className="mr-1 h-3.5 w-3.5" />Add Condition</Button>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label>Message Template</Label>
              <Textarea rows={3} value={template} onChange={(e) => setTemplate(e.target.value)} />
            </div>
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>A/B Testing</Label>
                <Switch checked={abEnabled} onCheckedChange={(v) => setAbEnabled(v)} />
              </div>
              {abEnabled && (
                <div className="space-y-3">
                  <div className="space-y-1"><Label>Variant A</Label><Textarea rows={2} value={variantA} onChange={(e) => setVariantA(e.target.value)} /></div>
                  <div className="space-y-1"><Label>Variant B</Label><Textarea rows={2} value={variantB} onChange={(e) => setVariantB(e.target.value)} /></div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>

          {/* Right: live preview */}
          <div className="shrink-0 border-t border-border-default bg-[color:var(--color-surface-subtle)] p-6 lg:w-[340px] lg:border-l lg:border-t-0">
            <PreviewPanel intervention={intervention} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
