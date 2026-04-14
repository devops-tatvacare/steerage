import { create } from "zustand";
import type { ScoringDimension, ConditionProtocol, ThresholdAlert, OverrideRule, PreauthTrigger } from "@/types";
import { PROVIDER_DIMENSIONS, PATIENT_DIMENSIONS } from "@/config/scoring-dimensions";
import { MOCK_CONDITION_PROTOCOLS } from "@/mock-data/condition-protocols";

interface RuleEngineStore {
  providerDimensions: ScoringDimension[];
  patientDimensions: ScoringDimension[];
  conditionProtocols: ConditionProtocol[];
  thresholds: ThresholdAlert[];
  overrideRules: OverrideRule[];
  preauthTriggers: PreauthTrigger[];
  isLoading: boolean;
  loadRuleEngine: () => Promise<void>;
  updateProviderWeight: (id: string, weight: number) => void;
  updatePatientWeight: (id: string, weight: number) => void;
  toggleDimension: (category: "provider" | "patient", id: string) => void;
  addConditionProtocol: (protocol: ConditionProtocol) => void;
  updateConditionProtocol: (id: string, updates: Partial<ConditionProtocol>) => void;
  removeConditionProtocol: (id: string) => void;
  addThreshold: (threshold: ThresholdAlert) => void;
  updateThreshold: (id: string, updates: Partial<ThresholdAlert>) => void;
  removeThreshold: (id: string) => void;
  addOverrideRule: (rule: OverrideRule) => void;
  updateOverrideRule: (id: string, updates: Partial<OverrideRule>) => void;
  removeOverrideRule: (id: string) => void;
}

export const useRuleEngineStore = create<RuleEngineStore>((set) => ({
  providerDimensions: [],
  patientDimensions: [],
  conditionProtocols: [],
  thresholds: [],
  overrideRules: [],
  preauthTriggers: [],
  isLoading: false,

  loadRuleEngine: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({
      providerDimensions: [...PROVIDER_DIMENSIONS],
      patientDimensions: [...PATIENT_DIMENSIONS],
      conditionProtocols: [...MOCK_CONDITION_PROTOCOLS],
      thresholds: [
        { id: "t1", name: "High Episode Cost", metric: "episode_cost", operator: "gt", value: 5000, action: "notify", escalateTo: "care_navigator", enabled: true },
        { id: "t2", name: "High-Cost Claimant", metric: "annual_spend", operator: "gt", value: 50000, action: "escalate", escalateTo: "medical_director", enabled: true },
        { id: "t3", name: "Repeated Override", metric: "override_count", operator: "gte", value: 5, action: "escalate", escalateTo: "care_navigator", enabled: true },
      ],
      overrideRules: [
        { id: "o1", name: "Global Dismissal Limit", maxDismissals: 3, cooldownDays: 7, scope: "global", enabled: true },
        { id: "o2", name: "Provider-Level Limit", maxDismissals: 2, cooldownDays: 30, scope: "provider", enabled: true },
      ],
      preauthTriggers: [
        { id: "pa1", procedureCode: "MRI-001", procedureName: "MRI Brain", providerTier: 1, autoApprove: true, enabled: true },
        { id: "pa2", procedureCode: "SURG-010", procedureName: "Knee Replacement", providerTier: null, autoApprove: false, enabled: true },
        { id: "pa3", procedureCode: "CARD-005", procedureName: "Cardiac Catheterization", providerTier: 1, autoApprove: true, enabled: true },
      ],
      isLoading: false,
    });
  },

  updateProviderWeight: (id, weight) => set((s) => ({
    providerDimensions: s.providerDimensions.map((d) => d.id === id ? { ...d, weight } : d),
  })),
  updatePatientWeight: (id, weight) => set((s) => ({
    patientDimensions: s.patientDimensions.map((d) => d.id === id ? { ...d, weight } : d),
  })),
  toggleDimension: (category, id) => set((s) => {
    const key = category === "provider" ? "providerDimensions" : "patientDimensions";
    return { [key]: s[key].map((d) => d.id === id ? { ...d, enabled: !d.enabled } : d) };
  }),
  addConditionProtocol: (protocol) => set((s) => ({ conditionProtocols: [...s.conditionProtocols, protocol] })),
  updateConditionProtocol: (id, updates) => set((s) => ({ conditionProtocols: s.conditionProtocols.map((p) => p.id === id ? { ...p, ...updates } : p) })),
  removeConditionProtocol: (id) => set((s) => ({ conditionProtocols: s.conditionProtocols.filter((p) => p.id !== id) })),
  addThreshold: (threshold) => set((s) => ({ thresholds: [...s.thresholds, threshold] })),
  updateThreshold: (id, updates) => set((s) => ({ thresholds: s.thresholds.map((t) => t.id === id ? { ...t, ...updates } : t) })),
  removeThreshold: (id) => set((s) => ({ thresholds: s.thresholds.filter((t) => t.id !== id) })),
  addOverrideRule: (rule) => set((s) => ({ overrideRules: [...s.overrideRules, rule] })),
  updateOverrideRule: (id, updates) => set((s) => ({ overrideRules: s.overrideRules.map((r) => r.id === id ? { ...r, ...updates } : r) })),
  removeOverrideRule: (id) => set((s) => ({ overrideRules: s.overrideRules.filter((r) => r.id !== id) })),
}));
