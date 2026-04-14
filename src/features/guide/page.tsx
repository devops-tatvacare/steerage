import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SlidersHorizontal,
  Building2,
  Megaphone,
  BarChart3,
  Upload,
  ArrowRight,
  Target,
  Users,
  AlertTriangle,
  Stamp,
  FlaskConical,
  Calculator,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface NarrativeStep {
  number: number;
  expertSays: string;
  screen: string;
  path: string;
  icon: React.ElementType;
  whatToShow: string;
  talkingPoint: string;
}

const NARRATIVE: NarrativeStep[] = [
  {
    number: 1,
    expertSays: "Who to steer for",
    screen: "Command Center -- Cohort Segmentation",
    path: "/",
    icon: Target,
    whatToShow: "The 2x2 matrix: High Cost + Engaged vs Not Engaged. Show them their population split.",
    talkingPoint: "These 3 members are your primary steerage targets. These 12 are high-cost but unreachable without app engagement. Steerage starts here.",
  },
  {
    number: 2,
    expertSays: "Prerequisite: people must be on the app",
    screen: "Command Center -- Steerage Readiness",
    path: "/",
    icon: Users,
    whatToShow: "High-cost engagement rate, steerage-eligible pool, engagement opportunity.",
    talkingPoint: "Your high-cost engagement is 20%. Steerage impact is limited until this moves. You need our engagement modules first -- steerage and engagement go hand in hand.",
  },
  {
    number: 3,
    expertSays: "Where to steer -- provider scoring",
    screen: "Rule Engine -- Step 1: Scoring Weights",
    path: "/rule-engine",
    icon: SlidersHorizontal,
    whatToShow: "Provider dimension sliders: clinical quality, cost, access, network tier, utilisation.",
    talkingPoint: "You configure how providers are ranked. Clinical quality 30%, cost 25%, access 15%. These weights determine which provider surfaces when a member searches.",
  },
  {
    number: 4,
    expertSays: "Condition-specific rules",
    screen: "Rule Engine -- Step 2: Condition Rules",
    path: "/rule-engine",
    icon: Sparkles,
    whatToShow: "Condition protocols table: diabetes, hypertension, cardiac with specialty targets.",
    talkingPoint: "For diabetes, always steer to an endocrinologist with a certified diabetes educator. For cardiac, interventional cardiologist with cath lab access. These override the default weights.",
  },
  {
    number: 5,
    expertSays: "Behavioral traits -- acceptance matters",
    screen: "Rule Engine -- Step 3: Thresholds & Behavior",
    path: "/rule-engine",
    icon: AlertTriangle,
    whatToShow: "Override stopping rules, cooldown periods, cost thresholds.",
    talkingPoint: "If a member dismisses a recommendation twice, we stop nudging for 7 days. You can't force steerage -- acceptance rate doesn't go up beyond a point. Rules must be smart about when to push and when to back off.",
  },
  {
    number: 6,
    expertSays: "Pre-auth / GL auto-trigger",
    screen: "Rule Engine -- Step 4: Pre-Authorisation",
    path: "/rule-engine",
    icon: Stamp,
    whatToShow: "Pre-auth trigger rules: procedure + provider tier combinations.",
    talkingPoint: "When a member selects an MRI at a Tier 1 provider, the guarantee letter fires automatically. No manual intervention needed.",
  },
  {
    number: 7,
    expertSays: "How to steer -- nudges, pop-ups, notifications",
    screen: "Interventions",
    path: "/interventions",
    icon: Megaphone,
    whatToShow: "8 intervention types: cost comparison, pre-booking nudge, virtual-first, home cards, etc.",
    talkingPoint: "Cost comparison popup when they pick a non-panel provider. Pre-booking nudge showing RM 920 savings. Virtual-first prompt for conditions treatable online. These fire at the right moment in the member journey.",
  },
  {
    number: 8,
    expertSays: "A/B testing which rules work",
    screen: "Interventions -- A/B toggle",
    path: "/interventions",
    icon: FlaskConical,
    whatToShow: "A/B test toggle per intervention, variant A vs variant B templates.",
    talkingPoint: "We beta test every rule. Which nudge copy gets higher acceptance? Pre-search vs pre-booking timing? This is how you go from 15% to 65% acceptance -- progressive, data-driven.",
  },
  {
    number: 9,
    expertSays: "Three numbers: steered, accepted, savings",
    screen: "Command Center -- ROI Summary",
    path: "/",
    icon: Calculator,
    whatToShow: "Transactions steered count, acceptance rate %, total RM savings, captured vs lost bar.",
    talkingPoint: "49 transactions steered, 44.9% acceptance, RM 13,406 saved. This is the value we deliver. Your cut is the savings, our cut is 10% of it.",
  },
  {
    number: 10,
    expertSays: "ROI commercial model",
    screen: "Command Center -- ROI Summary",
    path: "/",
    icon: TrendingUp,
    whatToShow: "Savings captured vs savings lost proportional bar.",
    talkingPoint: "If a member's average transaction is RM 500 and we shift them to RM 400, that RM 100 per transaction is the saving. Over 5 transactions that's RM 500 per member. 10% of that is our fee. One-time implementation, annual maintenance, plus percentage of savings.",
  },
  {
    number: 11,
    expertSays: "Provider panel management",
    screen: "Provider Network",
    path: "/providers",
    icon: Building2,
    whatToShow: "Tier 1/2/3 providers, radar scorecards, coverage gap analysis.",
    talkingPoint: "Your Tier 1 providers scored and ranked. Gap analysis shows you where panel coverage is thin. This is the provider database that powers the steerage engine.",
  },
  {
    number: 12,
    expertSays: "Bulk data onboarding",
    screen: "Data Onboarding",
    path: "/onboarding",
    icon: Upload,
    whatToShow: "Upload zone, field mapping wizard, validation, import history.",
    talkingPoint: "Upload 412,000 member records, map fields, validate, go live. Provider data, claims history, panel assignments -- everything flows in through here.",
  },
  {
    number: 13,
    expertSays: "KPI governance + feedback loop",
    screen: "Analytics -- Feedback Loop",
    path: "/analytics",
    icon: BarChart3,
    whatToShow: "6 KPI deep dives, CTA trigger log, feedback loop visualization.",
    talkingPoint: "Acceptance rate dropped for cardiology. CTA fired. We adjusted Access weight from 15% to 30%. Rate recovered. This is a closed loop -- measure, act, refine, measure again.",
  },
];

