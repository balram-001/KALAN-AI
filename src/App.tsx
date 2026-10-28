import { useState, useEffect } from 'react';
import { initialConflicts } from './data/conflicts';
import type { ConflictItem, ResolutionHistoryItem, SourceOfTruth } from './types/conflict';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import { ConflictTable } from './components/ConflictTable';
import { ConflictDetail } from './components/ConflictDetail';
import { ResolutionLog } from './components/ResolutionLog';
import { Overview } from './components/Overview';

const sampleHistory: ResolutionHistoryItem[] = [
  { id: 1, conflictId: 1042, company: 'Acme Inc.', action: 'Owner updated and conflict resolved', resolvedBy: 'CRM Admin', oldValue: 'Rahul Sharma', newValue: 'Priya Mehta', timestamp: 'Oct 21, 5:19 PM' },
  { id: 2, conflictId: 1043, company: 'Beta Security', action: 'Assigned to RevOps', resolvedBy: 'CRM Admin', oldValue: 'CRM Admin', newValue: 'RevOps', timestamp: 'Oct 21, 5:20 PM' },
  { id: 3, conflictId: 1044, company: 'CloudOps', action: 'Salesforce retry failed', resolvedBy: 'CRM Handoff Monitor', oldValue: 'Updated', newValue: 'Not updated', timestamp: 'Oct 21, 5:54 PM' },
];

