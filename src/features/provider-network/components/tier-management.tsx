import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProviderStore } from "@/stores/provider-store";
import { cn } from "@/lib/cn";

const TIER_CONFIG: Record<
  number,
  { label: string; accent: string; badgeClass: string }
> = {
  1: {
    label: "Tier 1",
    accent: "border-t-4 border-t-status-success",
    badgeClass: "border-transparent bg-status-success-bg text-status-success",
  },
  2: {
    label: "Tier 2",
    accent: "border-t-4 border-t-status-info",
    badgeClass: "border-transparent bg-status-info-bg text-status-info",
  },
  3: {
    label: "Tier 3",
    accent: "border-t-4 border-t-status-warning",
    badgeClass: "border-transparent bg-status-warning-bg text-status-warning",
  },
};

export function TierManagement() {
  const { providers, updateTier } = useProviderStore();

  const grouped = {
    1: providers.filter((p) => p.tier === 1),
    2: providers.filter((p) => p.tier === 2),
    3: providers.filter((p) => p.tier === 3),
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {([1, 2, 3] as const).map((tier) => {
        const config = TIER_CONFIG[tier];
        const list = grouped[tier];
        return (
          <Card key={tier} className={cn("overflow-hidden", config.accent)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{config.label}</CardTitle>
                <Badge variant="secondary" className="text-[11px]">
                  {list.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {list.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-md border border-border-default px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {p.name}
                    </p>
                    <p className="text-xs text-text-muted">{p.specialty}</p>
                  </div>
                  <Select
                    value={String(p.tier)}
                    onValueChange={(v) =>
                      updateTier(p.id, Number(v) as 1 | 2 | 3)
                    }
                  >
                    <SelectTrigger className="ml-2 h-7 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tier 1</SelectItem>
                      <SelectItem value="2">Tier 2</SelectItem>
                      <SelectItem value="3">Tier 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {list.length === 0 && (
                <p className="py-4 text-center text-xs text-text-placeholder">
                  No providers in this tier
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
