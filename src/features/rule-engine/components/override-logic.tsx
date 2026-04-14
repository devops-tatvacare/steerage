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
import { ShieldOff, Plus } from "lucide-react";
import type { OverrideRule } from "@/types";

const SCOPE_LABELS: Record<string, string> = {
  global: "Global",
  provider: "Provider",
  specialty: "Specialty",
};

export function OverrideLogic() {
  const { overrideRules, addOverrideRule, updateOverrideRule } = useRuleEngineStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    maxDismissals: "3",
    cooldownDays: "7",
    scope: "" as OverrideRule["scope"] | "",
    enabled: true,
  });

  function handleAdd() {
    if (!form.scope) return;
    const rule: OverrideRule = {
      id: `o-${Date.now()}`,
      name: form.name,
      maxDismissals: Number(form.maxDismissals),
      cooldownDays: Number(form.cooldownDays),
      scope: form.scope as OverrideRule["scope"],
      enabled: form.enabled,
    };
    addOverrideRule(rule);
    setForm({ name: "", maxDismissals: "3", cooldownDays: "7", scope: "", enabled: true });
    setOpen(false);
  }

  return (
    <DashboardCard
      icon={ShieldOff}
      title="Override Stopping Rules"
      badge={<span>{overrideRules.length} rules</span>}
      description="Limits on how often recommendations can be dismissed"
      actions={
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Rule
        </Button>
      }
    >
      {overrideRules.length === 0 ? (
        <p className="text-center text-sm text-text-muted py-6">No override rules configured.</p>
      ) : (
        <div className="space-y-3">
          {overrideRules.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border-default px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{r.name}</p>
                <p className="text-xs text-text-muted">
                  Max {r.maxDismissals} dismissals &middot; {r.cooldownDays}d cooldown
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {SCOPE_LABELS[r.scope] ?? r.scope}
              </Badge>
              <Switch
                checked={r.enabled}
                onCheckedChange={(checked) => updateOverrideRule(r.id, { enabled: checked === true })}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Override Rule</DialogTitle>
            <DialogDescription>
              Define limits for recommendation dismissals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input
                placeholder="e.g. Global Dismissal Limit"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Max Dismissals</Label>
                <Input
                  type="number"
                  value={form.maxDismissals}
                  onChange={(e) => setForm((f) => ({ ...f, maxDismissals: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cooldown (days)</Label>
                <Input
                  type="number"
                  value={form.cooldownDays}
                  onChange={(e) => setForm((f) => ({ ...f, cooldownDays: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={form.scope} onValueChange={(v) => setForm((f) => ({ ...f, scope: v as OverrideRule["scope"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={!form.name || !form.scope}
            >
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}
