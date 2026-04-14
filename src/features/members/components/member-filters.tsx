import { useMemberStore } from "@/stores/member-store";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

export function MemberFilters() {
  const { filters, setFilter, resetFilters } = useMemberStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Search members..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={filters.riskTier} onValueChange={(v) => setFilter("riskTier", v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Risk Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tiers</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.condition} onValueChange={(v) => setFilter("condition", v === "all" ? "" : v)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All conditions</SelectItem>
          <SelectItem value="diabetes">Diabetes</SelectItem>
          <SelectItem value="hypertension">Hypertension</SelectItem>
          <SelectItem value="cardiac">Cardiac</SelectItem>
          <SelectItem value="asthma">Asthma</SelectItem>
          <SelectItem value="orthopedic">Orthopedic</SelectItem>
          <SelectItem value="mental health">Mental Health</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.careStage} onValueChange={(v) => setFilter("careStage", v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Care Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stages</SelectItem>
          <SelectItem value="new_episode">New Episode</SelectItem>
          <SelectItem value="mid_treatment">Mid Treatment</SelectItem>
          <SelectItem value="follow_up">Follow Up</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={resetFilters}>
        <RotateCcw className="mr-1 h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
