import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { DataImport } from "@/types";

const TARGET_FIELDS: Record<DataImport["dataType"], string[]> = {
  members: [
    "Member ID",
    "Name",
    "Age",
    "Gender",
    "Plan Type",
    "Risk Tier",
    "Conditions",
    "Contact",
  ],
  providers: [
    "Provider ID",
    "Name",
    "Specialty",
    "Tier",
    "City",
    "State",
    "Cashless",
    "Teleconsult",
  ],
  claims: [
    "Claim ID",
    "Member ID",
    "Provider ID",
    "Amount",
    "Date",
    "Procedure",
    "Status",
  ],
  panels: [
    "Provider ID",
    "Panel ID",
    "Tier",
    "Effective Date",
    "Expiry Date",
  ],
};

interface FieldMappingProps {
  currentImport: DataImport;
}

export function FieldMapping({ currentImport }: FieldMappingProps) {
  const { updateMapping, advanceStatus } = useOnboardingStore();
  const targets = TARGET_FIELDS[currentImport.dataType] ?? [];
  const mappedCount = currentImport.fieldMappings.filter(
    (m) => m.mapped,
  ).length;
  const totalCount = currentImport.fieldMappings.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Map Source Fields
          </h3>
          <p className="text-xs text-text-muted">
            {mappedCount} / {totalCount} fields mapped
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {currentImport.fieldMappings.map((mapping, i) => (
          <div
            key={mapping.source}
            className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-secondary px-4 py-2.5"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
              {mapping.source}
            </span>

            <ArrowRight className="h-4 w-4 shrink-0 text-text-placeholder" />

            <div className="flex flex-1 items-center gap-2">
              <Select
                value={mapping.target || undefined}
                onValueChange={(v) => updateMapping(i, v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target field" />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {mapping.mapped && (
                <Check className="h-4 w-4 shrink-0 text-status-success" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button size="sm" onClick={advanceStatus}>
          Confirm Mapping
        </Button>
      </div>
    </div>
  );
}
