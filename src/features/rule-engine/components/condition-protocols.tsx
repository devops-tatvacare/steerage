import { useState } from "react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FileText, Plus } from "lucide-react";
import type { ConditionProtocol } from "@/types";

const SPECIALTIES = [
  "Endocrinology",
  "Cardiology",
  "Pulmonology",
  "Orthopedics",
  "Psychiatry",
  "Nephrology",
  "General Practice",
];

export function ConditionProtocols() {
  const { conditionProtocols, addConditionProtocol, updateConditionProtocol } = useRuleEngineStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    condition: "",
    icd10Prefix: "",
    targetSpecialty: "",
    additionalRequirements: "",
    enabled: true,
  });

  function handleAdd() {
    const protocol: ConditionProtocol = {
      id: `proto-${Date.now()}`,
      condition: form.condition,
      icd10Prefix: form.icd10Prefix,
      targetSpecialty: form.targetSpecialty,
      rules: [],
      additionalRequirements: form.additionalRequirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      enabled: form.enabled,
    };
    addConditionProtocol(protocol);
    setForm({ condition: "", icd10Prefix: "", targetSpecialty: "", additionalRequirements: "", enabled: true });
    setOpen(false);
  }

  const columns: Column<ConditionProtocol>[] = [
    {
      key: "condition",
      header: "Condition",
      cell: (row) => <span className="font-medium text-text-primary">{row.condition}</span>,
      sortable: true,
      sortValue: (row) => row.condition,
    },
    {
      key: "icd10",
      header: "ICD-10",
      cell: (row) => <code className="rounded bg-bg-hover px-1.5 py-0.5 text-xs">{row.icd10Prefix}</code>,
    },
    {
      key: "specialty",
      header: "Specialty",
      cell: (row) => row.targetSpecialty,
      sortable: true,
      sortValue: (row) => row.targetSpecialty,
    },
    {
      key: "requirements",
      header: "Requirements",
      cell: (row) => (
        <span className="text-xs text-text-muted">
          {row.additionalRequirements.length > 0
            ? row.additionalRequirements.slice(0, 2).join("; ") +
              (row.additionalRequirements.length > 2 ? ` (+${row.additionalRequirements.length - 2})` : "")
            : "None"}
        </span>
      ),
    },
    {
      key: "enabled",
      header: "Enabled",
      cell: (row) => (
        <Switch
          checked={row.enabled}
          onCheckedChange={(checked) => updateConditionProtocol(row.id, { enabled: checked === true })}
        />
      ),
      className: "w-[80px]",
    },
  ];

  return (
    <DashboardCard
      icon={FileText}
      title="Condition-Specific Protocols"
      badge={<span>{conditionProtocols.length} protocols</span>}
      description="Rules applied when a specific condition is detected"
      actions={
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Protocol
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={conditionProtocols}
        emptyTitle="No protocols configured"
        emptyDescription="Add condition-specific protocols to customize steerage logic."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Condition Protocol</DialogTitle>
            <DialogDescription>
              Define rules for a specific medical condition.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Condition Name</Label>
              <Input
                placeholder="e.g. Diabetes Mellitus"
                value={form.condition}
                onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>ICD-10 Prefix</Label>
              <Input
                placeholder="e.g. E11"
                value={form.icd10Prefix}
                onChange={(e) => setForm((f) => ({ ...f, icd10Prefix: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Specialty</Label>
              <Select
                value={form.targetSpecialty}
                onValueChange={(v) => setForm((f) => ({ ...f, targetSpecialty: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional Requirements</Label>
              <Textarea
                placeholder="One requirement per line"
                rows={3}
                value={form.additionalRequirements}
                onChange={(e) => setForm((f) => ({ ...f, additionalRequirements: e.target.value }))}
              />
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
              disabled={!form.condition || !form.icd10Prefix || !form.targetSpecialty}
            >
              Add Protocol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}
