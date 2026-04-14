import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";

interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  description?: string;
  className?: string;
}

export function WeightSlider({ label, value, onChange, max = 100, description, className }: WeightSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
        <span className="text-sm font-semibold text-brand-primary">{value}%</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} max={max} step={5} />
    </div>
  );
}
