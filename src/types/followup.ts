export type FollowUpStatus = 'Detected' | 'Owner Notified' | 'Escalated' | 'Awaiting Action' | 'Awaiting Verification' | 'Resolved';
export interface TimelineEvent { id: number; at: string; text: string; by: string; }
export interface FollowUpLead {
  id: number; name: string; company: string; source: string; priority: 'Urgent' | 'High' | 'Normal';
  owner: string; manager: string; issueAssignee: string; deadline: string; originalDeadline: string;
  overdue: number; lastOutreach: string; status: FollowUpStatus; rule: string; nextAction: string;
  slaBreached: boolean; hubspotId: string; salesforceId: string; timeline: TimelineEvent[];
}
