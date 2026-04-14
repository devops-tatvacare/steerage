import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, SlidersHorizontal, Building2, Megaphone, Users, BarChart3, Upload, Settings } from "lucide-react";

export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  group: "primary" | "config";
  showInSidebar: boolean;
}

export const ROUTES = {
  dashboard: { path: "/", label: "Command Center", icon: LayoutDashboard, group: "primary" as const, showInSidebar: true },
  ruleEngine: { path: "/rule-engine", label: "Rule Engine", icon: SlidersHorizontal, group: "primary" as const, showInSidebar: true },
  providerNetwork: { path: "/providers", label: "Provider Network", icon: Building2, group: "primary" as const, showInSidebar: true },
  interventions: { path: "/interventions", label: "Interventions", icon: Megaphone, group: "primary" as const, showInSidebar: true },
  members: { path: "/members", label: "Members", icon: Users, group: "primary" as const, showInSidebar: true },
  memberDetail: { path: "/members/:id", label: "Member Detail", icon: Users, group: "primary" as const, showInSidebar: false },
  analytics: { path: "/analytics", label: "Analytics", icon: BarChart3, group: "primary" as const, showInSidebar: true },
  dataOnboarding: { path: "/onboarding", label: "Data Onboarding", icon: Upload, group: "config" as const, showInSidebar: true },
  settings: { path: "/settings", label: "Settings", icon: Settings, group: "config" as const, showInSidebar: true },
} as const;

export type RouteName = keyof typeof ROUTES;
