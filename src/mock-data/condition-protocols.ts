import type { ConditionProtocol } from "@/types";

export const MOCK_CONDITION_PROTOCOLS: ConditionProtocol[] = [
  {
    id: "proto-001",
    condition: "Diabetes Mellitus",
    icd10Prefix: "E11",
    targetSpecialty: "Endocrinology",
    rules: [
      { dimension: "clinicalQuality", constraint: "gte:80" },
      { dimension: "cost", constraint: "lte:2000" },
      { dimension: "access", constraint: "gte:70" },
    ],
    additionalRequirements: [
      "Certified diabetes educator on-site",
      "HbA1c monitoring every 3 months",
      "Retinal screening capability",
      "Foot care assessment protocol",
    ],
    enabled: true,
  },
  {
    id: "proto-002",
    condition: "Hypertension",
    icd10Prefix: "I10",
    targetSpecialty: "Cardiology",
    rules: [
      { dimension: "clinicalQuality", constraint: "gte:75" },
      { dimension: "patientExperience", constraint: "gte:70" },
      { dimension: "access", constraint: "gte:75" },
    ],
    additionalRequirements: [
      "Cardiologist or nephrologist available",
      "Regular BP monitoring program",
      "24-hour ambulatory BP monitoring capability",
      "Cardiac risk assessment tools",
    ],
    enabled: true,
  },
  {
    id: "proto-003",
    condition: "Cardiac Disease",
    icd10Prefix: "I25",
    targetSpecialty: "Cardiology",
    rules: [
      { dimension: "clinicalQuality", constraint: "gte:85" },
      { dimension: "networkTier", constraint: "gte:80" },
      { dimension: "utilisation", constraint: "gte:60" },
    ],
    additionalRequirements: [
      "Interventional cardiologist on panel",
      "Catheterisation lab access",
      "Cardiac rehabilitation program",
      "24-hour emergency cardiac care",
    ],
    enabled: true,
  },
  {
    id: "proto-004",
    condition: "Asthma / COPD",
    icd10Prefix: "J45",
    targetSpecialty: "Pulmonology",
    rules: [
      { dimension: "clinicalQuality", constraint: "gte:75" },
      { dimension: "access", constraint: "gte:80" },
      { dimension: "cost", constraint: "lte:2500" },
    ],
    additionalRequirements: [
      "Pulmonologist available",
      "Spirometry testing availability",
      "Pulmonary function lab",
      "Smoking cessation program",
    ],
    enabled: true,
  },
  {
    id: "proto-005",
    condition: "Orthopedic Conditions",
    icd10Prefix: "M17",
    targetSpecialty: "Orthopedics",
    rules: [
      { dimension: "clinicalQuality", constraint: "gte:80" },
      { dimension: "patientExperience", constraint: "gte:75" },
      { dimension: "cost", constraint: "lte:4000" },
    ],
    additionalRequirements: [
      "Orthopedic surgeon with joint replacement credentials",
      "Physiotherapy and rehabilitation access",
      "MRI and imaging on-site",
      "Post-surgical rehabilitation pathway",
    ],
    enabled: true,
  },
  {
    id: "proto-006",
    condition: "Mental Health",
    icd10Prefix: "F32",
    targetSpecialty: "General Practice",
    rules: [
      { dimension: "patientExperience", constraint: "gte:85" },
      { dimension: "access", constraint: "gte:80" },
      { dimension: "clinicalQuality", constraint: "gte:70" },
    ],
    additionalRequirements: [
      "Psychiatrist or clinical psychologist available",
      "Cognitive behavioural therapy (CBT) availability",
      "Crisis intervention protocols",
      "Teleconsult option for follow-ups",
    ],
    enabled: true,
  },
];
