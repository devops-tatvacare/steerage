import type { Intervention } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

interface PreviewPanelProps {
  intervention: Intervention;
}

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Smartphone className="h-3.5 w-3.5" />
        <span className="font-medium">Member view</span>
      </div>
      <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-border-default bg-bg-primary shadow-[var(--shadow-surface-soft)]">
        <div className="bg-bg-secondary px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand-primary" />
            <span className="text-[10px] font-semibold text-text-primary">TatvaCare</span>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function CostComparisonPreview() {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold text-text-primary">We found a better option</p>

      <div className="rounded-lg border border-border-default px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-text-muted">Your selection</p>
            <p className="text-xs font-medium text-text-primary">Columbia Asia KL</p>
          </div>
          <p className="text-sm font-bold text-text-primary">RM 1,400</p>
        </div>
      </div>

      <div className="rounded-lg border border-status-success-border bg-[color:var(--color-surface-subtle)] px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-1 border-status-success text-[8px] text-status-success">Recommended</Badge>
            <p className="text-xs font-medium text-text-primary">PanelScan Damansara</p>
          </div>
          <p className="text-sm font-bold text-status-success">RM 480</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md bg-[color:var(--color-surface-subtle)] px-3 py-2">
        <span className="text-[10px] text-text-muted">You save</span>
        <span className="text-xs font-bold text-status-success">RM 920</span>
      </div>

      <Button size="sm" className="w-full text-[11px]">Switch to Recommended</Button>
      <p className="text-center text-[9px] text-text-placeholder">Continue with original provider</p>
    </div>
  );
}

function PreBookingPreview() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border-l-[3px] border-l-status-warning bg-[color:var(--color-surface-subtle)] px-3 py-2.5">
        <p className="text-[11px] font-semibold text-text-primary">Before you confirm</p>
        <p className="mt-0.5 text-[10px] text-text-secondary">You could save RM 650 with an in-panel provider for this procedure.</p>
      </div>

      <div className="rounded-lg border border-border-default px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-text-primary">Dr. Sarah Lim</p>
            <p className="text-[10px] text-text-muted">Orthopedics -- Tier 1</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-status-success">95% quality</p>
            <Badge variant="outline" className="text-[8px]">Cashless</Badge>
          </div>
        </div>
      </div>

      <Button size="sm" className="w-full text-[11px]">Book Instead</Button>
      <p className="text-center text-[9px] text-text-placeholder">Keep original booking</p>
    </div>
  );
}

function VirtualFirstPreview() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg bg-[color:var(--color-surface-subtle)] px-3 py-3 text-center">
        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-status-info-border bg-status-info-bg">
          <Smartphone className="h-4 w-4 text-status-info" />
        </div>
        <p className="text-[11px] font-semibold text-text-primary">This condition can be treated online</p>
        <p className="mt-1 text-[10px] text-text-muted">Save time and money with a teleconsult from a qualified specialist.</p>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border-default px-3 py-2">
        <span className="text-[10px] text-text-muted">In-person visit</span>
        <span className="text-[10px] font-medium text-text-primary">RM 150</span>
      </div>
      <div className="flex items-center justify-between rounded-md border border-status-success-border bg-[color:var(--color-surface-subtle)] px-3 py-2">
        <span className="text-[10px] text-text-muted">Teleconsult</span>
        <span className="text-[10px] font-bold text-status-success">RM 45</span>
      </div>

      <Button size="sm" className="w-full text-[11px]">Start Teleconsult</Button>
      <p className="text-center text-[9px] text-text-placeholder">I prefer in-person</p>
    </div>
  );
}

function HomeCardsPreview() {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold text-text-primary">Recommended for you</p>
      <div className="rounded-lg border border-border-default px-3 py-2.5">
        <p className="text-[11px] font-medium text-text-primary">Annual health screening</p>
        <p className="mt-0.5 text-[10px] text-text-muted">Your benefit expires in 45 days. 3 labs near you have same-week slots.</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {["Pathlab KL", "BP Lab PJ", "Quest Shah Alam"].map((name) => (
            <div key={name} className="rounded-md bg-[color:var(--color-surface-subtle)] px-2 py-1.5 text-center">
              <p className="text-[9px] font-medium text-text-primary">{name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border-default px-3 py-2.5 opacity-60">
        <p className="text-[11px] font-medium text-text-primary">Diabetes check-up due</p>
        <p className="mt-0.5 text-[10px] text-text-muted">HbA1c test recommended. Last tested 8 months ago.</p>
      </div>
    </div>
  );
}

function PostBookingPreview() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg bg-[color:var(--color-surface-subtle)] px-3 py-2.5">
        <p className="text-[10px] text-text-muted">Appointment confirmed</p>
        <p className="text-[11px] font-medium text-text-primary">Dr. Ahmad -- Columbia Asia KL</p>
        <p className="text-[10px] text-text-muted">Tomorrow, 2:30 PM</p>
      </div>
      <div className="rounded-lg border-l-[3px] border-l-status-info bg-[color:var(--color-surface-subtle)] px-3 py-2.5">
        <p className="text-[10px] text-text-secondary">Did you know you could save <span className="font-semibold text-status-success">RM 340</span> with a preferred provider for this procedure?</p>
      </div>
      <p className="text-center text-[9px] text-text-placeholder">Showing for future reference</p>
    </div>
  );
}

function GenericPreview({ intervention }: { intervention: Intervention }) {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-border-default px-3 py-2.5">
        <p className="mb-1 text-[10px] text-text-muted">{intervention.channels.join(", ").toUpperCase()}</p>
        <p className="text-[11px] text-text-primary">{intervention.template}</p>
      </div>
      <Button size="sm" className="w-full text-[11px]">View Details</Button>
    </div>
  );
}

export function PreviewPanel({ intervention }: PreviewPanelProps) {
  let content: React.ReactNode;
  switch (intervention.subtype) {
    case "cost_comparison": content = <CostComparisonPreview />; break;
    case "pre_booking": content = <PreBookingPreview />; break;
    case "virtual_first": content = <VirtualFirstPreview />; break;
    case "home_cards": content = <HomeCardsPreview />; break;
    case "post_booking": content = <PostBookingPreview />; break;
    default: content = <GenericPreview intervention={intervention} />; break;
  }

  return <DeviceFrame>{content}</DeviceFrame>;
}
