export type HealthStatus = "healthy" | "at_risk" | "critical";

export type ExpansionOpportunity = "high" | "medium" | "low" | "none";

export interface Customer {
  id: string;
  name: string;
  industry: string;
  arr: number;
  healthScore: number;
  renewalDate: string;
  csmOwner: string;
  status: HealthStatus;
  adoptionPercent: number;
  openTickets: number;
  expansionOpportunity: ExpansionOpportunity;
}
