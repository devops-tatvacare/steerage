import { create } from "zustand";
import type { KpiSnapshot, CtaAlert } from "@/types";
import { MOCK_KPI_SNAPSHOTS } from "@/mock-data/kpis";
import { MOCK_ALERTS } from "@/mock-data/alerts";

interface DashboardStore {
  kpis: KpiSnapshot[];
  alerts: CtaAlert[];
  period: "30d" | "60d" | "90d";
  isLoading: boolean;
  setPeriod: (period: "30d" | "60d" | "90d") => void;
  loadDashboard: () => Promise<void>;
  actionAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  kpis: [],
  alerts: [],
  period: "30d",
  isLoading: false,
  setPeriod: (period) => set({ period }),
  loadDashboard: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ kpis: MOCK_KPI_SNAPSHOTS, alerts: MOCK_ALERTS, isLoading: false });
  },
  actionAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, status: "actioned" as const, actionedAt: new Date().toISOString() } : a),
  })),
  dismissAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, status: "dismissed" as const } : a),
  })),
}));
