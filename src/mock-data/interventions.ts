import type { Intervention } from "@/types";

export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: "intv-001",
    name: "Cost Comparison Nudge",
    type: "active",
    subtype: "cost_comparison",
    enabled: true,
    triggerConditions: [
      { field: "provider.tier", operator: "gte", value: 2 },
      { field: "costDifferential", operator: "gt", value: 500 },
    ],
    template:
      "A Tier 1 provider near you offers the same treatment at RM {{savings}} less. Dr. {{recommendedProvider}} in {{city}} has a {{score}}% quality score. Would you like to explore this option?",
    channels: ["in_app", "push"],
    abTestEnabled: true,
    acceptanceRate: 0.42,
    impressions: 3240,
  },
  {
    id: "intv-002",
    name: "Pre-Booking Steerage",
    type: "active",
    subtype: "pre_booking",
    enabled: true,
    triggerConditions: [
      { field: "member.careJourneyStage", operator: "eq", value: "new_episode" },
      { field: "member.riskTier", operator: "neq", value: "low" },
    ],
    template:
      "Before booking, here are our recommended providers for your {{condition}} care. These providers offer cashless service and have the best clinical outcomes in your area.",
    channels: ["in_app", "email"],
    abTestEnabled: false,
    acceptanceRate: 0.58,
    impressions: 5120,
  },
  {
    id: "intv-003",
    name: "Panel Leakage Alert",
    type: "active",
    subtype: "leakage_prevention",
    enabled: true,
    triggerConditions: [
      { field: "provider.panelStatus", operator: "neq", value: "active" },
      { field: "member.planType", operator: "neq", value: "Corporate Platinum" },
    ],
    template:
      "The selected provider is out-of-panel. Switching to an in-panel provider could save you up to RM {{savings}} in out-of-pocket costs. View recommended alternatives.",
    channels: ["in_app", "sms", "push"],
    abTestEnabled: true,
    acceptanceRate: 0.35,
    impressions: 2180,
  },
  {
    id: "intv-004",
    name: "Benefits Utilisation Reminder",
    type: "passive",
    subtype: "benefits_reminder",
    enabled: true,
    triggerConditions: [
      { field: "member.benefitsUsed", operator: "lt", value: 3 },
      { field: "daysUntilRenewal", operator: "lte", value: 90 },
    ],
    template:
      "You have {{remaining}} unused benefits expiring in {{days}} days. Schedule your annual health screening, dental check-up, or specialist consultation before your plan renews.",
    channels: ["email", "push"],
    abTestEnabled: false,
    acceptanceRate: 0.61,
    impressions: 8450,
  },
  {
    id: "intv-005",
    name: "Follow-Up Compliance Prompt",
    type: "active",
    subtype: "follow_up_compliance",
    enabled: true,
    triggerConditions: [
      { field: "member.careJourneyStage", operator: "eq", value: "follow_up" },
      { field: "daysSinceLastVisit", operator: "gt", value: 30 },
    ],
    template:
      "Your follow-up with Dr. {{providerName}} is overdue. Continuing your treatment plan is important for managing {{condition}}. Book now — next available slot is {{nextSlot}}.",
    channels: ["in_app", "sms"],
    abTestEnabled: false,
    acceptanceRate: 0.48,
    impressions: 4320,
  },
  {
    id: "intv-006",
    name: "Fragmentation Warning",
    type: "active",
    subtype: "fragmentation_alert",
    enabled: true,
    triggerConditions: [
      { field: "member.fragmentationScore", operator: "gt", value: 0.6 },
      { field: "member.overrideCount", operator: "gt", value: 3 },
    ],
    template:
      "You are seeing multiple providers for related conditions, which may lead to gaps in care coordination. Consider consolidating your {{condition}} treatment with a single care team at {{recommendedFacility}}.",
    channels: ["in_app", "email"],
    abTestEnabled: true,
    acceptanceRate: 0.29,
    impressions: 1560,
  },
  {
    id: "intv-007",
    name: "Navigator Outreach",
    type: "active",
    subtype: "navigator_outreach",
    enabled: true,
    triggerConditions: [
      { field: "member.riskTier", operator: "eq", value: "critical" },
      { field: "member.overrideCount", operator: "gte", value: 5 },
    ],
    template:
      "A care navigator will reach out to help coordinate your treatment plan. They can assist with provider selection, appointment scheduling, and ensuring your benefits are maximised.",
    channels: ["sms", "push"],
    abTestEnabled: false,
    acceptanceRate: 0.72,
    impressions: 680,
  },
  {
    id: "intv-008",
    name: "Teleconsult Recommendation",
    type: "passive",
    subtype: "teleconsult_suggestion",
    enabled: true,
    triggerConditions: [
      { field: "member.careJourneyStage", operator: "eq", value: "follow_up" },
      { field: "visitType", operator: "eq", value: "routine_review" },
    ],
    template:
      "Your upcoming follow-up may be suitable for a teleconsult session, saving you time and travel. Dr. {{providerName}} offers video consultations — would you like to switch?",
    channels: ["in_app", "email"],
    abTestEnabled: false,
    acceptanceRate: 0.53,
    impressions: 2890,
  },
];
