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
