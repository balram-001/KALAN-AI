import React from 'react';
import { RotateCcw } from 'lucide-react';

interface SummaryCardsProps {
  openCount: number;
  needsReviewCount: number;
  adminCount: number;
  resolvedCount: number;
  onCardClick: (filter: string) => void;
  activeFilter: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  openCount,
  needsReviewCount,
  adminCount,
  resolvedCount,
  onCardClick,
  activeFilter,
}) => {
  const cards = [
    { title: 'Active conflicts', count: openCount, badge: 'Active', color: 'bg-red-50 text-red-600', filterVal: 'Active' },
    { title: 'Needs review', count: needsReviewCount, badge: 'Needs review', color: 'bg-amber-50 text-amber-600', filterVal: 'Needs review' },
    { title: 'Needs CRM admin', count: adminCount, badge: 'Admin', color: 'bg-red-50 text-red-600', filterVal: 'CRM Admin' },
    { title: 'Resolved this week', count: resolvedCount, badge: 'Resolved', color: 'bg-emerald-50 text-emerald-600', filterVal: 'Resolved' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const isSelected = activeFilter === card.filterVal;
        return (
          <div
            key={idx}
            onClick={() => onCardClick(card.filterVal)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-blue-50/50 border-blue-500 shadow-sm'
                : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-[0_2px_4px_rgba(0,0,0,0.02)]'
            }`}
          >
            <div className="flex justify-between items-center text-slate-500 mb-2">
              <span className="text-sm font-medium">{card.title}</span>
              <RotateCcw size={14} className="text-slate-400 hover:rotate-180 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-bold text-slate-900">{card.count}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${card.color}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
