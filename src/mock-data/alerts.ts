import type { CtaAlert } from "@/types";

export const MOCK_ALERTS: CtaAlert[] = [
  // ── Pending (6) ──
  {
    id: "alert-001",
    kpiType: "leakage_rate",
    severity: "critical",
    title: "Panel leakage spike in Johor Bahru",
    description:
      "Leakage rate for Cardiology in Johor Bahru reached 38% this week, driven by 12 members choosing out-of-panel providers. Dr. Chen Wei Ming (Tier 3) is the most common override target.",
    action: "Review Johor Bahru cardiology panel coverage and trigger navigator outreach",
    status: "pending",
    createdAt: "2026-04-13T14:22:00Z",
  },
  {
    id: "alert-002",
    kpiType: "acceptance_rate",
    severity: "high",
    title: "Endocrinology acceptance rate dropped below 40%",
    description:
      "Only 37% of steerage recommendations for Endocrinology were accepted in the past 7 days. Members in Kuching and Kota Kinabalu are primarily dismissing recommendations citing distance.",
    action: "Expand East Malaysia endocrinology panel or enable teleconsult options",
    status: "pending",
    createdAt: "2026-04-13T10:05:00Z",
  },
  {
    id: "alert-003",
    kpiType: "fragmentation_rate",
    severity: "high",
    title: "High fragmentation among diabetes patients",
    description:
      "14 diabetes patients in KL are seeing 3+ providers for related conditions. Average fragmentation score is 0.72, well above the 0.4 threshold. Care coordination is breaking down.",
    action: "Assign care navigator to high-fragmentation diabetes cohort",
    status: "pending",
    createdAt: "2026-04-12T16:30:00Z",
  },
  {
    id: "alert-004",
    kpiType: "cost_avoidance",
    severity: "medium",
    title: "Cost avoidance opportunity in Orthopedics",
    description:
      "Members choosing Dr. Azman Shah (Tier 2, suspended) for orthopedic consultations are paying RM 600-900 more per episode than Tier 1 alternatives in Shah Alam.",
    action: "Activate pre-booking steerage for orthopedic appointments in Selangor",
    status: "pending",
    createdAt: "2026-04-12T09:15:00Z",
  },
  {
    id: "alert-005",
    kpiType: "referral_compliance",
    severity: "medium",
    title: "Referral compliance low for Penang oncology",
    description:
      "Only 48% of oncology referrals in Penang follow the recommended pathway. Dr. Tan Soo Lin (suspended) continues to receive direct bookings bypassing referral protocols.",
    action: "Enforce referral gating for oncology in Penang region",
    status: "pending",
    createdAt: "2026-04-11T11:40:00Z",
  },
  {
    id: "alert-006",
    kpiType: "benefits_utilisation",
    severity: "low",
    title: "Corporate Platinum members under-utilising preventive benefits",
    description:
      "62% of Corporate Platinum members have not used any preventive screening benefits with 3 months remaining in the policy year. Total unused value is approximately RM 1.2M.",
    action: "Send benefits reminder campaign to Corporate Platinum segment",
    status: "pending",
    createdAt: "2026-04-10T08:00:00Z",
  },

  // ── Actioned (5) ──
  {
    id: "alert-007",
    kpiType: "leakage_rate",
    severity: "high",
    title: "Dermatology leakage in Petaling Jaya resolved",
    description:
      "Previously flagged 32% leakage rate for Dermatology in PJ. After adding Dr. Wong Siew Mei (Tier 1) to the fast-track panel, leakage dropped to 18%.",
    action: "Monitor for sustained improvement over next 14 days",
    status: "actioned",
    createdAt: "2026-03-28T13:00:00Z",
    actionedAt: "2026-04-02T10:30:00Z",
  },
  {
    id: "alert-008",
    kpiType: "acceptance_rate",
    severity: "medium",
    title: "Pulmonology steerage improved after teleconsult rollout",
    description:
      "Acceptance rate for Pulmonology recommendations increased from 41% to 58% after enabling teleconsult with Dr. Ong Boon Huat for follow-up visits in Kuching.",
    action: "Expand teleconsult to other specialties in East Malaysia",
    status: "actioned",
    createdAt: "2026-03-20T09:00:00Z",
    actionedAt: "2026-03-25T14:15:00Z",
  },
  {
    id: "alert-009",
    kpiType: "cost_avoidance",
    severity: "critical",
    title: "Cardiac cost spike contained",
    description:
      "Navigator outreach to 8 high-risk cardiac patients in KL who were booking non-panel providers resulted in RM 24,000 in cost avoidance over 2 weeks.",
    action: "Continue navigator program for cardiac critical-risk segment",
    status: "actioned",
    createdAt: "2026-03-15T11:20:00Z",
    actionedAt: "2026-03-22T16:00:00Z",
  },
  {
    id: "alert-010",
    kpiType: "fragmentation_rate",
    severity: "medium",
    title: "COPD care consolidation in Ipoh",
    description:
      "Successfully consolidated 6 COPD patients from 3 providers down to Dr. Harith Iskandar (Tier 3) and Dr. Rajan Krishnan (Tier 1). Fragmentation score dropped from 0.65 to 0.28.",
    action: "Replicate consolidation approach for asthma patients",
    status: "actioned",
    createdAt: "2026-03-10T14:30:00Z",
    actionedAt: "2026-03-18T09:45:00Z",
  },
  {
    id: "alert-011",
    kpiType: "referral_compliance",
    severity: "high",
    title: "Neurology referral pathway enforced in KL",
    description:
      "After implementing pre-booking steerage for neurology, referral compliance in KL rose from 52% to 71%. Dr. Farah Aminah now receives 85% of steered referrals.",
    action: "Extend pre-booking steerage to Penang neurology",
    status: "actioned",
    createdAt: "2026-03-05T10:00:00Z",
    actionedAt: "2026-03-12T11:30:00Z",
  },

  // ── Dismissed (3) ──
  {
    id: "alert-012",
    kpiType: "benefits_utilisation",
    severity: "low",
    title: "Basic Bronze utilisation appears low but within norms",
    description:
      "Benefits utilisation for Basic Bronze plan at 38%. Analysis shows this is consistent with the limited benefit set — members are using available benefits at expected rates.",
    action: "No action required — within acceptable range for plan type",
    status: "dismissed",
    createdAt: "2026-03-25T08:00:00Z",
    actionedAt: "2026-03-26T09:00:00Z",
  },
  {
    id: "alert-013",
    kpiType: "leakage_rate",
    severity: "medium",
    title: "Melaka GP leakage seasonal pattern",
    description:
      "GP leakage in Melaka spiked to 28% during Hari Raya period. Historical data shows this is a recurring seasonal pattern due to provider holiday schedules.",
    action: "Dismiss — seasonal pattern, will normalise within 2 weeks",
    status: "dismissed",
    createdAt: "2026-03-30T12:00:00Z",
    actionedAt: "2026-03-31T08:30:00Z",
  },
  {
    id: "alert-014",
    kpiType: "cost_avoidance",
    severity: "low",
    title: "Pediatrics cost differential negligible",
    description:
      "Cost differential between Tier 1 and Tier 3 pediatrics providers in Kota Kinabalu averages only RM 85 per episode. Steerage effort would exceed potential savings.",
    action: "Dismiss — cost differential below steerage threshold",
    status: "dismissed",
    createdAt: "2026-04-01T10:00:00Z",
    actionedAt: "2026-04-02T14:00:00Z",
  },
];
