import { create } from "zustand";
import type { Provider } from "@/types";
import { MOCK_PROVIDERS } from "@/mock-data/providers";

interface ProviderFilters {
  specialty: string;
  tier: string;
  panelStatus: string;
  search: string;
}

interface ProviderStore {
  providers: Provider[];
  filters: ProviderFilters;
  selectedProvider: Provider | null;
  isLoading: boolean;
  loadProviders: () => Promise<void>;
  setFilter: (key: keyof ProviderFilters, value: string) => void;
  resetFilters: () => void;
  selectProvider: (provider: Provider | null) => void;
  updateTier: (id: string, tier: 1 | 2 | 3) => void;
  updatePanelStatus: (id: string, status: "active" | "suspended" | "pending") => void;
}

const defaultFilters: ProviderFilters = { specialty: "", tier: "", panelStatus: "", search: "" };

export const useProviderStore = create<ProviderStore>((set) => ({
  providers: [],
  filters: { ...defaultFilters },
  selectedProvider: null,
  isLoading: false,
  loadProviders: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ providers: [...MOCK_PROVIDERS], isLoading: false });
  },
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  selectProvider: (provider) => set({ selectedProvider: provider }),
  updateTier: (id, tier) => set((s) => ({
    providers: s.providers.map((p) => p.id === id ? { ...p, tier } : p),
    selectedProvider: s.selectedProvider?.id === id ? { ...s.selectedProvider, tier } : s.selectedProvider,
  })),
  updatePanelStatus: (id, status) => set((s) => ({
    providers: s.providers.map((p) => p.id === id ? { ...p, panelStatus: status } : p),
  })),
}));
