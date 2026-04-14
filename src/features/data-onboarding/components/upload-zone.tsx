import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateMockMappings(
  dataType: DataImport["dataType"],
): DataImport["fieldMappings"] {
  const sourcesByType: Record<string, string[]> = {
    members: [
      "member_id",
      "full_name",
      "age",
      "gender_code",
      "plan_type",
      "risk_tier",
      "conditions",
      "contact_info",
    ],
    providers: [
      "provider_id",
      "provider_name",
      "specialty",
      "tier",
      "city",
      "state",
      "cashless_flag",
      "teleconsult_flag",
    ],
    claims: [
      "claim_id",
      "member_id",
      "provider_id",
      "amount",
      "claim_date",
      "procedure_code",
      "status",
    ],
    panels: [
      "provider_id",
      "panel_id",
      "tier",
      "effective_date",
      "expiry_date",
    ],
  };
  const sources = sourcesByType[dataType] ?? [];
  return sources.map((source) => ({ source, target: "", mapped: false }));
}

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataImport["dataType"] | "">("");
  const startImport = useOnboardingStore((s) => s.startImport);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  }

  function handleStart() {
    if (!file || !dataType) return;
    const ext = file.name.endsWith(".xlsx") ? "xlsx" : "csv";
    const imp: DataImport = {
      id: `imp-${Date.now()}`,
      fileName: file.name,
      fileType: ext,
      dataType: dataType as DataImport["dataType"],
      status: "mapping",
      recordCount: Math.floor(Math.random() * 50000) + 1000,
      errorCount: 0,
      warningCount: 0,
      fieldMappings: generateMockMappings(dataType as DataImport["dataType"]),
      uploadedAt: new Date().toISOString(),
    };
    startImport(imp);
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border-default px-6 py-12 transition-colors hover:border-brand-primary hover:bg-bg-hover"
      >
        <Upload className="h-8 w-8 text-text-placeholder" />
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">
            Drag &amp; drop or click to upload
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Supports CSV, XLSX
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border-default bg-bg-secondary p-4">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-text-muted" />
            <span className="font-medium text-text-primary">{file.name}</span>
            <span className="text-text-muted">
              ({formatFileSize(file.size)})
            </span>
          </div>

          <Select
            value={dataType}
            onValueChange={(v) =>
              setDataType(v as DataImport["dataType"])
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="providers">Providers</SelectItem>
              <SelectItem value="claims">Claims</SelectItem>
              <SelectItem value="panels">Panels</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            disabled={!dataType}
            onClick={handleStart}
          >
            Start Import
          </Button>
        </div>
      )}
    </div>
  );
}