export function GuidePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Guide"
        description="How to walk a payor through the steerage platform -- mapped to expert narrative"
      />

      {/* Opening context */}
      <Card variant="elevated" density="flush" className="overflow-hidden">
        <div className="space-y-3 px-6 py-5">
          <h2 className="text-sm font-semibold text-text-primary">The Pitch in One Sentence</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            We provide a backend steerage engine that integrates with your app to tell you <strong>which provider to recommend</strong> and <strong>when to recommend them</strong>, based on data science across clinical quality, cost, access, and member behavior -- and we charge a percentage of the savings we generate for you.
          </p>
          <Separator />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Commercial Model</p>
              <p className="mt-1 text-sm text-text-primary">One-time implementation + Annual maintenance + % of savings</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Key Prerequisite</p>
              <p className="mt-1 text-sm text-text-primary">Members must be engaged on the app -- steerage without engagement is worthless</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Benchmark</p>
              <p className="mt-1 text-sm text-text-primary">Transcarent went from 15% to 65% acceptance rate with progressive rule tuning</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Narrative steps */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Demo Walkthrough -- 13 Steps</h2>
        <p className="text-xs text-text-muted">Click any step to navigate to the relevant screen. Use the talking points during the demo.</p>
      </div>

      <div className="space-y-2">
        {NARRATIVE.map((step) => {
          const Icon = step.icon;
          return (
            <Link key={step.number} to={step.path} className="block">
              <Card variant="elevated" density="flush" className="overflow-hidden transition-colors hover:bg-bg-hover">
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Step number */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{step.expertSays}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-text-muted" />
                          <span className="text-xs text-text-muted">{step.screen}</span>
                        </div>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-text-placeholder" />
                    </div>

                    <div className="rounded-md bg-[color:var(--color-surface-subtle)] px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">What to show</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{step.whatToShow}</p>
                    </div>

                    <div className="rounded-md border-l-[3px] border-l-brand-primary bg-brand-primary-light px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-primary">Talking point</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{step.talkingPoint}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* What's missing */}
      <Card variant="elevated" density="flush" className="overflow-hidden">
        <div className="space-y-3 px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-text-primary">Gaps to Address</h2>
            <Badge variant="outline" className="border-status-warning text-status-warning">Action needed</Badge>
          </div>
          <div className="rounded-md border border-border-default px-4 py-3">
            <p className="text-sm font-medium text-text-primary">Page 1: "What is Steerage?"</p>
            <p className="mt-1 text-xs text-text-secondary">
              The expert specifically said the first page of the pitch explains what steerage is, why it's needed, what the prerequisites are (engagement), and what the commercial model looks like. This is the "convince them" page before they see the tool. Currently not built -- the Command Center partially covers it but isn't structured as a sales narrative.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
