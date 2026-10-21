import React from 'react';
import { Activity, CheckCircle2, RefreshCw, Server, Zap } from 'lucide-react';

interface OverviewProps {
  openCount: number;
  lastUpdated: string;
  isChecking: boolean;
  onViewConflicts: () => void;
  onRefreshMetrics: () => void;
  onRunSyncCheck: () => void;
  onCategoryClick: (category: string) => void;
  onActivityClick: (conflictId: number) => void;
  breakdown: Array<{ label: string; count: number; color: string }>;
}

const activity = [
  { time: '5 min ago', text: 'Acme Inc. owner mismatch resolved', id: 1042 },
  { time: '18 min ago', text: 'Beta Security assigned to RevOps', id: 1043 },
  { time: '42 min ago', text: 'CloudOps sync failed', id: 1044 },
];

export const Overview: React.FC<OverviewProps> = ({
  openCount,
  lastUpdated,
  isChecking,
  onViewConflicts,
  onRefreshMetrics,
  onRunSyncCheck,
  onCategoryClick,
  onActivityClick,
  breakdown,
}) => (
  <div className="space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">System sync health</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Monitor lead handoffs, ownership conflicts and sync performance across HubSpot and Salesforce.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onRefreshMetrics} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <RefreshCw size={15} /> Refresh metrics
          </button>
          <button onClick={onRunSyncCheck} disabled={isChecking} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400">
            <Zap size={15} /> {isChecking ? 'Checking...' : 'Run sync check'}
          </button>
        </div>
      </div>

      {isChecking && <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">Checking sync health...</div>}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-5">
          <div className="text-3xl font-bold text-slate-900">99.4%</div><div className="mt-2 font-medium text-slate-800">Sync Success Rate</div><div className="mt-1 text-xs text-slate-500">Last 24 hours</div>
        </div>
        <div className="rounded-xl bg-blue-50 p-5">
          <div className="text-3xl font-bold text-slate-900">14 min</div><div className="mt-2 font-medium text-slate-800">Avg Resolution Time</div><div className="mt-1 text-xs text-slate-500">This week</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-5">
          <div className="text-3xl font-bold text-slate-900">{openCount}</div><div className="mt-2 font-medium text-slate-800">Active Conflicts</div><div className="mt-1 text-xs text-slate-500">Needs attention</div>
        </div>
      </div>
    </section>

    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
        <div className="flex items-center justify-between"><div><h3 className="font-bold text-slate-900">Sync activity</h3><p className="mt-1 text-xs text-slate-500">Last 7 days</p></div><Activity className="text-blue-600" size={20} /></div>
        <div className="mt-5 h-32 border-b border-l border-slate-100 p-2">
          <svg viewBox="0 0 600 120" className="h-full w-full" role="img" aria-label="Sync success rate over the last seven days">
            <polyline points="0,72 100,56 200,64 300,37 400,45 500,18 600,26 600,120 0,120" fill="#dbeafe" opacity="0.7" />
            <polyline points="0,72 100,56 200,64 300,37 400,45 500,18 600,26" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm"><div><span className="block text-slate-500">Success rate</span><b className="text-emerald-600">99.4%</b></div><div><span className="block text-slate-500">Failed syncs</span><b className="text-red-600">3</b></div><div><span className="block text-slate-500">Records synced</span><b className="text-slate-900">248</b></div></div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900">Connection status</h3>
        <div className="mt-5 space-y-4 text-sm">
          {['HubSpot', 'Salesforce'].map((name) => <div key={name} className="flex items-center justify-between"><span className="flex items-center gap-2 font-medium text-slate-700"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{name}</span><span className="text-emerald-600">Connected</span></div>)}
          <div className="border-t border-slate-100 pt-4 text-slate-500">Last sync <span className="float-right font-medium text-slate-700">2 minutes ago</span></div>
        </div>
      </section>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div><h3 className="font-bold text-slate-900">Conflict breakdown</h3><p className="mt-1 text-xs text-slate-500">All conflicts</p></div>
        <div className="mt-4 divide-y divide-slate-100">
          {breakdown.map((item) => <button key={item.label} onClick={() => onCategoryClick(item.label)} className="flex w-full items-center justify-between py-3 text-left hover:bg-slate-50"><span className="flex items-center gap-2 text-sm font-medium text-slate-700"><span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />{item.label}</span><span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-semibold text-slate-700">{item.count}</span></button>)}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900">Recent activity</h3>
        <div className="mt-3 divide-y divide-slate-100">
          {activity.map((item) => <button key={item.id} onClick={() => onActivityClick(item.id)} className="block w-full py-3 text-left hover:bg-slate-50"><span className="text-xs text-slate-400">{item.time}</span><span className="mt-1 block text-sm font-medium text-slate-700">{item.text}</span></button>)}
        </div>
      </section>
    </div>

    {openCount === 0 && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-sm font-medium text-emerald-700">No active conflicts. Your CRM handoff is healthy.</div>}
    <button onClick={onViewConflicts} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"><Server size={16} /> View all conflicts</button>
    <div className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={14} className="text-emerald-500" /> Metrics last refreshed: {lastUpdated}</div>
  </div>
);
