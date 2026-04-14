import { useEffect } from "react";
import { Upload, CheckCircle2, PartyPopper } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { UploadZone } from "./components/upload-zone";
import { FieldMapping } from "./components/field-mapping";
import { ValidationReport } from "./components/validation-report";
import { ImportHistory } from "./components/import-history";
import type { DataImport } from "@/types";

/* ── Stepper ── */

const STEPS: { key: DataImport["status"]; label: string }[] = [
  { key: "uploading", label: "Upload" },
  { key: "mapping", label: "Map Fields" },
  { key: "validating", label: "Validate" },
  { key: "review", label: "Review" },
  { key: "live", label: "Live" },
];

const STATUS_ORDER: DataImport["status"][] = [
  "uploading",
  "mapping",
  "validating",
  "review",
  "approved",
  "live",
];

function Stepper({ status }: { status: DataImport["status"] }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const stepIdx = STATUS_ORDER.indexOf(step.key);
        const isCompleted = currentIdx > stepIdx;
        const isCurrent =
          currentIdx === stepIdx ||
          (step.key === "review" && status === "approved");

        return (
          <div key={step.key} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-6 sm:w-10",
                  isCompleted ? "bg-brand-primary" : "bg-border-default",
                )}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
                  isCompleted
                    ? "bg-brand-primary text-white"
                    : isCurrent
                      ? "border-2 border-brand-primary text-brand-primary"
                      : "border border-border-default text-text-placeholder",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs sm:inline",
                  isCurrent
                    ? "font-semibold text-text-primary"
                    : isCompleted
                      ? "text-text-muted"
                      : "text-text-placeholder",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Page ── */

export function DataOnboardingPage() {
  const { currentImport, loadImports } = useOnboardingStore();

  useEffect(() => {
    loadImports();
  }, [loadImports]);

  const clearImport = useOnboardingStore(
    (s) => () => s.startImport(null as unknown as DataImport),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Onboarding"
        description="Import member, provider, and claims data"
      />

      {!currentImport ? (
        /* ── No active import ── */
        <DashboardCard icon={Upload} title="Upload Data">
          <UploadZone />
        </DashboardCard>
      ) : (
        /* ── Active import workflow ── */
        <div className="space-y-6">
          <div className="rounded-xl border border-border-default bg-bg-primary p-4">
            <Stepper status={currentImport.status} />
          </div>

          {currentImport.status === "mapping" && (
            <DashboardCard title="Field Mapping">
              <FieldMapping currentImport={currentImport} />
            </DashboardCard>
          )}

          {(currentImport.status === "validating" ||
            currentImport.status === "review") && (
            <DashboardCard title="Validation Report">
              <ValidationReport currentImport={currentImport} />
            </DashboardCard>
          )}

          {(currentImport.status === "approved" ||
            currentImport.status === "live") && (
            <DashboardCard title="Import Complete">
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <PartyPopper className="h-10 w-10 text-status-success" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {currentImport.fileName} is live
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {currentImport.recordCount.toLocaleString()} records
                    imported successfully
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    useOnboardingStore.setState({ currentImport: null })
                  }
                >
                  Start New Import
                </Button>
              </div>
            </DashboardCard>
          )}
        </div>
      )}

      <ImportHistory />
    </div>
  );
}
