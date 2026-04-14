import { create } from "zustand";
import type { MemberExclusion, NotificationConfig, OverrideRule } from "@/types";
import { MOCK_EXCLUSIONS } from "@/mock-data/members";

interface SettingsStore {
  exclusions: MemberExclusion[];
  globalOverrideRules: OverrideRule[];
  notifications: NotificationConfig[];
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  addExclusion: (exclusion: MemberExclusion) => void;
  removeExclusion: (id: string) => void;
  updateNotification: (channel: string, updates: Partial<NotificationConfig>) => void;
  updateGlobalOverride: (id: string, updates: Partial<OverrideRule>) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  exclusions: [],
  globalOverrideRules: [],
  notifications: [],
  isLoading: false,
  loadSettings: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({
      exclusions: [...MOCK_EXCLUSIONS],
      globalOverrideRules: [
        { id: "go1", name: "Default Dismissal Limit", maxDismissals: 3, cooldownDays: 7, scope: "global", enabled: true },
        { id: "go2", name: "Specialty Override", maxDismissals: 2, cooldownDays: 14, scope: "specialty", enabled: true },
      ],
      notifications: [
        { channel: "push", enabled: true, frequencyCap: 3, cooldownHours: 24 },
        { channel: "sms", enabled: true, frequencyCap: 2, cooldownHours: 48 },
        { channel: "email", enabled: false, frequencyCap: 1, cooldownHours: 72 },
      ],
      isLoading: false,
    });
  },
  addExclusion: (exclusion) => set((s) => ({ exclusions: [...s.exclusions, exclusion] })),
  removeExclusion: (id) => set((s) => ({ exclusions: s.exclusions.filter((e) => e.id !== id) })),
  updateNotification: (channel, updates) => set((s) => ({
    notifications: s.notifications.map((n) => n.channel === channel ? { ...n, ...updates } : n),
  })),
  updateGlobalOverride: (id, updates) => set((s) => ({
    globalOverrideRules: s.globalOverrideRules.map((r) => r.id === id ? { ...r, ...updates } : r),
  })),
}));
