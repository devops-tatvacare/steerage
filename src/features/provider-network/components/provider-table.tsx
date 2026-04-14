import { useMemo } from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProviderStore } from "@/stores/provider-store";
import { Check, X, Search } from "lucide-react";
import type { Provider } from "@/types";

const TIER_COLORS: Record<number, string> = {
  1: "border-transparent bg-status-success-bg text-status-success",
  2: "border-transparent bg-status-info-bg text-status-info",
  3: "border-transparent bg-status-warning-bg text-status-warning",
};

function formatSlotDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const columns: Column<Provider>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <span className="font-semibold text-text-primary">{r.name}</span>,
  },
  {
    key: "specialty",
    header: "Specialty",
    cell: (r) => r.specialty,
  },
  {
    key: "tier",
    header: "Tier",
    sortable: true,
    sortValue: (r) => r.tier,
    cell: (r) => (
      <Badge variant="outline" className={TIER_COLORS[r.tier]}>
        Tier {r.tier}
      </Badge>
    ),
  },
  {
    key: "location",
    header: "City",
    cell: (r) => r.location.city,
  },
  {
    key: "panelStatus",
    header: "Status",
    cell: (r) => <StatusBadge status={r.panelStatus} />,
  },
  {
    key: "clinicalQuality",
    header: "Clinical",
    sortable: true,
    sortValue: (r) => r.scores.clinicalQuality,
    cell: (r) => (
      <span className="tabular-nums">{r.scores.clinicalQuality}/100</span>
    ),
  },
  {
    key: "cost",
    header: "Cost",
    sortable: true,
    sortValue: (r) => r.scores.cost,
    cell: (r) => <span className="tabular-nums">{r.scores.cost}/100</span>,
  },
  {
    key: "cashless",
    header: "Cashless",
    cell: (r) =>
      r.cashless ? (
        <Check className="h-4 w-4 text-status-success" />
      ) : (
        <X className="h-4 w-4 text-text-placeholder" />
      ),
    className: "text-center",
  },
  {
    key: "teleconsult",
    header: "Teleconsult",
    cell: (r) =>
      r.teleconsult ? (
        <Check className="h-4 w-4 text-status-success" />
      ) : (
        <X className="h-4 w-4 text-text-placeholder" />
      ),
    className: "text-center",
  },
  {
    key: "nextSlot",
    header: "Next Slot",
    cell: (r) => (
      <span className="text-xs tabular-nums">
        {formatSlotDate(r.nextAvailableSlot)}
      </span>
    ),
  },
];

export function ProviderTable() {
  const { providers, filters, setFilter, selectProvider } = useProviderStore();

  const specialties = useMemo(
    () => [...new Set(providers.map((p) => p.specialty))].sort(),
    [providers],
  );

  const filtered = useMemo(() => {
    let list = providers;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.specialty.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q),
      );
    }
    if (filters.specialty) {
      list = list.filter((p) => p.specialty === filters.specialty);
    }
    if (filters.tier) {
      list = list.filter((p) => p.tier === Number(filters.tier));
    }
    if (filters.panelStatus) {
      list = list.filter((p) => p.panelStatus === filters.panelStatus);
    }
    return list;
  }, [providers, filters]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-placeholder" />
          <Input
            placeholder="Search providers..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>

        <Select
          value={filters.specialty || "all"}
          onValueChange={(v) => setFilter("specialty", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.tier || "all"}
          onValueChange={(v) => setFilter("tier", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="1">Tier 1</SelectItem>
            <SelectItem value="2">Tier 2</SelectItem>
            <SelectItem value="3">Tier 3</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.panelStatus || "all"}
          onValueChange={(v) => setFilter("panelStatus", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={selectProvider}
        emptyTitle="No providers found"
        emptyDescription="Try adjusting your search or filters."
      />
    </div>
  );
}
