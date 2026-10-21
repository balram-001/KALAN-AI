import React from 'react';
import { Search, AlertTriangle, Wrench } from 'lucide-react';
import type { ConflictItem } from '../types/conflict';

interface ConflictTableProps {
  conflicts: ConflictItem[];
  selectedConflict: ConflictItem | null;
  onSelectConflict: (conflict: ConflictItem) => void;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  statusCounts: Record<string, number>;
  onFixError: (conflict: ConflictItem) => void;
  activeCount: number;
}

export const ConflictTable: React.FC<ConflictTableProps> = ({
  conflicts,
  selectedConflict,
  onSelectConflict,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  statusCounts,
  onFixError,
  activeCount,
}) => {
  const tableTitle = statusFilter === 'All' ? 'All conflicts' : 'Open conflicts';
  const shortTimestamp = (timestamp: string) => timestamp.replace('21 Oct 2026, ', 'Oct 21, ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 px-6 flex justify-between items-center border-b border-slate-100">
        <div><div className="flex items-center gap-2"><h3 className="font-semibold text-slate-900 text-base">{tableTitle}</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{statusCounts.All}</span></div><p className="mt-1 text-xs text-slate-400">{statusCounts.All} total · {activeCount} active</p></div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 w-52 transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label="Filter conflicts">
            {['All', 'Open', 'Needs review', 'Assigned', 'Resolved', 'Ignored'].map((status) => <button key={status} onClick={() => setStatusFilter(status)} className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${statusFilter === status ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{status} ({statusCounts[status]})</button>)}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-400 font-medium border-b border-slate-100 text-xs">
            <tr>
              <th className="py-3.5 px-6">Company</th>
              <th className="py-3.5 px-6">Issue</th>
              <th className="py-3.5 px-6">Field</th>
              <th className="py-3.5 px-6">HubSpot</th>
              <th className="py-3.5 px-6">Salesforce</th>
              <th className="py-3.5 px-6">Source of truth</th>
              <th className="py-3.5 px-6">Assigned to</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Last updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {conflicts.map((item) => {
              const isSelected = selectedConflict?.id === item.id;
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectConflict(item)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-slate-900">{item.company}</td>
                  <td className="py-4 px-6 text-slate-600"><div>{item.type}</div>{item.type === 'Sync failed' && <button onClick={(event) => { event.stopPropagation(); onFixError(item); }} className="mt-1 inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"><AlertTriangle size={12} /> Error · Fix error <Wrench size={12} /></button>}</td>
                  <td className="py-4 px-6 text-slate-600">{item.type === 'Owner mismatch' ? 'Record owner' : item.type === 'Possible duplicate' ? 'Account record' : item.type === 'Sync failed' ? 'Salesforce sync' : 'Account mapping'}</td>
                  <td className="py-4 px-6 text-slate-600">{item.hubspot}</td>
                  <td className="py-4 px-6 text-slate-600">{item.salesforce}</td>
                  <td className="py-4 px-6">
                    <span className="text-blue-600 bg-blue-50/50 px-2 py-1 rounded font-medium text-xs">
                      {item.sourceOfTruth}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">{shortTimestamp(item.lastUpdated)}</td>
                  <td className="py-4 px-6 text-slate-600">{item.assignedTo}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        item.status === 'Open'
                          ? 'bg-red-50 text-red-600'
                          : item.status === 'Needs review'
                          ? 'bg-amber-50 text-amber-600'
                          : item.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.status === 'Assigned'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {conflicts.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400">
                  No conflicts matched your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
