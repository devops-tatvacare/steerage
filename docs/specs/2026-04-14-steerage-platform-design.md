# Steerage Configuration Platform -- Design Spec

## Purpose

A payor-facing web application for configuring, monitoring, and optimizing member steerage. Enables insurers/TPAs to set up scoring engines, manage provider panels, design interventions, and track KPIs -- all without engineering intervention.

## Tech Stack

| Layer | Choice |
|---|---|
| Build | Vite + React 19 + TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + CSS custom properties (design tokens) |
| UI Primitives | shadcn/ui (Radix-based) |
| Icons | Lucide React |
| State | Zustand (per-feature stores) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| AI | Google Gemini SDK (`@google/genai`) |
| Font | Geist Sans / Geist Mono |

## Design Token System

All colors via CSS custom properties. Zero hardcoded hex. Light + dark mode via `.dark` class on `<html>`.

### Token Categories

- **Neutrals:** text-primary, text-secondary, text-muted, text-placeholder, bg-primary, bg-secondary, bg-hover, border-default, border-subtle
- **Brand:** brand-primary, brand-primary-light, brand-primary-hover
- **Status (triads):** success, warning, error, info -- each with fg/bg/border variants
- **Tier colors:** tier-1 (green), tier-2 (blue), tier-3 (amber), out-of-network (red)
- **AI accent:** ai-primary, ai-border, ai-bg
- **Shadows:** surface-quiet, surface-soft, surface-lifted
- **Radius:** sm (4px), md (6px), lg (8px), xl (12px)
- **Spacing:** page-shell, panel-gap, panel-padding

## Navigation Structure (8 sections)

### 1. Dashboard
- KPI strip: 6 cards (acceptance rate, leakage rate, cost avoidance, referral compliance, fragmentation rate, benefits utilisation)
- Trend sparklines per KPI (30/60/90 day)
- Active alerts table -- CTAs triggered by KPI thresholds
- AI insights panel (Gemini-powered summary of steerage performance)
- Recent steerage activity feed

### 2. Rule Engine
- **Provider Scoring Dimensions** -- weight sliders for: clinical quality, patient experience, cost, access & turnaround, network tier, utilisation signals
- **Patient Scoring Dimensions** -- weight config for: medical history, plan eligibility, location & preference, care journey stage
- **Condition-Specific Protocols** -- table of condition -> steering rules (e.g., diabetes -> endocrinologist with certified diabetes educator)
- **Threshold Alerts** -- cost threshold config, high-cost claimant escalation threshold
- **Override Logic** -- stopping rules (e.g., after N dismissals, stop nudging), override logging config
- **Pre-auth Triggers** -- auto GL trigger rules per procedure/provider combination
- **AI Rule Suggestions** -- Gemini analyzes KPI data and suggests weight adjustments

### 3. Provider Network
- Provider list with search, filter by tier/specialty/location
- Provider scorecard: radar chart across 6 dimensions
- Tier management: drag to assign Tier 1/2/3
- Panel gap analysis: specialties/geographies with insufficient coverage
- Bulk provider import

### 4. Interventions
- **Active Interventions** (at point of decision):
  - Cost Comparison Pop-up config
  - Pre-Booking Nudge config
  - Virtual-First Prompt config
  - Educational Content config
- **Passive Interventions** (ambient):
  - Home Screen Health Cards config
  - Recommendation Tooltip config
  - Post-Booking Reminder config
- Each intervention: enable/disable toggle, trigger conditions, template editor, A/B test toggle
- Preview panel showing mock member-facing UI

### 5. Members
- Member table: name, risk tier, plan, care journey stage, steerage score, last activity
- Member detail: steerage history timeline, override log, care fragmentation score, active interventions
- Filters: risk tier, plan type, condition, steerage status
- Bulk actions: assign care navigator, flag for review

### 6. Analytics
- **KPI Deep Dives** (one tab per KPI):
  - Acceptance Rate: trend, breakdown by specialty/provider/intervention type
  - Leakage Rate: by specialty, by geography, GP-driven vs member-driven
  - Cost Avoidance: per interaction, aggregate monthly, recovery rate from follow-ups
  - Referral Compliance: by GP clinic, by specialty
  - Fragmentation Rate: by condition, by geography
  - Benefits Utilisation: by benefit type, by employer group
- **CTA Trigger Log**: table of all fired CTAs with status (pending/actioned/dismissed)
- **Feedback Loop**: visualization of KPI -> CTA -> rule adjustment cycle
- **Rule Impact**: before/after comparison when scoring weights change

### 7. Data Onboarding
- Upload zone: drag & drop CSV/XLSX
- Field mapping step: source column -> platform field (Member ID, Plan Type, Claims History, Panel Assignments, Provider Data)
- Validation report: errors, warnings, row counts
- Review & approve gate before data goes live
- Progress indicator with ETA
- Import history log

