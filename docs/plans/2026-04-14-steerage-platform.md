# Steerage Configuration Platform -- Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a payor-facing Vite SPA for configuring member steerage -- scoring engine, provider panels, intervention design, KPI monitoring -- with full mock data, Gemini AI integration, and light/dark theming.

**Architecture:** Single-page React app with React Router for navigation, Zustand per-feature stores seeded with typed mock data, CSS custom property design tokens for theming. Follows the managed-care-platform's proven patterns: shadcn/ui primitives, semantic color tokens, compact card-based layouts.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix), Lucide React, Zustand, Recharts, React Hook Form + Zod, Google Gemini SDK (`@google/genai`), Geist font.

**Reference project:** `~/Programs/tc-work/managed-care-platform` -- replicate its design system, component patterns, and store architecture with steerage-specific domain.

---

## File Structure

```
steerage/
  index.html
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  postcss.config.js
  package.json
  .env                              # GEMINI_API_KEY
  src/
    main.tsx                         # React entry
    app.tsx                          # Router + routes
    globals.css                      # Design tokens (light + dark)
    lib/
      cn.ts                          # clsx + tailwind-merge
      gemini.ts                      # Gemini SDK client wrapper
    types/
      index.ts                       # All domain interfaces
    config/
      routes.ts                      # Route definitions + helpers
      navigation.ts                  # Sidebar nav builder
      scoring-dimensions.ts          # Provider + patient dimension registry
      intervention-types.ts          # Intervention type registry
      kpi-definitions.ts             # KPI metadata + thresholds
    mock-data/
      providers.ts                   # 25+ mock providers
      members.ts                     # 30+ mock members
      kpis.ts                        # Time-series KPI snapshots
      interventions.ts               # Intervention configs
      imports.ts                     # Data import records
      alerts.ts                      # CTA alerts
      condition-protocols.ts         # Condition-specific rules
    hooks/
      use-theme.ts                   # Theme toggle (useSyncExternalStore)
    stores/
      dashboard-store.ts
      rule-engine-store.ts
      provider-store.ts
      intervention-store.ts
      member-store.ts
      analytics-store.ts
      onboarding-store.ts
      settings-store.ts
    components/
      ui/                            # shadcn primitives (~20 components)
        button.tsx
        card.tsx
        badge.tsx
        tabs.tsx
        table.tsx
        dialog.tsx
        select.tsx
        input.tsx
        slider.tsx
        switch.tsx
        sheet.tsx
        separator.tsx
        label.tsx
        popover.tsx
        dropdown-menu.tsx
        tooltip.tsx
        progress.tsx
        textarea.tsx
        checkbox.tsx
        avatar.tsx
        scroll-area.tsx
      shared/
        page-header.tsx
        kpi-card.tsx
        dashboard-card.tsx
        status-badge.tsx
        empty-state.tsx
        data-table.tsx               # Reusable sortable table
        sparkline.tsx                # Tiny inline chart
        weight-slider.tsx            # Labeled slider for scoring weights
        trend-indicator.tsx          # Up/down arrow with color
    layout/
      app-shell.tsx                  # Flex shell: sidebar + main
      app-sidebar.tsx                # Collapsible nav sidebar
    features/
      dashboard/
        page.tsx
        components/
          kpi-strip.tsx
          alerts-table.tsx
          ai-insights-panel.tsx
          activity-feed.tsx
          steerage-trends.tsx
      rule-engine/
        page.tsx
        components/
          provider-dimensions.tsx     # Weight sliders for 6 provider dims
          patient-dimensions.tsx      # Weight sliders for 4 patient dims
          condition-protocols.tsx     # Condition -> rules table
          threshold-config.tsx        # Cost + escalation thresholds
          override-logic.tsx          # Stopping rules config
          preauth-triggers.tsx        # Auto GL trigger rules
          ai-rule-suggestions.tsx     # Gemini-powered suggestions
      provider-network/
        page.tsx
        components/
          provider-table.tsx
          provider-scorecard.tsx      # Radar chart + detail
          tier-management.tsx         # Drag-to-tier UI
          gap-analysis.tsx            # Coverage gaps by specialty/geo
      interventions/
        page.tsx
        components/
          intervention-list.tsx
          active-config.tsx           # Cost popup, pre-booking, virtual-first, educational
          passive-config.tsx          # Home cards, tooltips, post-booking
          intervention-editor.tsx     # Template + trigger editor
          preview-panel.tsx           # Mock member-facing preview
      members/
        page.tsx
        detail-page.tsx
        components/
          member-table.tsx
          member-filters.tsx
          member-detail-header.tsx
          steerage-timeline.tsx
          override-log.tsx
      analytics/
        page.tsx
        components/
          acceptance-rate.tsx
          leakage-rate.tsx
          cost-avoidance.tsx
          referral-compliance.tsx
          fragmentation-rate.tsx
          benefits-utilisation.tsx
          cta-trigger-log.tsx
          feedback-loop-viz.tsx
      data-onboarding/
        page.tsx
        components/
          upload-zone.tsx
          field-mapping.tsx
          validation-report.tsx
          import-history.tsx
      settings/
        page.tsx
        components/
          exclusion-management.tsx
          override-rules.tsx
          notification-config.tsx
          plan-config.tsx
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `postcss.config.js`, `index.html`, `.env`, `src/main.tsx`, `src/app.tsx`, `src/vite-env.d.ts`

- [ ] **Step 1: Scaffold Vite project**

```bash
cd /Users/dhspl/Programs/tc-work/steerage
npm create vite@latest . -- --template react-ts
```

Select React + TypeScript if prompted. If the directory isn't empty, accept overwrite.

- [ ] **Step 2: Install all dependencies**

```bash
npm install react-router-dom zustand recharts react-hook-form @hookform/resolvers zod lucide-react class-variance-authority clsx tailwind-merge sonner radix-ui vaul @google/genai
npm install -D tailwindcss @tailwindcss/postcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite for Tailwind v4 + path aliases**

`vite.config.ts`:
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

`tsconfig.app.json` -- add paths:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- [ ] **Step 4: Create PostCSS config**

`postcss.config.js`:
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 5: Create .env**

```
VITE_GEMINI_API_KEY=
```

- [ ] **Step 6: Create entry point**

