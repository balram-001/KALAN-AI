import React from 'react';
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
  const field = conflict.type === 'Owner mismatch' ? 'Record owner' : conflict.type === 'Possible duplicate' ? 'Account record' : conflict.type === 'Sync failed' ? 'Salesforce sync' : 'Account mapping';
  const hubspotLabel = conflict.type === 'Owner mismatch' ? 'HubSpot' : conflict.type === 'Possible duplicate' ? 'HubSpot records' : conflict.type === 'Sync failed' ? 'HubSpot status' : 'HubSpot account';
  const salesforceLabel = conflict.type === 'Owner mismatch' ? 'Salesforce' : conflict.type === 'Possible duplicate' ? 'Salesforce records' : conflict.type === 'Sync failed' ? 'Salesforce status' : 'Salesforce account';
  const conflictHistory = history.filter((item, index, entries) => item.conflictId === conflict.id && entries.findIndex((candidate) => candidate.conflictId === item.conflictId && candidate.action === item.action) === index).slice(0, 4);
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

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">{hubspotLabel}</label>
            <p className="font-medium text-slate-800">{conflict.previousHubspot ? `${conflict.previousHubspot} → ${conflict.hubspot}` : conflict.hubspot}</p>
          </div>

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

          {(conflict.type === 'Sync failed' || conflict.type === 'Owner mismatch') && <div><label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Sync direction</label><p className="font-medium text-slate-800">{conflict.type === 'Owner mismatch' ? 'Salesforce → HubSpot' : 'HubSpot → Salesforce'}</p></div>}

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
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-500">Error type</p><p className="text-red-700">Transient sync error</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-500">Details</p><p className="text-red-700">The record could not be updated in Salesforce. No changes were applied.</p>
              <p className="mt-3 text-red-600">Last attempt: {conflict.lastUpdated}</p><p className="mt-1 text-red-600">Retry count: 2 of 5</p><p className="mt-1 text-red-600">Next automatic retry: in 2 minutes</p><p className="mt-1 text-red-600">Retries remaining: 3</p>
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
        {conflict.type === 'Possible duplicate' && <div className="flex gap-2"><button onClick={() => onWorkflowAction(conflict.id, 'Compared records')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition">Compare records</button><button onClick={() => onWorkflowAction(conflict.id, 'Selected master record')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">Select master</button></div>}
        {conflict.type === 'Sync failed' && <><div className="flex gap-2"><button disabled={isRetrying} onClick={() => onRetrySync(conflict.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-xl text-sm transition"><RotateCw className="inline mr-1" size={14} />{isRetrying ? 'Retrying...' : 'Retry sync'}</button><button onClick={() => onViewError(conflict.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">View error details</button></div><div className="flex gap-2"><button onClick={() => onAssignRevOps(conflict.id)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl text-sm transition">Reassign</button><span className="flex-1 py-2 text-center text-xs text-slate-400">Next automatic retry: in 2 minutes</span></div></>}
        {conflict.type === 'Missing account' && <div className="flex gap-2"><button onClick={() => onWorkflowAction(conflict.id, 'Linked existing account')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-sm transition">Link account</button><button onClick={() => onWorkflowAction(conflict.id, 'Created HubSpot account')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-xl text-sm transition">Create account</button></div>}
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
