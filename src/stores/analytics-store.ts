import { create } from "zustand";
import type { KpiSnapshot, CtaAlert, KpiType } from "@/types";
import { MOCK_KPI_SNAPSHOTS } from "@/mock-data/kpis";
import { MOCK_ALERTS } from "@/mock-data/alerts";

interface AnalyticsStore {
  kpis: KpiSnapshot[];
  ctaLog: CtaAlert[];
  selectedKpi: KpiType;
  isLoading: boolean;
  loadAnalytics: () => Promise<void>;
  selectKpi: (kpi: KpiType) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  kpis: [],
  ctaLog: [],
  selectedKpi: "acceptance_rate",
  isLoading: false,
  loadAnalytics: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ kpis: MOCK_KPI_SNAPSHOTS, ctaLog: MOCK_ALERTS, isLoading: false });
  },
  selectKpi: (kpi) => set({ selectedKpi: kpi }),
}));
