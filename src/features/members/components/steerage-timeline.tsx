import type { SteerageEvent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const TYPE_STYLES: Record<SteerageEvent["type"], { dot: string; badge: string }> = {
  acceptance: { dot: "bg-status-success", badge: "border-status-success text-status-success bg-status-success-bg" },
  override: { dot: "bg-status-error", badge: "border-status-error text-status-error bg-status-error-bg" },
  dismissal: { dot: "bg-status-warning", badge: "border-status-warning text-status-warning bg-status-warning-bg" },
  recommendation: { dot: "bg-status-info", badge: "border-status-info text-status-info bg-status-info-bg" },
  escalation: { dot: "bg-purple-500", badge: "border-purple-300 text-purple-700 bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:bg-purple-950" },
  navigator_call: { dot: "bg-purple-500", badge: "border-purple-300 text-purple-700 bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:bg-purple-950" },
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-MY", { day: "numeric", month: "short" }),
    time: d.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

function buildDescription(e: SteerageEvent): string {
  const parts: string[] = [];
  if (e.providerRecommended) parts.push(`Recommended: ${e.providerRecommended}`);
  if (e.providerChosen) parts.push(`Chosen: ${e.providerChosen}`);
  if (e.costDifferential != null) parts.push(`Cost diff: RM ${e.costDifferential.toLocaleString()}`);
  if (e.interventionType) parts.push(`Intervention: ${e.interventionType.replace(/_/g, " ")}`);
  if (e.notes) parts.push(e.notes);
  return parts.join(" · ");
}

interface SteerageTimelineProps {
  events: SteerageEvent[];
}

export function SteerageTimeline({ events }: SteerageTimelineProps) {
  if (events.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">No steerage events</p>;
  }

  return (
    <div className="relative space-y-0">
      {events.map((event, i) => {
        const { date, time } = formatDateTime(event.timestamp);
        const style = TYPE_STYLES[event.type];
        const isLast = i === events.length - 1;
        const desc = buildDescription(event);

        return (
          <div key={event.id} className="flex gap-4">
            {/* Left: date/time */}
            <div className="w-20 shrink-0 pt-0.5 text-right">
              <p className="text-xs font-medium text-text-primary">{date}</p>
              <p className="text-[10px] text-text-muted">{time}</p>
            </div>

            {/* Center: dot + line */}
            <div className="relative flex flex-col items-center">
              <div className={cn("z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", style.dot)} />
              {!isLast && <div className="w-px flex-1 bg-border-default" />}
            </div>

            {/* Right: content */}
            <div className={cn("pb-6", isLast && "pb-0")}>
              <Badge variant="outline" className={cn("text-[10px] capitalize", style.badge)}>
                {event.type.replace(/_/g, " ")}
              </Badge>
              {desc && <p className="mt-1 text-xs text-text-secondary">{desc}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
