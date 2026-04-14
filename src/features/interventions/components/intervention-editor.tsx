import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Intervention, TriggerCondition } from "@/types";
import { INTERVENTION_TYPES } from "@/config/intervention-types";
import { useInterventionStore } from "@/stores/intervention-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_CHANNELS = ["push", "sms", "in_app", "email"] as const;

const CHANNEL_LABELS: Record<string, string> = {
  push: "Push",
  sms: "SMS",
  in_app: "In-App",
  email: "Email",
};

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
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  }

  function handleAddCondition() {
    setConditions((prev) => [...prev, { field: "", operator: "eq", value: "" }]);
  }

  function handleRemoveCondition(idx: number) {
    setConditions((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleConditionChange(idx: number, patch: Partial<TriggerCondition>) {
    setConditions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    );
  }

  function handleSave() {
    updateIntervention(intervention.id, {
      channels,
      triggerConditions: conditions,
      template,
    });
    if (abEnabled !== intervention.abTestEnabled) {
      toggleAbTest(intervention.id);
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{intervention.name}</DialogTitle>
            <Badge
              className={
                intervention.type === "active"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }
            >
              {intervention.type === "active" ? "Active" : "Passive"}
            </Badge>
          </div>
          {typeConfig && (
            <DialogDescription>{typeConfig.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-5">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <Label>Enabled</Label>
            <Switch
              checked={intervention.enabled}
              onCheckedChange={() => toggleIntervention(intervention.id)}
            />
          </div>

          <Separator />

          {/* Channels */}
          <div className="space-y-2">
            <Label>Channels</Label>
            <div className="flex flex-wrap gap-4">
              {ALL_CHANNELS.map((ch) => (
                <label key={ch} className="flex items-center gap-2 text-sm text-text-primary">
                  <Checkbox
                    checked={channels.includes(ch)}
                    onCheckedChange={() => handleChannelToggle(ch)}
                  />
                  {CHANNEL_LABELS[ch]}
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Trigger Conditions */}
          <div className="space-y-2">
            <Label>Trigger Conditions</Label>
            <div className="space-y-2">
              {conditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Field"
                    className="flex-1"
                    value={cond.field}
                    onChange={(e) => handleConditionChange(idx, { field: e.target.value })}
                  />
                  <Select
                    value={cond.operator}
                    onValueChange={(v) =>
                      handleConditionChange(idx, { operator: v as TriggerCondition["operator"] })
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATOR_OPTIONS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    className="flex-1"
                    value={String(cond.value)}
                    onChange={(e) => handleConditionChange(idx, { value: e.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveCondition(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-text-muted" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleAddCondition}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Condition
            </Button>
          </div>

          <Separator />

          {/* Template */}
          <div className="space-y-2">
            <Label>Message Template</Label>
            <Textarea
              rows={3}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </div>

          <Separator />

          {/* A/B Test */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>A/B Testing</Label>
              <Switch
                checked={abEnabled}
                onCheckedChange={(v) => setAbEnabled(v)}
              />
            </div>
            {abEnabled && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Variant A</Label>
                  <Textarea
                    rows={2}
                    value={variantA}
                    onChange={(e) => setVariantA(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Variant B</Label>
                  <Textarea
                    rows={2}
                    value={variantB}
                    onChange={(e) => setVariantB(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
