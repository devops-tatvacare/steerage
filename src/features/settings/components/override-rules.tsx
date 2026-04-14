import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/stores/settings-store";

const SCOPE_LABELS: Record<string, string> = {
  global: "Global",
  provider: "Provider",
  specialty: "Specialty",
};

export function OverrideRules() {
  const { globalOverrideRules, updateGlobalOverride } = useSettingsStore();

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Global Override Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {globalOverrideRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center gap-4 rounded-md border border-border-default px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  {rule.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Max dismissals</Label>
                <Input
                  type="number"
                  className="w-16"
                  value={rule.maxDismissals}
                  onChange={(e) =>
                    updateGlobalOverride(rule.id, {
                      maxDismissals: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Cooldown (days)</Label>
                <Input
                  type="number"
                  className="w-16"
                  value={rule.cooldownDays}
                  onChange={(e) =>
                    updateGlobalOverride(rule.id, {
                      cooldownDays: Number(e.target.value),
                    })
                  }
                />
              </div>
              <Badge variant="outline">{SCOPE_LABELS[rule.scope] ?? rule.scope}</Badge>
              <Switch
                checked={rule.enabled}
                onCheckedChange={(checked) =>
                  updateGlobalOverride(rule.id, { enabled: checked === true })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Override Logging Mode</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="overrides_only">Overrides Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Override Report Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
