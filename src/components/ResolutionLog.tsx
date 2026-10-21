import React from 'react';
import type { ResolutionHistoryItem } from '../types/conflict';

interface ResolutionLogProps {
  history: ResolutionHistoryItem[];
}

export const ResolutionLog: React.FC<ResolutionLogProps> = ({ history }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Resolution History Log</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-medium">
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Action Taken</th>
              <th className="py-3 px-4">Resolved By</th>
              <th className="py-3 px-4">Previous Value</th>
              <th className="py-3 px-4">Updated Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 text-slate-400">{item.timestamp}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{item.company}</td>
                <td className="py-3 px-4">
                  <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                    {item.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">{item.resolvedBy}</td>
                <td className="py-3 px-4 text-slate-400">{item.oldValue}</td>
                <td className="py-3 px-4 font-medium text-slate-900">{item.newValue}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No actions logged yet. Resolve or reassign a conflict to create logs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
