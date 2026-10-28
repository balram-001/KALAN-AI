import type { ConflictItem } from '../types/conflict';

export const initialConflicts: ConflictItem[] = [
  {
    id: 1042,
    company: "Acme Inc.",
    type: "Owner mismatch",
    hubspot: "Priya Mehta",
    salesforce: "Priya Mehta",
    sourceOfTruth: "Salesforce",
    assignedTo: "CRM Admin",
    status: "Resolved",
    recommendation: "Updated from Salesforce",
    detectedAt: "21 Oct 2026",
    lastUpdated: "21 Oct 2026, 5:25 PM",
    previousHubspot: "Rahul Sharma"
  },
  {
    id: 1043,
    company: "Beta Security",
    type: "Possible duplicate",
    hubspot: "1 record",
    salesforce: "2 records",
    sourceOfTruth: "Requires review",
    assignedTo: "RevOps",
    status: "Needs review",
    recommendation: "Compare both Salesforce records with the HubSpot record before selecting the master record.",
    detectedAt: "21 Oct 2026",
    lastUpdated: "21 Oct 2026, 4:32 PM"
  },
  {
    id: 1044,
    company: "CloudOps",
    type: "Sync failed",
    hubspot: "Updated",
    salesforce: "Not updated",
    sourceOfTruth: "Salesforce",
    assignedTo: "CRM Admin",
    status: "Open",
    recommendation: "Retry Salesforce update",
    detectedAt: "21 Oct 2026",
    lastUpdated: "21 Oct 2026, 4:35 PM"
  },
  {
    id: 1045, company: "Northstar Labs", type: "Owner mismatch", hubspot: "Aarav Patel", salesforce: "Maya Singh", sourceOfTruth: "Salesforce", assignedTo: "CRM Admin", status: "Open", recommendation: "Update HubSpot owner from Aarav Patel to Maya Singh", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:38 PM"
  },
  {
    id: 1046, company: "Vertex Health", type: "Owner mismatch", hubspot: "Neha Kapoor", salesforce: "Rohan Verma", sourceOfTruth: "Salesforce", assignedTo: "CRM Admin", status: "Needs review", recommendation: "Update HubSpot owner from Neha Kapoor to Rohan Verma", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:40 PM"
  },
  {
    id: 1047, company: "BrightPath", type: "Owner mismatch", hubspot: "Ishaan Roy", salesforce: "Ananya Das", sourceOfTruth: "Salesforce", assignedTo: "RevOps", status: "Assigned", recommendation: "Update HubSpot owner from Ishaan Roy to Ananya Das", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:42 PM"
  },
  {
    id: 1048, company: "Nova Retail", type: "Possible duplicate", hubspot: "1 record", salesforce: "2 records", sourceOfTruth: "Requires review", assignedTo: "CRM Admin", status: "Open", recommendation: "Compare both Salesforce records with the HubSpot record before selecting the master record.", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:44 PM"
  },
  {
    id: 1049, company: "Pioneer Systems", type: "Possible duplicate", hubspot: "2 records", salesforce: "1 record", sourceOfTruth: "Requires review", assignedTo: "RevOps", status: "Needs review", recommendation: "Compare both Salesforce records with the HubSpot record before selecting the master record.", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:46 PM"
  },
  {
    id: 1050, company: "Orbit Finance", type: "Possible duplicate", hubspot: "1 record", salesforce: "3 records", sourceOfTruth: "Requires review", assignedTo: "CRM Admin", status: "Open", recommendation: "Compare both Salesforce records with the HubSpot record before selecting the master record.", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:48 PM"
  },
  {
    id: 1051, company: "Greenline Media", type: "Sync failed", hubspot: "Updated", salesforce: "Not updated", sourceOfTruth: "Salesforce", assignedTo: "RevOps", status: "Assigned", recommendation: "Retry Salesforce update", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:50 PM"
  },
  {
    id: 1052, company: "Atlas Works", type: "Missing account", hubspot: "Account missing", salesforce: "Account present", sourceOfTruth: "Salesforce", assignedTo: "CRM Admin", status: "Open", recommendation: "Create missing HubSpot account", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:52 PM"
  },
  {
    id: 1053, company: "Summit Digital", type: "Owner mismatch", hubspot: "Karan Shah", salesforce: "Sara Khan", sourceOfTruth: "Salesforce", assignedTo: "RevOps", status: "Needs review", recommendation: "Update HubSpot owner from Karan Shah to Sara Khan", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:54 PM"
  },
  {
    id: 1054, company: "Proposal stage sync failures", type: "Sync failed", hubspot: "Proposal", salesforce: "Not available", sourceOfTruth: "Requires review", assignedTo: "CRM Admin", status: "Open", recommendation: "Map the Proposal picklist value before retrying these records.", detectedAt: "28 Oct 2026, 10:15 AM", lastUpdated: "28 Oct 2026, 10:15 AM", groupedFailures: 40, revenueAtRisk: "₹18,00,000", rootCause: "Picklist mismatch — Proposal not available in Salesforce"
  }
];
