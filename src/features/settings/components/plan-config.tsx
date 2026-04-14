import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import type { PlanConfig as PlanConfigType } from "@/types";

const MOCK_PLANS: PlanConfigType[] = [
  {
    id: "plan-1",
    name: "Premium Gold",
    benefitCategories: [
      "Annual Screening",
      "Dental",
      "Optical",
      "Mental Health",
      "Physiotherapy",
      "Specialist Referral",
      "Emergency",
      "Maternity",
    ],
    coverageRules: [
      "Full coverage for in-network providers",
      "80% for out-of-network",
    ],
  },
  {
    id: "plan-2",
    name: "Standard Silver",
    benefitCategories: [
      "Annual Screening",
      "Dental",
      "Mental Health",
      "Specialist Referral",
      "Emergency",
    ],
    coverageRules: [
      "In-network only",
      "Referral required for specialists",
    ],
  },
  {
    id: "plan-3",
    name: "Basic Bronze",
    benefitCategories: ["Annual Screening", "Emergency", "Specialist Referral"],
    coverageRules: [
      "In-network only",
      "Pre-authorization required",
    ],
  },
  {
    id: "plan-4",
    name: "Corporate Platinum",
    benefitCategories: [
      "Annual Screening",
      "Dental",
      "Optical",
      "Mental Health",
      "Physiotherapy",
      "Specialist Referral",
      "Emergency",
      "Maternity",
    ],
    coverageRules: [
      "Full coverage all providers",
      "No referral required",
      "International coverage included",
    ],
  },
];

const columns: Column<PlanConfigType>[] = [
  {
    key: "name",
    header: "Plan Name",
    cell: (r) => (
      <span className="text-sm font-medium text-text-primary">{r.name}</span>
    ),
    sortable: true,
    sortValue: (r) => r.name,
  },
  {
    key: "benefitCategories",
    header: "Benefit Categories",
    cell: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.benefitCategories.map((cat) => (
          <Badge key={cat} variant="secondary" className="text-[10px]">
            {cat}
          </Badge>
        ))}
      </div>
    ),
    className: "max-w-[400px]",
  },
  {
    key: "coverageRules",
    header: "Coverage Rules",
    cell: (r) => (
      <span className="text-xs text-text-secondary">
        {r.coverageRules.join("; ")}
      </span>
    ),
  },
];

export function PlanConfig() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        {MOCK_PLANS.length} plan{MOCK_PLANS.length !== 1 && "s"} configured
      </p>
      <DataTable<PlanConfigType> columns={columns} data={MOCK_PLANS} />
    </div>
  );
}
