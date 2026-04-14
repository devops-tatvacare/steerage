import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/stores/settings-store";
import { Bell, MessageSquare, Mail } from "lucide-react";
import type { NotificationConfig as NotificationConfigType } from "@/types";

const CHANNEL_META: Record<
  NotificationConfigType["channel"],
  { label: string; icon: React.ElementType }
> = {
  push: { label: "Push Notifications", icon: Bell },
  sms: { label: "SMS", icon: MessageSquare },
  email: { label: "Email", icon: Mail },
};

export function NotificationConfig() {
  const { notifications, updateNotification } = useSettingsStore();

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          {notifications.map((n) => {
            const meta = CHANNEL_META[n.channel];
            const Icon = meta.icon;
            return (
              <div
                key={n.channel}
                className="flex items-center gap-4 rounded-md border border-border-default px-4 py-3"
              >
                <div className="flex items-center gap-2 min-w-[160px]">
                  <Icon className="h-4 w-4 text-text-muted" />
                  <span className="text-sm font-medium text-text-primary">
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Enabled</Label>
                  <Switch
                    checked={n.enabled}
                    onCheckedChange={(checked) =>
                      updateNotification(n.channel, {
                        enabled: checked === true,
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Freq. cap</Label>
                  <Input
                    type="number"
                    className="w-16"
                    value={n.frequencyCap}
                    onChange={(e) =>
                      updateNotification(n.channel, {
                        frequencyCap: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Cooldown (hrs)</Label>
                  <Input
                    type="number"
                    className="w-16"
                    value={n.cooldownHours}
                    onChange={(e) =>
                      updateNotification(n.channel, {
                        cooldownHours: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Geo-Trigger Settings</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Geo-Trigger Radius</Label>
              <div className="flex items-center gap-2">
                <Input type="number" className="w-24" defaultValue={5} />
                <span className="text-sm text-text-muted">km</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Fires Per Day</Label>
              <Input type="number" className="w-24" defaultValue={3} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
