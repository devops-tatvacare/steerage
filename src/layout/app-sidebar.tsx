import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_GROUPS } from "@/config/navigation";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/cn";
import { Sun, Moon, PanelLeftClose, PanelLeftOpen, Navigation } from "lucide-react";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-divider bg-sidebar-bg transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-divider px-4">
        <Navigation className="h-5 w-5 shrink-0 text-sidebar-active-text" />
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-active-text">PMCares Steerage</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {SIDEBAR_GROUPS.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-4")}>
            {group.label && !collapsed && (
              <div className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-text/60">
                {group.label}
              </div>
            )}
            {gi > 0 && collapsed && (
              <div className="mx-3 mb-2 border-t border-sidebar-divider" />
            )}
            <div className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "border-l-2 border-sidebar-active-border bg-sidebar-active-bg text-sidebar-active-text"
                        : "border-l-2 border-transparent text-sidebar-text hover:bg-sidebar-active-bg/50 hover:text-sidebar-active-text",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-sidebar-divider p-2 space-y-1">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-text hover:bg-sidebar-active-bg/50 hover:text-sidebar-active-text transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-text hover:bg-sidebar-active-bg/50 hover:text-sidebar-active-text transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4 shrink-0" /> : <PanelLeftClose className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
