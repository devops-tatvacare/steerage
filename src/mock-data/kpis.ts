import type { KpiSnapshot } from "@/types";

/** Generate 30-day time series ending today (2026-04-14). */
function makeSeries(
  base: number,
  trendPerDay: number,
  noise: number,
): { date: string; value: number }[] {
  const points: { date: string; value: number }[] = [];
  const end = new Date("2026-04-14");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const val = base + trendPerDay * (29 - i) + (Math.sin(i * 1.3) * noise);
    points.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(val * 100) / 100,
    });
  }
  return points;
}

export const MOCK_KPI_SNAPSHOTS: KpiSnapshot[] = [
  {
    kpiType: "acceptance_rate",
    value: 56,
    trend: 3.2,
    target: 70,
    period: "30d",
    timeSeries: makeSeries(48, 0.27, 2),
  },
  {
    kpiType: "leakage_rate",
    value: 24,
    trend: -2.1,
    target: 15,
    period: "30d",
    timeSeries: makeSeries(29, -0.17, 1.5),
  },
  {
    kpiType: "cost_avoidance",
    value: 342,
    trend: 5.8,
    target: 500,
    period: "30d",
    timeSeries: makeSeries(280, 2.1, 15),
  },
  {
    kpiType: "referral_compliance",
    value: 62,
    trend: 1.5,
    target: 80,
    period: "30d",
    timeSeries: makeSeries(57, 0.17, 2.5),
  },
  {
    kpiType: "fragmentation_rate",
    value: 18,
    trend: -1.3,
    target: 10,
    period: "30d",
    timeSeries: makeSeries(22, -0.13, 1),
  },
  {
    kpiType: "benefits_utilisation",
    value: 54,
    trend: 2.4,
    target: 75,
    period: "30d",
    timeSeries: makeSeries(46, 0.27, 3),
  },
];
