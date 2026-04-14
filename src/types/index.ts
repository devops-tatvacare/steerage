// ── Scoring ──
export interface ScoringDimension {
  id: string;
  name: string;
  key: string;
  category: "provider" | "patient";
  weight: number;
  enabled: boolean;
  description: string;
  icon: string;
}

export interface ConditionProtocol {
  id: string;
  condition: string;
  icd10Prefix: string;
  targetSpecialty: string;
  rules: { dimension: string; constraint: string }[];
  additionalRequirements: string[];
  enabled: boolean;
}

export interface ThresholdAlert {
  id: string;
  name: string;
  metric: string;
  operator: "gt" | "lt" | "gte" | "lte";
  value: number;
  action: "notify" | "escalate" | "auto_trigger";
  escalateTo: string;
  enabled: boolean;
}

export interface OverrideRule {
  id: string;
  name: string;
  maxDismissals: number;
  cooldownDays: number;
  scope: "global" | "provider" | "specialty";
  enabled: boolean;
}

export interface PreauthTrigger {
  id: string;
  procedureCode: string;
  procedureName: string;
  providerTier: number | null;
  autoApprove: boolean;
  enabled: boolean;
}

// ── Providers ──
export interface Provider {
  id: string;
  name: string;
  specialty: string;
  tier: 1 | 2 | 3;
  location: { city: string; state: string; lat: number; lng: number };
  scores: ProviderScores;
  panelStatus: "active" | "suspended" | "pending";
  cashless: boolean;
  teleconsult: boolean;
  nextAvailableSlot: string;
  totalPatients: number;
  avgEpisodeCost: number;
  overrideRate: number;
}

export interface ProviderScores {
  clinicalQuality: number;
  patientExperience: number;
  cost: number;
  access: number;
  networkTier: number;
  utilisation: number;
}

// ── Members ──
export interface Member {
  id: string;
  name: string;
  age: number;
  gender: string;
  planType: string;
  riskTier: "low" | "moderate" | "high" | "critical";
  conditions: string[];
  careJourneyStage: "new_episode" | "mid_treatment" | "follow_up";
  steerageScore: number;
  overrideCount: number;
  fragmentationScore: number;
  lastActivity: string;
  preferredProviders: string[];
  benefitsUsed: number;
  benefitsTotal: number;
  annualSpend: number;
  projectedSpend: number;
}

export interface SteerageEvent {
  id: string;
  memberId: string;
  timestamp: string;
  type: "recommendation" | "acceptance" | "override" | "dismissal" | "escalation" | "navigator_call";
  providerRecommended?: string;
  providerChosen?: string;
  costDifferential?: number;
  interventionType?: string;
  notes?: string;
}

export interface MemberExclusion {
  id: string;
  memberId: string;
  type: "doctor_preference" | "active_referral" | "care_plan";
  providerId?: string;
  providerName?: string;
  reason: string;
  expiresAt: string | null;
  createdAt: string;
}

// ── Interventions ──
export interface Intervention {
  id: string;
  name: string;
  type: "active" | "passive";
  subtype: string;
  enabled: boolean;
  triggerConditions: TriggerCondition[];
  template: string;
  channels: ("push" | "sms" | "in_app" | "email")[];
  abTestEnabled: boolean;
  acceptanceRate?: number;
  impressions?: number;
}

export interface TriggerCondition {
  field: string;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains";
  value: string | number | boolean;
}

// ── KPIs ──
export type KpiType =
  | "acceptance_rate"
  | "leakage_rate"
  | "cost_avoidance"
  | "referral_compliance"
  | "fragmentation_rate"
  | "benefits_utilisation";

export interface KpiSnapshot {
  kpiType: KpiType;
  value: number;
  trend: number;
  target: number;
  period: "30d" | "60d" | "90d";
  timeSeries: { date: string; value: number }[];
}

export interface CtaAlert {
  id: string;
  kpiType: KpiType;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  action: string;
  status: "pending" | "actioned" | "dismissed";
  createdAt: string;
  actionedAt?: string;
}

// ── Data Onboarding ──
export interface DataImport {
  id: string;
  fileName: string;
  fileType: "csv" | "xlsx";
  dataType: "members" | "providers" | "claims" | "panels";
  status: "uploading" | "mapping" | "validating" | "review" | "approved" | "live" | "failed";
  recordCount: number;
  errorCount: number;
  warningCount: number;
  fieldMappings: { source: string; target: string; mapped: boolean }[];
  uploadedAt: string;
  completedAt?: string;
}

// ── Settings ──
export interface NotificationConfig {
  channel: "push" | "sms" | "email";
  enabled: boolean;
  frequencyCap: number;
  cooldownHours: number;
}

export interface PlanConfig {
  id: string;
  name: string;
  benefitCategories: string[];
  coverageRules: string[];
}