`src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/app.tsx` (placeholder -- will be expanded in Task 6):
```tsx
export function App() {
  return <div className="min-h-screen bg-bg-secondary text-text-primary">Steerage Platform</div>;
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server at http://localhost:5173 showing "Steerage Platform".

- [ ] **Step 8: Initialize git and commit**

```bash
cd /Users/dhspl/Programs/tc-work/steerage
git init
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
EOF
git add -A
git commit -m "feat: scaffold vite project with react 19, tailwind v4, and dependencies"
```

---

## Task 2: Design Token System

**Files:**
- Create: `src/globals.css`
- Reference: `~/Programs/tc-work/managed-care-platform/src/app/globals.css`

- [ ] **Step 1: Write globals.css with complete token system**

Copy the token architecture from the managed-care-platform reference. The file must include:

1. `@import "tailwindcss";`
2. `@theme { }` block with ALL tokens:
   - shadcn/ui core variables (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, radius)
   - Brand tokens (brand-primary, brand-primary-light, brand-primary-hover)
   - Neutral tokens (text-primary/secondary/muted/placeholder, bg-primary/secondary/hover, border-default/subtle)
   - Surface tokens (canvas, raised, subtle, muted, border, border-strong, ai)
   - Shadow scale (surface-quiet, surface-soft, surface-lifted)
   - Spacing (page-shell, panel-gap, panel-padding, panel-padding-compact)
   - Status triads (success/warning/error/info with fg/bg/border)
   - AI tokens (ai-primary, ai-border)
   - Tier colors (tier-1 green, tier-2 blue, tier-3 amber, out-of-network red)
   - Sidebar colors (bg, text, active-bg, active-text, active-border, divider)
   - Typography (font-sans: Geist Sans, font-mono: Geist Mono)
   - Radius scale (sm 4px, md 6px, lg 8px, xl 12px, full 9999px, panel 0.875rem)
3. `.dark { }` block overriding ALL tokens for dark mode
4. `@layer base { }` with border-color default and body styling

Use the exact same hex values and approach from the managed-care-platform globals.css. This is a proven palette that works in both modes.

- [ ] **Step 2: Add Geist font to index.html**

In `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Also add theme initialization script before `</head>`:
```html
<script>try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch{}</script>
```

- [ ] **Step 3: Verify tokens render**

Update `src/app.tsx` temporarily to show token samples:
```tsx
export function App() {
  return (
    <div className="min-h-screen bg-bg-secondary p-8 font-sans">
      <h1 className="text-xl font-bold text-text-primary">Design Tokens</h1>
      <p className="text-sm text-text-secondary">Secondary text</p>
      <p className="text-xs text-text-muted">Muted text</p>
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-8 rounded-md bg-brand-primary" />
        <div className="h-8 w-8 rounded-md bg-status-success" />
        <div className="h-8 w-8 rounded-md bg-status-warning" />
        <div className="h-8 w-8 rounded-md bg-status-error" />
        <div className="h-8 w-8 rounded-md bg-status-info" />
      </div>
    </div>
  );
}
```

Check browser: tokens should render with correct colors.

- [ ] **Step 4: Commit**

```bash
git add src/globals.css index.html
git commit -m "feat: design token system with light/dark mode"
```

---

## Task 3: UI Primitives (shadcn components)

**Files:**
- Create: `src/lib/cn.ts`, `src/components/ui/*.tsx` (~20 files)
- Reference: `~/Programs/tc-work/managed-care-platform/src/components/ui/`

- [ ] **Step 1: Create cn utility**

`src/lib/cn.ts`:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create all shadcn UI primitives**

Copy each component from the managed-care-platform `src/components/ui/` directory, adapting import paths from `@/lib/cn` and `@/components/ui/*`. Components to create:

1. `button.tsx` -- variants: default, destructive, outline, surface, secondary, ghost. Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm.
2. `card.tsx` -- Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter. Variants: default, subtle, elevated, ai, ghost. Densities: default, compact, relaxed, flush.
3. `badge.tsx` -- variants: default, secondary, destructive, outline, ghost.
4. `tabs.tsx` -- Tabs, TabsList (default + line variant), TabsTrigger, TabsContent.
5. `table.tsx` -- Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption.
6. `dialog.tsx` -- Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription.
7. `select.tsx` -- Select, SelectGroup, SelectValue, SelectTrigger (sizes: sm, default), SelectContent, SelectLabel, SelectItem, SelectSeparator.
8. `input.tsx` -- styled input element.
9. `slider.tsx` -- Radix slider with track, range, thumb.
10. `switch.tsx` -- sizes: sm, default.
11. `sheet.tsx` -- side variants (top, right, bottom, left).
12. `separator.tsx` -- horizontal/vertical.
13. `label.tsx` -- styled label.
14. `popover.tsx` -- Popover, PopoverTrigger, PopoverContent.
15. `dropdown-menu.tsx` -- full menu with sub-menus, checkboxes, radio items.
16. `tooltip.tsx` -- Tooltip, TooltipTrigger, TooltipContent, TooltipProvider.
17. `progress.tsx` -- progress bar.
18. `textarea.tsx` -- styled textarea.
19. `checkbox.tsx` -- Radix checkbox.
20. `scroll-area.tsx` -- Radix scroll area.

Each component must:
- Use `cn()` for class merging
- Use CVA for variant management where appropriate
- Use `data-slot` attributes
- Reference only CSS custom property-based colors (no hardcoded hex)

- [ ] **Step 3: Verify primitives render**

