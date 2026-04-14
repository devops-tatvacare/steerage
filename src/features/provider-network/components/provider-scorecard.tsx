import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProviderStore } from "@/stores/provider-store";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const TIER_COLORS: Record<number, string> = {
  1: "border-transparent bg-status-success-bg text-status-success",
  2: "border-transparent bg-status-info-bg text-status-info",
  3: "border-transparent bg-status-warning-bg text-status-warning",
};

const SCORE_LABELS: { key: keyof typeof SCORE_KEYS; label: string }[] = [
  { key: "clinicalQuality", label: "Clinical Quality" },
  { key: "patientExperience", label: "Patient Exp." },
  { key: "cost", label: "Cost" },
  { key: "access", label: "Access" },
  { key: "networkTier", label: "Network Tier" },
  { key: "utilisation", label: "Utilisation" },
];

// Just used to satisfy the keyof constraint above
const SCORE_KEYS = {
  clinicalQuality: true,
  patientExperience: true,
  cost: true,
  access: true,
  networkTier: true,
  utilisation: true,
} as const;

export function ProviderScorecard() {
  const { selectedProvider, selectProvider, updateTier, updatePanelStatus } =
    useProviderStore();

  const radarData = selectedProvider
    ? SCORE_LABELS.map((d) => ({
        dimension: d.label,
        score: selectedProvider.scores[d.key],
        fullMark: 100,
      }))
    : [];

  return (
    <Sheet
      open={selectedProvider !== null}
      onOpenChange={(open) => {
        if (!open) selectProvider(null);
      }}
    >
      <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
        {selectedProvider && (
          <>
            <SheetHeader>
              <SheetTitle>{selectedProvider.name}</SheetTitle>
              <SheetDescription>
                {selectedProvider.specialty} &middot;{" "}
                {selectedProvider.location.city},{" "}
                {selectedProvider.location.state}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-3 flex items-center gap-2">
              <Badge
                variant="outline"
                className={TIER_COLORS[selectedProvider.tier]}
              >
                Tier {selectedProvider.tier}
              </Badge>
              <StatusBadge status={selectedProvider.panelStatus} />
            </div>

            <Separator className="my-4" />

            {/* Radar Chart */}
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="var(--color-border-subtle)" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "var(--color-text-placeholder)" }}
                  />
                  <Radar
                    name="Scores"
                    dataKey="score"
                    stroke="var(--color-brand-primary)"
                    fill="var(--color-brand-primary)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <Separator className="my-4" />

            {/* Score breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Score Breakdown
              </h4>
              {SCORE_LABELS.map((d) => {
                const score = selectedProvider.scores[d.key];
                return (
                  <div key={d.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{d.label}</span>
                      <span className="tabular-nums font-medium text-text-primary">
                        {score}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-bg-secondary">
                      <div
                        className="h-1.5 rounded-full bg-brand-primary transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Quick actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Quick Actions
              </h4>

              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">Change Tier</span>
                <Select
                  value={String(selectedProvider.tier)}
                  onValueChange={(v) =>
                    updateTier(
                      selectedProvider.id,
                      Number(v) as 1 | 2 | 3,
                    )
                  }
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tier 1</SelectItem>
                    <SelectItem value="2">Tier 2</SelectItem>
                    <SelectItem value="3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedProvider.panelStatus === "active" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    updatePanelStatus(selectedProvider.id, "suspended")
                  }
                >
                  Suspend Provider
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    updatePanelStatus(selectedProvider.id, "active")
                  }
                >
                  Activate Provider
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
