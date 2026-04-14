import { Wifi, Battery, Signal } from "lucide-react";
import type { Intervention } from "@/types";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  intervention: Intervention | null;
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[280px]">
      <p className="mb-2 text-xs font-medium text-text-muted">Member Preview</p>
      <div className="overflow-hidden rounded-[2rem] border-2 border-border-default bg-bg-primary shadow-sm">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-bg-secondary px-5 pb-1 pt-2">
          <span className="text-[10px] font-medium text-text-muted">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3 text-text-muted" />
            <Wifi className="h-3 w-3 text-text-muted" />
            <Battery className="h-3 w-3 text-text-muted" />
          </div>
        </div>
        {/* Notch */}
        <div className="flex justify-center bg-bg-secondary pb-2">
          <div className="h-[5px] w-20 rounded-full bg-border-default" />
        </div>
        {/* Content area */}
        <div className="min-h-[420px] bg-bg-primary p-4">{children}</div>
        {/* Home indicator */}
        <div className="flex justify-center bg-bg-primary pb-2 pt-1">
          <div className="h-1 w-24 rounded-full bg-border-default" />
        </div>
      </div>
    </div>
  );
}

function CostComparisonPreview() {
  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-semibold text-text-primary">Compare Providers</p>
      <div className="rounded-lg border border-border-default bg-bg-secondary p-3">
        <p className="text-[10px] font-medium text-text-muted">Your selection</p>
        <p className="text-xs font-semibold text-text-primary">Provider A</p>
        <p className="text-sm font-bold text-text-primary">RM 1,400</p>
      </div>
      <div className="rounded-lg border-2 border-green-300 bg-green-50 p-3">
        <p className="text-[10px] font-medium text-green-600">Recommended</p>
        <p className="text-xs font-semibold text-text-primary">Provider B</p>
        <p className="text-sm font-bold text-green-700">RM 480</p>
      </div>
      <div className="rounded-md bg-green-100 px-3 py-2 text-center">
        <p className="text-xs font-bold text-green-800">Save RM 920</p>
      </div>
      <Button size="sm" className="w-full text-xs">
        Switch Provider
      </Button>
    </div>
  );
}

function PreBookingPreview() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-amber-50 p-3">
        <p className="text-xs font-semibold text-amber-800">Before you book</p>
        <p className="mt-1 text-[11px] text-amber-700">
          Save RM 650 with a recommended in-panel provider for your condition.
        </p>
      </div>
      <div className="rounded-lg border border-border-default p-3">
        <p className="text-xs font-semibold text-text-primary">Dr. Sarah Lim</p>
        <p className="text-[10px] text-text-muted">Orthopedics - KL Sentral Clinic</p>
        <p className="mt-1 text-[10px] text-green-600">95% quality score - Cashless</p>
      </div>
      <Button size="sm" className="w-full text-xs">
        Book Instead
      </Button>
      <button className="w-full text-center text-[10px] text-text-muted underline">
        Continue with original
      </button>
    </div>
  );
}

function VirtualFirstPreview() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border-default bg-bg-secondary p-4 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <span className="text-lg">🩺</span>
        </div>
        <p className="text-xs font-semibold text-text-primary">
          This condition can be treated online
        </p>
        <p className="mt-1 text-[10px] text-text-muted">
          Save time and get treated from home via teleconsult with a qualified specialist.
        </p>
      </div>
      <Button size="sm" className="w-full text-xs">
        Start Teleconsult
      </Button>
      <button className="w-full text-center text-[10px] text-text-muted underline">
        I prefer in-person
      </button>
    </div>
  );
}

function HomeCardsPreview() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-text-primary">For You</p>
      <div className="rounded-lg border border-border-default bg-bg-secondary p-3">
        <p className="text-xs font-semibold text-text-primary">Time for your annual screening</p>
        <p className="mt-1 text-[10px] text-text-muted">
          Your health screening benefit expires in 45 days. Book now at a nearby lab.
        </p>
        <div className="mt-2 flex gap-2">
          <div className="flex-1 rounded-md bg-bg-primary p-2 text-center">
            <p className="text-[10px] font-medium text-text-primary">Pathlab KL</p>
            <p className="text-[9px] text-text-muted">1.2 km</p>
          </div>
          <div className="flex-1 rounded-md bg-bg-primary p-2 text-center">
            <p className="text-[10px] font-medium text-text-primary">BP Lab PJ</p>
            <p className="text-[9px] text-text-muted">3.4 km</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericPreview({ template }: { template: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border-default bg-bg-secondary p-3">
        <p className="mb-1 text-[10px] font-medium text-text-muted">Notification</p>
        <p className="text-xs text-text-primary">{template}</p>
      </div>
      <Button size="sm" className="w-full text-xs">
        View Details
      </Button>
    </div>
  );
}

export function PreviewPanel({ intervention }: PreviewPanelProps) {
  if (!intervention) {
    return (
      <PhoneFrame>
        <div className="flex h-full min-h-[380px] items-center justify-center">
          <p className="text-center text-xs text-text-muted">
            Select an intervention to preview how it appears to members
          </p>
        </div>
      </PhoneFrame>
    );
  }

  let content: React.ReactNode;
  switch (intervention.subtype) {
    case "cost_comparison":
      content = <CostComparisonPreview />;
      break;
    case "pre_booking":
      content = <PreBookingPreview />;
      break;
    case "virtual_first":
      content = <VirtualFirstPreview />;
      break;
    case "home_cards":
      content = <HomeCardsPreview />;
      break;
    default:
      content = <GenericPreview template={intervention.template} />;
      break;
  }

  return <PhoneFrame>{content}</PhoneFrame>;
}
