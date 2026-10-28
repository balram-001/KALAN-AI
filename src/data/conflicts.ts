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
    recommendation: "Resolve the Salesforce validation rule failure, then retry the deal stage update.",
    detectedAt: "21 Oct 2026",
    lastUpdated: "21 Oct 2026, 4:35 PM",
    rootCause: "Validation rule failure"
  },
  {
    id: 1045, company: "Northstar Labs", type: "Owner mismatch", hubspot: "Aarav Patel", salesforce: "Maya Singh", sourceOfTruth: "Salesforce", assignedTo: "CRM Admin", status: "Open", recommendation: "Confirm Maya Singh is active and correctly mapped, then update HubSpot owner from Aarav Patel to Maya Singh.", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:38 PM", rootCause: "Unmapped / inactive Salesforce user"
  },
  {
    id: 1046, company: "Vertex Health", type: "Owner mismatch", hubspot: "Rohan Verma", salesforce: "Unassigned", sourceOfTruth: "HubSpot", assignedTo: "CRM Admin", status: "Needs review", recommendation: "Map the Salesforce user and set the record owner to Rohan Verma.", detectedAt: "21 Oct 2026", lastUpdated: "28 Oct 2026, 3:20 PM", rootCause: "Unmapped / inactive Salesforce user"
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
    id: 1052, company: "Atlas Works", type: "Missing account", hubspot: "Missing", salesforce: "Atlas Works", sourceOfTruth: "Salesforce", assignedTo: "CRM Admin", status: "Open", recommendation: "Link the existing Salesforce account to HubSpot, or create a HubSpot account only if no match exists.", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:52 PM", rootCause: "Missing account mapping"
  },
  {
    id: 1053, company: "Summit Digital", type: "Owner mismatch", hubspot: "Karan Shah", salesforce: "Sara Khan", sourceOfTruth: "Salesforce", assignedTo: "RevOps", status: "Needs review", recommendation: "Update HubSpot owner from Karan Shah to Sara Khan", detectedAt: "21 Oct 2026", lastUpdated: "21 Oct 2026, 4:54 PM"
  },
  {
    id: 1054, company: "Proposal stage sync failures", type: "Sync failed", hubspot: "Proposal", salesforce: "Not available", sourceOfTruth: "HubSpot", assignedTo: "CRM Admin", status: "Open", recommendation: "Map “Proposal” in Salesforce, then retry the 40 affected records.", detectedAt: "28 Oct 2026, 9:42 AM", lastUpdated: "28 Oct 2026, 10:15 AM", groupedFailures: 40, revenueAtRisk: "₹18,00,000", rootCause: "Picklist mismatch"
  }
];
