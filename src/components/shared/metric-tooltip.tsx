import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

interface MetricTooltipProps {
  title: string;
  description: string;
  formula?: string;
  target?: string;
  className?: string;
}

export function MetricTooltip({ title, description, formula, target, className }: MetricTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={cn("inline-flex items-center justify-center rounded-full text-text-placeholder transition-colors hover:text-text-muted", className)}>
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] space-y-1.5 px-3.5 py-2.5">
          <p className="text-[11px] font-semibold text-background">{title}</p>
          <p className="text-[10px] leading-relaxed text-background/80">{description}</p>
          {formula && (
            <p className="rounded bg-background/10 px-2 py-1 font-mono text-[9px] text-background/70">{formula}</p>
          )}
          {target && (
            <p className="text-[10px] text-background/60">Target: {target}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
