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
