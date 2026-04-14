import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
  invertColor?: boolean;
}

export function TrendIndicator({ value, suffix = "%", invertColor = false }: TrendIndicatorProps) {
  const isPositive = invertColor ? value < 0 : value > 0;
  const isNeutral = value === 0;
  const Icon = value > 0 ? ArrowUp : value < 0 ? ArrowDown : Minus;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-medium", isNeutral ? "text-text-muted" : isPositive ? "text-status-success" : "text-status-error")}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}{suffix}
    </span>
  );
}
