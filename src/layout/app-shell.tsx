import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-bg-secondary p-4 lg:p-6">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
