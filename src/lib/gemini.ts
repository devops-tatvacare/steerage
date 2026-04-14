import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

export async function generateInsights(kpiData: string): Promise<string[]> {
  const ai = getClient();
  if (!ai) return getFallbackInsights();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a healthcare steerage analytics assistant for a Malaysian TPA (Sumitomo). Given the following KPI data, generate exactly 4 concise actionable insights for a payor operations team. Each insight must be one sentence. Focus on: trends, anomalies, opportunities, and risks. Use Malaysian context (RM currency, Malaysian cities).\n\nKPI Data:\n${kpiData}`,
    });

    const text = response.text ?? "";
    const lines = text
      .split("\n")
      .filter((line: string) => line.trim().length > 0)
      .slice(0, 4);
    return lines.length > 0 ? lines : getFallbackInsights();
  } catch {
    return getFallbackInsights();
  }
}

export async function generateRuleSuggestions(
  currentWeights: string,
  kpiTrends: string,
): Promise<string[]> {
  const ai = getClient();
  if (!ai) return getFallbackRuleSuggestions();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a steerage rule engine optimizer for a Malaysian TPA. Given current scoring weights and KPI trends, suggest exactly 4 specific weight adjustments to improve steerage outcomes. Each suggestion should state: which dimension to adjust, by how much, and why. Be specific and actionable.\n\nCurrent Weights:\n${currentWeights}\n\nKPI Trends:\n${kpiTrends}`,
    });

    const text = response.text ?? "";
    const lines = text
      .split("\n")
      .filter((line: string) => line.trim().length > 0)
      .slice(0, 4);
    return lines.length > 0 ? lines : getFallbackRuleSuggestions();
  } catch {
    return getFallbackRuleSuggestions();
  }
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
