import { create } from "zustand";
import type { Member, SteerageEvent, MemberExclusion } from "@/types";
import { MOCK_MEMBERS, MOCK_STEERAGE_EVENTS, MOCK_EXCLUSIONS } from "@/mock-data/members";

interface MemberFilters {
  riskTier: string;
  condition: string;
  careStage: string;
  search: string;
}

interface MemberStore {
  members: Member[];
  events: SteerageEvent[];
  exclusions: MemberExclusion[];
  filters: MemberFilters;
  selectedMemberId: string | null;
  isLoading: boolean;
  loadMembers: () => Promise<void>;
  setFilter: (key: keyof MemberFilters, value: string) => void;
  resetFilters: () => void;
  selectMember: (id: string | null) => void;
  getFilteredMembers: () => Member[];
  getMemberEvents: (memberId: string) => SteerageEvent[];
  getMemberExclusions: (memberId: string) => MemberExclusion[];
}

const defaultFilters: MemberFilters = { riskTier: "", condition: "", careStage: "", search: "" };

export const useMemberStore = create<MemberStore>((set, get) => ({
  members: [],
  events: [],
  exclusions: [],
  filters: { ...defaultFilters },
  selectedMemberId: null,
  isLoading: false,
  loadMembers: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ members: [...MOCK_MEMBERS], events: [...MOCK_STEERAGE_EVENTS], exclusions: [...MOCK_EXCLUSIONS], isLoading: false });
  },
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  selectMember: (id) => set({ selectedMemberId: id }),
  getFilteredMembers: () => {
    const { members, filters } = get();
    return members.filter((m) => {
      if (filters.riskTier && m.riskTier !== filters.riskTier) return false;
      if (filters.condition && !m.conditions.some((c) => c.toLowerCase().includes(filters.condition.toLowerCase()))) return false;
      if (filters.careStage && m.careJourneyStage !== filters.careStage) return false;
      if (filters.search && !m.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  },
  getMemberEvents: (memberId) => get().events.filter((e) => e.memberId === memberId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  getMemberExclusions: (memberId) => get().exclusions.filter((e) => e.memberId === memberId),
}));
