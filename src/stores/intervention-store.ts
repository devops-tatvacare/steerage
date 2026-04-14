import { create } from "zustand";
import type { Intervention } from "@/types";
import { MOCK_INTERVENTIONS } from "@/mock-data/interventions";

interface InterventionStore {
  interventions: Intervention[];
  isLoading: boolean;
  loadInterventions: () => Promise<void>;
  toggleIntervention: (id: string) => void;
  updateIntervention: (id: string, updates: Partial<Intervention>) => void;
  toggleAbTest: (id: string) => void;
}

export const useInterventionStore = create<InterventionStore>((set) => ({
  interventions: [],
  isLoading: false,
  loadInterventions: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ interventions: [...MOCK_INTERVENTIONS], isLoading: false });
  },
  toggleIntervention: (id) => set((s) => ({
    interventions: s.interventions.map((i) => i.id === id ? { ...i, enabled: !i.enabled } : i),
  })),
  updateIntervention: (id, updates) => set((s) => ({
    interventions: s.interventions.map((i) => i.id === id ? { ...i, ...updates } : i),
  })),
  toggleAbTest: (id) => set((s) => ({
    interventions: s.interventions.map((i) => i.id === id ? { ...i, abTestEnabled: !i.abTestEnabled } : i),
  })),
}));
