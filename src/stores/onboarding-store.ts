import { create } from "zustand";
import type { DataImport } from "@/types";
import { MOCK_IMPORTS } from "@/mock-data/imports";

interface OnboardingStore {
  imports: DataImport[];
  currentImport: DataImport | null;
  isLoading: boolean;
  loadImports: () => Promise<void>;
  startImport: (imp: DataImport) => void;
  updateMapping: (index: number, target: string) => void;
  advanceStatus: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  imports: [],
  currentImport: null,
  isLoading: false,
  loadImports: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ imports: [...MOCK_IMPORTS], isLoading: false });
  },
  startImport: (imp) => set({ currentImport: imp }),
  updateMapping: (index, target) => set((s) => {
    if (!s.currentImport) return s;
    const mappings = [...s.currentImport.fieldMappings];
    mappings[index] = { ...mappings[index], target, mapped: true };
    return { currentImport: { ...s.currentImport, fieldMappings: mappings } };
  }),
  advanceStatus: () => set((s) => {
    if (!s.currentImport) return s;
    const order: DataImport["status"][] = ["uploading", "mapping", "validating", "review", "approved", "live"];
    const idx = order.indexOf(s.currentImport.status);
    if (idx < order.length - 1) {
      return { currentImport: { ...s.currentImport, status: order[idx + 1] } };
    }
    return s;
  }),
}));
