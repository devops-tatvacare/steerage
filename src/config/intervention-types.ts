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
