import { useMemo } from "react";
import { DashboardCard } from "@/components/shared/dashboard-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProviderStore } from "@/stores/provider-store";
import { BarChart3, AlertTriangle } from "lucide-react";

export function GapAnalysis() {
  const { providers } = useProviderStore();

  // Specialty distribution for bar chart
  const specialtyData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of providers) {
      counts[p.specialty] = (counts[p.specialty] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([specialty, count]) => ({ specialty, count }))
      .sort((a, b) => b.count - a.count);
  }, [providers]);

  // All unique specialties and cities
  const allSpecialties = useMemo(
    () => [...new Set(providers.map((p) => p.specialty))].sort(),
    [providers],
  );

  // City coverage analysis
  const cityData = useMemo(() => {
    const cityMap: Record<
      string,
      { total: number; specialties: Set<string> }
    > = {};
    for (const p of providers) {
      const c = p.location.city;
      if (!cityMap[c]) cityMap[c] = { total: 0, specialties: new Set() };
      cityMap[c].total += 1;
      cityMap[c].specialties.add(p.specialty);
    }
    return Object.entries(cityMap)
      .map(([city, info]) => {
        const missingSpecialties = allSpecialties.filter(
          (s) => !info.specialties.has(s),
        );
        return {
          city,
          providerCount: info.total,
          specialtiesCovered: info.specialties.size,
          hasGap: missingSpecialties.length > 0,
          missingSpecialties,
        };
      })
      .sort((a, b) => b.providerCount - a.providerCount);
  }, [providers, allSpecialties]);

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <DashboardCard
        icon={BarChart3}
        title="Providers by Specialty"
        description="Distribution of providers across specialties"
      >
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={specialtyData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-subtle)"
              />
              <XAxis
                dataKey="specialty"
                tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="count"
                name="Providers"
                fill="var(--color-brand-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* City coverage table */}
      <DashboardCard
        icon={AlertTriangle}
        title="Coverage by City"
        description="Specialties covered per city and gap flags"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Providers</TableHead>
              <TableHead className="text-right">Specialties</TableHead>
              <TableHead>Gap</TableHead>
              <TableHead>Missing Specialties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityData.map((row) => (
              <TableRow key={row.city}>
                <TableCell className="font-medium text-text-primary">
                  {row.city}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.providerCount}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.specialtiesCovered}/{allSpecialties.length}
                </TableCell>
                <TableCell>
                  {row.hasGap ? (
                    <Badge
                      variant="outline"
                      className="border-status-error bg-status-error-bg text-status-error text-[10px]"
                    >
                      Gap
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-status-success bg-status-success-bg text-status-success text-[10px]"
                    >
                      Covered
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-text-muted">
                  {row.missingSpecialties.length > 0
                    ? row.missingSpecialties.join(", ")
                    : "\u2014"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </div>
  );
}
