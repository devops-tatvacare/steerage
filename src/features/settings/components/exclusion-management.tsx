import { useState } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { Plus, Trash2, ShieldX } from "lucide-react";
import type { MemberExclusion } from "@/types";

const TYPE_CONFIG: Record<
  MemberExclusion["type"],
  { label: string; className: string }
> = {
  doctor_preference: {
    label: "Doctor Preference",
    className: "border-status-info text-status-info bg-status-info-bg",
  },
  active_referral: {
    label: "Active Referral",
    className: "border-status-warning text-status-warning bg-status-warning-bg",
  },
  care_plan: {
    label: "Care Plan",
    className: "border-status-success text-status-success bg-status-success-bg",
  },
};

function truncateId(id: string) {
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const INITIAL_FORM = {
  memberId: "",
  type: "" as MemberExclusion["type"] | "",
  providerName: "",
  reason: "",
  expiresAt: "",
};

export function ExclusionManagement() {
  const { exclusions, addExclusion, removeExclusion } = useSettingsStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const columns: Column<MemberExclusion>[] = [
    {
      key: "memberId",
      header: "Member ID",
      cell: (r) => (
        <span className="font-mono text-xs" title={r.memberId}>
          {truncateId(r.memberId)}
        </span>
      ),
      sortable: true,
      sortValue: (r) => r.memberId,
    },
    {
      key: "type",
      header: "Type",
      cell: (r) => {
        const cfg = TYPE_CONFIG[r.type];
        return (
          <Badge variant="outline" className={cfg.className}>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: "providerName",
      header: "Provider",
      cell: (r) => (
        <span className="text-sm text-text-primary">
          {r.providerName ?? "-"}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      cell: (r) => (
        <span className="text-sm text-text-secondary">{r.reason}</span>
      ),
      className: "max-w-[200px] truncate",
    },
    {
      key: "expiresAt",
      header: "Expiry",
      cell: (r) => (
        <span className="text-xs text-text-muted">
          {r.expiresAt ? formatDate(r.expiresAt) : "No expiry"}
        </span>
      ),
      sortable: true,
      sortValue: (r) => r.expiresAt ?? "9999",
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (r) => (
        <span className="text-xs text-text-muted">
          {formatDate(r.createdAt)}
        </span>
      ),
      sortable: true,
      sortValue: (r) => r.createdAt,
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => removeExclusion(r.id)}
        >
          <Trash2 className="h-3.5 w-3.5 text-text-muted" />
        </Button>
      ),
      className: "w-10",
    },
  ];

  function handleAdd() {
    if (!form.memberId || !form.type || !form.reason) return;
    const exclusion: MemberExclusion = {
      id: `excl-${Date.now()}`,
      memberId: form.memberId,
      type: form.type as MemberExclusion["type"],
      providerName: form.providerName || undefined,
      reason: form.reason,
      expiresAt: form.expiresAt || null,
      createdAt: new Date().toISOString(),
    };
    addExclusion(exclusion);
    setForm(INITIAL_FORM);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          {exclusions.length} exclusion{exclusions.length !== 1 && "s"}
        </p>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Exclusion
        </Button>
      </div>

      <DataTable<MemberExclusion>
        columns={columns}
        data={exclusions}
        emptyIcon={ShieldX}
        emptyTitle="No exclusions"
        emptyDescription="Add member exclusions to bypass steerage recommendations."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Exclusion</DialogTitle>
            <DialogDescription>
              Exclude a member from steerage recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Member ID</Label>
              <Input
                placeholder="e.g. mem-001"
                value={form.memberId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, memberId: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    type: v as MemberExclusion["type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor_preference">
                    Doctor Preference
                  </SelectItem>
                  <SelectItem value="active_referral">
                    Active Referral
                  </SelectItem>
                  <SelectItem value="care_plan">Care Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Provider Name (optional)</Label>
              <Input
                placeholder="e.g. Dr. Smith"
                value={form.providerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, providerName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Reason for exclusion..."
                value={form.reason}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reason: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date (optional)</Label>
              <Input
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiresAt: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.memberId || !form.type || !form.reason}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
