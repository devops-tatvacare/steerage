import { ROUTES } from "./routes";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
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
