import type { LucideIcon } from "lucide-react";
import {
  DollarSign,
  Bell,
  Video,
  BookOpen,
  LayoutGrid,
  Info,
  MessageSquare,
  MapPin,
  FlaskConical,
  Eye,
} from "lucide-react";
import type { Intervention } from "@/types";
import { INTERVENTION_TYPES } from "@/config/intervention-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useInterventionStore } from "@/stores/intervention-store";

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  Bell,
  Video,
  BookOpen,
  LayoutGrid,
  Info,
  MessageSquare,
  MapPin,
};

const CHANNEL_LABELS: Record<string, string> = {
  push: "Push",
  sms: "SMS",
  in_app: "In-App",
  email: "Email",
};

interface InterventionListProps {
  interventions: Intervention[];
  onSelect: (intervention: Intervention) => void;
}

export function InterventionList({ interventions, onSelect }: InterventionListProps) {
  const toggleIntervention = useInterventionStore((s) => s.toggleIntervention);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {interventions.map((intervention) => {
        const typeConfig = INTERVENTION_TYPES.find((t) => t.key === intervention.subtype);
        const IconComp = typeConfig ? ICON_MAP[typeConfig.icon] : undefined;

        return (
          <Card
            key={intervention.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => onSelect(intervention)}
          >
            <CardContent className="space-y-3 pt-6">
              {/* Header row: icon + name + switch */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {IconComp && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-secondary">
                      <IconComp className="h-4.5 w-4.5 text-text-secondary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{intervention.name}</p>
                    {typeConfig && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                        {typeConfig.description}
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={intervention.enabled}
                  onCheckedChange={() => toggleIntervention(intervention.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Type + A/B badge row */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  className={
                    intervention.type === "active"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-green-200 bg-green-50 text-green-700"
                  }
                >
                  {intervention.type === "active" ? "Active" : "Passive"}
                </Badge>
                {intervention.abTestEnabled && (
                  <Badge className="border-purple-200 bg-purple-50 text-purple-700">
                    <FlaskConical className="mr-1 h-3 w-3" />
                    A/B Test
                  </Badge>
                )}
              </div>

              {/* Channels */}
              <div className="flex flex-wrap gap-1">
                {intervention.channels.map((ch) => (
                  <Badge key={ch} variant="outline" className="text-[11px]">
                    {CHANNEL_LABELS[ch] ?? ch}
                  </Badge>
                ))}
              </div>

              {/* Metrics */}
              {(intervention.acceptanceRate != null || intervention.impressions != null) && (
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  {intervention.acceptanceRate != null && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-text-primary">
                        {(intervention.acceptanceRate * 100).toFixed(0)}%
                      </span>{" "}
                      acceptance
                    </span>
                  )}
                  {intervention.impressions != null && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {intervention.impressions.toLocaleString()} impressions
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