Create a quick test page showing Button variants, Card, Badge, Tabs to confirm they render correctly with the design tokens.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cn.ts src/components/ui/
git commit -m "feat: shadcn ui primitives with design token integration"
```

---

## Task 4: Shared Components

**Files:**
- Create: `src/components/shared/page-header.tsx`, `kpi-card.tsx`, `dashboard-card.tsx`, `status-badge.tsx`, `empty-state.tsx`, `data-table.tsx`, `sparkline.tsx`, `weight-slider.tsx`, `trend-indicator.tsx`

- [ ] **Step 1: Create PageHeader**

Same pattern as managed-care-platform. Props: `title`, `description?`, `actions?`, `className?`, `size?: "default" | "compact"`.

- [ ] **Step 2: Create KpiCard**

Same pattern as managed-care-platform. Props: `label`, `value`, `subtitle?`, `trend?: { direction, value, positive? }`, `icon?`, `className?`. Uses Card with elevated variant, separator between header and content.

- [ ] **Step 3: Create DashboardCard**

Same pattern. Props: `icon?`, `title`, `description?`, `badge?`, `actions?`, `variant?: "default" | "ai"`, `density?: "default" | "compact"`, `showSeparator?`, `children`.

- [ ] **Step 4: Create StatusBadge**

Props: `status: string`, `className?`. Maps status strings to colors:
```typescript
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "border-status-success text-status-success bg-status-success-bg" },
  draft: { label: "Draft", className: "border-border-default text-text-muted" },
  paused: { label: "Paused", className: "border-status-warning text-status-warning bg-status-warning-bg" },
  published: { label: "Published", className: "border-status-success text-status-success bg-status-success-bg" },
  suspended: { label: "Suspended", className: "border-status-error text-status-error bg-status-error-bg" },
  pending: { label: "Pending", className: "border-status-warning text-status-warning bg-status-warning-bg" },
};
```

- [ ] **Step 5: Create EmptyState**

Same pattern. Props: `icon: LucideIcon`, `title`, `description?`, `action?`, `className?`.

- [ ] **Step 6: Create DataTable**

A reusable sortable table wrapper. Props:
```typescript
interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
}
```

Uses the `Table` primitives internally. Manages sort state (column + direction). Shows `EmptyState` when data is empty.

- [ ] **Step 7: Create Sparkline**

Tiny inline chart using Recharts `LineChart` with no axes. Props: `data: number[]`, `color?: string`, `height?: number`, `width?: number`.

```tsx
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = "var(--color-brand-primary)", height = 32 }: SparklineProps) {
  const points = data.map((value, index) => ({ index, value }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 8: Create WeightSlider**

Labeled slider for scoring dimension weights. Props: `label`, `value: number`, `onChange: (v: number) => void`, `max?: number`, `description?`.

```tsx
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";

interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  description?: string;
  className?: string;
}

export function WeightSlider({ label, value, onChange, max = 100, description, className }: WeightSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
        <span className="text-sm font-semibold text-brand-primary">{value}%</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} max={max} step={5} />
    </div>
  );
}
```

- [ ] **Step 9: Create TrendIndicator**

```tsx
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
  invertColor?: boolean;
}

export function TrendIndicator({ value, suffix = "%", invertColor = false }: TrendIndicatorProps) {
  const isPositive = invertColor ? value < 0 : value > 0;
  const isNeutral = value === 0;
  const Icon = value > 0 ? ArrowUp : value < 0 ? ArrowDown : Minus;

  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[11px] font-medium",
      isNeutral ? "text-text-muted" : isPositive ? "text-status-success" : "text-status-error",
    )}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}{suffix}
    </span>
  );
}
```

- [ ] **Step 10: Commit**

```bash
git add src/components/shared/
git commit -m "feat: shared components (page-header, kpi-card, dashboard-card, data-table, sparkline, weight-slider)"
```

---

## Task 5: Types & Config

**Files:**
- Create: `src/types/index.ts`, `src/config/routes.ts`, `src/config/navigation.ts`, `src/config/scoring-dimensions.ts`, `src/config/intervention-types.ts`, `src/config/kpi-definitions.ts`

- [ ] **Step 1: Define all domain types**

`src/types/index.ts` -- all interfaces from the design spec:

```typescript
// ── Scoring ──
export interface ScoringDimension {
  id: string;
  name: string;
  key: string;
  category: "provider" | "patient";
  weight: number;
  enabled: boolean;
  description: string;
  icon: string; // lucide icon name
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
```

- [ ] **Step 2: Define route config**

`src/config/routes.ts`:
```typescript
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Building2,
  Megaphone,
  Users,
  BarChart3,
  Upload,
  Settings,
} from "lucide-react";

export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  group: "primary" | "config";
  showInSidebar: boolean;
}

export const ROUTES = {
  dashboard: { path: "/", label: "Dashboard", icon: LayoutDashboard, group: "primary", showInSidebar: true },
  ruleEngine: { path: "/rule-engine", label: "Rule Engine", icon: SlidersHorizontal, group: "primary", showInSidebar: true },
  providerNetwork: { path: "/providers", label: "Provider Network", icon: Building2, group: "primary", showInSidebar: true },
  interventions: { path: "/interventions", label: "Interventions", icon: Megaphone, group: "primary", showInSidebar: true },
  members: { path: "/members", label: "Members", icon: Users, group: "primary", showInSidebar: true },
  memberDetail: { path: "/members/:id", label: "Member Detail", icon: Users, group: "primary", showInSidebar: false },
  analytics: { path: "/analytics", label: "Analytics", icon: BarChart3, group: "primary", showInSidebar: true },
  dataOnboarding: { path: "/onboarding", label: "Data Onboarding", icon: Upload, group: "config", showInSidebar: true },
  settings: { path: "/settings", label: "Settings", icon: Settings, group: "config", showInSidebar: true },
} as const satisfies Record<string, RouteConfig>;

export type RouteName = keyof typeof ROUTES;

export function getRoute(name: RouteName): RouteConfig {
  return ROUTES[name];
}
```

- [ ] **Step 3: Define navigation config**

`src/config/navigation.ts`:
```typescript
import { ROUTES, type RouteConfig } from "./routes";

export interface NavItem {
  path: string;
  label: string;
  icon: RouteConfig["icon"];
}

export interface SidebarGroup {
  label: string | null;
  items: NavItem[];
}

function buildNavItems(group: "primary" | "config"): NavItem[] {
  return Object.values(ROUTES)
    .filter((r) => r.group === group && r.showInSidebar)
    .map((r) => ({ path: r.path, label: r.label, icon: r.icon }));
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  { label: null, items: buildNavItems("primary") },
  { label: "Configuration", items: buildNavItems("config") },
];
```

- [ ] **Step 4: Define scoring dimensions registry**

`src/config/scoring-dimensions.ts`:
```typescript
import type { ScoringDimension } from "@/types";

export const PROVIDER_DIMENSIONS: ScoringDimension[] = [
  { id: "clinical_quality", name: "Clinical Quality", key: "clinicalQuality", category: "provider", weight: 30, enabled: true, description: "Outcomes, re-admission rates, complication rates, credentials", icon: "Heart" },
  { id: "patient_experience", name: "Patient Experience", key: "patientExperience", category: "provider", weight: 20, enabled: true, description: "NPS, complaint history, grievance addressal rate", icon: "Star" },
  { id: "cost", name: "Cost Efficiency", key: "cost", category: "provider", weight: 25, enabled: true, description: "Cost vs average, generic prescription rate", icon: "DollarSign" },
  { id: "access", name: "Access & Turnaround", key: "access", category: "provider", weight: 15, enabled: true, description: "Time to appointment, proximity, teleconsult availability", icon: "Clock" },
  { id: "network_tier", name: "Network Tier", key: "networkTier", category: "provider", weight: 5, enabled: true, description: "In/out of network, tier within network, cashless coverage", icon: "Shield" },
  { id: "utilisation", name: "Utilisation Signals", key: "utilisation", category: "provider", weight: 5, enabled: true, description: "Over-investigation history, utilisation rate vs peers", icon: "Activity" },
];

export const PATIENT_DIMENSIONS: ScoringDimension[] = [
  { id: "medical_history", name: "Medical History", key: "medicalHistory", category: "patient", weight: 35, enabled: true, description: "Chronic disease flags, symptoms, claims history, risk tier", icon: "FileText" },
  { id: "plan_eligibility", name: "Plan Eligibility", key: "planEligibility", category: "patient", weight: 25, enabled: true, description: "Coverage, in-panel entitlement, remaining benefit limit", icon: "CreditCard" },
  { id: "location_preference", name: "Location & Preference", key: "locationPreference", category: "patient", weight: 25, enabled: true, description: "Proximity, language, previously visited providers", icon: "MapPin" },
  { id: "care_journey", name: "Care Journey Stage", key: "careJourney", category: "patient", weight: 15, enabled: true, description: "New episode, mid-treatment, or follow-up", icon: "Route" },
];
```

- [ ] **Step 5: Define intervention types registry**

`src/config/intervention-types.ts`:
```typescript
export interface InterventionTypeConfig {
  key: string;
  name: string;
  type: "active" | "passive";
  description: string;
  defaultChannels: ("push" | "sms" | "in_app" | "email")[];
  icon: string;
}

export const INTERVENTION_TYPES: InterventionTypeConfig[] = [
  { key: "cost_comparison", name: "Cost Comparison Pop-up", type: "active", description: "Triggered when member selects a non-preferred provider. Shows estimated cost vs area average.", defaultChannels: ["in_app"], icon: "DollarSign" },
  { key: "pre_booking", name: "Pre-Booking Nudge", type: "active", description: "Banner before appointment confirmation showing savings with recommended provider.", defaultChannels: ["in_app"], icon: "Bell" },
  { key: "virtual_first", name: "Virtual-First Prompt", type: "active", description: "Triggered for conditions manageable virtually. Highlights cost and convenience.", defaultChannels: ["in_app"], icon: "Video" },
  { key: "educational", name: "Educational Content", type: "active", description: "Brief educational card above provider results when member searches symptoms.", defaultChannels: ["in_app"], icon: "BookOpen" },
  { key: "home_cards", name: "Home Screen Health Cards", type: "passive", description: "Personalised tiles based on risk profile and benefits utilisation.", defaultChannels: ["in_app", "push"], icon: "LayoutGrid" },
  { key: "recommendation_tooltip", name: "Recommendation Tooltip", type: "passive", description: "Tappable badge on provider cards explaining recommendation reasoning.", defaultChannels: ["in_app"], icon: "Info" },
  { key: "post_booking", name: "Post-Booking Reminder", type: "passive", description: "Soft reminder after booking non-preferred provider about savings.", defaultChannels: ["push", "sms"], icon: "MessageSquare" },
  { key: "geo_triggered", name: "Geo-Triggered Nudge", type: "passive", description: "Push notification when member is near a panel clinic during operating hours.", defaultChannels: ["push"], icon: "MapPin" },
];
```

- [ ] **Step 6: Define KPI definitions**

`src/config/kpi-definitions.ts`:
```typescript
import type { KpiType } from "@/types";

export interface KpiDefinition {
  type: KpiType;
  name: string;
  shortName: string;
  description: string;
  unit: "%" | "currency" | "count" | "rate";
  higherIsBetter: boolean;
  thresholds: { good: number; warning: number; critical: number };
  icon: string;
}

export const KPI_DEFINITIONS: KpiDefinition[] = [
  {
    type: "acceptance_rate", name: "Steerage Acceptance Rate", shortName: "Acceptance", description: "Proportion of recommendations members follow through on",
    unit: "%", higherIsBetter: true, thresholds: { good: 60, warning: 40, critical: 25 }, icon: "CheckCircle2",
  },
  {
    type: "leakage_rate", name: "Out-of-Panel Leakage Rate", shortName: "Leakage", description: "Care episodes where member went out-of-panel",
    unit: "%", higherIsBetter: false, thresholds: { good: 15, warning: 25, critical: 40 }, icon: "AlertTriangle",
  },
  {
    type: "cost_avoidance", name: "Cost Avoidance per Interaction", shortName: "Cost Saved", description: "Estimated savings per accepted steerage interaction",
    unit: "currency", higherIsBetter: true, thresholds: { good: 200, warning: 100, critical: 50 }, icon: "TrendingDown",
  },
  {
    type: "referral_compliance", name: "Referral Compliance Rate", shortName: "Referral Comp.", description: "GP/specialist referrals landing on panel providers",
    unit: "%", higherIsBetter: true, thresholds: { good: 70, warning: 50, critical: 35 }, icon: "FileCheck",
  },
  {
    type: "fragmentation_rate", name: "Chronic Care Fragmentation", shortName: "Fragmentation", description: "Chronic members receiving uncoordinated multi-provider care",
    unit: "%", higherIsBetter: false, thresholds: { good: 10, warning: 20, critical: 35 }, icon: "Unlink",
  },
  {
    type: "benefits_utilisation", name: "Benefits Utilisation Rate", shortName: "Benefits Used", description: "Members who have used at least one entitled benefit",
    unit: "%", higherIsBetter: true, thresholds: { good: 70, warning: 50, critical: 30 }, icon: "Gift",
  },
];

export function getKpiDefinition(type: KpiType): KpiDefinition {
  return KPI_DEFINITIONS.find((k) => k.type === type)!;
}

export function getKpiStatus(type: KpiType, value: number): "good" | "warning" | "critical" {
  const def = getKpiDefinition(type);
  if (def.higherIsBetter) {
    if (value >= def.thresholds.good) return "good";
    if (value >= def.thresholds.warning) return "warning";
    return "critical";
  }
  if (value <= def.thresholds.good) return "good";
  if (value <= def.thresholds.warning) return "warning";
  return "critical";
}
```

- [ ] **Step 7: Commit**

```bash
git add src/types/ src/config/
git commit -m "feat: domain types, route config, scoring/intervention/kpi registries"
```

---

## Task 6: Mock Data Layer

**Files:**
- Create: `src/mock-data/providers.ts`, `members.ts`, `kpis.ts`, `interventions.ts`, `imports.ts`, `alerts.ts`, `condition-protocols.ts`

- [ ] **Step 1: Create provider mock data**

`src/mock-data/providers.ts` -- 25+ providers across specialties (cardiology, endocrinology, orthopedics, general practice, neurology, oncology, dermatology, pediatrics). Each with realistic scores, locations (Malaysian cities for Sumitomo TPA context), tier assignments. Mix of Tier 1/2/3, some with teleconsult, some suspended. Realistic cost figures in RM.

- [ ] **Step 2: Create member mock data**

`src/mock-data/members.ts` -- 30+ members with mix of risk tiers, conditions (diabetes, hypertension, cardiac, respiratory, orthopedic), care journey stages, override counts, fragmentation scores. Include steerage event history per member (5-15 events each). Include exclusions for some members.

- [ ] **Step 3: Create KPI time-series data**

`src/mock-data/kpis.ts` -- 90-day time-series for each of the 6 KPIs. Values should tell a story: acceptance rate trending up (45% -> 58%), leakage trending down (32% -> 22%), cost avoidance growing. Include breakdowns by specialty and geography.

- [ ] **Step 4: Create intervention mock data**

`src/mock-data/interventions.ts` -- One config per intervention type from the registry. Some enabled, some disabled. Include acceptance rates and impression counts. Include trigger conditions.

- [ ] **Step 5: Create import mock data**

`src/mock-data/imports.ts` -- 5 historical imports (members CSV, providers XLSX, claims CSV, panel assignments CSV, provider scores XLSX) in various statuses. Include field mappings and validation results.

- [ ] **Step 6: Create alert mock data**

`src/mock-data/alerts.ts` -- 10-15 CTA alerts triggered by KPI thresholds. Mix of pending/actioned/dismissed. Realistic descriptions referencing specific providers, specialties, and geographies.

- [ ] **Step 7: Create condition protocol mock data**

`src/mock-data/condition-protocols.ts` -- 6 condition-specific protocols: diabetes, hypertension, cardiac, asthma/COPD, orthopedic, mental health. Each with target specialties and specific steering rules.

- [ ] **Step 8: Commit**

```bash
git add src/mock-data/
git commit -m "feat: comprehensive mock data layer for all features"
```

---

## Task 7: Theme Hook & Zustand Stores

**Files:**
- Create: `src/hooks/use-theme.ts`, `src/stores/*.ts` (8 stores)

- [ ] **Step 1: Create theme hook**

`src/hooks/use-theme.ts` -- same `useSyncExternalStore` pattern as managed-care-platform. MutationObserver on `<html>` class. Persists to localStorage.

- [ ] **Step 2: Create dashboard store**

`src/stores/dashboard-store.ts`:
```typescript
import { create } from "zustand";
import type { KpiSnapshot, CtaAlert } from "@/types";
import { MOCK_KPI_SNAPSHOTS } from "@/mock-data/kpis";
import { MOCK_ALERTS } from "@/mock-data/alerts";

interface DashboardStore {
  kpis: KpiSnapshot[];
  alerts: CtaAlert[];
  period: "30d" | "60d" | "90d";
  isLoading: boolean;
  setPeriod: (period: "30d" | "60d" | "90d") => void;
  loadDashboard: () => Promise<void>;
  actionAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  kpis: [],
  alerts: [],
  period: "30d",
  isLoading: false,
  setPeriod: (period) => set({ period }),
  loadDashboard: async () => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 300));
    set({ kpis: MOCK_KPI_SNAPSHOTS, alerts: MOCK_ALERTS, isLoading: false });
  },
  actionAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, status: "actioned" as const, actionedAt: new Date().toISOString() } : a),
  })),
  dismissAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, status: "dismissed" as const } : a),
  })),
}));
```

- [ ] **Step 3: Create rule engine store**

Manages scoring dimension weights (provider + patient), condition protocols, threshold alerts, override rules, preauth triggers. Actions: `updateWeight`, `toggleDimension`, `addProtocol`, `updateProtocol`, `removeProtocol`, `addThreshold`, `updateThreshold`, `removeThreshold`, `addOverrideRule`, `updateOverrideRule`.

- [ ] **Step 4: Create provider store**

Manages provider list, filters (specialty, tier, panel status, search), sort, selected provider for scorecard. Actions: `loadProviders`, `setFilter`, `setSort`, `updateTier`, `updatePanelStatus`.

- [ ] **Step 5: Create intervention store**

Manages intervention list. Actions: `loadInterventions`, `toggleIntervention`, `updateIntervention`, `toggleAbTest`.

- [ ] **Step 6: Create member store**

Manages member list, filters (risk tier, condition, care stage, search), selected member, steerage events. Actions: `loadMembers`, `setFilter`, `selectMember`, `loadMemberEvents`.

- [ ] **Step 7: Create analytics store**

Manages KPI deep-dive data, CTA trigger log, selected KPI for drill-down. Actions: `loadAnalytics`, `selectKpi`, `loadCtaLog`.

- [ ] **Step 8: Create onboarding store**

Manages data imports, current import wizard state. Actions: `loadImports`, `startImport`, `updateMapping`, `validateImport`, `approveImport`.

- [ ] **Step 9: Create settings store**

Manages exclusions, override rules (global), notification config, plan config. Actions: `loadSettings`, `addExclusion`, `removeExclusion`, `updateNotificationConfig`, `updateOverrideRules`.

- [ ] **Step 10: Commit**

```bash
git add src/hooks/ src/stores/
git commit -m "feat: theme hook and zustand stores for all features"
```

---

## Task 8: App Shell & Routing

**Files:**
- Create: `src/layout/app-shell.tsx`, `src/layout/app-sidebar.tsx`, update `src/app.tsx`

- [ ] **Step 1: Create AppSidebar**

`src/layout/app-sidebar.tsx` -- Collapsible sidebar following managed-care-platform pattern:

- Logo/brand section at top ("Steerage" or "PMCares Steerage")
- Navigation groups from `SIDEBAR_GROUPS`
- Each nav item: icon + label, active state highlighting via `useLocation`
- Footer: theme toggle (Sun/Moon icons), collapse button (PanelLeftClose/PanelLeftOpen)
- Desktop: fixed sidebar (collapsed: 60px, expanded: 220px)
- Mobile: hidden (could add sheet overlay later)
- All colors via sidebar tokens (sidebar-bg, sidebar-text, sidebar-active-bg, sidebar-active-text, sidebar-active-border)

- [ ] **Step 2: Create AppShell**

`src/layout/app-shell.tsx`:
```tsx
import { useState } from "react";
import { AppSidebar } from "./app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-bg-secondary p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Set up React Router with all routes**

Update `src/app.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/layout/app-shell";
import { DashboardPage } from "@/features/dashboard/page";
import { RuleEnginePage } from "@/features/rule-engine/page";
import { ProviderNetworkPage } from "@/features/provider-network/page";
import { InterventionsPage } from "@/features/interventions/page";
import { MembersPage } from "@/features/members/page";
import { MemberDetailPage } from "@/features/members/detail-page";
import { AnalyticsPage } from "@/features/analytics/page";
import { DataOnboardingPage } from "@/features/data-onboarding/page";
import { SettingsPage } from "@/features/settings/page";

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/rule-engine" element={<RuleEnginePage />} />
          <Route path="/providers" element={<ProviderNetworkPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:id" element={<MemberDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/onboarding" element={<DataOnboardingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Create placeholder pages for all features**

Each feature page exports a simple component with `PageHeader` and a placeholder message. This ensures routing works before building out each feature.

```tsx
// Example: src/features/dashboard/page.tsx
import { PageHeader } from "@/components/shared/page-header";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Steerage performance overview" />
      <p className="text-sm text-text-muted">Loading...</p>
    </div>
  );
}
```

Create one for each: dashboard, rule-engine, provider-network, interventions, members, members/detail-page, analytics, data-onboarding, settings.

- [ ] **Step 5: Verify routing works**

Start dev server, navigate to each route via sidebar. All should render their placeholder page with correct PageHeader.

- [ ] **Step 6: Commit**

```bash
git add src/layout/ src/app.tsx src/features/
git commit -m "feat: app shell with collapsible sidebar and router for all 8 sections"
```

---

## Task 9: Dashboard Page

**Files:**
- Create/update: `src/features/dashboard/page.tsx`, `src/features/dashboard/components/kpi-strip.tsx`, `alerts-table.tsx`, `ai-insights-panel.tsx`, `activity-feed.tsx`, `steerage-trends.tsx`

- [ ] **Step 1: Build KpiStrip**

Grid of 6 `KpiCard` components, one per KPI. Uses `useDashboardStore` for data. Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-6`. Each card shows value, trend (with `TrendIndicator`), and a `Sparkline` from the time-series data.

- [ ] **Step 2: Build AlertsTable**

`DashboardCard` wrapping a `DataTable` of active CTAs. Columns: severity badge, title, KPI source, action needed, status, timestamp. Row actions: "Action" and "Dismiss" buttons. Filter tabs: All | Pending | Actioned | Dismissed.

- [ ] **Step 3: Build AiInsightsPanel**

`DashboardCard` with `variant="ai"`. Shows 3-4 AI-generated insight bullets based on mock KPI data. Each insight is a compact card with an icon, title, and description. Include a "Refresh Insights" button that will later call Gemini.

For now, hardcode realistic insights:
- "Acceptance rate for cardiology has increased 12% since adjusting Access weight from 15% to 30%"
- "Leakage in Petaling Jaya is driven by 3 GP clinics routing to non-panel cardiologists"
- "Virtual-first prompt is underperforming: only 18% engagement. Consider testing pre-search placement"
- "67% of fragmented chronic care members carry both DM and HTN -- consolidated programme opportunity"

- [ ] **Step 4: Build ActivityFeed**

`DashboardCard` showing recent steerage events. Compact list: timestamp, member name (truncated), event type badge, provider info. Show latest 10 events. Each row is a single line.

- [ ] **Step 5: Build SteerageTrends**

`DashboardCard` with Recharts `AreaChart` showing overlaid trends for acceptance rate and leakage rate over the selected period. Uses `ResponsiveContainer`, dual Y-axes, light fill gradients using brand/status colors.

- [ ] **Step 6: Compose Dashboard page**

```tsx
export function DashboardPage() {
  const { loadDashboard, kpis, period, setPeriod } = useDashboardStore();

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Steerage performance overview"
        actions={/* Period selector: 30d | 60d | 90d tabs */}
      />
      <KpiStrip kpis={kpis} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SteerageTrends kpis={kpis} />
          <AlertsTable />
        </div>
        <div className="space-y-4">
          <AiInsightsPanel />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/features/dashboard/
git commit -m "feat: dashboard with KPI strip, alerts, AI insights, trends, activity feed"
```

---

## Task 10: Rule Engine Page

**Files:**
- Create/update: `src/features/rule-engine/page.tsx` + all components in `components/`

- [ ] **Step 1: Build ProviderDimensions**

Card with 6 `WeightSlider` components for provider scoring dimensions. Shows a total weight indicator (must sum to 100). Each slider dispatches `updateWeight` to `useRuleEngineStore`. Include enable/disable `Switch` per dimension. Show warning badge if weights don't sum to 100.

- [ ] **Step 2: Build PatientDimensions**

Same pattern as ProviderDimensions but for the 4 patient dimensions. Separate card.

- [ ] **Step 3: Build ConditionProtocols**

`DashboardCard` with `DataTable` of condition-specific protocols. Columns: condition, ICD-10 prefix, target specialty, requirements, status toggle. "Add Protocol" button opens a `Dialog` with form (React Hook Form + Zod): condition name, ICD-10 prefix, target specialty (Select), requirements (multi-line), rules list.

- [ ] **Step 4: Build ThresholdConfig**

Card with configurable thresholds:
- Cost threshold alert (RM amount input)
- High-cost claimant threshold (annual RM amount)
- Escalation target (Select: care navigator, medical director, claims review)
Each as a compact row: label, input, operator select, action select, enable toggle.

- [ ] **Step 5: Build OverrideLogic**

Card with override stopping rules:
- Max dismissals before stopping (number input)
- Cooldown period in days (number input)
- Scope selector (global / per-provider / per-specialty)
- Override logging toggle
Table of configured rules with edit/delete actions.

- [ ] **Step 6: Build PreauthTriggers**

Table of auto GL trigger rules. Columns: procedure code, procedure name, provider tier filter, auto-approve toggle. Add/edit via Dialog.

- [ ] **Step 7: Build AiRuleSuggestions**

`DashboardCard variant="ai"` with a "Generate Suggestions" button. When clicked, shows loading state then displays AI-generated weight adjustment suggestions. For now mock data; Gemini integration in Task 16.

- [ ] **Step 8: Compose Rule Engine page**

Tabs layout: "Scoring Weights" | "Condition Protocols" | "Thresholds & Overrides" | "Pre-Auth" | "AI Suggestions"

Tab 1: Two-column grid of ProviderDimensions and PatientDimensions.
Tab 2: ConditionProtocols table.
Tab 3: Two-column grid of ThresholdConfig and OverrideLogic.
Tab 4: PreauthTriggers table.
Tab 5: AiRuleSuggestions panel.

- [ ] **Step 9: Commit**

```bash
git add src/features/rule-engine/
git commit -m "feat: rule engine with scoring weights, condition protocols, thresholds, overrides"
```

---

## Task 11: Provider Network Page

**Files:**
- Create/update: `src/features/provider-network/page.tsx` + components

- [ ] **Step 1: Build ProviderTable**

`DataTable` with columns: name, specialty, tier (badge with tier color), location, panel status (StatusBadge), clinical quality score, cost score, cashless (check/x icon), teleconsult (check/x icon), next available. Sortable by name, tier, any score. Row click opens scorecard.

Filters above table: specialty (Select), tier (Select), panel status (Select), search (Input).

- [ ] **Step 2: Build ProviderScorecard**

Opens in a `Sheet` (slide-out panel) when a provider row is clicked. Shows:
- Provider name, specialty, tier badge, location
- Radar chart (Recharts `RadarChart`) of the 6 scoring dimensions
- Score breakdown table: dimension name, score, weight, weighted score
- Composite score calculation
- Quick actions: Change Tier (Select), Suspend/Activate (Button)

- [ ] **Step 3: Build TierManagement**

Three columns (Tier 1, Tier 2, Tier 3) showing provider counts and lists. Each column is a card with the tier color accent. Shows count badge. Providers can be moved between tiers via a Select on each row (no actual drag-and-drop needed -- Select dropdown is cleaner).

- [ ] **Step 4: Build GapAnalysis**

`DashboardCard` showing coverage gaps. Two views via tabs:
- By Specialty: bar chart (Recharts `BarChart`) showing provider count per specialty, with a "minimum coverage" reference line
- By Geography: table of cities with provider counts, specialties covered, gap flags

- [ ] **Step 5: Compose Provider Network page**

Tabs: "All Providers" | "Tier Management" | "Gap Analysis"

- [ ] **Step 6: Commit**

```bash
git add src/features/provider-network/
git commit -m "feat: provider network with table, scorecard, tier management, gap analysis"
```

---

## Task 12: Interventions Page

**Files:**
- Create/update: `src/features/interventions/page.tsx` + components

- [ ] **Step 1: Build InterventionList**

Grid of intervention cards (2 columns). Each card shows: icon, name, type badge (active/passive), enabled toggle, acceptance rate (if available), impression count, channel badges. Click opens editor.

- [ ] **Step 2: Build InterventionEditor**

Opens in `Dialog`. Sections:
- Name and description (read-only from registry)
- Enable/disable switch
- Channels: checkbox group (push, SMS, in-app, email)
- Trigger conditions: list of condition rows (field Select, operator Select, value Input) with add/remove
- Template: textarea for the nudge message text
- A/B Test: switch to enable, shows variant A/B template inputs when enabled

- [ ] **Step 3: Build PreviewPanel**

A mock phone frame showing how the intervention would appear to a member. Styled as a small mobile screen outline with the nudge rendered inside. Uses intervention type to render different preview layouts:
- Cost comparison: two provider cards with price comparison
- Pre-booking: banner with savings amount
- Virtual-first: modal with telehealth option
- Home card: notification tile

Simple CSS phone frame (border-radius, aspect ratio, nested content area).

- [ ] **Step 4: Build ActiveConfig and PassiveConfig views**

Two tab views filtering interventions by type. Each renders `InterventionList` filtered accordingly. Active tab shows intervention funnel metrics (impressions -> views -> accepts). Passive tab shows engagement rate and frequency.

- [ ] **Step 5: Compose Interventions page**

Tabs: "Active Interventions" | "Passive Interventions" | "All"

Header actions: "Intervention Impact" button showing a summary dialog of total impressions, overall acceptance rate, top performer.

- [ ] **Step 6: Commit**

```bash
git add src/features/interventions/
git commit -m "feat: interventions page with config, editor, preview panel"
```

---

## Task 13: Members Page

**Files:**
- Create/update: `src/features/members/page.tsx`, `detail-page.tsx` + components

- [ ] **Step 1: Build MemberTable**

`DataTable` with columns: name, age, risk tier (badge with tier color), plan type, conditions (truncated badges), care journey stage, steerage score, override count, last activity. Sortable. Row click navigates to `/members/:id`.

- [ ] **Step 2: Build MemberFilters**

Filter bar above table: risk tier (Select), condition (Select from unique conditions in data), care journey stage (Select), search (Input). Filters dispatch to `useMemberStore`.

- [ ] **Step 3: Build MemberDetailHeader**

Top section of detail page: member name, age, gender, plan type. KPI strip of 4 mini cards: risk tier, steerage score, override count, fragmentation score. Badge row: conditions, care journey stage, preferred providers.

- [ ] **Step 4: Build SteerageTimeline**

Vertical timeline of steerage events for the selected member. Each event is a compact card:
- Left: timestamp (date + time)
- Center: event type icon + description
- Right: provider info, cost differential if applicable
- Color coding: green for acceptance, red for override, amber for dismissal, blue for recommendation

Uses a simple CSS vertical line with positioned event nodes.

- [ ] **Step 5: Build OverrideLog**

`DataTable` of override events for the selected member. Columns: date, recommended provider, chosen provider, cost differential, intervention type that was overridden, notes.

- [ ] **Step 6: Compose Members page and Detail page**

Members page: filters + table with row click navigation.
Detail page: breadcrumb ("Members > {name}"), header, then tabs: "Steerage Timeline" | "Override Log" | "Exclusions".
Exclusions tab shows the member's current exclusions with add/remove actions.

- [ ] **Step 7: Commit**

```bash
git add src/features/members/
git commit -m "feat: members list, filters, detail page with steerage timeline and override log"
```

---

## Task 14: Analytics Page

**Files:**
- Create/update: `src/features/analytics/page.tsx` + components

- [ ] **Step 1: Build per-KPI deep dive components**

One component per KPI. Each follows the same pattern:
- Large value display with trend
- Full-width `AreaChart` (Recharts) for the time-series
- Breakdown table below: by specialty, geography, or other relevant dimension
- CTA threshold markers on the chart (horizontal reference lines)

Create: `acceptance-rate.tsx`, `leakage-rate.tsx`, `cost-avoidance.tsx`, `referral-compliance.tsx`, `fragmentation-rate.tsx`, `benefits-utilisation.tsx`.

Each uses the KPI definition from config for metadata, thresholds, and status coloring.

- [ ] **Step 2: Build CTA Trigger Log**

`DataTable` of all CTA alerts across time. Columns: timestamp, KPI source, severity badge, title, action required, status badge, actioned by. Filters: KPI type, severity, status.

- [ ] **Step 3: Build Feedback Loop Viz**

A visual showing the closed loop: KPI signal -> CTA fired -> Action taken -> Rule adjustment -> Measure again. Use a simple flow diagram built with styled divs and connecting lines (CSS only, no external lib needed). Show recent examples of the loop completing:
- "Access weight increased for cardiology (CTA #14) -> Acceptance rate +12%"
- "3 GP clinics flagged for panel education (CTA #8) -> Leakage -6% in PJ"

- [ ] **Step 4: Compose Analytics page**

Tabs: one tab per KPI (6 tabs) + "CTA Log" + "Feedback Loop"

Each KPI tab renders its deep-dive component. Use `variant="line"` tabs.

- [ ] **Step 5: Commit**

```bash
git add src/features/analytics/
git commit -m "feat: analytics with 6 KPI deep dives, CTA log, feedback loop visualization"
```

---

## Task 15: Data Onboarding Page

**Files:**
- Create/update: `src/features/data-onboarding/page.tsx` + components

- [ ] **Step 1: Build UploadZone**

Drop zone styled with dashed border. Accepts CSV and XLSX files (file input, not actual drag-drop). Shows file name, size, and data type selector (members, providers, claims, panel assignments) after selection. "Start Import" button.

- [ ] **Step 2: Build FieldMapping**

Two-column layout: left shows source columns (from "parsed" file), right shows platform target fields (from type definitions). Each row: source field name + Select dropdown of target fields. Auto-map obvious matches (e.g., "member_id" -> "Member ID"). Show mapped/unmapped counts. "Confirm Mapping" button.

- [ ] **Step 3: Build ValidationReport**

Shows validation results: total records, valid records, errors, warnings. Error/warning table: row number, field, issue description, severity badge. "Approve & Go Live" button (disabled if errors > 0). "Download Error Report" link.

- [ ] **Step 4: Build ImportHistory**

`DataTable` of past imports. Columns: file name, data type, record count, status (StatusBadge), errors, uploaded date, completed date. Sort by date.

- [ ] **Step 5: Compose Data Onboarding page**

Top section: UploadZone card.
If an import is in progress, show the wizard steps: Upload -> Map Fields -> Validate -> Review -> Live (stepper using a horizontal progress indicator).
Bottom section: ImportHistory table.

- [ ] **Step 6: Commit**

```bash
git add src/features/data-onboarding/
git commit -m "feat: data onboarding with upload, field mapping wizard, validation, import history"
```

---

## Task 16: Settings Page

**Files:**
- Create/update: `src/features/settings/page.tsx` + components

- [ ] **Step 1: Build ExclusionManagement**

`DataTable` of member exclusions. Columns: member name, exclusion type badge, provider name (if applicable), reason, expiry date, created date. Filters: type (Select). "Add Exclusion" button opens Dialog: member search, type select, provider select, reason textarea, expiry date input.

- [ ] **Step 2: Build OverrideRules (global)**

Card with global override configuration:
- Default max dismissals before stopping (number input)
- Default cooldown period (number input)
- Logging mode: "all" | "overrides only" | "none" (Select)
- Override report frequency: "daily" | "weekly" | "monthly" (Select)

- [ ] **Step 3: Build NotificationConfig**

Table of notification channels (push, SMS, email). Each row: channel name, enabled toggle, frequency cap (number), cooldown hours (number). Additional settings: geo-trigger radius (number + unit), geo-trigger max fires per day (number).

- [ ] **Step 4: Build PlanConfig**

Card showing plan types and benefit categories. Table of plans: name, benefit categories (badge list), coverage rules summary. Add/edit plan via Dialog.

- [ ] **Step 5: Compose Settings page**

Tabs: "Exclusions" | "Override Rules" | "Notifications" | "Plans"

- [ ] **Step 6: Commit**

```bash
git add src/features/settings/
git commit -m "feat: settings with exclusion management, override rules, notification config, plans"
```

---

## Task 17: Gemini SDK Integration

**Files:**
- Create: `src/lib/gemini.ts`
- Update: `src/features/dashboard/components/ai-insights-panel.tsx`, `src/features/rule-engine/components/ai-rule-suggestions.tsx`

- [ ] **Step 1: Create Gemini client wrapper**

`src/lib/gemini.ts`:
```typescript
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

export async function generateInsights(kpiData: string): Promise<string[]> {
  const ai = getClient();
  if (!ai) return getFallbackInsights();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a healthcare steerage analytics assistant. Given the following KPI data, generate 4 concise actionable insights for a payor/insurer operations team. Each insight should be one sentence. Focus on: trends, anomalies, opportunities, and risks.\n\nKPI Data:\n${kpiData}`,
  });

  const text = response.text ?? "";
  return text.split("\n").filter((line) => line.trim().length > 0).slice(0, 4);
}

export async function generateRuleSuggestions(currentWeights: string, kpiTrends: string): Promise<string[]> {
  const ai = getClient();
  if (!ai) return getFallbackRuleSuggestions();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a steerage rule engine optimizer. Given current scoring weights and KPI trends, suggest 3-5 specific weight adjustments to improve steerage outcomes. Each suggestion should state: which dimension to adjust, by how much, and why.\n\nCurrent Weights:\n${currentWeights}\n\nKPI Trends:\n${kpiTrends}`,
  });

  const text = response.text ?? "";
  return text.split("\n").filter((line) => line.trim().length > 0).slice(0, 5);
}

function getFallbackInsights(): string[] {
  return [
    "Acceptance rate for cardiology has increased 12% since adjusting Access weight from 15% to 30%",
    "Leakage in Petaling Jaya is driven by 3 GP clinics routing to non-panel cardiologists",
    "Virtual-first prompt is underperforming at 18% engagement -- consider testing pre-search placement",
    "67% of fragmented chronic care members carry both DM and HTN -- consolidated programme opportunity",
  ];
}

function getFallbackRuleSuggestions(): string[] {
  return [
    "Increase Access & Turnaround weight from 15% to 25% for cardiology searches -- override data shows slot availability is the primary driver of leakage",
    "Reduce Network Tier weight from 5% to 3% and redistribute to Cost -- members are price-sensitive in orthopedic searches",
    "Add a condition-specific override: for DM+HTN comorbidity, force minimum Clinical Quality weight of 40%",
    "Increase Patient Experience weight by 5% for dermatology -- high override rate correlates with low NPS providers being recommended",
  ];
}
```

Check Context7 for latest `@google/genai` SDK docs before finalizing the API call pattern.

- [ ] **Step 2: Wire Gemini into AI Insights Panel**

Update `ai-insights-panel.tsx` to call `generateInsights()` when "Refresh Insights" is clicked. Show loading spinner during call. Display results. Fall back to mock data if no API key.

- [ ] **Step 3: Wire Gemini into AI Rule Suggestions**

Update `ai-rule-suggestions.tsx` to call `generateRuleSuggestions()` with serialized current weights and KPI trends. Show results as suggestion cards with "Apply" buttons.

- [ ] **Step 4: Commit**

```bash
git add src/lib/gemini.ts src/features/dashboard/components/ai-insights-panel.tsx src/features/rule-engine/components/ai-rule-suggestions.tsx
git commit -m "feat: gemini sdk integration for ai insights and rule suggestions"
```

---

## Task 18: Polish & Verification

- [ ] **Step 1: Visual audit in light mode**

Open every page and section. Check:
- All colors from tokens (no hardcoded hex)
- Consistent spacing (p-4 lg:p-6 page padding, space-y-6 sections)
- Typography hierarchy (text-xl bold for page titles, text-sm secondary for descriptions, text-xs muted for labels)
- Card borders and shadows render correctly
- Tables are compact and readable
- Charts render with correct colors

- [ ] **Step 2: Visual audit in dark mode**

Toggle to dark mode. Check every page:
- Text is readable (not too bright, not too dim)
- Card backgrounds use dark tokens
- Charts, badges, and status colors adapt
- No white flashes or unstyled elements
- Sidebar is legible

- [ ] **Step 3: Fix any visual issues found**

Address all issues from both audits.

- [ ] **Step 4: Test all interactions**

- Dashboard: period selector changes data, alert action/dismiss works
- Rule Engine: weight sliders update and reflect in total, protocol CRUD, threshold CRUD
- Providers: filters work, sort works, scorecard opens, tier change works
- Interventions: toggle enables/disables, editor saves, preview shows
- Members: filters work, row click navigates to detail, timeline renders, back navigation works
- Analytics: tab navigation, chart rendering, CTA log filters
- Data Onboarding: upload -> mapping -> validation flow
- Settings: exclusion CRUD, notification config changes

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: polish pass -- visual consistency, interaction verification, dark mode audit"
```

---

## Execution Notes

- **Total tasks:** 18
- **Critical path:** Tasks 1-8 are sequential (foundation). Tasks 9-16 are parallelizable (one per feature section). Tasks 17-18 are final integration.
- **Biggest risk:** Token system (Task 2) and primitives (Task 3) must be perfect -- everything else depends on them.
- **Mock data quality:** Realistic data makes the concept compelling. Use Malaysian context (RM currency, Malaysian cities, local provider names) per the Sumitomo TPA branding.
- **No tests in this plan:** This is a concept/demo, not production code. TDD is skipped intentionally.