### 8. Settings
- **Exclusion Management**: member-level exclusions by type (doctor preference, active referral, care plan), configurable expiry
- **Override Stopping Rules**: global config for nudge suppression after N dismissals
- **Notification Preferences**: channels (push, SMS, email), frequency caps, geo-trigger radius
- **Plan Configuration**: plan types, benefit categories, coverage rules
- **Theme**: light/dark toggle

## Data Model (TypeScript interfaces)

```typescript
// Scoring
interface ScoringDimension {
  id: string;
  name: string;
  category: 'provider' | 'patient';
  weight: number; // 0-100, sum to 100 per category
  enabled: boolean;
}

interface ConditionProtocol {
  id: string;
  condition: string;
  icd10Prefix: string;
  rules: { dimension: string; constraint: string }[];
  targetSpecialty: string;
  additionalRequirements: string[];
}

interface ThresholdAlert {
  id: string;
  name: string;
  metric: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte';
  value: number;
  action: 'notify' | 'escalate' | 'auto_trigger';
  escalateTo: string;
}

// Providers
interface Provider {
  id: string;
  name: string;
  specialty: string;
  tier: 1 | 2 | 3;
  location: { lat: number; lng: number; city: string; state: string };
  scores: {
    clinicalQuality: number;
    patientExperience: number;
    cost: number;
    access: number;
    networkTier: number;
    utilisation: number;
  };
  panelStatus: 'active' | 'suspended' | 'pending';
  cashless: boolean;
  teleconsult: boolean;
  nextAvailableSlot: string;
}

// Members
interface Member {
  id: string;
  name: string;
  age: number;
  gender: string;
  planType: string;
  riskTier: 'low' | 'moderate' | 'high' | 'critical';
  conditions: string[];
  careJourneyStage: 'new_episode' | 'mid_treatment' | 'follow_up';
  steerageScore: number;
  overrideCount: number;
  fragmentationScore: number;
  lastActivity: string;
  preferredProviders: string[];
  exclusions: Exclusion[];
}

// Interventions
interface Intervention {
  id: string;
  name: string;
  type: 'active' | 'passive';
  subtype: string; // cost_comparison, pre_booking, virtual_first, etc.
  enabled: boolean;
  triggerConditions: TriggerCondition[];
  template: string;
  abTestEnabled: boolean;
  abVariant?: 'A' | 'B';
  channels: ('push' | 'sms' | 'in_app' | 'email')[];
}

// KPIs
interface KpiSnapshot {
  id: string;
  kpiType: 'acceptance_rate' | 'leakage_rate' | 'cost_avoidance' | 'referral_compliance' | 'fragmentation_rate' | 'benefits_utilisation';
  value: number;
  trend: number; // % change
  period: '30d' | '60d' | '90d';
  timestamp: string;
  breakdown: Record<string, number>;
}

// Data Import
interface DataImport {
  id: string;
  fileName: string;
  fileType: 'csv' | 'xlsx';
  status: 'uploading' | 'mapping' | 'validating' | 'review' | 'approved' | 'live' | 'failed';
  recordCount: number;
  errorCount: number;
  warningCount: number;
  fieldMappings: { source: string; target: string }[];
  uploadedAt: string;
  completedAt?: string;
}
```

## File Structure

```
src/
  app/
    globals.css              # Design tokens, Tailwind config
    layout.tsx               # App shell with sidebar
  components/
    ui/                      # shadcn primitives
    shared/                  # PageHeader, KpiCard, StatusBadge, EmptyState, etc.
  features/
    dashboard/               # Dashboard page + components
    rule-engine/             # Rule builder page + components
    provider-network/        # Provider management
    interventions/           # Intervention config
    members/                 # Member list + detail
    analytics/               # KPI deep dives
    data-onboarding/         # Upload + mapping wizard
    settings/                # Config pages
  stores/                    # Zustand stores per feature
  lib/
    cn.ts                    # Class merge utility
    gemini.ts                # Gemini SDK client
    mock-data/               # Typed mock data generators
  config/
    scoring-dimensions.ts    # Dimension registry
    intervention-types.ts    # Intervention type registry
    kpi-definitions.ts       # KPI config
  hooks/                     # Shared hooks
  types/                     # Shared TypeScript types
```

## Key Interactions

1. **Rule Engine weight adjustment** -> re-ranks provider recommendations in real-time preview
2. **Provider tier change** -> surfaces impact estimate (how many members affected)
3. **Intervention toggle** -> shows projected KPI impact based on historical data
4. **KPI threshold breach** -> generates CTA in dashboard alerts table
5. **AI insights** -> Gemini analyzes mock KPI trends and suggests rule engine adjustments
6. **Data onboarding** -> wizard flow with validation, maps to platform data model
7. **Member detail** -> full steerage timeline showing every recommendation, acceptance, override

## Design Principles

- Tight, compact cards -- no bloated whitespace
- Information density over decoration
- Light/dark mode with zero visual breakage
- Every color from a token, every spacing from a scale
- No custom components where shadcn provides one
- `cn()` for all conditional classes (Tailwind v4 JIT compat)
