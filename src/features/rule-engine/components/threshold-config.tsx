import { useState } from "react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRuleEngineStore } from "@/stores/rule-engine-store";
import { AlertTriangle, Plus } from "lucide-react";
import type { ThresholdAlert } from "@/types";

const OPERATOR_LABELS: Record<string, string> = {
  gt: ">",
  lt: "<",
  gte: ">=",
  lte: "<=",
};

const METRIC_LABELS: Record<string, string> = {
  episode_cost: "Episode Cost",
  annual_spend: "Annual Spend",
  override_count: "Override Count",
};

const ACTION_LABELS: Record<string, string> = {
  notify: "Notify",
  escalate: "Escalate",
  auto_trigger: "Auto-Trigger",
};

export function ThresholdConfig() {
  const { thresholds, addThreshold, updateThreshold } = useRuleEngineStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    metric: "",
    operator: "" as ThresholdAlert["operator"] | "",
    value: "",
    action: "" as ThresholdAlert["action"] | "",
    escalateTo: "",
    enabled: true,
  });

  function handleAdd() {
    if (!form.metric || !form.operator || !form.action) return;
    const threshold: ThresholdAlert = {
      id: `t-${Date.now()}`,
      name: form.name,
      metric: form.metric,
      operator: form.operator as ThresholdAlert["operator"],
      value: Number(form.value),
      action: form.action as ThresholdAlert["action"],
      escalateTo: form.escalateTo,
      enabled: form.enabled,
    };
    addThreshold(threshold);
    setForm({ name: "", metric: "", operator: "", value: "", action: "", escalateTo: "", enabled: true });
    setOpen(false);
  }

  return (
    <DashboardCard
      icon={AlertTriangle}
      title="Threshold Alerts"
      badge={<span>{thresholds.length} rules</span>}
      description="Trigger actions when metrics cross thresholds"
      actions={
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Threshold
        </Button>
      }
    >
      {thresholds.length === 0 ? (
        <p className="text-center text-sm text-text-muted py-6">No thresholds configured.</p>
      ) : (
        <div className="space-y-3">
          {thresholds.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border-default px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted">
                  {METRIC_LABELS[t.metric] ?? t.metric}{" "}
                  {OPERATOR_LABELS[t.operator] ?? t.operator} {t.value.toLocaleString()}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {ACTION_LABELS[t.action] ?? t.action}
              </Badge>
              <Switch
                checked={t.enabled}
                onCheckedChange={(checked) => updateThreshold(t.id, { enabled: checked === true })}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Threshold Alert</DialogTitle>
            <DialogDescription>
              Create a rule that triggers when a metric crosses a threshold.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. High Episode Cost"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Metric</Label>
                <Select value={form.metric} onValueChange={(v) => setForm((f) => ({ ...f, metric: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="episode_cost">Episode Cost</SelectItem>
                    <SelectItem value="annual_spend">Annual Spend</SelectItem>
                    <SelectItem value="override_count">Override Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select value={form.operator} onValueChange={(v) => setForm((f) => ({ ...f, operator: v as ThresholdAlert["operator"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Op" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt">&gt;</SelectItem>
                    <SelectItem value="lt">&lt;</SelectItem>
                    <SelectItem value="gte">&gt;=</SelectItem>
                    <SelectItem value="lte">&lt;=</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={form.action} onValueChange={(v) => setForm((f) => ({ ...f, action: v as ThresholdAlert["action"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notify">Notify</SelectItem>
                    <SelectItem value="escalate">Escalate</SelectItem>
                    <SelectItem value="auto_trigger">Auto-Trigger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Escalate To</Label>
                <Input
                  placeholder="e.g. care_navigator"
                  value={form.escalateTo}
                  onChange={(e) => setForm((f) => ({ ...f, escalateTo: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.enabled}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, enabled: checked === true }))}
              />
              <Label>Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.name || !form.metric || !form.operator || !form.value || !form.action}
            >
              Add Threshold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}
