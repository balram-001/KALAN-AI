export type ConflictStatus = 'Open' | 'Needs review' | 'Assigned' | 'Resolved' | 'Ignored';
export type SourceOfTruth = 'Salesforce' | 'HubSpot' | 'Requires review';
export type AssignedRole = 'CRM Admin' | 'RevOps';

export interface ConflictItem {
  id: number;
  company: string;
  type: string;
  hubspot: string;
  salesforce: string;
  sourceOfTruth: SourceOfTruth;
  assignedTo: AssignedRole;
  status: ConflictStatus;
  recommendation: string;
  detectedAt: string;
  lastUpdated: string;
  previousHubspot?: string;
}

export interface ResolutionHistoryItem {
  id: number;
  conflictId: number;
  company: string;
  action: string;
  resolvedBy: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}
