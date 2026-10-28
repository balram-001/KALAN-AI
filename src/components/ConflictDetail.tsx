import React, { useState } from 'react';
import { X, RotateCw, Trash2 } from 'lucide-react';
import type { ConflictItem, ResolutionHistoryItem, SourceOfTruth } from '../types/conflict';

interface ConflictDetailProps {
  conflict: ConflictItem;
  onClose: () => void;
  onAssignRevOps: (id: number) => void;
  onIgnore: (id: number) => void;
  onRetrySync: (id: number) => void;
  onApplyFix: (id: number) => void;
  onWorkflowAction: (id: number, action: string) => void;
  onViewError: (id: number) => void;
  onSourceChange: (id: number, source: SourceOfTruth) => void;
  history: ResolutionHistoryItem[];
  isRetrying: boolean;
}

export const ConflictDetail: React.FC<ConflictDetailProps> = ({
  conflict,
  onClose,
  onAssignRevOps,
  onIgnore,
  onRetrySync,
  onApplyFix,
  onWorkflowAction,
  onViewError,
  onSourceChange,
  history,
  isRetrying,
}) => {
  const [rootCause, setRootCause] = useState(conflict.rootCause ?? (conflict.type === 'Owner mismatch' ? 'Unmapped / inactive Salesforce user' : conflict.type === 'Possible duplicate' ? 'Duplicate record' : conflict.type === 'Sync failed' ? 'Validation rule failure' : 'Routing rule conflict'));
  const field = conflict.type === 'Owner mismatch' ? 'Record owner' : conflict.type === 'Possible duplicate' ? 'Account record' : conflict.type === 'Sync failed' ? 'Salesforce sync' : 'Account mapping';
  const hubspotLabel = conflict.type === 'Owner mismatch' ? 'HubSpot' : conflict.type === 'Possible duplicate' ? 'HubSpot records' : conflict.type === 'Sync failed' ? 'HubSpot status' : 'HubSpot account';
  const salesforceLabel = conflict.type === 'Owner mismatch' ? 'Salesforce' : conflict.type === 'Possible duplicate' ? 'Salesforce records' : conflict.type === 'Sync failed' ? 'Salesforce status' : 'Salesforce account';
  const conflictHistory = history.filter((item, index, entries) => item.conflictId === conflict.id && entries.findIndex((candidate) => candidate.conflictId === item.conflictId && candidate.action === item.action) === index).slice(0, 4);
  const isPicklistMismatch = conflict.rootCause === 'Picklist mismatch';
  const fieldDiffs = conflict.groupedFailures
    ? [['Deal stage', 'Proposal', 'Not available', 'Yes'], ['Deal name', 'Acme – CRM rollout', 'Acme – CRM rollout', 'No'], ['Amount', '₹4,50,000', '₹4,50,000', 'No'], ['Owner', 'Balram', 'Balram', 'No']]
    : conflict.type === 'Owner mismatch'
    ? [['Owner', conflict.hubspot, conflict.salesforce, 'Yes'], ['Email', 'rahul@company.com', 'rahul@company.com', 'No'], ['Phone', '+91 98xxxxxxx', 'blank', 'Yes'], ['Company', conflict.company, conflict.company, 'No']]
    : [['Primary field', conflict.hubspot, conflict.salesforce, 'Yes'], ['Company', conflict.company, conflict.company, 'No']];
  return (
    <aside className="w-96 min-h-0 overflow-y-auto bg-white border-l border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-lg z-10 animate-in slide-in-from-right duration-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{conflict.company}</h3>
            <span
              className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                conflict.status === 'Open'
                  ? 'bg-red-50 text-red-600'
                  : conflict.status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-600'
                  : conflict.status === 'Assigned'
                  ? 'bg-indigo-50 text-indigo-600'
                  : conflict.status === 'Ignored'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {conflict.status}
            </span>
          </div>

          {conflict.type === 'Owner mismatch' && <><div><label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Difference</label><p className="font-medium text-slate-800">{conflict.status === 'Resolved' ? 'Values match' : 'Values do not match'}</p></div><p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">{conflict.salesforce} must be an active, matching user in HubSpot before applying this update.</p></>}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Conflict</label>
            <p className="font-medium text-slate-800">#{conflict.id}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Issue</label>
            <p className="font-medium text-slate-800">{conflict.type}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Field</label>
            <p className="font-medium text-slate-800">{field}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Conflict type</label>
            <p className="font-medium text-slate-800">{conflict.type === 'Owner mismatch' ? 'Value mismatch' : conflict.type}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Detected</label>
            <p className="font-medium text-slate-800">{conflict.detectedAt}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Assigned to</label>
            <p className="font-medium text-slate-800">{conflict.assignedTo}</p>
          </div>

          {conflict.type === 'Owner mismatch' && <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5"><p className="text-xs font-semibold uppercase tracking-wider text-blue-500">Investigation</p><p className="mt-1 text-sm font-medium text-slate-800">Contact: Rahul Sharma</p><p className="mt-1 text-sm text-slate-600">Open deal: ₹4,50,000 · Proposal · <span className="font-medium text-red-600">Revenue at risk: High</span></p><p className="mt-1 text-xs text-slate-500">Last successful sync: Oct 24, 2026, 6:12 PM</p></div>}

          {conflict.groupedFailures && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5"><p className="text-sm font-bold text-amber-900">{conflict.groupedFailures} failed syncs</p><p className="mt-1 text-sm text-amber-800">Root cause: {conflict.rootCause}</p><p className="mt-1 text-sm text-amber-800">Revenue at risk: {conflict.revenueAtRisk}</p><p className="mt-1 text-xs text-amber-700">Grouped issue · Suggested owner: CRM Admin</p></div>}

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">{hubspotLabel}</label>
            <p className="font-medium text-slate-800">{conflict.previousHubspot ? `${conflict.previousHubspot} → ${conflict.hubspot}` : conflict.hubspot}</p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Field-level diff</h4>
            <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-2">Field</th><th className="p-2">HubSpot</th><th className="p-2">Salesforce</th><th className="p-2">Conflict</th></tr></thead><tbody>{fieldDiffs.map(([fieldName, hubspotValue, salesforceValue, mismatch]) => <tr key={fieldName} className="border-t border-slate-100"><td className="p-2 font-medium text-slate-700">{fieldName}</td><td className="p-2 text-slate-600">{hubspotValue}</td><td className="p-2 text-slate-600">{salesforceValue}</td><td className={`p-2 font-medium ${mismatch === 'Yes' ? 'text-red-600' : 'text-emerald-600'}`}>{mismatch}</td></tr>)}</tbody></table></div>
          </div>

          <div className="rounded-xl border border-violet-100 bg-violet-50 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Likely root cause</p><p className="mt-1 text-sm font-semibold text-slate-800">{conflict.rootCause ?? rootCause}</p>{conflict.type === 'Owner mismatch' && <p className="mt-1 text-xs text-slate-600">The Salesforce owner could not be resolved because the user mapping is missing or inactive.</p>}<p className="mt-1 text-xs text-slate-600">Suggested owner: {rootCause.includes('Routing') || rootCause.includes('Duplicate') ? 'RevOps' : 'CRM Admin'}</p>
            <label className="mt-3 block text-xs font-semibold text-slate-500">Confirm root cause</label><select value={rootCause} onChange={(event) => setRootCause(event.target.value)} className="mt-1 w-full rounded-lg border border-violet-200 bg-white p-2 text-xs text-slate-700"><option>Routing rule conflict</option><option>Unmapped / inactive Salesforce user</option><option>Validation rule failure</option><option>Picklist mismatch</option><option>Duplicate record</option></select>
            <button onClick={() => onWorkflowAction(conflict.id, `Root cause confirmed: ${rootCause}`)} className="mt-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700">Confirm triage</button>
          </div>

          <div className="rounded-xl border border-slate-200 p-3.5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">System of record</p><p className="mt-2 text-sm text-slate-700">Owner: <b>HubSpot</b></p><p className="mt-1 text-sm text-slate-700">Phone: <b>Salesforce</b></p></div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">{salesforceLabel}</label>
            <p className="font-medium text-slate-800">{conflict.salesforce}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Source of truth</label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(['Salesforce', 'HubSpot', 'Requires review'] as SourceOfTruth[]).map((source) => <button key={source} onClick={() => onSourceChange(conflict.id, source)} className={`rounded-md px-1 py-2 text-xs font-medium transition ${conflict.sourceOfTruth === source ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{source}</button>)}
            </div>
          </div>

          {(conflict.type === 'Sync failed' || conflict.type === 'Owner mismatch') && <div><label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Sync direction</label><p className="font-medium text-slate-800">{conflict.type === 'Owner mismatch' ? (conflict.sourceOfTruth === 'HubSpot' ? 'HubSpot → Salesforce' : 'Salesforce → HubSpot') : 'HubSpot → Salesforce'}</p></div>}

          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl mt-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Recommended action
            </label>
            <p className="font-medium text-slate-800 leading-snug">{conflict.recommendation}</p>
          </div>

          <p className="text-xs text-slate-400">Last updated: {conflict.lastUpdated}</p>

          {conflict.type === 'Sync failed' && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500">Error</p><p className="font-semibold text-red-700">Salesforce update failed</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-500">Error type</p><p className="text-red-700">{isPicklistMismatch ? 'Configuration / data mapping error' : 'Transient sync error'}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-500">Details</p><p className="text-red-700">{isPicklistMismatch ? 'Proposal is valid in HubSpot but is not mapped to a Salesforce picklist value.' : 'The record could not be updated in Salesforce. No changes were applied.'}</p>
              <p className="mt-3 text-red-600">Last attempt: {conflict.lastUpdated}</p><p className="mt-1 text-red-600">Retry count: 2 of 5</p><p className="mt-1 text-red-600">Auto-retry: {isPicklistMismatch ? 'Disabled' : 'Enabled'}</p><p className="mt-1 text-red-600">{isPicklistMismatch ? 'Reason: Retry will fail until the Salesforce picklist value is mapped.' : 'Next automatic retry: in 2 minutes'}</p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Activity</h4>
            <div className="mt-3 space-y-3 text-sm">
              {conflictHistory.map((item) => <div key={item.id}><p className="text-xs text-slate-400">{item.timestamp}</p><p className="text-slate-700">{item.action}{item.oldValue && ` from ${item.oldValue} to ${item.newValue}`}</p><p className="text-xs text-slate-400">By: {item.resolvedBy}</p></div>)}
              {conflict.type === 'Sync failed' && <div><p className="text-xs text-slate-400">{conflict.lastUpdated}</p><p className="text-slate-700">Sync attempt failed</p><p className="text-xs text-slate-400">By: CRM Handoff Monitor</p></div>}
              <div><p className="text-xs text-slate-400">{conflict.detectedAt}</p><p className="text-slate-700">{conflict.type === 'Sync failed' ? 'Sync failure detected' : `${conflict.type} detected`}</p><p className="text-xs text-slate-400">By: CRM Handoff Monitor</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-slate-100 space-y-2">
        {conflict.type === 'Owner mismatch' && <div className="flex gap-2"><button onClick={() => onApplyFix(conflict.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition shadow-sm">Apply fix</button><button onClick={() => onAssignRevOps(conflict.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">Reassign</button></div>}
        {conflict.type === 'Possible duplicate' && <><div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><b>Risk: Irreversible</b><br />Action: Merge duplicate contacts<br />Requires approval from: CRM Admin</div><div className="flex gap-2"><button onClick={() => onWorkflowAction(conflict.id, 'Compared records')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition">Compare records</button><button onClick={() => onWorkflowAction(conflict.id, 'Approval requested for duplicate merge')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">Request approval</button></div></>}
        {conflict.type === 'Sync failed' && <><div className="flex gap-2"><button disabled={isRetrying || isPicklistMismatch} onClick={() => onRetrySync(conflict.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-xl text-sm transition"><RotateCw className="inline mr-1" size={14} />{isRetrying ? 'Retrying...' : 'Retry sync'}</button><button onClick={() => onViewError(conflict.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">View error details</button></div>{isPicklistMismatch && <p className="text-xs font-medium text-amber-700">⚠ Blocked: Resolve picklist mapping first</p>}<div className="flex gap-2"><button onClick={() => onAssignRevOps(conflict.id)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl text-sm transition">Reassign</button><span className="flex-1 py-2 text-center text-xs text-slate-400">{isPicklistMismatch ? 'Auto-retry disabled' : 'Next automatic retry: in 2 minutes'}</span></div></>}
        {conflict.type === 'Missing account' && <><div className="flex gap-2"><button onClick={() => onWorkflowAction(conflict.id, 'Linked existing account')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition">Link account</button><button onClick={() => onWorkflowAction(conflict.id, 'Created HubSpot account')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">Create account</button></div><button onClick={() => onWorkflowAction(conflict.id, 'Auto-filled blank field')} className="w-full rounded-xl bg-emerald-50 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100">Auto-fill blank field</button></>}
        {conflict.type === 'Sync failed' && !isPicklistMismatch && <button onClick={() => onWorkflowAction(conflict.id, 'Auto-retry enabled')} className="w-full rounded-xl bg-emerald-50 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100">Auto-retry enabled</button>}
        <div className="grid grid-cols-2 gap-2 pt-1"><button title="Live integration pending." onClick={() => onWorkflowAction(conflict.id, 'Requested HubSpot record')} className="rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Open in HubSpot</button><button title="Live integration pending." onClick={() => onWorkflowAction(conflict.id, 'Requested Salesforce record')} className="rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Open in Salesforce</button></div>
        <button
          onClick={() => onIgnore(conflict.id)}
          className="w-full flex items-center justify-center gap-1.5 text-slate-400 hover:text-red-500 py-1.5 text-xs font-medium transition"
        >
          <span>Ignore conflict</span>
          <Trash2 size={13} />
        </button>
      </div>
    </aside>
  );
};