export default function App() {
  const formatTimestamp = () =>
    new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [conflicts, setConflicts] = useState<ConflictItem[]>(() => {
    const saved = localStorage.getItem('crm_conflicts_v7');
    return saved ? JSON.parse(saved) : initialConflicts;
  });
  const [history, setHistory] = useState<ResolutionHistoryItem[]>(() => {
    const saved = localStorage.getItem('crm_history_v2');
    return saved ? JSON.parse(saved) : sampleHistory;
  });
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [defaultSource, setDefaultSource] = useState<SourceOfTruth>('Salesforce');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [pendingFixId, setPendingFixId] = useState<number | null>(null);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [errorDetailsId, setErrorDetailsId] = useState<number | null>(null);
  const [pendingIgnoreId, setPendingIgnoreId] = useState<number | null>(null);
  const [ignoreReason, setIgnoreReason] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('crm_conflicts_v7', JSON.stringify(conflicts));
  }, [conflicts]);

  useEffect(() => {
    localStorage.setItem('crm_history_v2', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const addHistory = (conflict: ConflictItem, action: string, oldValue: string, newValue: string) => {
    const newEntry: ResolutionHistoryItem = {
      id: Date.now(),
      conflictId: conflict.id,
      company: conflict.company,
      action,
      resolvedBy: 'CRM Admin',
      oldValue,
      newValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const updateConflict = (
    id: number,
    update: Partial<ConflictItem>,
    action: string,
    oldValue: string,
    newValue: string,
    successMessage: string,
  ) => {
    const target = conflicts.find((conflict) => conflict.id === id);
    if (!target) return;

    const timestamp = formatTimestamp();
    const updated = { ...target, ...update, lastUpdated: timestamp };
    setConflicts((previous) => previous.map((item) => (item.id === id ? updated : item)));
    setSelectedConflict((previous) => (previous?.id === id ? updated : previous));
    addHistory(target, action, oldValue, newValue);
    setLastUpdated(timestamp);
    setToastMessage(successMessage);
  };

  const confirmApplyFix = () => {
    if (pendingFixId === null) return;
    const target = conflicts.find((conflict) => conflict.id === pendingFixId);
    if (!target) return;
    const update = target.sourceOfTruth === 'Salesforce'
      ? { hubspot: target.salesforce, previousHubspot: target.hubspot, status: 'Resolved' as const }
      : { salesforce: target.hubspot, status: 'Resolved' as const };
    const oldValue = target.sourceOfTruth === 'Salesforce' ? target.hubspot : target.salesforce;
    const newValue = target.sourceOfTruth === 'Salesforce' ? target.salesforce : target.hubspot;
    updateConflict(target.id, update, 'Applied recommended fix', oldValue, newValue, 'Conflict resolved successfully.');
    setPendingFixId(null);
  };

  const handleAssignRevOps = (id: number) => {
    const target = conflicts.find((c) => c.id === id);
    if (!target) return;
    if (target.assignedTo === 'RevOps') {
      setToastMessage('This conflict is already assigned to RevOps.');
      return;
    }

    updateConflict(id, { assignedTo: 'RevOps', status: 'Assigned' }, 'Assigned to RevOps', target.assignedTo, 'RevOps', 'Conflict assigned to RevOps successfully.');
  };

  const handleIgnore = (id: number) => {
    const target = conflicts.find((c) => c.id === id);
    if (!target) return;
    updateConflict(id, { status: 'Ignored' }, 'Ignored conflict', target.status, ignoreReason, 'Conflict ignored successfully.');
    setPendingIgnoreId(null);
    setIgnoreReason('');
  };

  const handleRetrySync = (id: number) => {
    const target = conflicts.find((conflict) => conflict.id === id);
    if (!target) return;
    if (target.rootCause === 'Validation rule failure') {
      setToastMessage('Retry is blocked until the Salesforce validation rule is resolved.');
      return;
    }
    setRetryingId(id);
    window.setTimeout(() => {
      updateConflict(id, { salesforce: target.hubspot, status: 'Resolved', recommendation: 'Salesforce updated successfully.' }, 'Error fixed: Salesforce update succeeded', target.salesforce, target.hubspot, 'Error fixed successfully. Salesforce is now updated.');
      setRetryingId(null);
    }, 1200);
  };

  const handleViewError = (id: number) => {
    const target = conflicts.find((conflict) => conflict.id === id);
    if (!target) return;
    if (!history.some((item) => item.conflictId === id && item.action === 'Viewed sync error')) {
      addHistory(target, 'Viewed sync error', '', '');
    }
    setErrorDetailsId(id);
  };

  const handleWorkflowAction = (id: number, action: string) => {
    const target = conflicts.find((conflict) => conflict.id === id);
    if (!target) return;
    const timestamp = formatTimestamp();
    const updated = { ...target, lastUpdated: timestamp };
    setConflicts((previous) => previous.map((item) => item.id === id ? updated : item));
    setSelectedConflict((previous) => previous?.id === id ? updated : previous);
    addHistory(target, action, '', '');
    setLastUpdated(timestamp);
    setToastMessage(`${action} successfully.`);
  };

  const handleSourceChange = (id: number, newSource: SourceOfTruth) => {
    const target = conflicts.find((conflict) => conflict.id === id);
    if (!target) return;
    const recommendation = newSource === 'Requires review'
      ? 'Compare both Salesforce records with the HubSpot record before selecting the master record.'
      : target.type === 'Owner mismatch' && newSource === 'HubSpot'
      ? `Map the Salesforce user and set the record owner to ${target.hubspot}.`
      : target.groupedFailures && newSource === 'HubSpot'
      ? 'Map “Proposal” in Salesforce, then retry the 40 affected records.'
      : newSource === 'Salesforce'
      ? `Update HubSpot owner from ${target.hubspot} to ${target.salesforce}`
      : `Update Salesforce owner from ${target.salesforce} to ${target.hubspot}`;
    updateConflict(id, { sourceOfTruth: newSource, recommendation }, 'Changed source of truth', target.sourceOfTruth, newSource, 'Source of truth updated successfully.');
  };

  const handleCardClick = (filterVal: string) => {
    if (activeTab !== 'Conflicts') {
      setActiveTab('Conflicts');
    }
    setStatusFilter(prev => prev === filterVal ? 'All' : filterVal);
    setTypeFilter('');
  };

  const openAllConflicts = () => {
    setActiveTab('Conflicts');
    setStatusFilter('All');
    setTypeFilter('');
    setSearch('');
  };

  const openCategory = (category: string) => {
    setActiveTab('Conflicts');
    setStatusFilter('Active');
    setTypeFilter(category);
    setSearch('');
  };

  const openActivityConflict = (id: number) => {
    const conflict = conflicts.find((item) => item.id === id);
    if (!conflict) return;
    setActiveTab('Conflicts');
    setStatusFilter('All');
    setTypeFilter('');
    setSelectedConflict(conflict);
  };

  const refreshMetrics = () => {
    const timestamp = formatTimestamp();
    setLastUpdated(timestamp);
    setToastMessage('Metrics refreshed successfully.');
  };

  const runSyncCheck = () => {
    if (isChecking) return;
    setIsChecking(true);
    window.setTimeout(() => {
      setIsChecking(false);
      setLastUpdated(formatTimestamp());
      setToastMessage('Sync health check completed successfully.');
    }, 1200);
  };

  // Metrics
  const openCount = conflicts.filter((c) => ['Open', 'Needs review', 'Assigned'].includes(c.status)).length;
  const needsReviewCount = conflicts.filter((c) => c.status === 'Needs review').length;
  const adminCount = conflicts.filter((c) => c.assignedTo === 'CRM Admin' && c.status !== 'Resolved').length;
  const resolvedCount = conflicts.filter((c) => c.status === 'Resolved').length;
  const statusCounts = ['All', 'Open', 'Needs review', 'Assigned', 'Resolved', 'Ignored'].reduce<Record<string, number>>((counts, status) => {
    counts[status] = status === 'All' ? conflicts.length : conflicts.filter((conflict) => conflict.status === status).length;
    return counts;
  }, {});
  const conflictBreakdown = [
    { label: 'Owner mismatch', color: 'bg-red-500' },
    { label: 'Possible duplicate', color: 'bg-amber-500' },
    { label: 'Sync failed', color: 'bg-rose-500' },
    { label: 'Missing account', color: 'bg-blue-500' },
  ].map((item) => ({ ...item, count: conflicts.filter((conflict) => conflict.type === item.label).length }));

  const filteredConflicts = conflicts.filter((item) => {
    const matchesSearch =
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'CRM Admin') {
      matchesStatus = item.assignedTo === 'CRM Admin' && item.status !== 'Resolved';
    } else if (statusFilter === 'Active') {
      matchesStatus = ['Open', 'Needs review', 'Assigned'].includes(item.status);
    } else if (statusFilter !== 'All') {
      matchesStatus = item.status === statusFilter;
    }

    return matchesSearch && matchesStatus && (!typeFilter || item.type === typeFilter);
  }).sort((left, right) => {
    const priority: Record<string, number> = { Open: 0, 'Needs review': 1, Assigned: 2, Resolved: 3, Ignored: 4 };
    return priority[left.status] - priority[right.status];
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">CRM Handoff Monitor</h2>
              <p className="text-xs text-slate-400 mt-0.5">HubSpot ↔ Salesforce</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Last updated: {lastUpdated}</span>
          </div>

          {activeTab === 'Conflicts' && (
            <SummaryCards
              openCount={openCount}
               needsReviewCount={needsReviewCount}
              adminCount={adminCount}
              resolvedCount={resolvedCount}
              onCardClick={handleCardClick}
              activeFilter={statusFilter}
            />
          )}

          {/* Conditional View by Sidebar Tab */}
          {activeTab === 'Overview' && <Overview openCount={openCount} lastUpdated={lastUpdated} isChecking={isChecking} onViewConflicts={openAllConflicts} onRefreshMetrics={refreshMetrics} onRunSyncCheck={runSyncCheck} onCategoryClick={openCategory} onActivityClick={openActivityConflict} breakdown={conflictBreakdown} />}

          {activeTab === 'Conflicts' && (
            <ConflictTable
              conflicts={filteredConflicts}
              selectedConflict={selectedConflict}
              onSelectConflict={(c) => setSelectedConflict(conflicts.find((item) => item.id === c.id) ?? c)}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              statusCounts={statusCounts}
              onFixError={(conflict) => setSelectedConflict(conflict)}
              activeCount={openCount}
            />
          )}

          {activeTab === 'Resolution Log' && (
            <ResolutionLog history={history} />
          )}

          {activeTab === 'Settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Sync Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Default Source of Truth
                  </label>
                  <select
                    value={defaultSource}
                    onChange={(e) => setDefaultSource(e.target.value as SourceOfTruth)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Salesforce">Salesforce (Recommended)</option>
                    <option value="HubSpot">HubSpot</option>
                  </select>
                </div>
                <button
                  onClick={() => alert('Settings saved successfully!')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl text-sm transition"
                >
                  Save settings
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Detail Panel on Row Click */}
        {selectedConflict && (
          <ConflictDetail
            key={selectedConflict.id}
            conflict={selectedConflict}
            onClose={() => setSelectedConflict(null)}
            onAssignRevOps={handleAssignRevOps}
            onIgnore={setPendingIgnoreId}
            onRetrySync={handleRetrySync}
            onApplyFix={setPendingFixId}
            onWorkflowAction={handleWorkflowAction}
            onViewError={handleViewError}
            onSourceChange={handleSourceChange}
            history={history}
            isRetrying={retryingId === selectedConflict.id}
          />
        )}
      </div>
      {toastMessage && (
        <div role="status" className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}
      {pendingFixId !== null && (() => {
        const conflict = conflicts.find((item) => item.id === pendingFixId);
        if (!conflict) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Update {conflict.sourceOfTruth === 'Salesforce' ? 'HubSpot' : 'Salesforce'} owner?</h3>
              <dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-400">Record</dt><dd className="font-medium text-slate-900">{conflict.company}</dd></div><div><dt className="text-slate-400">Current HubSpot owner</dt><dd className="font-medium text-slate-900">{conflict.hubspot}</dd></div><div><dt className="text-slate-400">New HubSpot owner</dt><dd className="font-medium text-slate-900">{conflict.salesforce}</dd></div><div><dt className="text-slate-400">Source of truth</dt><dd className="font-medium text-slate-900">{conflict.sourceOfTruth}</dd></div><div><dt className="text-slate-400">Direction</dt><dd className="font-medium text-slate-900">Salesforce → HubSpot</dd></div></dl>
              <p className="mt-4 text-sm text-slate-600">This will update the HubSpot record.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setPendingFixId(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button onClick={confirmApplyFix} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Confirm update</button>
              </div>
            </div>
          </div>
        );
      })()}
      {errorDetailsId !== null && (() => {
        const conflict = conflicts.find((item) => item.id === errorDetailsId);
        if (!conflict) return null;
        const isPicklistMismatch = conflict.rootCause === 'Picklist mismatch';
        return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h3 className="text-lg font-bold text-slate-900">Sync error details</h3><p className="mt-1 text-sm text-slate-500">Demo error information for this conflict</p></div><button onClick={() => setErrorDetailsId(null)} className="text-slate-400 hover:text-slate-700">×</button></div><dl className="mt-5 space-y-3 text-sm"><div><dt className="text-slate-400">Record</dt><dd className="font-medium text-slate-800">{conflict.company}</dd></div><div><dt className="text-slate-400">Direction</dt><dd className="font-medium text-slate-800">HubSpot → Salesforce</dd></div><div><dt className="text-slate-400">Failed field</dt><dd className="font-medium text-slate-800">{isPicklistMismatch ? 'Deal stage' : 'Record owner'}</dd></div><div><dt className="text-slate-400">Attempted at</dt><dd className="font-medium text-slate-800">{conflict.lastUpdated}</dd></div><div><dt className="text-slate-400">Error message</dt><dd className="font-medium text-slate-800">{isPicklistMismatch ? 'Proposal is not available in the Salesforce picklist.' : 'Salesforce service temporarily unavailable'}</dd></div><div><dt className="text-slate-400">Retry policy</dt><dd className="font-medium text-slate-800">{isPicklistMismatch ? 'Disabled until picklist mapping is resolved' : 'Automatic retry enabled (up to 5 attempts)'}</dd></div></dl><button onClick={() => setErrorDetailsId(null)} className="mt-6 w-full rounded-xl bg-slate-900 py-2 text-sm font-medium text-white">Close</button></div></div>;
      })()}
      {pendingIgnoreId !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h3 className="text-lg font-bold text-slate-900">Ignore this conflict?</h3><p className="mt-2 text-sm text-slate-500">Select a reason to keep the audit trail complete.</p><select value={ignoreReason} onChange={(event) => setIgnoreReason(event.target.value)} className="mt-5 w-full rounded-xl border border-slate-200 p-2.5 text-sm"><option value="">Reason required</option><option>Duplicate business rule</option><option>Manual exception</option><option>Not actionable</option><option>Other</option></select><div className="mt-6 flex justify-end gap-3"><button onClick={() => { setPendingIgnoreId(null); setIgnoreReason(''); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button><button disabled={!ignoreReason} onClick={() => handleIgnore(pendingIgnoreId)} className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300">Ignore conflict</button></div></div></div>}
    </div>
  );
}
